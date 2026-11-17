import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Loader2,
  Play,
  Video as VideoIcon,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Settings: change these to match your Supabase project
// ---------------------------------------------------------------------------

// Bucket that holds your photos
const IMAGE_BUCKET = 'gallery';

// Bucket that holds your videos. Use the same name as IMAGE_BUCKET if you
// keep photos and videos together in one bucket.
const VIDEO_BUCKET = 'videos';

// File name (inside VIDEO_BUCKET) of the video that pops up when the site opens.
// Set to '' to turn the popup off.
const FEATURED_VIDEO = 'intro.mp4';

// true = popup shows once per browser session, false = every page load
const POPUP_ONCE_PER_SESSION = true;

// ---------------------------------------------------------------------------

type MediaKind = 'image' | 'video';
type Filter = 'all' | MediaKind;

interface MediaItem {
  name: string;
  url: string;
  kind: MediaKind;
}

const IMAGE_EXT = /\.(jpe?g|png|gif|webp|avif|svg)$/i;
const VIDEO_EXT = /\.(mp4|webm|mov|m4v|ogg)$/i;

function getKind(fileName: string): MediaKind | null {
  if (IMAGE_EXT.test(fileName)) return 'image';
  if (VIDEO_EXT.test(fileName)) return 'video';
  return null;
}

function prettyName(fileName: string) {
  return fileName.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ');
}

async function loadBucket(bucket: string): Promise<MediaItem[]> {
  const { data, error } = await supabase.storage.from(bucket).list('', {
    limit: 200,
    sortBy: { column: 'created_at', order: 'desc' },
  });

  if (error || !data) {
    console.error(`Could not list bucket "${bucket}"`, error);
    return [];
  }

  return data
    .filter((file) => file.id && !file.name.startsWith('.'))
    .flatMap((file) => {
      const kind = getKind(file.name);
      if (!kind) return [];
      const {
        data: { publicUrl },
      } = supabase.storage.from(bucket).getPublicUrl(file.name);
      return [{ name: file.name, url: publicUrl, kind }];
    });
}

function useBodyLock(active: boolean) {
  useEffect(() => {
    if (!active) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [active]);
}

// ---------------------------------------------------------------------------
// Popup video shown when the website opens
// ---------------------------------------------------------------------------

export function WelcomeVideoPopup() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [muted, setMuted] = useState(true);
  const [videoEl, setVideoEl] = useState<HTMLVideoElement | null>(null);

  const src = useMemo(() => {
    if (!FEATURED_VIDEO) return '';
    return supabase.storage.from(VIDEO_BUCKET).getPublicUrl(FEATURED_VIDEO).data.publicUrl;
  }, []);

  useEffect(() => {
    if (!src) return;
    try {
      if (POPUP_ONCE_PER_SESSION && sessionStorage.getItem('welcome-video-seen')) return;
    } catch {
      // sessionStorage can be blocked, show the popup anyway
    }
    const timer = setTimeout(() => {
      setMounted(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    }, 700);
    return () => clearTimeout(timer);
  }, [src]);

  const close = useCallback(() => {
    setVisible(false);
    try {
      sessionStorage.setItem('welcome-video-seen', '1');
    } catch {
      // ignore
    }
    setTimeout(() => setMounted(false), 300);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mounted, close]);

  useBodyLock(mounted);

  const toggleSound = () => {
    if (!videoEl) return;
    videoEl.muted = !videoEl.muted;
    setMuted(videoEl.muted);
    if (!videoEl.muted) videoEl.play().catch(() => {});
  };

  if (!mounted) return null;

  return (
    <div
      className={`fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-8 bg-black/80 backdrop-blur-md transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={close}
      role="dialog"
      aria-modal="true"
      aria-label="Featured video"
    >
      <div
        className={`relative w-full max-w-4xl rounded-3xl overflow-hidden bg-black shadow-2xl ring-1 ring-white/10 transition-all duration-300 ${
          visible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <video
          ref={setVideoEl}
          src={src}
          autoPlay
          muted
          loop
          playsInline
          controls
          onError={close}
          className="w-full max-h-[80vh] bg-black"
        />

        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={toggleSound}
            className="w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur transition-colors"
            aria-label={muted ? 'Turn sound on' : 'Turn sound off'}
          >
            {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
          <button
            onClick={close}
            className="w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur transition-colors"
            aria-label="Close video"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Lightbox for photos and videos
// ---------------------------------------------------------------------------

interface LightboxProps {
  items: MediaItem[];
  index: number;
  onClose: () => void;
  onChange: (next: number) => void;
}

function Lightbox({ items, index, onClose, onChange }: LightboxProps) {
  const item = items[index];
  const hasMany = items.length > 1;

  const prev = useCallback(
    () => onChange((index - 1 + items.length) % items.length),
    [index, items.length, onChange]
  );
  const next = useCallback(() => onChange((index + 1) % items.length), [index, items.length, onChange]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && hasMany) prev();
      if (e.key === 'ArrowRight' && hasMany) next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, prev, next, hasMany]);

  useBodyLock(true);

  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 sm:p-10"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <button
        onClick={onClose}
        className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
        aria-label="Close"
      >
        <X className="w-6 h-6" />
      </button>

      {hasMany && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            className="absolute left-3 sm:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            aria-label="Previous"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            className="absolute right-3 sm:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            aria-label="Next"
          >
            <ChevronRight className="w-7 h-7" />
          </button>
        </>
      )}

      <figure className="max-w-5xl w-full flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
        {item.kind === 'image' ? (
          <img
            key={item.url}
            src={item.url}
            alt={prettyName(item.name)}
            className="max-h-[78vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl"
          />
        ) : (
          <video
            key={item.url}
            src={item.url}
            controls
            autoPlay
            playsInline
            className="max-h-[78vh] w-full rounded-2xl bg-black shadow-2xl"
          />
        )}
        <figcaption className="mt-5 text-center">
          <p className="text-white font-medium capitalize">{prettyName(item.name)}</p>
          <p className="text-white/50 text-sm mt-1">
            {index + 1} / {items.length}
          </p>
        </figcaption>
      </figure>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Gallery section
// ---------------------------------------------------------------------------

export function Gallery() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>('all');
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchMedia() {
      try {
        const buckets = Array.from(new Set([IMAGE_BUCKET, VIDEO_BUCKET]));
        const results = await Promise.all(buckets.map(loadBucket));
        if (!cancelled) setItems(results.flat());
      } catch (err) {
        console.error('Failed to load gallery media', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchMedia();
    return () => {
      cancelled = true;
    };
  }, []);

  const imageCount = items.filter((i) => i.kind === 'image').length;
  const videoCount = items.filter((i) => i.kind === 'video').length;

  const visibleItems = useMemo(
    () => (filter === 'all' ? items : items.filter((i) => i.kind === filter)),
    [items, filter]
  );

  const tabs: { id: Filter; label: string; count: number; icon?: React.ReactNode }[] = [
    { id: 'all', label: 'All', count: items.length },
    { id: 'image', label: 'Photos', count: imageCount, icon: <ImageIcon className="w-4 h-4" /> },
    { id: 'video', label: 'Videos', count: videoCount, icon: <VideoIcon className="w-4 h-4" /> },
  ];

  return (
    <section id="gallery" className="relative py-32 bg-white overflow-hidden">
      <div className="pointer-events-none absolute -top-40 -left-40 w-96 h-96 rounded-full bg-accent-blue/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-accent-emerald/10 blur-3xl" />

      <div className="container relative mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
          <div>
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-3 h-3 bg-accent-emerald rounded-full animate-pulse" />
              <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Our Gallery
              </span>
              <div className="w-3 h-3 bg-accent-blue rounded-full animate-pulse" />
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight text-gray-900">
              <span className="block">Moments in</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-accent-blue to-accent-emerald">
                Pictures &amp; Videos
              </span>
            </h2>
          </div>
          <div className="max-w-xl text-lg text-gray-600">
            A visual journey of our events, programs, and scientific engagements.
          </div>
        </div>

        {!loading && items.length > 0 && imageCount > 0 && videoCount > 0 && (
          <div className="mb-10 inline-flex p-1.5 rounded-full bg-gray-100 gap-1">
            {tabs.map((tab) => {
              const active = filter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                    active
                      ? 'bg-white text-gray-900 shadow-md'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      active ? 'bg-accent-blue/10 text-accent-blue' : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <Loader2 className="w-12 h-12 text-accent-blue animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No photos or videos yet</h3>
            <p className="text-gray-500 max-w-md">
              Upload files to your Supabase "{IMAGE_BUCKET}" bucket (photos) and "{VIDEO_BUCKET}" bucket
              (videos), and make sure both buckets are public.
            </p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6">
            {visibleItems.map((item, idx) => (
              <button
                key={`${item.kind}-${item.name}`}
                onClick={() => setOpenIndex(idx)}
                className="group relative mb-6 block w-full break-inside-avoid overflow-hidden rounded-3xl bg-gray-100 text-left elevated-shadow clean-border transition-all duration-500 hover:-translate-y-1 focus:outline-none focus-visible:ring-4 focus-visible:ring-accent-blue/40"
              >
                {item.kind === 'image' ? (
                  <img
                    src={item.url}
                    alt={prettyName(item.name)}
                    loading="lazy"
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <video
                    src={`${item.url}#t=0.5`}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
                    onMouseLeave={(e) => e.currentTarget.pause()}
                    className="w-full aspect-video object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )}

                {item.kind === 'video' && (
                  <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur text-white text-xs font-semibold">
                    <VideoIcon className="w-3.5 h-3.5" />
                    Video
                  </div>
                )}

                {item.kind === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-16 h-16 rounded-full bg-white/90 text-accent-blue flex items-center justify-center shadow-xl transition-transform duration-300 group-hover:scale-110">
                      <Play className="w-7 h-7 ml-1" fill="currentColor" />
                    </div>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="text-white font-medium truncate capitalize drop-shadow-md">
                      {prettyName(item.name)}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {openIndex !== null && (
        <Lightbox
          items={visibleItems}
          index={openIndex}
          onClose={() => setOpenIndex(null)}
          onChange={setOpenIndex}
        />
      )}

      <WelcomeVideoPopup />
    </section>
  );
}
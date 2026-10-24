import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

interface GalleryImage {
  name: string;
  url: string;
}

export function Gallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchImages() {
      try {
        // Fetch list of files from the 'gallery' bucket
        const { data, error } = await supabase.storage.from('gallery').list();
        
        if (error) {
          console.error('Error fetching images:', error);
          setLoading(false);
          return;
        }

        if (data) {
          // Filter out any hidden/system files and map to URLs
          const validFiles = data.filter((file) => file.name !== '.emptyFolderPlaceholder');
          
          const imageObjects = validFiles.map((file) => {
            const { data: { publicUrl } } = supabase.storage.from('gallery').getPublicUrl(file.name);
            return {
              name: file.name,
              url: publicUrl,
            };
          });
          
          setImages(imageObjects);
        }
      } catch (err) {
        console.error('Failed to load gallery images', err);
      } finally {
        setLoading(false);
      }
    }

    fetchImages();
  }, []);

  return (
    <section id="gallery" className="relative py-32 bg-white overflow-hidden">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
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
                Pictures
              </span>
            </h2>
          </div>
          <div className="max-w-xl text-lg text-gray-600">
            A visual journey of our events, programs, and scientific engagements.
          </div>
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <Loader2 className="w-12 h-12 text-accent-blue animate-spin" />
          </div>
        ) : images.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No images found</h3>
            <p className="text-gray-500 max-w-md">
              Please upload photos to your Supabase "gallery" bucket to see them appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {images.map((img, idx) => (
              <div
                key={idx}
                className="group relative aspect-square rounded-3xl overflow-hidden elevated-shadow clean-border bg-gray-100 cursor-pointer"
              >
                <img
                  src={img.url}
                  alt={img.name}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <p className="text-white font-medium truncate drop-shadow-md">
                      {img.name.split('.')[0].replace(/[-_]/g, ' ')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

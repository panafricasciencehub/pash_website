import partner1Img from '../assets/partent1.jpeg'
import partner2Img from '../assets/partent2.jpeg'
import partner3Img from '../assets/partent3.jpeg'
import partner4Img from '../assets/partent4.jpeg'

const partners = [
  {
    id: 1,
    title: "Intercity Dairy Farm",
    image: partner1Img,
    description: "A Ugandan dairy farm owned by Allen Atuhaire Tibishangwa. Started in 2015 with few cows, it has grown into a 68-acre sustainable operation focused on milk processing, yogurt production, and value addition."
  },
  {
    id: 2,
    title: "Association of African Students in India (AASI)",
    image: partner2Img,
    description: "AASI is a non-profit organization founded in 1960s (re-emerged 2010) that unites African students across India. It promotes their welfare, resolves challenges, fosters cultural exchange, and supports academic success."
  },
  {
    id: 3,
    title: "NEAT Cancer Foundation",
    image: partner3Img,
    description: "NEAT Cancer Foundation is a cancer awareness and support organization. It focuses on prevention, early detection, patient advocacy, and providing resources to fight cancer through education and community initiatives."
  },
  {
    id: 4,
    title: "Grittrix",
    image: partner4Img,
    description: "Grittrix is an AI-powered innovation company founded in 2025. It develops custom software, web/apps, and intelligent solutions to transform industries like healthcare, retail, and agriculture with accessible technology."
  }
];

export function Partners() {
  return (
    <section id="partners" className="relative py-24 sm:py-32 bg-background overflow-hidden border-t border-black/5">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-3 h-3 bg-accent-emerald rounded-full animate-pulse" />
              <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Our Partners
              </span>
              <div className="w-3 h-3 bg-accent-blue rounded-full animate-pulse" />
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight">
              <span className="block">Strategic</span>
              <span className="block text-gray-400">Partnerships</span>
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {partners.map((partner) => (
            <div
              key={partner.id}
              className="flex flex-col bg-white clean-border rounded-3xl overflow-hidden elevated-shadow group"
            >
              <div className="relative h-56 w-full overflow-hidden shrink-0 bg-gray-100 flex items-center justify-center p-4">
                <img
                  src={partner.image}
                  alt={partner.title}
                  className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-gray-900 mb-3 leading-snug">
                  {partner.title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {partner.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

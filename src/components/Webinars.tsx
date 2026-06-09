import { Calendar, Target, Lightbulb, Clock } from 'lucide-react'

const webinars = [
  {
    id: 1,
    date: "June 12, 2026",
    session: "First Friday",
    topic: "Africa's AI Revolution: Coding Intelligence for Continental Breakthroughs",
    focus: "African AI innovations in healthcare, agriculture, education, governance, and ethics",
    outcome: "Inspire students to explore AI careers and African innovation",
    color: "bg-accent-blue"
  },
  {
    id: 2,
    date: "June 26, 2026",
    session: "Last Friday",
    topic: "Queens of Science: African Women Leading the Next Scientific Golden Age",
    focus: "Women in STEM, mentorship, inclusion, and leadership",
    outcome: "Empower female students and strengthen inclusion in STEM",
    color: "bg-accent-purple"
  },
  {
    id: 3,
    date: "July 3, 2026",
    session: "First Friday",
    topic: "Feeding One Billion: Revolutionary Agrotech & Climate-Smart Farming",
    focus: "Smart farming, drones, biotech, climate resilience",
    outcome: "Promote agrotech careers and food security awareness",
    color: "bg-accent-emerald"
  },
  {
    id: 4,
    date: "July 31, 2026",
    session: "Last Friday",
    topic: "Unlocking Africa's Genetic Goldmine: Genomics for Health Sovereignty",
    focus: "Genomics, biotechnology, precision medicine, ethics",
    outcome: "Build interest in African biotech and health innovation",
    color: "bg-accent-blue"
  },
  {
    id: 5,
    date: "August 7, 2026",
    session: "First Friday",
    topic: "Science Millionaires: Turning Research into African Startups & Unicorns",
    focus: "Entrepreneurship, commercialization, innovation funding",
    outcome: "Encourage startup creation and entrepreneurial thinking",
    color: "bg-accent-purple"
  },
  {
    id: 6,
    date: "August 28, 2026",
    session: "Last Friday",
    topic: "Climate Warriors: Science & Tech for African Adaptation and Resilience",
    focus: "Climate adaptation technologies and sustainability",
    outcome: "Equip youth to contribute to climate solutions",
    color: "bg-accent-emerald"
  },
  {
    id: 7,
    date: "September 4, 2026",
    session: "First Friday",
    topic: "Africa in Space: Satellites, Stars & Building a Spacefaring Continent",
    focus: "Space science, satellites, aerospace innovation",
    outcome: "Spark interest in space and satellite careers",
    color: "bg-accent-blue"
  }
];

export function Webinars() {
  return (
    <section id="webinars" className="relative py-24 sm:py-32 bg-card/30 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-40 right-20 w-72 h-72 bg-accent-blue/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-40 left-20 w-96 h-96 bg-accent-purple/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-3 h-3 bg-accent-purple rounded-full animate-pulse" />
              <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                Webinars & Events
              </span>
              <div className="w-3 h-3 bg-accent-blue rounded-full animate-pulse" />
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight">
              <span className="block">Scientific</span>
              <span className="block text-gray-400">Engagements</span>
            </h2>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl leading-relaxed">
              Join our interactive sessions to explore frontier sciences, build meaningful connections, and foster innovation across the African continent.
            </p>
          </div>
        </div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {webinars.map((webinar, index) => (
            <div 
              key={webinar.id} 
              className="group relative bg-white dark:bg-card clean-border rounded-3xl p-8 flex flex-col h-full hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              style={{
                transitionDelay: `${index * 50}ms`
              }}
            >
              {/* Top Accent Line */}
              <div className={`absolute top-0 left-0 right-0 h-1.5 rounded-t-3xl ${webinar.color} opacity-80 group-hover:opacity-100 transition-opacity`} />
              
              {/* Date and Session Tags */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <div className="inline-flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  {webinar.date}
                </div>
                <div className="inline-flex items-center gap-1.5 bg-accent-blue/10 px-3 py-1.5 rounded-full text-sm font-semibold text-accent-blue">
                  <Clock className="w-4 h-4" />
                  {webinar.session}
                </div>
              </div>

              {/* Topic */}
              <h3 className="text-xl sm:text-2xl font-black text-foreground mb-6 leading-snug group-hover:text-accent-blue transition-colors">
                {webinar.topic}
              </h3>

              {/* Focus and Outcome Cards */}
              <div className="mt-auto space-y-4">
                <div className="bg-gray-50 dark:bg-black/20 p-4 rounded-2xl border border-border">
                  <div className="flex items-start gap-3">
                    <Target className="w-5 h-5 text-accent-emerald shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-foreground mb-1 uppercase tracking-wide">Core Focus</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {webinar.focus}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-black/20 p-4 rounded-2xl border border-border">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-accent-purple shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-foreground mb-1 uppercase tracking-wide">Expected Outcome</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {webinar.outcome}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Hover Glow Effect */}
              <div className={`absolute inset-0 ${webinar.color} opacity-0 group-hover:opacity-[0.02] transition-opacity duration-500 rounded-3xl pointer-events-none`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

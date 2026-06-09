'use client'

import { ImageWithFallback } from './figma/ImageWithFallback'
import ceophoto from '../assets/team-member-1.png'
import emmanuelphoto from '../assets/team-member-2.png'
import ronaladphoto from '../assets/team-member-3.png'
import nabasophoto from '../assets/team-member-4.png'
import jonnahphoto from '../assets/team-member-5.png.jpeg'

export function Team() {
  const teamMembers = [
    {
      name: "NAHABWAMUKAMA PIUS",
      role: "Microbiologist & CEO",
      image: ceophoto,
    },
    {
      name: "ISINDE EMMANUEL",
      role: "Social Scientist & Director of Partnerships",
      image: emmanuelphoto,
    },
    {
      name: "SSEKIKUBO RONALD",
      role: "Pharmacologist & Director of Education",
      image: ronaladphoto,
    },
    {
      name: "SAMSON NABASA",
      role: "Biotechnologist & Chief Operations Officer",
      image: nabasophoto,
    },
    {
      name: "AGABA JONNAH",
      role: "Country Director Uganda",
      image: jonnahphoto,
    },
    // Placeholders for remaining members
    {
      name: "Team Member 6",
      role: "Role Description",
      image: ceophoto, // Placeholder image
    },
    {
      name: "Team Member 7",
      role: "Role Description",
      image: ceophoto, // Placeholder image
    },
    {
      name: "Team Member 8",
      role: "Role Description",
      image: ceophoto, // Placeholder image
    }
  ]

  return (
    <div className="relative py-24 bg-background w-full">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Meet the Innovators
            </span>
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-6 text-foreground">
            Leading the Scientific Frontier
          </h2>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Brilliant minds dedicated to advancing STEM across the continent.
          </p>
        </div>

        {/* Team Grid */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <div 
                key={index}
                className="group relative rounded-2xl overflow-hidden bg-card shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-border"
              >
                {/* Photo Container */}
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted">
                  <ImageWithFallback
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 transition-opacity duration-300" />
                  
                  {/* Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                    <h3 className="text-xl font-bold text-white mb-1 drop-shadow-md">
                      {member.name}
                    </h3>
                    <p className="text-sm font-medium text-blue-300 drop-shadow-md uppercase tracking-wide">
                      {member.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
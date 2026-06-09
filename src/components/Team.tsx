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
      articleLink: "#", // Replace with actual article link
    },
    {
      name: "ISINDE EMMANUEL",
      role: "Social Scientist & Director of Partnerships",
      image: emmanuelphoto,
      articleLink: "#", // Replace with actual article link
    },
    {
      name: "SSEKIKUBO RONALD",
      role: "Pharmacologist & Director of Education",
      image: ronaladphoto,
      articleLink: "#", // Replace with actual article link
    },
    {
      name: "SAMSON NABASA",
      role: "Biotechnologist & Chief Operations Officer",
      image: nabasophoto,
      articleLink: "#", // Replace with actual article link
    },
    {
      name: "AGABA JONNAH",
      role: "Country Director Uganda",
      image: jonnahphoto,
      articleLink: "#", // Replace with actual article link
    },
    // Placeholders for remaining members
    {
      name: "MARIA VALERIA KOBUSINGE",
      role: "Coordinator of Youth Education and Outreach",
      image: ceophoto,
      articleLink: "#",
    },
    {
      name: "OKWE DARIOUS",
      role: "Chief University Representative",
      image: ceophoto,
      articleLink: "#",
    },
    {
      name: "Team Member 8",
      role: "Role Description",
      image: ceophoto,
      articleLink: "#",
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
              <a 
                href={member.articleLink}
                target="_blank"
                rel="noopener noreferrer"
                key={index}
                className="group relative rounded-2xl overflow-hidden bg-card shadow-sm hover:shadow-xl transition-all duration-300 border border-border flex flex-col block cursor-pointer"
              >
                {/* Photo Container */}
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted">
                  <ImageWithFallback
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                
                {/* Info */}
                <div className="p-5 text-center flex-1 flex flex-col justify-center bg-white dark:bg-gray-900 border-t border-border">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-1">
                    {member.name}
                  </h3>
                  <p className="text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                    {member.role}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
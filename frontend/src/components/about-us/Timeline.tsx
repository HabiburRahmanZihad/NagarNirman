'use client'

import { Calendar, Map, MessageSquare, Rocket, Shield, Users } from 'lucide-react'
import { useState } from 'react'

const milestones = [
  {
    year: '2020',
    icon: Calendar,
    title: 'Platform Launch',
    description: 'Initial launch in 5 pilot cities with basic reporting features',
    color: 'from-[#2a7d2f] to-[#1e5c23]',
  },
  {
    year: '2021',
    icon: Users,
    title: 'Rapid User Growth',
    description: 'Expanded to 50+ cities with 100K+ active citizen contributors',
    color: 'from-[#ffcc33] to-[#e6b82e]',
  },
  {
    year: '2022',
    icon: Shield,
    title: 'Government Partnerships',
    description: 'Formal agreements with municipal corporations across states',
    color: 'from-[#2a7d2f] to-[#1e5c23]',
  },
  {
    year: '2023',
    icon: MessageSquare,
    title: 'Mobile App Release',
    description: 'Dedicated mobile application with enhanced reporting features',
    color: 'from-[#ffcc33] to-[#e6b82e]',
  },
  {
    year: '2024',
    icon: Map,
    title: 'National Expansion',
    description: 'Covering 380+ cities with advanced analytics and tracking',
    color: 'from-[#2a7d2f] to-[#1e5c23]',
  },
]

export default function Timeline() {
  const [activeIndex, setActiveIndex] = useState<number | null>(2)

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="hidden lg:block absolute left-1/2 top-12 bottom-12 w-1 bg-gradient-to-b from-[#2a7d2f]/20 via-[#2a7d2f] to-[#2a7d2f]/20 -translate-x-1/2" />
      
      {/* Animated progress */}
      <div className="hidden lg:block absolute left-1/2 top-12 w-1 bg-gradient-to-b from-[#ffcc33] to-[#2a7d2f] -translate-x-1/2 origin-top transition-all duration-1000"
           style={{ height: activeIndex !== null ? `${(activeIndex / (milestones.length - 1)) * 100}%` : '0%' }} />

      <div className="space-y-16 lg:space-y-0">
        {milestones.map((milestone, index) => (
          <div
            key={index}
            className={`relative flex flex-col lg:flex-row items-center transition-all duration-500 ${
              index % 2 === 0 ? 'lg:justify-start' : 'lg:justify-end'
            } ${index === activeIndex ? 'lg:scale-105' : ''}`}
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(2)}
          >
            {/* Timeline content */}
            <div
              className={`w-full lg:w-5/12 transform transition-all duration-500 ${
                index === activeIndex ? 'lg:scale-105' : ''
              } ${
                index % 2 === 0 ? 'lg:pr-24' : 'lg:pl-24'
              }`}
            >
              <div
                className={`group relative bg-white rounded-3xl shadow-xl border-2 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 ${
                  index === activeIndex
                    ? 'border-[#2a7d2f]/30 shadow-2xl shadow-[#2a7d2f]/10'
                    : 'border-gray-200'
                } p-10`}
              >
                {/* Year badge */}
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 lg:left-auto lg:translate-x-0 lg:top-1/2 lg:-translate-y-1/2 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-r from-gray-900 to-gray-800 flex items-center justify-center shadow-lg z-10">
                  <span className="text-white font-bold text-xl">{milestone.year}</span>
                </div>
                
                <div className={`flex items-center gap-8 ${
                  index % 2 === 0 ? 'lg:flex-row-reverse lg:text-right' : ''
                }`}>
                  {/* Icon */}
                  <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${milestone.color} flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-500`}>
                    <milestone.icon className="w-12 h-12 text-white" />
                  </div>
                  
                  {/* Content */}
                  <div className={`flex-1 ${index % 2 === 0 ? 'lg:text-right' : ''}`}>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {milestone.title}
                    </h3>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      {milestone.description}
                    </p>
                    
                    {/* Progress dots */}
                    <div className="flex gap-2 mt-6">
                      {milestones.map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full transition-all duration-500 ${
                            i <= index ? 'bg-[#2a7d2f]' : 'bg-gray-300'
                          } ${i === index ? 'w-8' : ''}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline node */}
            <div
              className={`absolute left-1/2 -translate-x-1/2 lg:translate-x-0 lg:left-1/2 w-8 h-8 rounded-full border-4 transition-all duration-500 z-20 ${
                index === activeIndex
                  ? 'bg-[#ffcc33] border-[#ffcc33] scale-125'
                  : 'bg-white border-[#2a7d2f]'
              }`}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
import { Calendar, Rocket, Handshake, Cpu, Map } from 'lucide-react'

const milestones = [
  {
    year: '2020 Q3',
    icon: Calendar,
    title: 'Concept & Research',
    description: 'Initial idea formation and market research',
    color: 'bg-blue-100 text-blue-700',
  },
  {
    year: '2021 Q2',
    icon: Rocket,
    title: 'Prototype Launch',
    description: 'First working version released in Pune',
    color: 'bg-green-100 text-green-700',
  },
  {
    year: '2022 Q4',
    icon: Handshake,
    title: 'Government Partnerships',
    description: 'Formal agreements with 50+ municipal bodies',
    color: 'bg-purple-100 text-purple-700',
  },
  {
    year: '2023 Q3',
    icon: Cpu,
    title: 'AI Integration',
    description: 'Smart routing and predictive analytics added',
    color: 'bg-orange-100 text-orange-700',
  },
  {
    year: '2024+',
    icon: Map,
    title: 'Pan-India Expansion',
    description: 'Covering all major cities across India',
    color: 'bg-red-100 text-red-700',
  },
]

export default function Timeline() {
  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-secondary via-primary to-secondary -translate-x-1/2" />

      <div className="space-y-12">
        {milestones.map((milestone, index) => (
          <div
            key={index}
            className={`relative flex flex-col lg:flex-row items-center ${
              index % 2 === 0 ? 'lg:justify-start' : 'lg:justify-end'
            }`}
          >
            {/* Timeline content */}
            <div
              className={`card bg-white shadow-lg w-full max-w-md ${
                index % 2 === 0 ? 'lg:mr-auto lg:pr-12' : 'lg:ml-auto lg:pl-12'
              }`}
            >
              <div className="card-body p-6">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${milestone.color.split(' ')[0]}`}>
                    <milestone.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="badge badge-primary">{milestone.year}</span>
                      <h3 className="card-title text-lg font-semibold">{milestone.title}</h3>
                    </div>
                    <p className="text-gray-600">{milestone.description}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline node */}
            <div className="absolute left-1/2 -translate-x-1/2 lg:translate-x-0 lg:left-1/2 w-6 h-6 bg-white border-4 border-primary rounded-full z-10" />
          </div>
        ))}
      </div>
    </div>
  )
}
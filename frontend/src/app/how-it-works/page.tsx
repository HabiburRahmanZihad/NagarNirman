// app/how-it-works/page.tsx
import { FaMapMarkerAlt, FaCamera, FaCheckCircle, FaUserCheck, FaBuilding, FaTools, FaChartLine, FaUsers, FaRoad, FaLightbulb, FaTint, FaTrash, FaTree, FaExclamationTriangle, FaBolt, FaLeaf, FaClock, FaUserShield, FaMapMarkedAlt, FaComments, FaQuestionCircle, FaArrowRight } from 'react-icons/fa';
import { MdOutlineDescription, MdAssignment, MdUpdate, MdVerified } from 'react-icons/md';

// Optional: If you want to extract components, you can create these as separate files
// For now, I'll include everything in one file for clarity

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 1️⃣ Page Intro Header */}
      <section className="relative overflow-hidden bg-white">
        <div className="container mx-auto px-4 py-16 md:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                How <span className="text-[#2a7d2f]">NagarNirman</span> Works
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                NagarNirman streamlines civic reporting through a transparent, efficient workflow. 
                From spotting an issue to complete resolution, our platform connects citizens with 
                authorities in a seamless process that ensures every concern is addressed promptly 
                and effectively.
              </p>
              <div className="flex gap-4">
                <button className="bg-[#2a7d2f] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#236927] transition-colors">
                  Start Reporting
                </button>
                <button className="border border-[#2a7d2f] text-[#2a7d2f] px-6 py-3 rounded-lg font-medium hover:bg-green-50 transition-colors">
                  Watch Demo
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="relative z-10 bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-8 shadow-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                      <FaCamera className="text-[#2a7d2f] text-xl" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Report</h3>
                    <p className="text-sm text-gray-600">Citizens submit issues</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-3">
                      <MdVerified className="text-[#ffcc33] text-xl" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Verify</h3>
                    <p className="text-sm text-gray-600">Officials validate reports</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                      <MdAssignment className="text-blue-600 text-xl" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Assign</h3>
                    <p className="text-sm text-gray-600">Route to department</p>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                      <FaCheckCircle className="text-[#2a7d2f] text-xl" />
                    </div>
                    <h3 className="font-semibold text-gray-900">Resolve</h3>
                    <p className="text-sm text-gray-600">Issue gets fixed</p>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">Average resolution time</div>
                    <div className="text-2xl font-bold text-[#2a7d2f]">72 hours</div>
                  </div>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#ffcc33] opacity-10 rounded-full"></div>
              <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-[#2a7d2f] opacity-5 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* 2️⃣ Step-by-Step Reporting Journey */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Reporting Journey</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Follow these simple steps to report civic issues and track their resolution
            </p>
          </div>

          <div className="relative">
            {/* Desktop timeline */}
            <div className="hidden md:grid md:grid-cols-6 gap-4">
              {steps.map((step, index) => (
                <div key={step.id} className="relative">
                  {/* Connecting line */}
                  {index < steps.length - 1 && (
                    <div className="absolute top-8 left-1/2 w-full h-0.5 bg-green-200 z-0"></div>
                  )}
                  
                  <div className="relative z-10">
                    <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
                      index === 0 ? 'bg-[#2a7d2f]' : 'bg-white border-2 border-green-200'
                    }`}>
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        index === 0 ? 'bg-white' : 'bg-green-50'
                      }`}>
                        <step.icon className={`text-xl ${
                          index === 0 ? 'text-[#2a7d2f]' : 'text-gray-600'
                        }`} />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#ffcc33] rounded-full flex items-center justify-center text-sm font-bold">
                        {step.id}
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                      <p className="text-sm text-gray-600">{step.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile timeline */}
            <div className="md:hidden space-y-8">
              {steps.map((step) => (
                <div key={step.id} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <step.icon className="text-[#2a7d2f] text-lg" />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-6 h-6 bg-[#2a7d2f] text-white rounded-full text-sm flex items-center justify-center">
                        {step.id}
                      </span>
                      <h3 className="font-semibold text-gray-900">{step.title}</h3>
                    </div>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3️⃣ Authority Workflow */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How Authorities Handle Reports</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our streamlined process ensures efficient handling and resolution of every report
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Vertical timeline line */}
              <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-green-200 to-blue-200"></div>
              
              {authoritySteps.map((step, index) => (
                <div key={step.id} className={`relative mb-12 ${index % 2 === 0 ? 'md:pr-1/2 md:pl-4' : 'md:pl-1/2 md:pr-4 md:text-right'}`}>
                  {/* Timeline dot */}
                  <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-white border-4 border-[#2a7d2f] rounded-full"></div>
                  
                  <div className="bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${
                        step.color === 'green' ? 'bg-green-100' :
                        step.color === 'yellow' ? 'bg-yellow-100' :
                        step.color === 'blue' ? 'bg-blue-100' : 'bg-purple-100'
                      }`}>
                        <step.icon className={`text-xl ${
                          step.color === 'green' ? 'text-[#2a7d2f]' :
                          step.color === 'yellow' ? 'text-[#ffcc33]' :
                          step.color === 'blue' ? 'text-blue-600' : 'text-purple-600'
                        }`} />
                      </div>
                      <div className={`flex-1 ${index % 2 === 1 ? 'md:text-right' : ''}`}>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 text-lg">{step.title}</h3>
                          <span className="text-sm font-medium px-3 py-1 bg-green-100 text-[#2a7d2f] rounded-full">
                            {step.status}
                          </span>
                        </div>
                        <p className="text-gray-600">{step.description}</p>
                        {step.details && (
                          <div className="mt-3">
                            <p className="text-sm text-gray-500">{step.details}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4️⃣ Who Uses NagarNirman? */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Who Uses NagarNirman?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our platform brings together citizens, authorities, and administrators for better civic management
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {userPersonas.map((persona) => (
              <div key={persona.id} className="bg-white rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 ${
                  persona.id === 1 ? 'bg-green-100' :
                  persona.id === 2 ? 'bg-blue-100' : 'bg-purple-100'
                }`}>
                  <persona.icon className={`text-2xl ${
                    persona.id === 1 ? 'text-[#2a7d2f]' :
                    persona.id === 2 ? 'text-blue-600' : 'text-purple-600'
                  }`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{persona.title}</h3>
                <p className="text-gray-600 mb-4">{persona.description}</p>
                <ul className="space-y-2">
                  {persona.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-600">
                      <FaCheckCircle className="text-green-500 mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5️⃣ Common Issues That Can Be Reported */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Common Issues You Can Report</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Report any of these civic issues quickly and easily through our platform
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {issues.map((issue) => (
              <div key={issue.id} className="group bg-gray-50 rounded-xl p-6 hover:bg-white hover:shadow-lg transition-all cursor-pointer">
                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mb-4 group-hover:bg-[#2a7d2f] group-hover:text-white transition-colors">
                  <issue.icon className="text-xl text-[#2a7d2f] group-hover:text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{issue.title}</h3>
                <p className="text-sm text-gray-600">{issue.description}</p>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <span className="text-xs font-medium px-3 py-1 bg-green-50 text-[#2a7d2f] rounded-full">
                    {issue.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6️⃣ Why This Process Works */}
      <section className="py-16 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Our Process Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Key benefits that make NagarNirman an effective civic reporting platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit) => (
              <div key={benefit.id} className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-white flex items-center justify-center mb-6 shadow-sm">
                  <benefit.icon className="text-2xl text-[#2a7d2f]" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
                <div className="mt-4">
                  <span className="inline-block w-12 h-0.5 bg-[#2a7d2f]"></span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-[#2a7d2f] mb-2">95%</div>
                <p className="text-gray-600">Reports verified within 24 hours</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-[#2a7d2f] mb-2">85%</div>
                <p className="text-gray-600">Issues resolved within 1 week</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-[#2a7d2f] mb-2">4.8★</div>
                <p className="text-gray-600">User satisfaction rating</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7️⃣ FAQ Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions about using NagarNirman
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
                  <button className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <span className="font-medium text-gray-900">{faq.question}</span>
                    <FaQuestionCircle className="text-[#2a7d2f] flex-shrink-0" />
                  </button>
                  <div className="px-6 pb-6">
                    <p className="text-gray-600">{faq.answer}</p>
                    {faq.note && (
                      <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                        <p className="text-sm text-gray-700">{faq.note}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 8️⃣ Call to Action Footer Section */}
      <section className="py-16 bg-gradient-to-r from-[#2a7d2f] to-green-600">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to improve your city?
            </h2>
            <p className="text-green-100 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of citizens who are making their neighborhoods better, one report at a time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-[#2a7d2f] px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
                Start Reporting Now
                <FaArrowRight />
              </button>
              <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-colors">
                Explore Dashboard
              </button>
            </div>
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-white">
              <div className="text-center">
                <div className="text-2xl font-bold">50K+</div>
                <div className="text-sm text-green-100">Reports Filed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">120+</div>
                <div className="text-sm text-green-100">Cities Covered</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">98%</div>
                <div className="text-sm text-green-100">Satisfaction Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">24/7</div>
                <div className="text-sm text-green-100">Platform Availability</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Data for steps
const steps = [
  {
    id: 1,
    title: 'Identify the Issue',
    description: 'Spot a civic problem in your area',
    icon: FaMapMarkerAlt
  },
  {
    id: 2,
    title: 'Capture a Photo',
    description: 'Take visual proof with your phone',
    icon: FaCamera
  },
  {
    id: 3,
    title: 'Auto-detect Location',
    description: 'Let GPS pinpoint the exact spot',
    icon: FaMapMarkedAlt
  },
  {
    id: 4,
    title: 'Add Details',
    description: 'Brief description of the issue',
    icon: MdOutlineDescription
  },
  {
    id: 5,
    title: 'Submit Report',
    description: 'Send to authorities instantly',
    icon: FaCheckCircle
  },
  {
    id: 6,
    title: 'Track Status',
    description: 'Live updates until resolution',
    icon: FaChartLine
  }
];

// Data for authority workflow
const authoritySteps = [
  {
    id: 1,
    title: 'Verification',
    status: '1-24 hours',
    description: 'Municipal officer reviews the report for validity and priority',
    details: 'Checks for duplicates, assesses severity, and categorizes the issue',
    icon: FaUserCheck,
    color: 'green'
  },
  {
    id: 2,
    title: 'Department Assignment',
    status: 'Within 4 hours',
    description: 'Report is routed to the appropriate civic department',
    details: 'Based on issue type (roads, water, electricity, etc.)',
    icon: FaBuilding,
    color: 'blue'
  },
  {
    id: 3,
    title: 'On-ground Action',
    status: '1-3 days',
    description: 'Field workers are dispatched to address the issue',
    details: 'Includes site assessment and implementation of solution',
    icon: FaTools,
    color: 'yellow'
  },
  {
    id: 4,
    title: 'Progress Updates',
    status: 'Real-time',
    description: 'Regular status updates are pushed to the user',
    details: 'Users receive notifications at each milestone',
    icon: MdUpdate,
    color: 'purple'
  },
  {
    id: 5,
    title: 'Resolution & Feedback',
    status: 'Final',
    description: 'Issue marked resolved after verification',
    details: 'User can confirm resolution and provide feedback',
    icon: FaComments,
    color: 'green'
  }
];

// Data for user personas
const userPersonas = [
  {
    id: 1,
    title: 'Citizens',
    description: 'Report issues and track resolutions in their neighborhoods',
    icon: FaUsers,
    features: [
      'Submit reports with photos',
      'Track real-time status',
      'Receive resolution updates',
      'View community reports'
    ]
  },
  {
    id: 2,
    title: 'Municipality Workers',
    description: 'Receive and resolve reported civic issues efficiently',
    icon: FaBuilding,
    features: [
      'Access assigned reports',
      'Update work progress',
      'Upload completion proof',
      'Coordinate with teams'
    ]
  },
  {
    id: 3,
    title: 'Admins & Moderators',
    description: 'Monitor, verify, and manage all platform activities',
    icon: FaUserShield,
    features: [
      'Verify incoming reports',
      'Assign to departments',
      'Monitor resolution rates',
      'Generate analytics'
    ]
  }
];

// Data for common issues
const issues = [
  {
    id: 1,
    title: 'Road Damage',
    description: 'Potholes, cracks, and road surface issues',
    icon: FaRoad,
    category: 'Infrastructure'
  },
  {
    id: 2,
    title: 'Street Light Failure',
    description: 'Non-functioning or damaged street lights',
    icon: FaLightbulb,
    category: 'Public Utilities'
  },
  {
    id: 3,
    title: 'Water & Drainage',
    description: 'Leakages, blockages, and waterlogging',
    icon: FaTint,
    category: 'Water Supply'
  },
  {
    id: 4,
    title: 'Garbage & Waste',
    description: 'Uncollected waste, overflowing bins',
    icon: FaTrash,
    category: 'Sanitation'
  },
  {
    id: 5,
    title: 'Parks & Public Spaces',
    description: 'Maintenance issues in parks and community areas',
    icon: FaTree,
    category: 'Public Spaces'
  },
  {
    id: 6,
    title: 'Safety Hazards',
    description: 'Broken footpaths, exposed wiring, dangerous structures',
    icon: FaExclamationTriangle,
    category: 'Safety'
  },
  {
    id: 7,
    title: 'Electricity Issues',
    description: 'Power outages, fallen cables, transformer problems',
    icon: FaBolt,
    category: 'Electricity'
  },
  {
    id: 8,
    title: 'Environmental Concerns',
    description: 'Air/water pollution, tree damage, illegal dumping',
    icon: FaLeaf,
    category: 'Environment'
  }
];

// Data for benefits
const benefits = [
  {
    id: 1,
    title: 'Faster Resolution',
    description: 'Streamlined process reduces average resolution time by 60%',
    icon: FaClock
  },
  {
    id: 2,
    title: 'Transparent Tracking',
    description: 'Real-time updates keep citizens informed at every step',
    icon: FaChartLine
  },
  {
    id: 3,
    title: 'Data-Driven Planning',
    description: 'Aggregated reports help in evidence-based urban planning',
    icon: FaMapMarkedAlt
  },
  {
    id: 4,
    title: 'Community Engagement',
    description: 'Empowers citizens to actively participate in civic improvement',
    icon: FaUsers
  }
];

// Data for FAQs
const faqs = [
  {
    question: 'How long does a report take to verify?',
    answer: 'Most reports are verified within 24 hours during working days. High-priority issues like safety hazards may be verified within 4-6 hours.',
    note: 'Verification time may vary based on municipal office hours and workload.'
  },
  {
    question: 'Do I need to share personal details?',
    answer: 'Only basic contact information is required for updates. Your identity remains confidential with authorities unless you choose to share it.',
    note: 'We comply with data protection regulations to ensure your privacy.'
  },
  {
    question: 'Is location auto-detected?',
    answer: 'Yes, our platform uses GPS to auto-detect your location when you submit a report. You can also manually adjust the location pin on the map.',
    note: 'Location access is requested only when submitting a report.'
  },
  {
    question: 'Can I track real-time updates?',
    answer: 'Absolutely! You\'ll receive notifications at every stage: Verification → Assignment → In Progress → Resolved. You can also check status anytime on your dashboard.',
    note: 'Enable push notifications for instant updates.'
  },
  {
    question: 'How do authorities respond to reports?',
    answer: 'Municipal departments receive reports through their dedicated dashboard. They assign field staff, update progress, and mark reports resolved with photographic evidence.',
    note: 'Response time depends on issue severity and department workload.'
  }
];
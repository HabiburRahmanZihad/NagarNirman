import {
  Camera,
  CheckCircle,
  ChevronDown,
  Clock,
  Eye,
  FileText,
  Filter,
  Flag,
  Globe,
  Home,
  Lightbulb,
  MapPin,
  MessageSquare,
  Search,
  Shield,
  Target,
  TrendingUp,
  Upload,
  UserPlus,
  Users,
  Zap,
} from 'lucide-react'
import FAQAccordion from '@/components/about-us/FAQAccordion'
import StatCard from '@/components/about-us/StatCard'
import Timeline from '@/components/about-us/Timeline'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* 1. Top Hero Section - Enhanced */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-gray-50/50 to-white">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />
        <div className="relative container mx-auto px-4 py-24 md:py-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-[#2a7d2f]/10 rounded-full blur-2xl" />
              <div className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-[#2a7d2f]/10 to-[#ffcc33]/10 backdrop-blur-sm border border-[#2a7d2f]/20 mb-8">
                <div className="w-8 h-8 rounded-full bg-[#2a7d2f] flex items-center justify-center">
                  <Flag className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-semibold text-[#2a7d2f]">Civic Tech Platform</span>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight">
                About{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2a7d2f] to-[#1e5c23]">
                  NagarNirman
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-10 max-w-2xl leading-relaxed">
                Transforming urban governance through citizen-powered reporting and 
                data-driven solutions. Making cities smarter, one report at a time.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="group relative px-8 py-4 bg-gradient-to-r from-[#2a7d2f] to-[#1e5c23] text-white font-semibold rounded-full hover:shadow-xl hover:shadow-[#2a7d2f]/20 transition-all duration-300 hover:-translate-y-0.5">
                  <span className="flex items-center">
                    Explore Our Impact
                    <ChevronDown className="w-5 h-5 ml-3 group-hover:translate-y-1 transition-transform" />
                  </span>
                </button>
                <button className="group px-8 py-4 border-2 border-[#2a7d2f] text-[#2a7d2f] font-semibold rounded-full hover:bg-[#2a7d2f] hover:text-white transition-all duration-300">
                  <span className="flex items-center">
                    Watch Demo
                    <span className="ml-2 group-hover:ml-3 transition-all">→</span>
                  </span>
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -right-4 -top-4 w-64 h-64 bg-gradient-to-br from-[#ffcc33]/20 to-[#2a7d2f]/20 rounded-full blur-3xl" />
              <div className="relative w-full aspect-square rounded-3xl overflow-hidden shadow-2xl shadow-[#2a7d2f]/10 border border-gray-200">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800">
                  {/* City Grid Illustration */}
                  <div className="absolute inset-0 flex items-center justify-center p-12">
                    <div className="grid grid-cols-4 gap-6 w-full">
                      {Array.from({ length: 12 }).map((_, i) => (
                        <div
                          key={i}
                          className={`aspect-square rounded-2xl ${
                            i % 4 === 0 ? 'bg-[#2a7d2f]/30' :
                            i % 4 === 1 ? 'bg-[#ffcc33]/30' :
                            i % 4 === 2 ? 'bg-blue-500/30' :
                            'bg-purple-500/30'
                          } backdrop-blur-sm border border-white/10`}
                        />
                      ))}
                    </div>
                  </div>
                  {/* Floating Elements */}
                  <div className="absolute top-1/4 left-1/4 w-16 h-16 rounded-full bg-[#2a7d2f]/20 backdrop-blur-sm border border-[#2a7d2f]/30" />
                  <div className="absolute top-1/3 right-1/4 w-12 h-12 rounded-full bg-[#ffcc33]/20 backdrop-blur-sm border border-[#ffcc33]/30" />
                  <div className="absolute bottom-1/4 left-1/3 w-20 h-20 rounded-full bg-blue-500/20 backdrop-blur-sm border border-blue-500/30" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/60 to-transparent">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-1">Live City Dashboard</h3>
                      <p className="text-white/80 text-sm">Real-time urban issue tracking</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. User Onboarding Steps - Enhanced */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50/50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-2 h-8 bg-[#2a7d2f] rounded-full" />
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                Join Our Civic Community
              </h2>
              <div className="w-2 h-8 bg-[#ffcc33] rounded-full" />
            </div>
            <p className="text-xl text-gray-600">
              Become an active citizen contributor in just four simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto relative">
            {/* Connecting line */}
            <div className="hidden lg:block absolute top-24 left-8 right-8 h-0.5 bg-gradient-to-r from-[#2a7d2f]/20 via-[#ffcc33]/20 to-[#2a7d2f]/20" />
            
            {[
              {
                icon: UserPlus,
                step: "01",
                title: "Create Account",
                description: "Quick sign-up with email or mobile",
                gradient: "from-[#2a7d2f] to-[#1e5c23]",
                delay: 0,
              },
              {
                icon: Shield,
                step: "02",
                title: "Verify Basic Info",
                description: "Simple identity verification process",
                gradient: "from-[#ffcc33] to-[#e6b82e]",
                delay: 100,
              },
              {
                icon: MapPin,
                step: "03",
                title: "Enable Location",
                description: "Allow access for accurate reporting",
                gradient: "from-[#2a7d2f] to-[#1e5c23]",
                delay: 200,
              },
              {
                icon: Flag,
                step: "04",
                title: "Start Reporting",
                description: "Begin submitting civic issues",
                gradient: "from-[#ffcc33] to-[#e6b82e]",
                delay: 300,
              },
            ].map((step, index) => (
              <div
                key={index}
                className="relative group"
                style={{ animationDelay: `${step.delay}ms` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl group-hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2" />
                <div className="relative card bg-transparent border-none">
                  <div className="card-body items-center text-center p-8">
                    {/* Step number badge */}
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-r from-gray-900 to-gray-700 flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-lg">{step.step}</span>
                    </div>
                    
                    {/* Icon container */}
                    <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                      <step.icon className="w-12 h-12 text-white" />
                    </div>
                    
                    {/* Content */}
                    <h3 className="card-title text-2xl font-bold text-gray-900 mb-4">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      {step.description}
                    </p>
                    
                    {/* Progress indicator */}
                    {index < 3 && (
                      <div className="lg:hidden absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-[#2a7d2f]/20 to-transparent" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. What is NagarNirman + Why Choose Us - Enhanced */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Left Column - What is NagarNirman */}
            <div className="relative">
              <div className="sticky top-32">
                <div className="flex items-center gap-6 mb-10">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#2a7d2f]/10 to-[#2a7d2f]/5 flex items-center justify-center shadow-inner">
                      <Target className="w-10 h-10 text-[#2a7d2f]" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-[#ffcc33] flex items-center justify-center">
                      <span className="text-sm font-bold">★</span>
                    </div>
                  </div>
                  <h2 className="text-4xl font-bold text-gray-900">
                    Transforming Urban{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2a7d2f] to-[#1e5c23]">
                      Governance
                    </span>
                  </h2>
                </div>
                <p className="text-gray-700 text-xl mb-10 leading-relaxed">
                  NagarNirman is India's premier civic-tech platform that bridges citizens 
                  with local authorities. We transform urban problem reporting into a 
                  seamless, transparent, and impactful experience through technology and 
                  community collaboration.
                </p>
                
                <div className="space-y-6">
                  <div className="group p-6 rounded-2xl bg-gradient-to-r from-white to-gray-50/50 border border-gray-200 hover:border-[#2a7d2f]/30 transition-all duration-300 hover:shadow-lg">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#2a7d2f]/10 to-[#2a7d2f]/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Clock className="w-8 h-8 text-[#2a7d2f]" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-xl text-gray-900 mb-2">Real-Time Tracking</h4>
                        <p className="text-gray-600">Monitor your report status live from submission to resolution</p>
                      </div>
                    </div>
                  </div>
                  <div className="group p-6 rounded-2xl bg-gradient-to-r from-white to-gray-50/50 border border-gray-200 hover:border-[#ffcc33]/30 transition-all duration-300 hover:shadow-lg">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#ffcc33]/10 to-[#ffcc33]/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Filter className="w-8 h-8 text-[#ffcc33]" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-xl text-gray-900 mb-2">Smart Routing</h4>
                        <p className="text-gray-600">AI-powered routing to relevant municipal departments</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Why Choose Us */}
            <div className="relative">
              <div className="relative bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-xl border border-gray-200 p-10">
                {/* Decorative elements */}
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-[#2a7d2f]/10 to-transparent rounded-full blur-2xl" />
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-tr from-[#ffcc33]/10 to-transparent rounded-full blur-2xl" />
                
                <div className="relative">
                  <div className="flex items-center gap-6 mb-12">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#ffcc33]/10 to-[#ffcc33]/5 flex items-center justify-center shadow-inner">
                      <Shield className="w-10 h-10 text-[#ffcc33]" />
                    </div>
                    <div>
                      <div className="inline-block px-4 py-2 rounded-full bg-[#2a7d2f]/10 text-[#2a7d2f] text-sm font-semibold mb-2">
                        Why Trust Us
                      </div>
                      <h2 className="text-4xl font-bold text-gray-900">
                        Built for{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffcc33] to-[#e6b82e]">
                          Citizens
                        </span>
                      </h2>
                    </div>
                  </div>

                  <div className="space-y-8">
                    {[
                      {
                        icon: Zap,
                        title: "Faster Resolution",
                        description: "Direct routing reduces response time by 60% compared to traditional methods",
                        stat: "24-48h",
                      },
                      {
                        icon: Eye,
                        title: "Complete Transparency",
                        description: "Real-time updates and status tracking for every report submitted",
                        stat: "100%",
                      },
                      {
                        icon: Shield,
                        title: "Secure & Anonymous",
                        description: "Bank-level encryption with optional anonymous reporting feature",
                        stat: "✓",
                      },
                      {
                        icon: Users,
                        title: "Community Verified",
                        description: "Local moderators verify reports for accuracy before escalation",
                        stat: "95%",
                      },
                      {
                        icon: Globe,
                        title: "Government Collaboration",
                        description: "Official partnerships with municipal corporations across India",
                        stat: "380+",
                      },
                    ].map((item, index) => (
                      <div
                        key={index}
                        className="group flex items-center gap-6 p-6 rounded-2xl bg-white/50 hover:bg-white border border-gray-200 hover:border-[#2a7d2f]/30 transition-all duration-300 hover:shadow-lg"
                      >
                        <div className="relative">
                          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#2a7d2f]/10 to-[#2a7d2f]/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <item.icon className="w-8 h-8 text-[#2a7d2f]" />
                          </div>
                          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[#ffcc33] flex items-center justify-center text-xs font-bold">
                            {item.stat}
                          </div>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-xl text-gray-900 mb-2">{item.title}</h3>
                          <p className="text-gray-600">{item.description}</p>
                        </div>
                        <ChevronDown className="w-5 h-5 text-[#2a7d2f] opacity-0 group-hover:opacity-100 transition-opacity rotate-90" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. How Reporting Works - Timeline - Enhanced */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50/50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <div className="inline-flex items-center justify-center gap-4 mb-8">
              <div className="w-12 h-1 bg-gradient-to-r from-transparent via-[#2a7d2f] to-transparent" />
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                From Report to Resolution
              </h2>
              <div className="w-12 h-1 bg-gradient-to-r from-transparent via-[#ffcc33] to-transparent" />
            </div>
            <p className="text-xl text-gray-600">
              Our streamlined 7-step process ensures every issue gets proper attention
            </p>
          </div>

          <div className="relative max-w-6xl mx-auto">
            {/* Timeline line */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#2a7d2f]/20 via-[#2a7d2f] to-[#2a7d2f]/20 -translate-x-1/2" />
            
            {/* Timeline dots */}
            <div className="hidden lg:block absolute left-1/2 -translate-x-1/2 w-4 h-full">
              {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="absolute w-4 h-4 rounded-full bg-white border-4 border-[#2a7d2f] shadow-lg"
                  style={{ top: `${(i * 14) + 12}%` }}
                />
              ))}
            </div>

            {/* Timeline steps */}
            <div className="space-y-24">
              {[
                {
                  step: 1,
                  icon: Search,
                  title: "Identify Issue",
                  description: "Spot a civic problem in your locality",
                  align: "left",
                },
                {
                  step: 2,
                  icon: Camera,
                  title: "Capture Photo",
                  description: "Take clear photos as visual evidence",
                  align: "right",
                },
                {
                  step: 3,
                  icon: MapPin,
                  title: "Add Location",
                  description: "Pinpoint exact location on interactive map",
                  align: "left",
                },
                {
                  step: 4,
                  icon: FileText,
                  title: "Write Details",
                  description: "Describe the issue with relevant details",
                  align: "right",
                },
                {
                  step: 5,
                  icon: Upload,
                  title: "Submit Report",
                  description: "Send to relevant municipal department",
                  align: "left",
                },
                {
                  step: 6,
                  icon: TrendingUp,
                  title: "Track Progress",
                  description: "Monitor real-time status updates",
                  align: "right",
                },
                {
                  step: 7,
                  icon: CheckCircle,
                  title: "Resolution Update",
                  description: "Get notified when issue is resolved",
                  align: "left",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className={`relative flex flex-col lg:flex-row items-center ${
                    item.align === 'left' ? 'lg:justify-start' : 'lg:justify-end'
                  }`}
                >
                  {/* Step content */}
                  <div
                    className={`w-full lg:w-5/12 ${
                      item.align === 'left' ? 'lg:pr-24' : 'lg:pl-24'
                    }`}
                  >
                    <div
                      className={`group relative bg-white rounded-2xl shadow-xl border border-gray-200 hover:border-[#2a7d2f]/30 p-8 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 ${
                        item.align === 'left' ? 'lg:text-right' : ''
                      }`}
                    >
                      {/* Step badge */}
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 lg:left-auto lg:translate-x-0 lg:top-1/2 lg:-translate-y-1/2 lg:w-16 lg:h-16 rounded-full bg-gradient-to-r from-[#2a7d2f] to-[#1e5c23] flex items-center justify-center shadow-lg z-10">
                        <span className="text-white font-bold text-lg">{item.step}</span>
                      </div>
                      
                      <div className={`flex items-center gap-6 ${
                        item.align === 'left' ? 'flex-row-reverse' : ''
                      }`}>
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#2a7d2f]/10 to-[#2a7d2f]/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                          <item.icon className="w-10 h-10 text-[#2a7d2f]" />
                        </div>
                        <div className={`flex-1 ${item.align === 'left' ? 'text-right' : ''}`}>
                          <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
                          <p className="text-gray-600 text-lg">{item.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Problem Type Cards - Enhanced */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
              Report These Common{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2a7d2f] to-[#1e5c23]">
                Civic Issues
              </span>
            </h2>
            <p className="text-xl text-gray-600">
              Help improve your city by reporting various urban infrastructure issues
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {[
              {
                icon: Lightbulb,
                title: "Street Light Issues",
                description: "Non-functional or damaged street lighting",
                issues: ["Flickering lights", "Complete outage", "Damaged poles"],
                color: "from-yellow-100 to-yellow-50",
                border: "hover:border-yellow-300",
                count: "45K+ resolved",
              },
              {
                icon: "🚧",
                title: "Road Damage",
                description: "Potholes, cracks, or road surface issues",
                issues: ["Deep potholes", "Surface cracks", "Uneven roads"],
                color: "from-orange-100 to-orange-50",
                border: "hover:border-orange-300",
                count: "82K+ resolved",
              },
              {
                icon: "💧",
                title: "Water Problems",
                description: "Leakages, contamination, or supply issues",
                issues: ["Pipe leaks", "Water logging", "Supply shortage"],
                color: "from-blue-100 to-blue-50",
                border: "hover:border-blue-300",
                count: "38K+ resolved",
              },
              {
                icon: "🗑️",
                title: "Waste Management",
                description: "Overflowing bins or irregular collection",
                issues: ["Full bins", "Missed collection", "Illegal dumping"],
                color: "from-gray-100 to-gray-50",
                border: "hover:border-gray-300",
                count: "67K+ resolved",
              },
              {
                icon: "🌳",
                title: "Park Maintenance",
                description: "Issues in public parks and green spaces",
                issues: ["Broken equipment", "Overgrown grass", "Littering"],
                color: "from-green-100 to-green-50",
                border: "hover:border-green-300",
                count: "29K+ resolved",
              },
              {
                icon: "🛣️",
                title: "Drainage Issues",
                description: "Blocked or overflowing drainage systems",
                issues: ["Clogged drains", "Flooding", "Damaged covers"],
                color: "from-purple-100 to-purple-50",
                border: "hover:border-purple-300",
                count: "41K+ resolved",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="group relative"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className={`relative card bg-white border-2 border-gray-200 ${item.border} rounded-3xl transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl`}>
                  <div className="card-body p-8">
                    {/* Icon */}
                    <div className="mb-8">
                      {typeof item.icon === 'string' ? (
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-100 to-white flex items-center justify-center shadow-inner">
                          <span className="text-4xl">{item.icon}</span>
                        </div>
                      ) : (
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#2a7d2f]/10 to-[#2a7d2f]/5 flex items-center justify-center shadow-inner">
                          <item.icon className="w-10 h-10 text-[#2a7d2f]" />
                        </div>
                      )}
                    </div>
                    
                    {/* Title & Description */}
                    <h3 className="card-title text-2xl font-bold text-gray-900 mb-3">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 text-lg mb-6">
                      {item.description}
                    </p>
                    
                    {/* Issues list */}
                    <div className="space-y-3 mb-6">
                      {item.issues.map((issue, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-[#2a7d2f]" />
                          <span className="text-gray-700">{issue}</span>
                        </div>
                      ))}
                    </div>
                    
                    {/* Footer */}
                    <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                      <span className="text-sm font-medium text-gray-500">
                        {item.count}
                      </span>
                      <button className="px-5 py-2 rounded-full bg-gradient-to-r from-[#2a7d2f] to-[#1e5c23] text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-0 translate-x-4">
                        Report Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FAQ Section - Enhanced */}
      <section className="py-24 bg-gradient-to-b from-gray-50/50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-4 mb-8">
                <div className="w-16 h-1 bg-gradient-to-r from-[#2a7d2f] to-transparent" />
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                  Frequently Asked{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffcc33] to-[#e6b82e]">
                    Questions
                  </span>
                </h2>
                <div className="w-16 h-1 bg-gradient-to-l from-[#ffcc33] to-transparent" />
              </div>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Everything you need to know about NagarNirman civic reporting
              </p>
            </div>

            <FAQAccordion />
          </div>
        </div>
      </section>

      {/* 7. Mission & Vision - Enhanced */}
      <section className="py-24 relative overflow-hidden">
        {/* Background patterns */}
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.8))]" />
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />
        
        <div className="relative container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Mission Card */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#2a7d2f] to-[#1e5c23] rounded-3xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
              <div className="relative card bg-white border border-gray-200 rounded-3xl overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-[#2a7d2f]/5 to-transparent rounded-full -translate-y-24 translate-x-24" />
                <div className="card-body p-12">
                  <div className="flex items-center gap-8 mb-10">
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#2a7d2f] to-[#1e5c23] flex items-center justify-center shadow-xl">
                      <Target className="w-12 h-12 text-white" />
                    </div>
                    <div>
                      <div className="inline-block px-5 py-2 rounded-full bg-[#2a7d2f]/10 text-[#2a7d2f] font-semibold mb-3">
                        Our Purpose
                      </div>
                      <h2 className="text-4xl font-bold text-gray-900">Mission</h2>
                    </div>
                  </div>
                  <p className="text-gray-700 text-xl leading-relaxed mb-10">
                    To empower every citizen with accessible tools for direct civic engagement, 
                    creating transparent digital bridges between communities and local governments 
                    for efficient, data-driven urban problem-solving.
                  </p>
                  <div className="space-y-4">
                    {['Citizen Empowerment', 'Government Transparency', 'Community Collaboration', 'Digital Innovation'].map(
                      (value, index) => (
                        <div key={index} className="flex items-center gap-4 group/item">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#2a7d2f]/10 to-[#2a7d2f]/5 flex items-center justify-center group-hover/item:scale-110 transition-transform">
                            <CheckCircle className="w-4 h-4 text-[#2a7d2f]" />
                          </div>
                          <span className="font-semibold text-lg text-gray-900">{value}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Vision Card */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#ffcc33] to-[#e6b82e] rounded-3xl blur opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
              <div className="relative card bg-white border border-gray-200 rounded-3xl overflow-hidden">
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-[#ffcc33]/5 to-transparent rounded-full translate-y-24 -translate-x-24" />
                <div className="card-body p-12">
                  <div className="flex items-center gap-8 mb-10">
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#ffcc33] to-[#e6b82e] flex items-center justify-center shadow-xl">
                      <Eye className="w-12 h-12 text-gray-900" />
                    </div>
                    <div>
                      <div className="inline-block px-5 py-2 rounded-full bg-[#ffcc33]/10 text-gray-900 font-semibold mb-3">
                        Our Future
                      </div>
                      <h2 className="text-4xl font-bold text-gray-900">Vision</h2>
                    </div>
                  </div>
                  <p className="text-gray-700 text-xl leading-relaxed mb-10">
                    A future where Indian cities leverage community-reported data for 
                    predictive governance, creating self-sustaining urban ecosystems 
                    that are transparent, efficient, and centered around citizen needs.
                  </p>
                  <div className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-8 border border-gray-200">
                    <h4 className="font-bold text-xl text-gray-900 mb-6">Strategic Goals</h4>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between group/item">
                        <div>
                          <h5 className="font-semibold text-gray-900">Expanded City Coverage</h5>
                          <p className="text-gray-600 text-sm">Reach 500+ cities nationwide</p>
                        </div>
                        <span className="px-4 py-2 rounded-full bg-gradient-to-r from-[#2a7d2f] to-[#1e5c23] text-white font-bold">
                          2024
                        </span>
                      </div>
                      <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
                      <div className="flex items-center justify-between group/item">
                        <div>
                          <h5 className="font-semibold text-gray-900">Mobile App Enhancement</h5>
                          <p className="text-gray-600 text-sm">Advanced reporting features</p>
                        </div>
                        <span className="px-4 py-2 rounded-full bg-gradient-to-r from-[#ffcc33] to-[#e6b82e] text-gray-900 font-bold">
                          2025
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Extra Sections */}

      {/* A. Impact Numbers */}
      <section className="py-24 bg-gradient-to-br from-[#2a7d2f] to-[#1e5c23] relative overflow-hidden">
        {/* Background patterns */}
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,white)]" />
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/10 to-transparent" />
        
        <div className="relative container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
              Our Impact in Numbers
            </h2>
            <p className="text-white/80 text-xl max-w-2xl mx-auto">
              Join thousands of citizens actively improving urban infrastructure across India
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <StatCard
              number="285,000+"
              label="Reports Submitted"
              icon="📄"
              delay={100}
            />
            <StatCard
              number="950,000+"
              label="Active Users"
              icon="👥"
              delay={300}
            />
            <StatCard
              number="82%"
              label="Resolution Rate"
              icon="📈"
              delay={500}
            />
            <StatCard
              number="380+"
              label="Cities Covered"
              icon="🏙️"
              delay={700}
            />
          </div>
        </div>
      </section>

      {/* B. Journey Timeline */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
              Our{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2a7d2f] to-[#1e5c23]">
                Journey
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Milestones in building leading civic-tech platform
            </p>
          </div>

          <Timeline />
        </div>
      </section>

      {/* C. Final CTA */}
      <section className="relative py-32 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#2a7d2f] via-[#236925] to-[#1e5c23]" />
        
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#ffcc33]/10 rounded-full blur-3xl" />
        </div>
        
        {/* Top separator */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#ffcc33] to-transparent" />
        
        <div className="relative container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-4 mb-12">
              <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent" />
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white">
                Ready to{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffcc33] to-white">
                  Improve
                </span>{' '}
                Your City?
              </h2>
              <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent" />
            </div>
            
            <p className="text-white/90 text-2xl mb-16 leading-relaxed">
              Join citizens across India in building cleaner, safer, and 
              better-managed urban spaces through transparent civic reporting.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
              <button className="group relative px-12 py-6 bg-gradient-to-r from-[#ffcc33] to-[#e6b82e] text-gray-900 font-bold text-xl rounded-full hover:shadow-2xl hover:shadow-[#ffcc33]/30 transition-all duration-300 hover:-translate-y-1">
                <span className="flex items-center">
                  Start Reporting Now
                  <span className="ml-4 group-hover:translate-x-2 transition-transform">→</span>
                </span>
              </button>
              <button className="group px-12 py-6 border-2 border-white/30 text-white font-bold text-xl rounded-full hover:bg-white/10 hover:border-white backdrop-blur-sm transition-all duration-300">
                <span className="flex items-center">
                  View Success Stories
                  <span className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </span>
              </button>
            </div>
            
            <div className="mt-20 pt-8 border-t border-white/20">
              <p className="text-white/70">
                Already contributing?{' '}
                <a href="/login" className="text-white font-semibold hover:text-[#ffcc33] transition-colors">
                  Sign in to your civic account →
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
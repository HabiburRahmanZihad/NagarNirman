import {
  CheckCircle,
  ChevronDown,
  Clock,
  Eye,
  FileText,
  Filter,
  Flag,
  Globe,
  Lightbulb,
  MapPin,
  MessageSquare,
  Shield,
  Target,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react'
import FAQAccordion from '@/components/about-us/FAQAccordion'
import StatCard from '@/components/about-us/StatCard'
import Timeline from '@/components/about-us/Timeline'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* 1. Top Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-secondary-light/20 to-white" />
        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
                <Flag className="w-4 h-4" />
                <span className="text-sm font-medium">Civic Tech Platform</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-6">
                About NagarNirman
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl">
                Building smarter cities through community-powered solutions. NagarNirman transforms urban 
                problem reporting into a seamless, transparent, and impactful experience.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="btn btn-primary rounded-full px-8">
                  Explore Our Impact
                  <ChevronDown className="w-4 h-4 ml-2" />
                </button>
                <button className="btn btn-outline border-primary text-primary hover:bg-primary hover:text-white rounded-full px-8">
                  Watch Demo
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="relative w-full h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                {/* Dummy illustration - replace with actual image/illustration */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary-light">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="grid grid-cols-3 gap-4 p-8">
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div
                          key={i}
                          className="w-16 h-16 bg-white/20 rounded-xl backdrop-blur-sm"
                        />
                      ))}
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
                <div className="absolute bottom-8 left-8 right-8 text-white">
                  <h3 className="text-xl font-semibold mb-2">Interactive City Dashboard</h3>
                  <p className="text-white/80">Real-time urban issue monitoring</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. User Onboarding Steps */}
      <section className="py-16 bg-base-100">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Join Our Civic Community
            </h2>
            <p className="text-gray-600">
              Become part of the movement to create better cities in just four simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: Users,
                step: "01",
                title: "Create Account",
                description: "Sign up with your email or mobile number in under 2 minutes",
                color: "bg-secondary",
              },
              {
                icon: Shield,
                step: "02",
                title: "Verify Identity",
                description: "Secure verification process to ensure community safety",
                color: "bg-accent",
              },
              {
                icon: MapPin,
                step: "03",
                title: "Enable Location",
                description: "Allow location access for accurate issue pinpointing",
                color: "bg-primary",
              },
              {
                icon: MessageSquare,
                step: "04",
                title: "Start Reporting",
                description: "Begin reporting issues and tracking resolutions",
                color: "bg-green-500",
              },
            ].map((step, index) => (
              <div
                key={index}
                className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-base-200"
              >
                <div className="card-body items-center text-center p-6">
                  <div className={`w-16 h-16 ${step.color} rounded-full flex items-center justify-center mb-4`}>
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="badge badge-primary badge-outline mb-2">Step {step.step}</div>
                  <h3 className="card-title text-lg font-semibold text-primary mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. What is NagarNirman + Why Choose Us */}
      <section className="py-16 bg-secondary-light/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left Column - What is NagarNirman */}
            <div>
              <div className="sticky top-24">
                <div className="inline-flex items-center gap-2 mb-6">
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-primary">Transforming Urban Governance</h2>
                </div>
                <p className="text-gray-700 mb-8 text-lg">
                  NagarNirman is India's premier civic-tech platform that bridges the gap between citizens 
                  and municipal authorities. We provide a smart, data-driven system for reporting, tracking, 
                  and resolving urban issues efficiently.
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-white p-4 rounded-xl shadow-sm border">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-secondary/20 rounded-lg flex items-center justify-center">
                        <Clock className="w-4 h-4 text-primary" />
                      </div>
                      <h4 className="font-semibold">Real-time Tracking</h4>
                    </div>
                    <p className="text-sm text-gray-600">Monitor issue status live</p>
                  </div>
                  <div className="bg-white p-4 rounded-xl shadow-sm border">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-secondary/20 rounded-lg flex items-center justify-center">
                        <Filter className="w-4 h-4 text-primary" />
                      </div>
                      <h4 className="font-semibold">AI-Powered Routing</h4>
                    </div>
                    <p className="text-sm text-gray-600">Smart department assignment</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Why Choose Us */}
            <div>
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-accent" />
                  </div>
                  <h2 className="text-3xl font-bold text-primary">Why Trust NagarNirman</h2>
                </div>

                <div className="space-y-6">
                  {[
                    {
                      icon: Zap,
                      title: "Faster Resolution",
                      description: "AI-powered routing ensures complaints reach the right department within minutes",
                      color: "text-yellow-500",
                    },
                    {
                      icon: Eye,
                      title: "Complete Transparency",
                      description: "Track every stage of your complaint from submission to resolution",
                      color: "text-blue-500",
                    },
                    {
                      icon: Users,
                      title: "Community Impact",
                      description: "Your reports contribute to data-driven urban planning decisions",
                      color: "text-green-500",
                    },
                    {
                      icon: Globe,
                      title: "24/7 Accessibility",
                      description: "Report issues anytime, anywhere via mobile app or web portal",
                      color: "text-purple-500",
                    },
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 rounded-xl hover:bg-base-100 transition-colors">
                      <div className={`w-10 h-10 rounded-full ${item.color.replace('text', 'bg')}/10 flex items-center justify-center flex-shrink-0`}>
                        <item.icon className={`w-5 h-5 ${item.color}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                        <p className="text-gray-600">{item.description}</p>
                      </div>
                      <CheckCircle className="w-5 h-5 text-accent ml-auto flex-shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. How Reporting Works - Timeline */}
      <section className="py-16 bg-base-100">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              From Report to Resolution
            </h2>
            <p className="text-gray-600">
              Our streamlined process ensures every issue gets the attention it deserves
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-secondary via-primary to-secondary -translate-x-1/2" />

            {/* Timeline steps */}
            <div className="space-y-12 lg:space-y-0">
              {[
                {
                  step: 1,
                  icon: Eye,
                  title: "Identify Issue",
                  description: "Spot an urban problem in your area",
                  align: "left",
                },
                {
                  step: 2,
                  icon: FileText,
                  title: "Document Evidence",
                  description: "Capture photos/videos with details",
                  align: "right",
                },
                {
                  step: 3,
                  icon: MapPin,
                  title: "Pinpoint Location",
                  description: "Add precise GPS coordinates",
                  align: "left",
                },
                {
                  step: 4,
                  icon: MessageSquare,
                  title: "Submit Report",
                  description: "Send to relevant authorities",
                  align: "right",
                },
                {
                  step: 5,
                  icon: TrendingUp,
                  title: "Track Progress",
                  description: "Monitor real-time updates",
                  align: "left",
                },
                {
                  step: 6,
                  icon: CheckCircle,
                  title: "Verify Resolution",
                  description: "Confirm issue has been fixed",
                  align: "right",
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
                    className={`card bg-base-100 shadow-lg w-full max-w-md ${
                      item.align === 'left' ? 'lg:text-right lg:mr-auto' : 'lg:text-left lg:ml-auto'
                    }`}
                  >
                    <div className="card-body p-6">
                      <div className="flex items-center gap-4">
                        {item.align === 'left' && (
                          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                            <item.icon className="w-6 h-6 text-white" />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="badge badge-primary mb-2">Step {item.step}</div>
                          <h3 className="card-title text-lg font-semibold">{item.title}</h3>
                          <p className="text-gray-600">{item.description}</p>
                        </div>
                        {item.align === 'right' && (
                          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                            <item.icon className="w-6 h-6 text-white" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Timeline node */}
                  <div className="absolute left-1/2 -translate-x-1/2 lg:translate-x-0 lg:left-1/2 w-8 h-8 bg-white border-4 border-primary rounded-full z-10" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Problem Type Cards */}
      <section className="py-16 bg-secondary-light/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Common Issues You Can Report
            </h2>
            <p className="text-gray-600">
              From infrastructure to environmental concerns, report any urban issue you encounter
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: Lightbulb,
                title: "Street Light Failure",
                description: "Non-functional or damaged street lighting",
                color: "bg-yellow-100 text-yellow-700",
              },
              {
                icon: Flag,
                title: "Road Damage",
                description: "Potholes, cracks, or surface deterioration",
                color: "bg-orange-100 text-orange-700",
              },
              {
                icon: "💧",
                title: "Water Issues",
                description: "Pipe leaks, contamination, or shortage",
                color: "bg-blue-100 text-blue-700",
              },
              {
                icon: "🗑️",
                title: "Waste Management",
                description: "Overflowing bins or irregular collection",
                color: "bg-gray-100 text-gray-700",
              },
              {
                icon: "🌳",
                title: "Public Parks",
                description: "Maintenance issues in green spaces",
                color: "bg-green-100 text-green-700",
              },
              {
                icon: "🚦",
                title: "Traffic Signals",
                description: "Malfunctioning traffic control systems",
                color: "bg-red-100 text-red-700",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="card bg-base-100 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-base-200 cursor-pointer group"
              >
                <div className="card-body p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${item.color.split(' ')[0]}`}>
                      {typeof item.icon === 'string' ? (
                        <span className="text-2xl">{item.icon}</span>
                      ) : (
                        <item.icon className="w-6 h-6" />
                      )}
                    </div>
                    <div className="badge badge-primary badge-outline opacity-0 group-hover:opacity-100 transition-opacity">
                      + Report
                    </div>
                  </div>
                  <h3 className="card-title text-lg font-semibold text-primary mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FAQ Section */}
      <section className="py-16 bg-base-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-gray-600">
                Find answers to common questions about NagarNirman
              </p>
            </div>

            <FAQAccordion />
          </div>
        </div>
      </section>

      {/* 7. Mission & Vision */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <div className="relative container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Mission Card */}
            <div className="card bg-white shadow-xl border border-base-200">
              <div className="card-body p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Target className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <div className="badge badge-primary badge-outline mb-2">Our Purpose</div>
                    <h2 className="card-title text-2xl font-bold text-primary">Mission</h2>
                  </div>
                </div>
                <p className="text-gray-700 text-lg mb-6">
                  To empower every citizen with tools for direct civic engagement, transforming urban 
                  problem-solving through transparency, technology, and community collaboration.
                </p>
                <div className="space-y-3">
                  {['Citizen Empowerment', 'Technological Innovation', 'Government Accountability'].map(
                    (value, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-accent" />
                        <span className="font-medium">{value}</span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Vision Card */}
            <div className="card bg-white shadow-xl border border-base-200">
              <div className="card-body p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center">
                    <Eye className="w-7 h-7 text-accent" />
                  </div>
                  <div>
                    <div className="badge badge-accent badge-outline mb-2">Our Future</div>
                    <h2 className="card-title text-2xl font-bold text-primary">Vision</h2>
                  </div>
                </div>
                <p className="text-gray-700 text-lg mb-6">
                  A future where Indian cities leverage community-reported data for predictive governance, 
                  creating self-healing urban ecosystems that are responsive, sustainable, and citizen-centric.
                </p>
                <div className="bg-base-100 rounded-xl p-4">
                  <h4 className="font-semibold mb-3">Future Goals</h4>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-primary">AI-Powered Analytics</span>
                    <span className="badge badge-primary badge-outline">2024</span>
                  </div>
                  <div className="divider my-2" />
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-primary">Pan-India Coverage</span>
                    <span className="badge badge-primary badge-outline">2025</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Extra Sections */}

      {/* A. Impact Numbers */}
      <section className="py-16 bg-primary text-primary-content">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Impact in Numbers</h2>
            <p className="text-primary-content/80 max-w-2xl mx-auto">
              Join thousands of citizens making a difference in their communities
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <StatCard
              number="235,000+"
              label="Reports Submitted"
              icon="📄"
              delay={100}
            />
            <StatCard
              number="1.2M+"
              label="Active Users"
              icon="👥"
              delay={300}
            />
            <StatCard
              number="78%"
              label="Resolution Rate"
              icon="📈"
              delay={500}
            />
            <StatCard
              number="420+"
              label="Cities Covered"
              icon="🏙️"
              delay={700}
            />
          </div>
        </div>
      </section>

      {/* B. Journey Timeline */}
      <section className="py-16 bg-base-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Our Journey
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From a simple idea to India's leading civic-tech platform
            </p>
          </div>

          <Timeline />
        </div>
      </section>

      {/* C. Final CTA */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary-light relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-black/10" />
        </div>
        <div className="relative container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to transform your city?
            </h2>
            <p className="text-white/90 text-xl mb-8">
              Join thousands of citizens already making a difference in their communities
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn btn-accent btn-lg rounded-full px-8 text-white">
                Start Reporting Now
                <ChevronDown className="w-5 h-5 ml-2" />
              </button>
              <button className="btn btn-outline btn-lg border-white text-white hover:bg-white hover:text-primary rounded-full px-8">
                Explore Success Stories →
              </button>
            </div>
            <div className="mt-12 text-white/70">
              <p className="text-sm">
                Already using NagarNirman?{' '}
                <a href="/login" className="underline hover:text-white">
                  Sign in to your account
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
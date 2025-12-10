import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* 1️⃣ Intro Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#2a7d2f] via-[#2a7d2f]/20 to-transparent pointer-events-none" />
        <div className="container relative mx-auto px-4 py-20 md:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                About NagarNirman
              </h1>
              <p className="text-lg md:text-xl text-gray-700 mb-8 leading-relaxed">
                NagarNirman is a civic-reporting platform designed to help citizens identify local problems, report them instantly, and track resolutions with complete transparency. We connect communities with authorities to make urban governance faster, smarter, and more accountable.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/report"
                  className="bg-[#2a7d2f] text-white font-semibold py-3 px-8 rounded-lg hover:bg-[#236b27] transition-colors text-center shadow-lg"
                >
                  Get Started Reporting
                </Link>
                <Link
                  href="/how-it-works"
                  className="border-2 border-[#ffcc33] text-gray-800 font-semibold py-3 px-8 rounded-lg hover:bg-[#ffcc33]/10 transition-colors text-center"
                >
                  Explore How It Works
                </Link>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative w-full max-w-lg">
                <div className="absolute -inset-4 bg-gradient-to-r from-[#2a7d2f]/10 to-transparent rounded-3xl blur-xl" />
                <div className="relative bg-white rounded-2xl p-8 shadow-2xl border border-gray-100">
                  <div className="aspect-square rounded-xl bg-gradient-to-br from-[#2a7d2f]/5 to-[#ffcc33]/5 flex items-center justify-center">
                    <div className="text-center p-8">
                      <div className="inline-flex items-center justify-center w-20 h-20 bg-[#2a7d2f] rounded-full mb-6">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Civic Reporting Made Simple</h3>
                      <p className="text-gray-600">Report • Track • Resolve</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2️⃣ Join Our Civic Community */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Join Our Civic Community
            <span className="block text-lg font-normal text-gray-600 mt-2">How to Become a User</span>
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: "fas fa-user-plus",
                title: "Create Account",
                desc: "Sign up using your basic information to get started."
              },
              {
                icon: "fas fa-shield-alt",
                title: "Verify Basic Details",
                desc: "Confirm your phone/email to secure your account."
              },
              {
                icon: "fas fa-map-marker-alt",
                title: "Enable Location",
                desc: "Allow location access for accurate issue reporting."
              },
              {
                icon: "fas fa-flag",
                title: "Start Reporting",
                desc: "Submit your first report and help improve your community."
              }
            ].map((card, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-[#ffcc33] group cursor-pointer"
              >
                <div className="w-14 h-14 bg-[#ffcc33]/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#ffcc33]/30 transition-colors">
                  <i className={`${card.icon} text-2xl text-[#ffcc33]`}></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{card.title}</h3>
                <p className="text-gray-600">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3️⃣ What is NagarNirman & Why It Matters */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left Column */}
            <div className="bg-[#f8f8f8] rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-[#2a7d2f] rounded-lg flex items-center justify-center">
                  <i className="fas fa-bridge text-xl text-white"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">What is NagarNirman?</h3>
              </div>
              <p className="text-lg text-gray-700">
                A digital bridge between citizens and authorities that makes reporting urban problems seamless and transparent.
              </p>
            </div>

            {/* Right Column */}
            <div className="bg-[#f8f8f8] rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-[#2a7d2f] rounded-lg flex items-center justify-center">
                  <i className="fas fa-star text-xl text-white"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Why NagarNirman?</h3>
              </div>
              <ul className="space-y-4">
                {[
                  "Faster issue resolution",
                  "Verified updates from authorities",
                  "Transparent reporting workflow",
                  "Encourages public participation",
                  "Anonymous reporting support",
                  "Helps cities grow smarter and cleaner"
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <i className="fas fa-check text-[#2a7d2f] mt-1"></i>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 4️⃣ How to Report an Issue */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">
            How to Report an Issue
            <span className="block text-lg font-normal text-gray-600 mt-2">Step-by-Step Process</span>
          </h2>
          
          <div className="relative">
            {/* Timeline Line */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-[#2a7d2f]/30 top-0"></div>
            
            {/* Timeline Steps */}
            <div className="space-y-12 md:space-y-0">
              {[
                {title: "Identify the Issue", desc: "Spot any civic problem around you."},
                {title: "Capture Photo", desc: "Take a clear picture for evidence."},
                {title: "Add Location", desc: "Pin the exact spot on the map."},
                {title: "Write Details", desc: "Describe the problem briefly."},
                {title: "Submit Report", desc: "Your report is instantly recorded."},
                {title: "Track Progress", desc: "Monitor live status updates."},
                {title: "Receive Resolution", desc: "Get notified once the issue is solved."}
              ].map((step, index) => (
                <div 
                  key={index}
                  className={`relative flex flex-col md:flex-row items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  {/* Step Content */}
                  <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:pr-12' : 'md:pl-12'}`}>
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-[#ffcc33] rounded-full flex items-center justify-center">
                          <span className="font-bold text-gray-900">{index + 1}</span>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                          <p className="text-gray-600">{step.desc}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Timeline Dot */}
                  <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 w-8 h-8 bg-white rounded-full border-4 border-[#ffcc33] items-center justify-center z-10">
                    <div className="w-3 h-3 bg-[#ffcc33] rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5️⃣ Common Issues You Can Report */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Common Issues You Can Report
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {icon: "fas fa-lightbulb", title: "Street Light Failure", desc: "Dark areas or non-functioning lights."},
              {icon: "fas fa-road", title: "Road Damage", desc: "Potholes, cracks, or broken roads."},
              {icon: "fas fa-tint", title: "Water Issues", desc: "Blocked drains or waterlogging."},
              {icon: "fas fa-trash", title: "Garbage Mismanagement", desc: "Overflowing bins or waste dumping."},
              {icon: "fas fa-tree", title: "Public Parks", desc: "Damaged benches, broken equipment."},
              {icon: "fas fa-exclamation-triangle", title: "Safety Hazards", desc: "Unsafe areas requiring urgent attention."}
            ].map((issue, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
              >
                <div className="w-14 h-14 bg-[#2a7d2f]/10 rounded-xl flex items-center justify-center mb-6">
                  <i className={`${issue.icon} text-2xl text-[#2a7d2f]`}></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{issue.title}</h3>
                <p className="text-gray-600">{issue.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6️⃣ FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              "Is NagarNirman connected with the government?",
              "Is reporting free to use?",
              "Can I submit an anonymous report?",
              "What information is required to create a report?",
              "How long does resolution usually take?",
              "How do I track the status of my report?",
              "Will my personal data remain private?"
            ].map((question, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:border-[#2a7d2f]/30 transition-colors cursor-pointer group"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">{question}</h3>
                  <i className="fas fa-chevron-down text-[#2a7d2f] group-hover:rotate-180 transition-transform"></i>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7️⃣ Mission & Vision */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Mission Card */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border-t-4 border-[#ffcc33]">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-[#2a7d2f]/10 rounded-xl flex items-center justify-center">
                  <i className="fas fa-bullseye text-2xl text-[#2a7d2f]"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Mission</h3>
              </div>
              <p className="text-gray-700 text-lg">
                To empower citizens with tools that improve transparency, accelerate problem-solving, and encourage collaborative governance.
              </p>
            </div>

            {/* Vision Card */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border-t-4 border-[#ffcc33]">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-[#2a7d2f]/10 rounded-xl flex items-center justify-center">
                  <i className="fas fa-eye text-2xl text-[#2a7d2f]"></i>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Vision</h3>
              </div>
              <p className="text-gray-700 text-lg">
                To build cleaner, safer, digitally connected cities where every citizen can contribute to community improvement effortlessly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8️⃣ Our Impact in Numbers */}
      <section className="py-20 bg-gradient-to-r from-[#2a7d2f]/5 to-[#ffcc33]/5">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">
            Our Impact in Numbers
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {number: "235,000+", label: "Reports Submitted", icon: "fas fa-file-alt"},
              {number: "12,000+", label: "Active Users", icon: "fas fa-users"},
              {number: "78%", label: "Resolution Rate", icon: "fas fa-chart-line"},
              {number: "420+", label: "Cities Covered", icon: "fas fa-city"}
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <i className={`${stat.icon} text-3xl text-[#ffcc33]`}></i>
                </div>
                <div className="text-5xl font-bold text-[#ffcc33] mb-3">{stat.number}</div>
                <div className="text-lg font-semibold text-gray-900">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9️⃣ Footer */}
      <footer className="bg-gradient-to-r from-[#2a7d2f] to-[#236b27] text-white pt-12 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* About Column */}
            <div>
              <h4 className="text-xl font-bold mb-6">About NagarNirman</h4>
              <p className="text-white/80 mb-4">
                A civic-reporting platform connecting citizens with authorities for transparent urban governance.
              </p>
              <Link href="/about" className="text-white hover:text-[#ffcc33] transition-colors inline-block">
                Learn More →
              </Link>
            </div>

            {/* Quick Links Column */}
            <div>
              <h4 className="text-xl font-bold mb-6">Quick Links</h4>
              <ul className="space-y-3">
                <li><Link href="/report" className="text-white/80 hover:text-[#ffcc33] transition-colors">Report an Issue</Link></li>
                <li><Link href="/track" className="text-white/80 hover:text-[#ffcc33] transition-colors">Track Reports</Link></li>
                <li><Link href="/how-it-works" className="text-white/80 hover:text-[#ffcc33] transition-colors">How It Works</Link></li>
                <li><Link href="/contact" className="text-white/80 hover:text-[#ffcc33] transition-colors">Contact Us</Link></li>
              </ul>
            </div>

            {/* Support Column */}
            <div>
              <h4 className="text-xl font-bold mb-6">Support</h4>
              <ul className="space-y-3 mb-6">
                <li><Link href="/help" className="text-white/80 hover:text-[#ffcc33] transition-colors">Help Center</Link></li>
                <li><Link href="/faq" className="text-white/80 hover:text-[#ffcc33] transition-colors">FAQ</Link></li>
                <li><Link href="/privacy" className="text-white/80 hover:text-[#ffcc33] transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-white/80 hover:text-[#ffcc33] transition-colors">Terms of Service</Link></li>
              </ul>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/20 text-center text-white/60 text-sm">
            <p>© {new Date().getFullYear()} NagarNirman Civic Reporting Platform. Empowering communities through transparency.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
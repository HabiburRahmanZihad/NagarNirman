import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* 1️⃣ Intro Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#2a7d2f] via-[#2a7d2f]/10 to-transparent pointer-events-none" />
        <div className="container relative mx-auto px-4 py-20 md:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                About <span className="text-[#2a7d2f]">NagarNirman</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-700 mb-6 leading-relaxed">
                NagarNirman is a civic-reporting platform designed to empower citizens by providing a seamless interface to identify local problems, report them instantly with proper evidence, and track their resolution with complete transparency.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                We bridge the gap between communities and municipal authorities, making urban governance faster, smarter, and more accountable. Our platform ensures that every reported issue receives proper attention and follows a structured resolution process.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/report"
                  className="bg-[#2a7d2f] text-white font-semibold py-3 px-8 rounded-lg hover:bg-[#236b27] transition-all duration-300 text-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Get Started Reporting
                </Link>
                <Link
                  href="/how-it-works"
                  className="border-2 border-[#ffcc33] text-gray-800 font-semibold py-3 px-8 rounded-lg hover:bg-[#ffcc33]/10 transition-all duration-300 text-center hover:border-[#2a7d2f] group"
                >
                  <span className="group-hover:text-[#2a7d2f] transition-colors">Explore How It Works</span>
                </Link>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative w-full max-w-lg">
                <div className="absolute -inset-4 bg-gradient-to-r from-[#2a7d2f]/20 to-[#ffcc33]/20 rounded-3xl blur-xl opacity-50" />
                <div className="relative bg-white rounded-2xl p-8 shadow-2xl border border-gray-100">
                  <div className="aspect-square rounded-xl bg-gradient-to-br from-[#2a7d2f]/5 to-[#ffcc33]/10 flex items-center justify-center p-6">
                    <div className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-inner">
                      <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#2a7d2f] to-[#236b27] rounded-full mb-6 shadow-lg">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">Your Voice Matters</h3>
                      <p className="text-gray-600 mb-4">Report civic issues with photo evidence and location tracking</p>
                      <div className="flex items-center justify-center gap-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-[#2a7d2f] rounded-full"></div>
                          <span className="text-sm text-gray-600">Real-time Tracking</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-[#ffcc33] rounded-full"></div>
                          <span className="text-sm text-gray-600">Transparent Process</span>
                        </div>
                      </div>
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
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">
            Join Our <span className="text-[#2a7d2f]">Civic Community</span>
            <span className="block text-lg font-normal text-gray-600 mt-3">Simple Steps to Become an Active Citizen Reporter</span>
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: "fas fa-user-plus text-3xl",
                title: "Create Your Account",
                desc: "Register with your basic details in under 2 minutes. No complicated forms, just essential information to get you started on your civic journey."
              },
              {
                icon: "fas fa-shield-alt text-3xl",
                title: "Verify Your Identity",
                desc: "Secure your account with phone/email verification. This ensures authenticity and helps maintain a trusted community of reporters."
              },
              {
                icon: "fas fa-map-marker-alt text-3xl",
                title: "Enable Location Access",
                desc: "Allow location permissions for precise issue reporting. Accurate location data helps authorities respond faster and more effectively."
              },
              {
                icon: "fas fa-flag-checkered text-3xl",
                title: "Start Reporting Issues",
                desc: "Submit your first civic report with photos and details. Join thousands of citizens actively improving their neighborhoods."
              }
            ].map((card, index) => (
              <div 
                key={index}
                className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border-2 border-transparent hover:border-[#ffcc33] group cursor-pointer overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#2a7d2f] to-[#ffcc33]"></div>
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#ffcc33]/20 to-[#ffcc33]/40 rounded-2xl flex items-center justify-center mb-8 group-hover:from-[#ffcc33]/30 group-hover:to-[#ffcc33]/50 transition-all duration-300">
                    <i className={`${card.icon} text-[#ffcc33]`}></i>
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-[#2a7d2f] text-white rounded-full flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{card.title}</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{card.desc}</p>
                </div>
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <i className="fas fa-arrow-right text-[#2a7d2f] text-lg"></i>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3️⃣ What is NagarNirman & Why It Matters */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* What is NagarNirman */}
            <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-3xl p-10 shadow-2xl border border-gray-100">
              <div className="absolute -top-4 left-10 bg-[#2a7d2f] text-white px-6 py-2 rounded-full font-semibold text-lg">
                What We Are
              </div>
              <div className="flex items-center gap-6 mb-8 mt-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[#2a7d2f] to-[#1e5a22] rounded-2xl flex items-center justify-center shadow-lg">
                  <i className="fas fa-bridge text-2xl text-white"></i>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">What is NagarNirman?</h3>
                  <p className="text-gray-600">Transforming Civic Engagement</p>
                </div>
              </div>
              <div className="space-y-6">
                <p className="text-gray-700 text-lg leading-relaxed">
                  NagarNirman is a comprehensive digital ecosystem that serves as a bridge between citizens and municipal authorities. Our platform transforms how urban problems are reported, tracked, and resolved through technology-driven solutions.
                </p>
                <div className="bg-[#f8f8f8] rounded-xl p-6 border-l-4 border-[#2a7d2f]">
                  <p className="text-gray-700">
                    We provide a structured framework where every reported issue follows a transparent workflow, from submission to resolution, ensuring accountability at every step of the governance process.
                  </p>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3">
                    <i className="fas fa-check-circle text-[#2a7d2f] text-xl"></i>
                    <span className="text-gray-700">Real-time issue reporting with GPS tracking</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <i className="fas fa-check-circle text-[#2a7d2f] text-xl"></i>
                    <span className="text-gray-700">Photo and video evidence support</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <i className="fas fa-check-circle text-[#2a7d2f] text-xl"></i>
                    <span className="text-gray-700">Direct communication channel with authorities</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Why NagarNirman Matters */}
            <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-3xl p-10 shadow-2xl border border-gray-100">
              <div className="absolute -top-4 left-10 bg-[#ffcc33] text-gray-900 px-6 py-2 rounded-full font-semibold text-lg">
                Why We Matter
              </div>
              <div className="flex items-center gap-6 mb-8 mt-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[#ffcc33] to-[#e6b82e] rounded-2xl flex items-center justify-center shadow-lg">
                  <i className="fas fa-star text-2xl text-gray-900"></i>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Why NagarNirman?</h3>
                  <p className="text-gray-600">Impactful Civic Technology</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {icon: "fas fa-bolt", title: "Faster Resolution", desc: "Reduces issue resolution time by 60% through streamlined workflows"},
                  {icon: "fas fa-check-double", title: "Verified Updates", desc: "Authentic status updates directly from municipal authorities"},
                  {icon: "fas fa-eye", title: "Complete Transparency", desc: "Every step of the resolution process is visible and trackable"},
                  {icon: "fas fa-users", title: "Community Building", desc: "Encourages citizen participation in local governance"},
                  {icon: "fas fa-user-secret", title: "Privacy Protection", desc: "Option for anonymous reporting while maintaining effectiveness"},
                  {icon: "fas fa-city", title: "Smart Cities", desc: "Contributes to data-driven urban planning and development"}
                ].map((item, index) => (
                  <div key={index} className="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow border border-gray-100">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-[#2a7d2f]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <i className={`${item.icon} text-[#2a7d2f] text-lg`}></i>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-2">{item.title}</h4>
                        <p className="text-sm text-gray-600">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4️⃣ How to Report an Issue - Timeline Design */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            Step-by-Step <span className="text-[#2a7d2f]">Reporting Process</span>
          </h2>
          <p className="text-lg text-gray-600 text-center mb-16 max-w-3xl mx-auto">
            Follow this structured timeline to report civic issues effectively and track their resolution progress
          </p>
          
          <div className="relative">
            {/* Main Timeline Line */}
            <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-[#2a7d2f] via-[#ffcc33] to-[#2a7d2f] top-0"></div>
            
            {/* Timeline Steps */}
            <div className="space-y-24">
              {[
                {
                  year: "01",
                  title: "Identify the Issue",
                  desc: "Spot any civic problem in your locality - from potholes to broken street lights. Take a moment to assess the situation and determine the exact nature of the problem.",
                  icon: "fas fa-search",
                  details: "Look for recurring issues or safety hazards that need immediate attention"
                },
                {
                  year: "02",
                  title: "Capture Photo Evidence",
                  desc: "Take clear, well-lit photographs that show the problem from multiple angles. Include landmarks for better location identification.",
                  icon: "fas fa-camera",
                  details: "Good evidence leads to faster resolution. Show scale and severity clearly."
                },
                {
                  year: "03",
                  title: "Pin Exact Location",
                  desc: "Use our interactive map to drop a pin at the exact location. GPS coordinates ensure authorities find the issue without confusion.",
                  icon: "fas fa-map-pin",
                  details: "Accuracy within 10 meters for precise municipal department assignment"
                },
                {
                  year: "04",
                  title: "Write Detailed Description",
                  desc: "Provide a clear description including when you noticed the issue, its impact on the community, and any safety concerns.",
                  icon: "fas fa-edit",
                  details: "Mention affected area size, potential risks, and urgency level"
                },
                {
                  year: "05",
                  title: "Submit Your Report",
                  desc: "Review all information and submit. Your report is instantly logged into the municipal system with a unique tracking ID.",
                  icon: "fas fa-paper-plane",
                  details: "Instant acknowledgment with estimated resolution timeline"
                },
                {
                  year: "06",
                  title: "Track Live Progress",
                  desc: "Monitor real-time updates as your report moves through different municipal departments. Receive notifications at every milestone.",
                  icon: "fas fa-chart-line",
                  details: "View status: Received → Assigned → In Progress → Resolved"
                },
                {
                  year: "07",
                  title: "Receive Resolution Confirmation",
                  desc: "Get notified when the issue is resolved. Verify the solution and provide feedback to improve the system.",
                  icon: "fas fa-check-circle",
                  details: "Option to submit before/after photos and rate the resolution quality"
                }
              ].map((step, index) => (
                <div 
                  key={index}
                  className={`relative flex flex-col lg:flex-row items-center ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}
                >
                  {/* Year Label */}
                  <div className={`absolute lg:static left-4 lg:left-auto top-0 lg:top-auto ${index % 2 === 0 ? 'lg:mr-12' : 'lg:ml-12'} z-10`}>
                    <div className="w-16 h-16 bg-gradient-to-br from-[#ffcc33] to-[#e6b82e] rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                      <span className="text-xl font-bold text-gray-900">{step.year}</span>
                    </div>
                  </div>

                  {/* Step Content */}
                  <div className={`w-full lg:w-5/12 ml-20 lg:ml-0 ${index % 2 === 0 ? 'lg:pr-12' : 'lg:pl-12'}`}>
                    <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100 hover:border-[#2a7d2f]/30 transition-all duration-300">
                      <div className="flex items-start gap-6">
                        <div className="w-14 h-14 bg-[#2a7d2f]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                          <i className={`${step.icon} text-2xl text-[#2a7d2f]`}></i>
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-3">{step.title}</h3>
                          <p className="text-gray-700 mb-4 leading-relaxed">{step.desc}</p>
                          <div className="bg-[#f8f8f8] rounded-lg p-4 border-l-3 border-[#ffcc33]">
                            <p className="text-gray-600 text-sm">{step.details}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Timeline Dot */}
                  <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 w-10 h-10 bg-white rounded-full border-4 border-[#ffcc33] items-center justify-center z-10 shadow-lg">
                    <div className="w-4 h-4 bg-[#ffcc33] rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5️⃣ Common Issues You Can Report */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            Common <span className="text-[#2a7d2f]">Civic Issues</span> You Can Report
          </h2>
          <p className="text-lg text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Identify and report these common urban problems to help create cleaner, safer, and better-maintained neighborhoods
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "fas fa-lightbulb",
                title: "Street Light Failure",
                desc: "Report non-functioning street lights, dark spots in public areas, or flickering lights that pose safety risks during night hours.",
                severity: "Medium Priority",
                tips: "Include pole number if visible"
              },
              {
                icon: "fas fa-road",
                title: "Road Damage & Potholes",
                desc: "Report potholes, cracks, uneven surfaces, or broken roads that can cause accidents or damage vehicles.",
                severity: "High Priority",
                tips: "Show scale using common objects for reference"
              },
              {
                icon: "fas fa-tint",
                title: "Water & Drainage Issues",
                desc: "Report blocked drains, waterlogging, leakages, or contaminated water supply affecting public health and mobility.",
                severity: "High Priority",
                tips: "Mention if it's causing traffic disruption"
              },
              {
                icon: "fas fa-trash-alt",
                title: "Garbage Mismanagement",
                desc: "Report overflowing bins, irregular garbage collection, illegal dumping sites, or waste burning in public areas.",
                severity: "Medium Priority",
                tips: "Specify type of waste and approximate volume"
              },
              {
                icon: "fas fa-tree",
                title: "Public Parks & Amenities",
                desc: "Report damaged benches, broken play equipment, unmaintained gardens, or faulty public amenities in parks.",
                severity: "Low Priority",
                tips: "Include photos of specific damaged equipment"
              },
              {
                icon: "fas fa-exclamation-triangle",
                title: "Safety Hazards",
                desc: "Report exposed electrical wires, broken footpaths, dangerous intersections, or any immediate public safety threats.",
                severity: "Emergency",
                tips: "Mark as urgent if immediate danger exists"
              }
            ].map((issue, index) => (
              <div 
                key={index}
                className="bg-gradient-to-b from-white to-gray-50 rounded-2xl p-8 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-gray-100 group"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#2a7d2f]/20 to-[#2a7d2f]/10 rounded-2xl flex items-center justify-center group-hover:from-[#2a7d2f]/30 group-hover:to-[#2a7d2f]/20 transition-all">
                    <i className={`${issue.icon} text-3xl text-[#2a7d2f]`}></i>
                  </div>
                  <span className={`px-4 py-1 rounded-full text-sm font-semibold ${
                    issue.severity === 'Emergency' ? 'bg-red-100 text-red-700' :
                    issue.severity === 'High Priority' ? 'bg-orange-100 text-orange-700' :
                    issue.severity === 'Medium Priority' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {issue.severity}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{issue.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{issue.desc}</p>
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <i className="fas fa-lightbulb text-[#ffcc33]"></i>
                      <span>Tip: {issue.tips}</span>
                    </div>
                    <button className="text-[#2a7d2f] font-semibold hover:text-[#236b27] transition-colors group">
                      Report Issue
                      <i className="fas fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6️⃣ Frequently Asked Questions */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-[#f8f8f8]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">
            Frequently Asked <span className="text-[#2a7d2f]">Questions</span>
          </h2>
          
          <div className="grid lg:grid-cols-2 gap-12">
            {/* FAQ Column */}
            <div className="space-y-4">
              {[
                {
                  q: "Is NagarNirman officially connected with municipal authorities?",
                  a: "Yes, NagarNirman has formal partnerships with municipal corporations across multiple cities. Our platform is integrated with official grievance redressal systems to ensure reported issues reach the right departments promptly."
                },
                {
                  q: "Is reporting civic issues completely free to use?",
                  a: "Absolutely. NagarNirman is a free public service platform. There are no charges for reporting issues, tracking progress, or receiving resolution updates. Our mission is to make civic participation accessible to everyone."
                },
                {
                  q: "Can I submit reports anonymously to protect my privacy?",
                  a: "Yes, we offer anonymous reporting options. While providing contact information helps with updates, you can choose to report anonymously. However, anonymous reports may have limited tracking features."
                },
                {
                  q: "What information do I need to provide when creating a report?",
                  a: "Essential information includes clear photos, exact location, issue description, and category. Optional details include your contact information for updates and priority level assessment."
                },
                {
                  q: "How long does it usually take to resolve reported issues?",
                  a: "Resolution time varies by issue type and location. Simple issues like garbage clearance take 24-48 hours, while complex problems like road repairs may take 7-14 days. You'll receive estimated timelines upon submission."
                },
                {
                  q: "How can I track the status of my submitted reports?",
                  a: "Each report gets a unique tracking ID. Use this ID on our website or app to view real-time status, department assignments, progress updates, and estimated completion dates."
                },
                {
                  q: "Is my personal data secure and private on NagarNirman?",
                  a: "We follow strict data protection protocols. Personal information is encrypted and never shared without consent. Read our Privacy Policy for detailed information on data handling."
                }
              ].map((faq, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 group cursor-pointer"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-[#2a7d2f] transition-colors">
                        {faq.q}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                    <div className="w-10 h-10 bg-[#2a7d2f]/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-[#2a7d2f]/20 transition-colors">
                      <i className="fas fa-chevron-down text-[#2a7d2f] group-hover:rotate-180 transition-transform"></i>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Interactive Info Column */}
            <div className="lg:sticky lg:top-24">
              <div className="bg-gradient-to-br from-[#2a7d2f] to-[#1e5a22] rounded-2xl p-10 text-white shadow-2xl">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <i className="fas fa-headset text-3xl text-white"></i>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Need More Help?</h3>
                  <p className="text-white/90 mb-8">Our support team is here to assist you with any questions about civic reporting.</p>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                        <i className="fas fa-comment-alt text-[#2a7d2f] text-xl"></i>
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">Live Chat Support</h4>
                        <p className="text-white/80 text-sm">Available 9 AM - 6 PM</p>
                      </div>
                    </div>
                    <button className="w-full bg-white text-[#2a7d2f] font-semibold py-3 rounded-lg hover:bg-gray-100 transition-colors">
                      Start Chat Now
                    </button>
                  </div>

                  <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                        <i className="fas fa-envelope text-[#2a7d2f] text-xl"></i>
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">Email Support</h4>
                        <p className="text-white/80 text-sm">24-hour response time</p>
                      </div>
                    </div>
                    <button className="w-full border-2 border-white text-white font-semibold py-3 rounded-lg hover:bg-white/10 transition-colors">
                      Send Email
                    </button>
                  </div>

                  <div className="text-center pt-6 border-t border-white/20">
                    <p className="text-white/80 mb-4">Average response time: <span className="font-bold">Under 2 hours</span></p>
                    <div className="flex items-center justify-center gap-2 text-sm">
                      <i className="fas fa-star text-[#ffcc33]"></i>
                      <i className="fas fa-star text-[#ffcc33]"></i>
                      <i className="fas fa-star text-[#ffcc33]"></i>
                      <i className="fas fa-star text-[#ffcc33]"></i>
                      <i className="fas fa-star text-[#ffcc33]"></i>
                      <span className="ml-2">4.9/5 Support Rating</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7️⃣ Mission & Vision */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Mission Card */}
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#2a7d2f]/10 to-transparent rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-3xl p-10 shadow-2xl border-t-4 border-[#ffcc33] overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#ffcc33]/5 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-6 mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#2a7d2f] to-[#1e5a22] rounded-2xl flex items-center justify-center shadow-lg">
                      <i className="fas fa-bullseye text-3xl text-white"></i>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Our Mission</h3>
                      <p className="text-gray-600">Driving Civic Transformation</p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <p className="text-gray-700 text-lg leading-relaxed">
                      To empower every citizen with intuitive digital tools that enhance transparency in urban governance, accelerate problem-solving through streamlined processes, and foster collaborative participation between communities and municipal authorities.
                    </p>
                    <div className="bg-[#f8f8f8] rounded-xl p-6 border-l-4 border-[#2a7d2f]">
                      <p className="text-gray-700">
                        We aim to democratize civic engagement by making issue reporting accessible, efficient, and impactful for every resident, regardless of technical expertise or social background.
                      </p>
                    </div>
                    <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
                      <div className="flex-1 text-center">
                        <div className="text-2xl font-bold text-[#2a7d2f]">100,000+</div>
                        <div className="text-sm text-gray-600">Issues Resolved</div>
                      </div>
                      <div className="flex-1 text-center">
                        <div className="text-2xl font-bold text-[#2a7d2f]">500+</div>
                        <div className="text-sm text-gray-600">Municipal Partners</div>
                      </div>
                      <div className="flex-1 text-center">
                        <div className="text-2xl font-bold text-[#2a7d2f]">24/7</div>
                        <div className="text-sm text-gray-600">Platform Availability</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Vision Card */}
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#ffcc33]/10 to-transparent rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-3xl p-10 shadow-2xl border-t-4 border-[#2a7d2f] overflow-hidden">
                <div className="absolute top-0 left-0 w-32 h-32 bg-[#2a7d2f]/5 rounded-full -translate-y-16 -translate-x-16"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-6 mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-[#ffcc33] to-[#e6b82e] rounded-2xl flex items-center justify-center shadow-lg">
                      <i className="fas fa-eye text-3xl text-gray-900"></i>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">Our Vision</h3>
                      <p className="text-gray-600">Building Tomorrow's Cities</p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <p className="text-gray-700 text-lg leading-relaxed">
                      To create cleaner, safer, and digitally connected cities where every citizen can effortlessly contribute to community improvement, and where urban governance evolves into a participatory, data-driven ecosystem that proactively addresses civic needs.
                    </p>
                    <div className="bg-[#f8f8f8] rounded-xl p-6 border-l-4 border-[#ffcc33]">
                      <p className="text-gray-700">
                        We envision a future where civic reporting becomes as natural as social media sharing, creating a self-sustaining cycle of urban improvement driven by engaged communities and responsive governance.
                      </p>
                    </div>
                    <div className="pt-6 border-t border-gray-100">
                      <h4 className="font-bold text-gray-900 mb-4">Future Goals</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                          <i className="fas fa-check text-[#2a7d2f]"></i>
                          <span className="text-sm text-gray-700">AI-powered issue prediction</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <i className="fas fa-check text-[#2a7d2f]"></i>
                          <span className="text-sm text-gray-700">Smart city integrations</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <i className="fas fa-check text-[#2a7d2f]"></i>
                          <span className="text-sm text-gray-700">Multi-language support</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <i className="fas fa-check text-[#2a7d2f]"></i>
                          <span className="text-sm text-gray-700">Citizen reward systems</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8️⃣ Our Impact in Numbers */}
      <section className="py-20 bg-gradient-to-r from-[#2a7d2f]/5 via-[#ffcc33]/5 to-[#2a7d2f]/5">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            Our Growing <span className="text-[#2a7d2f]">Impact</span>
          </h2>
          <p className="text-lg text-gray-600 text-center mb-16 max-w-3xl mx-auto">
            Real numbers that demonstrate our commitment to transforming civic engagement and urban governance
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                number: "235,000",
                suffix: "+",
                label: "Reports Successfully Submitted",
                icon: "fas fa-file-alt",
                color: "from-[#2a7d2f] to-[#1e5a22]",
                description: "Civic issues reported and processed"
              },
              {
                number: "12,000",
                suffix: "+",
                label: "Active Citizen Reporters",
                icon: "fas fa-users",
                color: "from-[#ffcc33] to-[#e6b82e]",
                description: "Monthly active users improving cities"
              },
              {
                number: "78",
                suffix: "%",
                label: "Average Resolution Rate",
                icon: "fas fa-chart-line",
                color: "from-[#2a7d2f] to-[#ffcc33]",
                description: "Issues resolved satisfactorily"
              },
              {
                number: "420",
                suffix: "+",
                label: "Cities & Municipalities Covered",
                icon: "fas fa-city",
                color: "from-[#ffcc33] to-[#2a7d2f]",
                description: "Urban areas using our platform"
              }
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="relative inline-block mb-8">
                  <div className="absolute inset-0 bg-gradient-to-br opacity-20 rounded-full blur-lg group-hover:blur-xl transition-all duration-500"></div>
                  <div className={`w-24 h-24 bg-gradient-to-br ${stat.color} rounded-full flex items-center justify-center mx-auto shadow-xl relative z-10 group-hover:scale-110 transition-transform duration-500`}>
                    <i className={`${stat.icon} text-3xl text-white`}></i>
                  </div>
                </div>
                <div className="relative">
                  <div className="text-5xl md:text-6xl font-bold text-[#ffcc33] mb-3 group-hover:scale-105 transition-transform duration-300">
                    {stat.number}<span className="text-[#2a7d2f]">{stat.suffix}</span>
                  </div>
                  <div className="text-lg font-semibold text-gray-900 mb-2">{stat.label}</div>
                  <div className="text-gray-600 text-sm">{stat.description}</div>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="inline-flex items-center gap-2 text-sm text-gray-500">
                    <div className="w-2 h-2 bg-[#2a7d2f] rounded-full animate-pulse"></div>
                    <span>Live Counter</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
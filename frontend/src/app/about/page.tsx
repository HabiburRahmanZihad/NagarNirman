"use client";

import Link from "next/link";
import { useState } from "react";
import CountUp from "react-countup";
import { 
  CheckCircle, 
  Users, 
  FileText, 
  MapPin, 
  Camera, 
  Edit, 
  Send, 
  BarChart, 
  CheckCircle2,
  Lightbulb,
  Shield,
  Flag,
  Star,
  Search,
  AlertTriangle,
  Trash2,
  TreePine,
  Droplets,
  Road,
  Eye,
  Target,
  Headphones,
  MessageCircle,
  Mail,
  ChevronDown,
  ArrowRight,
  Award,
  Zap,
  Globe,
  TrendingUp
} from "lucide-react";
import { FaRoad } from "react-icons/fa";

export default function AboutPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
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
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* 1️⃣ Intro Section with Background Image */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")',
            }}
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#2a7d2f]/90 via-[#2a7d2f]/70 to-transparent" />
          {/* Pattern Overlay - Fixed syntax */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '60px 60px'
            }}
          />
        </div>
        
        <div className="container relative mx-auto px-4 py-20 md:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                About <span className="text-[#ffcc33]">NagarNirman</span>
              </h1>
              <p className="text-lg md:text-xl mb-6 leading-relaxed opacity-95">
                NagarNirman is a civic-reporting platform designed to empower citizens by providing a seamless interface to identify local problems, report them instantly with proper evidence, and track their resolution with complete transparency.
              </p>
              <p className="text-lg mb-8 leading-relaxed opacity-90">
                We bridge the gap between communities and municipal authorities, making urban governance faster, smarter, and more accountable. Our platform ensures that every reported issue receives proper attention and follows a structured resolution process.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/report"
                  className="bg-[#ffcc33] text-gray-900 font-semibold py-3 px-8 rounded-lg hover:bg-[#e6b82e] transition-all duration-300 text-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Get Started Reporting
                </Link>
                <Link
                  href="/how-it-works"
                  className="border-2 border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white/10 transition-all duration-300 text-center"
                >
                  Explore How It Works
                </Link>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative w-full max-w-lg">
                <div className="absolute -inset-4 bg-gradient-to-r from-white/20 to-transparent rounded-3xl blur-xl opacity-50" />
                <div className="relative bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20">
                  <div className="aspect-square rounded-xl bg-white/5 flex items-center justify-center p-6">
                    <div className="text-center p-6 bg-white/10 backdrop-blur-sm rounded-2xl shadow-inner border border-white/10">
                      <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#ffcc33] to-[#e6b82e] rounded-full mb-6 shadow-lg">
                        <CheckCircle2 className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-3">Your Voice Matters</h3>
                      <p className="text-white/80 mb-4">Report civic issues with photo evidence and location tracking</p>
                      <div className="flex items-center justify-center gap-4">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-[#ffcc33] rounded-full"></div>
                          <span className="text-sm text-white/80">Real-time Tracking</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                          <span className="text-sm text-white/80">Transparent Process</span>
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
                icon: <Users className="w-8 h-8" />,
                title: "Create Your Account",
                desc: "Register with your basic details in under 2 minutes. No complicated forms, just essential information to get you started on your civic journey."
              },
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Verify Your Identity",
                desc: "Secure your account with phone/email verification. This ensures authenticity and helps maintain a trusted community of reporters."
              },
              {
                icon: <MapPin className="w-8 h-8" />,
                title: "Enable Location Access",
                desc: "Allow location permissions for precise issue reporting. Accurate location data helps authorities respond faster and more effectively."
              },
              {
                icon: <Flag className="w-8 h-8" />,
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
                    <div className="text-[#ffcc33]">
                      {card.icon}
                    </div>
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
                  <ArrowRight className="w-5 h-5 text-[#2a7d2f]" />
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
                  <div className="text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
                      <path d="M9 5v10" />
                      <path d="M15 5v10" />
                    </svg>
                  </div>
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
                    <CheckCircle className="w-5 h-5 text-[#2a7d2f]" />
                    <span className="text-gray-700">Real-time issue reporting with GPS tracking</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-[#2a7d2f]" />
                    <span className="text-gray-700">Photo and video evidence support</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-[#2a7d2f]" />
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
                  <Star className="w-8 h-8 text-gray-900" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Why NagarNirman?</h3>
                  <p className="text-gray-600">Impactful Civic Technology</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {icon: <Zap className="w-5 h-5" />, title: "Faster Resolution", desc: "Reduces issue resolution time by 60% through streamlined workflows"},
                  {icon: <CheckCircle2 className="w-5 h-5" />, title: "Verified Updates", desc: "Authentic status updates directly from municipal authorities"},
                  {icon: <Eye className="w-5 h-5" />, title: "Complete Transparency", desc: "Every step of the resolution process is visible and trackable"},
                  {icon: <Users className="w-5 h-5" />, title: "Community Building", desc: "Encourages citizen participation in local governance"},
                  {icon: <Shield className="w-5 h-5" />, title: "Privacy Protection", desc: "Option for anonymous reporting while maintaining effectiveness"},
                  {icon: <Globe className="w-5 h-5" />, title: "Smart Cities", desc: "Contributes to data-driven urban planning and development"}
                ].map((item, index) => (
                  <div key={index} className="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow border border-gray-100">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-[#2a7d2f]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <div className="text-[#2a7d2f]">
                          {item.icon}
                        </div>
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
                  icon: <Search className="w-6 h-6" />,
                  details: "Look for recurring issues or safety hazards that need immediate attention"
                },
                {
                  year: "02",
                  title: "Capture Photo Evidence",
                  desc: "Take clear, well-lit photographs that show the problem from multiple angles. Include landmarks for better location identification.",
                  icon: <Camera className="w-6 h-6" />,
                  details: "Good evidence leads to faster resolution. Show scale and severity clearly."
                },
                {
                  year: "03",
                  title: "Pin Exact Location",
                  desc: "Use our interactive map to drop a pin at the exact location. GPS coordinates ensure authorities find the issue without confusion.",
                  icon: <MapPin className="w-6 h-6" />,
                  details: "Accuracy within 10 meters for precise municipal department assignment"
                },
                {
                  year: "04",
                  title: "Write Detailed Description",
                  desc: "Provide a clear description including when you noticed the issue, its impact on the community, and any safety concerns.",
                  icon: <Edit className="w-6 h-6" />,
                  details: "Mention affected area size, potential risks, and urgency level"
                },
                {
                  year: "05",
                  title: "Submit Your Report",
                  desc: "Review all information and submit. Your report is instantly logged into the municipal system with a unique tracking ID.",
                  icon: <Send className="w-6 h-6" />,
                  details: "Instant acknowledgment with estimated resolution timeline"
                },
                {
                  year: "06",
                  title: "Track Live Progress",
                  desc: "Monitor real-time updates as your report moves through different municipal departments. Receive notifications at every milestone.",
                  icon: <BarChart className="w-6 h-6" />,
                  details: "View status: Received → Assigned → In Progress → Resolved"
                },
                {
                  year: "07",
                  title: "Receive Resolution Confirmation",
                  desc: "Get notified when the issue is resolved. Verify the solution and provide feedback to improve the system.",
                  icon: <CheckCircle2 className="w-6 h-6" />,
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
                          <div className="text-[#2a7d2f]">
                            {step.icon}
                          </div>
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
                icon: <Lightbulb className="w-7 h-7" />,
                title: "Street Light Failure",
                desc: "Report non-functioning street lights, dark spots in public areas, or flickering lights that pose safety risks during night hours.",
                severity: "Medium Priority",
                tips: "Include pole number if visible"
              },
              {
                icon: <FaRoad className="w-7 h-7" />,
                title: "Road Damage & Potholes",
                desc: "Report potholes, cracks, uneven surfaces, or broken roads that can cause accidents or damage vehicles.",
                severity: "High Priority",
                tips: "Show scale using common objects for reference"
              },
              {
                icon: <Droplets className="w-7 h-7" />,
                title: "Water & Drainage Issues",
                desc: "Report blocked drains, waterlogging, leakages, or contaminated water supply affecting public health and mobility.",
                severity: "High Priority",
                tips: "Mention if it's causing traffic disruption"
              },
              {
                icon: <Trash2 className="w-7 h-7" />,
                title: "Garbage Mismanagement",
                desc: "Report overflowing bins, irregular garbage collection, illegal dumping sites, or waste burning in public areas.",
                severity: "Medium Priority",
                tips: "Specify type of waste and approximate volume"
              },
              {
                icon: <TreePine className="w-7 h-7" />,
                title: "Public Parks & Amenities",
                desc: "Report damaged benches, broken play equipment, unmaintained gardens, or faulty public amenities in parks.",
                severity: "Low Priority",
                tips: "Include photos of specific damaged equipment"
              },
              {
                icon: <AlertTriangle className="w-7 h-7" />,
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
                    <div className="text-[#2a7d2f]">
                      {issue.icon}
                    </div>
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
                      <Lightbulb className="w-4 h-4 text-[#ffcc33]" />
                      <span>Tip: {issue.tips}</span>
                    </div>
                    <button className="text-[#2a7d2f] font-semibold hover:text-[#236b27] transition-colors group">
                      Report Issue
                      <ArrowRight className="w-4 h-4 ml-2 inline group-hover:translate-x-1 transition-transform" />
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
              {faqs.map((faq, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full text-left p-6 flex justify-between items-center hover:bg-gray-50 transition-colors"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 pr-8">
                      {faq.q}
                    </h3>
                    <div className={`w-10 h-10 bg-[#2a7d2f]/10 rounded-full flex items-center justify-center flex-shrink-0 transition-transform ${openFaq === index ? 'rotate-180' : ''}`}>
                      <ChevronDown className="w-5 h-5 text-[#2a7d2f]" />
                    </div>
                  </button>
                  <div 
                    className={`px-6 overflow-hidden transition-all duration-300 ${openFaq === index ? 'max-h-96 pb-6' : 'max-h-0'}`}
                  >
                    <p className="text-gray-600 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Interactive Info Column */}
            <div className="lg:sticky lg:top-24">
              <div className="bg-gradient-to-br from-[#2a7d2f] to-[#1e5a22] rounded-2xl p-10 text-white shadow-2xl">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Headphones className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Need More Help?</h3>
                  <p className="text-white/90 mb-8">Our support team is here to assist you with any questions about civic reporting.</p>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                        <MessageCircle className="w-6 h-6 text-[#2a7d2f]" />
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
                        <Mail className="w-6 h-6 text-[#2a7d2f]" />
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
                      <Star className="w-4 h-4 fill-[#ffcc33] text-[#ffcc33]" />
                      <Star className="w-4 h-4 fill-[#ffcc33] text-[#ffcc33]" />
                      <Star className="w-4 h-4 fill-[#ffcc33] text-[#ffcc33]" />
                      <Star className="w-4 h-4 fill-[#ffcc33] text-[#ffcc33]" />
                      <Star className="w-4 h-4 fill-[#ffcc33] text-[#ffcc33]" />
                      <span className="ml-2">4.9/5 Support Rating</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7️⃣ Mission & Vision - Equal Height Cards */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Mission Card */}
            <div className="flex flex-col h-full">
              <div className="relative group flex-1">
                <div className="absolute -inset-4 bg-gradient-to-r from-[#2a7d2f]/10 to-transparent rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-3xl p-10 shadow-2xl border-t-4 border-[#ffcc33] overflow-hidden h-full">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#ffcc33]/5 rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="relative z-10 h-full flex flex-col">
                    <div className="flex items-center gap-6 mb-8">
                      <div className="w-20 h-20 bg-gradient-to-br from-[#2a7d2f] to-[#1e5a22] rounded-2xl flex items-center justify-center shadow-lg">
                        <Target className="w-10 h-10 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">Our Mission</h3>
                        <p className="text-gray-600">Driving Civic Transformation</p>
                      </div>
                    </div>
                    <div className="space-y-6 flex-1">
                      <p className="text-gray-700 text-lg leading-relaxed">
                        To empower every citizen with intuitive digital tools that enhance transparency in urban governance, accelerate problem-solving through streamlined processes, and foster collaborative participation between communities and municipal authorities.
                      </p>
                      <div className="bg-[#f8f8f8] rounded-xl p-6 border-l-4 border-[#2a7d2f] flex-1">
                        <p className="text-gray-700">
                          We aim to democratize civic engagement by making issue reporting accessible, efficient, and impactful for every resident, regardless of technical expertise or social background.
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 pt-6 border-t border-gray-100 mt-6">
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
            <div className="flex flex-col h-full">
              <div className="relative group flex-1">
                <div className="absolute -inset-4 bg-gradient-to-r from-[#ffcc33]/10 to-transparent rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative bg-gradient-to-br from-white to-gray-50 rounded-3xl p-10 shadow-2xl border-t-4 border-[#2a7d2f] overflow-hidden h-full">
                  <div className="absolute top-0 left-0 w-32 h-32 bg-[#2a7d2f]/5 rounded-full -translate-y-16 -translate-x-16"></div>
                  <div className="relative z-10 h-full flex flex-col">
                    <div className="flex items-center gap-6 mb-8">
                      <div className="w-20 h-20 bg-gradient-to-br from-[#ffcc33] to-[#e6b82e] rounded-2xl flex items-center justify-center shadow-lg">
                        <Eye className="w-10 h-10 text-gray-900" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">Our Vision</h3>
                        <p className="text-gray-600">Building Tomorrow's Cities</p>
                      </div>
                    </div>
                    <div className="space-y-6 flex-1">
                      <p className="text-gray-700 text-lg leading-relaxed">
                        To create cleaner, safer, and digitally connected cities where every citizen can effortlessly contribute to community improvement, and where urban governance evolves into a participatory, data-driven ecosystem that proactively addresses civic needs.
                      </p>
                      <div className="bg-[#f8f8f8] rounded-xl p-6 border-l-4 border-[#ffcc33] flex-1">
                        <p className="text-gray-700">
                          We envision a future where civic reporting becomes as natural as social media sharing, creating a self-sustaining cycle of urban improvement driven by engaged communities and responsive governance.
                        </p>
                      </div>
                    </div>
                    <div className="pt-6 border-t border-gray-100 mt-6">
                      <h4 className="font-bold text-gray-900 mb-4">Future Goals</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-4 h-4 text-[#2a7d2f]" />
                          <span className="text-sm text-gray-700">AI-powered issue prediction</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-4 h-4 text-[#2a7d2f]" />
                          <span className="text-sm text-gray-700">Smart city integrations</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-4 h-4 text-[#2a7d2f]" />
                          <span className="text-sm text-gray-700">Multi-language support</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-4 h-4 text-[#2a7d2f]" />
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

      {/* 8️⃣ Our Impact in Numbers with CountUp */}
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
                number: 235000,
                suffix: "+",
                label: "Reports Successfully Submitted",
                icon: <FileText className="w-8 h-8" />,
                color: "from-[#2a7d2f] to-[#1e5a22]",
                description: "Civic issues reported and processed",
                duration: 2.5
              },
              {
                number: 12000,
                suffix: "+",
                label: "Active Citizen Reporters",
                icon: <Users className="w-8 h-8" />,
                color: "from-[#ffcc33] to-[#e6b82e]",
                description: "Monthly active users improving cities",
                duration: 2
              },
              {
                number: 78,
                suffix: "%",
                label: "Average Resolution Rate",
                icon: <TrendingUp className="w-8 h-8" />,
                color: "from-[#2a7d2f] to-[#ffcc33]",
                description: "Issues resolved satisfactorily",
                duration: 1.5
              },
              {
                number: 420,
                suffix: "+",
                label: "Cities & Municipalities Covered",
                icon: <Globe className="w-8 h-8" />,
                color: "from-[#ffcc33] to-[#2a7d2f]",
                description: "Urban areas using our platform",
                duration: 2
              }
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="relative inline-block mb-8">
                  <div className={`w-24 h-24 bg-gradient-to-br ${stat.color} rounded-full flex items-center justify-center mx-auto shadow-xl relative z-10 group-hover:scale-110 transition-transform duration-500`}>
                    <div className="text-white">
                      {stat.icon}
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br opacity-20 rounded-full blur-lg group-hover:blur-xl transition-all duration-500"></div>
                </div>
                <div className="relative">
                  <div className="text-5xl md:text-6xl font-bold text-[#ffcc33] mb-3 group-hover:scale-105 transition-transform duration-300">
                    <CountUp 
                      end={stat.number} 
                      duration={stat.duration}
                      separator=","
                    />
                    <span className="text-[#2a7d2f]">{stat.suffix}</span>
                  </div>
                  <div className="text-lg font-semibold text-gray-900 mb-2">{stat.label}</div>
                  <div className="text-gray-600 text-sm">{stat.description}</div>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="inline-flex items-center gap-2 text-sm text-gray-500">
                    <Award className="w-4 h-4 text-[#ffcc33]" />
                    <span>Tracked & Verified Data</span>
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
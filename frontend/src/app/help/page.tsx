'use client';

import Button from '@/components/common/Button';
import { PUBLIC_ROUTES } from '@/constants/routes';
import Image from 'next/image';
import Link from 'next/link';
import { useMemo } from 'react';
import { FaEnvelope, FaPhone, FaQuestionCircle, FaChartLine, FaUsers, FaHistory, FaArrowRight } from 'react-icons/fa';

export default function HelpPage() {
  const currentDateShow = useMemo(() => {
    return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, []);

  const helpCards = [
    {
      title: 'Report an Issue',
      description: 'Submit reports about civic problems in your area and help make your community better.',
      icon: <FaChartLine className="text-2xl" />,
      color: 'primary',
      link: PUBLIC_ROUTES.REPORT,
      buttonText: 'Start Reporting',
      gradientFrom: 'from-[#004540]/20',
      gradientTo: 'to-[#004540]/5',
      stat: '10,000+ Reports'
    },
    {
      title: 'Become a Solver',
      description: 'Join our community of problem solvers and help resolve issues in your area.',
      icon: <FaUsers className="text-2xl" />,
      color: 'accent',
      link: '/dashboard/user/join-as-a-Problem-Solver',
      buttonText: 'Apply Now',
      gradientFrom: 'from-[#f2a921]/20',
      gradientTo: 'to-[#f2a921]/5',
      stat: '500+ Active Solvers'
    },
    {
      title: 'Track Reports',
      description: 'Monitor the progress of your submitted issues and see resolution updates.',
      icon: <FaHistory className="text-2xl" />,
      color: 'secondary',
      link: '/dashboard/user/reports',
      buttonText: 'View Dashboard',
      gradientFrom: 'from-[#2a7d2f]/20',
      gradientTo: 'to-[#2a7d2f]/5',
      stat: '85% Resolution Rate'
    }
  ];

  const faqs = [
    {
      question: 'How do I report a civic issue?',
      answer: 'Click on "Report an Issue" from the navigation menu, fill in the details, add photos, and submit your report.',
      borderColor: 'border-[#004540]'
    },
    {
      question: 'How long does it take to resolve issues?',
      answer: 'Resolution time varies depending on the complexity of the issue. You can track the progress from your dashboard.',
      borderColor: 'border-[#2a7d2f]'
    },
    {
      question: 'Can I track my submitted reports?',
      answer: 'Yes! Visit your dashboard to see all your submitted reports and their current status.',
      borderColor: 'border-[#004540]'
    },
    {
      question: 'Is there a mobile app available?',
      answer: 'Yes, NagarNirman is available on both iOS and Android platforms for convenient reporting on the go.',
      borderColor: 'border-[#f2a921]'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F6FFF9] pb-10">
      {/* -------- the hero section placed here => start -------- */}
      <section className="relative overflow-hidden mb-10">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80"
            alt="Legal background"
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-linear-to-r from-[#004d40]/90 via-[#004d40]/75 to-transparent"></div>
        </div>

        <div className="container relative mx-auto px-4 py-20 md:py-28">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Help Center
            </h1>
            <p className="text-xl text-gray-100 mb-6">
              Get clear guidance and support for using NagarNirman effectively
            </p>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 inline-block">
              <p className="text-gray-100">
                <span className="font-semibold">Last Updated:</span>{' '}
                {currentDateShow || 'Loading...'}
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* -------- the hero section placed here => end -------- */}

      <div className="container mx-auto px-4 max-w-6xl mb-10">
        {/* Improved Quick Action Cards */}
        <section className="mb-12">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-[#004540]/10 text-[#004540] px-4 py-2 rounded-full mb-4">
              <span className="text-sm font-medium">Quick Actions</span>
            </div>
            <h2 className="text-3xl font-bold text-[#002E2E] mb-3">How Can We Help You?</h2>
            <p className="text-[#6B7280] max-w-2xl mx-auto">
              Choose from our most popular help options to get started
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {helpCards.map((card, index) => (
              <div 
                key={index}
                className="group relative"
              >
                {/* Card with improved UI */}
                <div className={`
                  relative bg-white rounded-2xl shadow-lg overflow-hidden
                  border border-transparent
                  hover:shadow-2xl transition-all duration-500
                  hover:transform hover:-translate-y-2
                  ${card.color === 'primary' ? 'hover:border-[#004540]/30' : ''}
                  ${card.color === 'secondary' ? 'hover:border-[#2a7d2f]/30' : ''}
                  ${card.color === 'accent' ? 'hover:border-[#f2a921]/30' : ''}
                `}>
                  {/* Gradient background layer */}
                  <div className={`
                    absolute inset-0 opacity-0 group-hover:opacity-100 
                    transition-opacity duration-500
                    bg-linear-to-br ${card.gradientFrom} ${card.gradientTo}
                  `}></div>
                  
                  {/* Top color accent */}
                  <div className={`
                    h-2 w-full
                    ${card.color === 'primary' ? 'bg-[#004540]' : ''}
                    ${card.color === 'secondary' ? 'bg-[#2a7d2f]' : ''}
                    ${card.color === 'accent' ? 'bg-[#f2a921]' : ''}
                  `}></div>
                  
                  <div className="relative p-8">
                    {/* Icon with background */}
                    <div className={`
                      w-16 h-16 rounded-2xl flex items-center justify-center mb-6
                      transition-all duration-300 group-hover:scale-110
                      ${card.color === 'primary' ? 'bg-[#004540]/10 text-[#004540]' : ''}
                      ${card.color === 'secondary' ? 'bg-[#2a7d2f]/10 text-[#2a7d2f]' : ''}
                      ${card.color === 'accent' ? 'bg-[#f2a921]/10 text-[#f2a921]' : ''}
                    `}>
                      {card.icon}
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-2xl font-bold text-[#002E2E] mb-4">
                      {card.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-[#6B7280] mb-8 leading-relaxed">
                      {card.description}
                    </p>
                    
                    {/* Stat badge */}
                    <div className="mb-8">
                      <span className={`
                        inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium
                        ${card.color === 'primary' ? 'bg-[#004540]/10 text-[#004540]' : ''}
                        ${card.color === 'secondary' ? 'bg-[#2a7d2f]/10 text-[#2a7d2f]' : ''}
                        ${card.color === 'accent' ? 'bg-[#f2a921]/10 text-[#f2a921]' : ''}
                      `}>
                        {card.stat}
                      </span>
                    </div>
                    
                    {/* Button with arrow */}
                    <Link href={card.link}>
                      <Button 
                        variant={card.color === 'primary' ? 'primary' : card.color === 'accent' ? 'accent' : 'secondary'}
                        size="lg"
                        className="w-full group/btn"
                      >
                        <span className="flex items-center justify-center gap-2">
                          {card.buttonText}
                          <FaArrowRight className="transition-transform duration-300 group-hover/btn:translate-x-1" />
                        </span>
                      </Button>
                    </Link>
                  </div>
                  
                  {/* Corner accent */}
                  <div className={`
                    absolute top-0 right-0 w-20 h-20 opacity-10
                    ${card.color === 'primary' ? 'text-[#004540]' : ''}
                    ${card.color === 'secondary' ? 'text-[#2a7d2f]' : ''}
                    ${card.color === 'accent' ? 'text-[#f2a921]' : ''}
                  `}>
                    <svg width="80" height="80" viewBox="0 0 80 80" fill="currentColor">
                      <path d="M0,0 L80,80 L80,0 Z" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Main Content Section */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - FAQs */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-[#004540]/10 rounded-lg flex items-center justify-center">
                  <FaQuestionCircle className="text-[#004540] text-xl" />
                </div>
                <h2 className="text-2xl font-bold text-[#002E2E]">
                  Frequently Asked Questions
                </h2>
              </div>

              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <div 
                    key={index}
                    className={`
                      ${faq.borderColor} border-l-4 pl-6 py-4
                      hover:bg-[#F3F4F6] transition-colors duration-200
                    `}
                  >
                    <h3 className="font-semibold text-[#002E2E] mb-2 text-lg">
                      {faq.question}
                    </h3>
                    <p className="text-[#6B7280]">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-10 pt-8 border-t border-[#F3F4F6]">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-[#002E2E] mb-2">
                      {`Didn't find your answer?`}
                    </h3>
                    <p className="text-[#6B7280]">
                      Browse our complete FAQ section for more detailed information.
                    </p>
                  </div>
                  <Link href={PUBLIC_ROUTES.FAQ}>
                    <Button variant="outline" size="lg">
                      <span className='text-[#004540]'>View All FAQs</span>
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Contact & Support */}
          <div className="space-y-8">
            {/* Contact Card */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-[#002E2E] mb-6">
                Contact Support
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-[#F6FFF9] transition-colors">
                  <div className="w-12 h-12 bg-[#004540] flex items-center justify-center rounded-full shrink-0">
                    <FaEnvelope className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#002E2E] mb-1">
                      Email Support
                    </h3>
                    <p className="text-[#6B7280] text-sm mb-2">
                      Get help via email
                    </p>
                    <a
                      href="mailto:support@nagarnirman.com"
                      className="text-[#004540] hover:text-[#2a7d2f] font-medium transition-colors"
                    >
                      support@nagarnirman.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-[#F6FFF9] transition-colors">
                  <div className="w-12 h-12 bg-[#f2a921] flex items-center justify-center rounded-full shrink-0">
                    <FaPhone className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#002E2E] mb-1">
                      Phone Support
                    </h3>
                    <p className="text-[#6B7280] text-sm mb-2">
                      Call us directly
                    </p>
                    <a
                      href="tel:+8801950719346"
                      className="text-[#004540] hover:text-[#2a7d2f] font-medium transition-colors"
                    >
                      +880 1950 719346
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[#F3F4F6]">
                <h4 className="font-semibold text-[#002E2E] mb-3">
                  Support Hours
                </h4>
                <div className="text-[#6B7280] space-y-1">
                  <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p>Saturday: 10:00 AM - 4:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </div>

            {/* Quick Tips Card */}
            <div className="bg-linear-to-br from-[#004540]/5 to-[#2a7d2f]/5 rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-[#002E2E] mb-4">
                Quick Tips
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#004540] rounded-full mt-2 shrink-0"></div>
                  <span className="text-[#6B7280]">Add clear photos for faster resolution</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#2a7d2f] rounded-full mt-2 shrink-0"></div>
                  <span className="text-[#6B7280]">Provide exact location details</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#f2a921] rounded-full mt-2 shrink-0"></div>
                  <span className="text-[#6B7280]">Check status updates regularly</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-[#004540] rounded-full mt-2 shrink-0"></div>
                  <span className="text-[#6B7280]">Use categories for proper routing</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
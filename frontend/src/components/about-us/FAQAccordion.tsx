'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react'

const faqItems = [
  {
    question: 'Is NagarNirman officially connected with local government?',
    answer: 'Yes, we have formal partnerships with municipal corporations and urban development authorities across India. Reports are directly routed to relevant government departments for resolution, ensuring official action.',
  },
  {
    question: 'Is reporting civic issues completely free?',
    answer: 'Absolutely. NagarNirman is completely free for citizens. Our platform is supported through government partnerships and public service grants, ensuring accessibility for all.',
  },
  {
    question: 'Can I report issues anonymously?',
    answer: 'Yes, you can choose to report anonymously. Your privacy is protected, and anonymous reports are treated with the same priority as verified ones.',
  },
  {
    question: 'How long does resolution usually take?',
    answer: 'Resolution time varies by issue type. Most reports see initial action within 24-48 hours, with complete resolution typically within 3-7 working days for standard issues.',
  },
  {
    question: 'What information is required to submit a report?',
    answer: 'Minimum requirements: Location (automatic or manual), issue type/category, and photo evidence. Additional details help ensure faster and more accurate resolution.',
  },
  {
    question: 'How do I track my report status?',
    answer: 'You can track your report in real-time through your personal dashboard. We also send email/SMS notifications at each status update stage.',
  },
  {
    question: 'What types of civic issues can I report?',
    answer: 'You can report various urban infrastructure issues including road damage, street light problems, waste management, water supply issues, drainage problems, and public space maintenance.',
  },
  {
    question: 'Are reports verified before action?',
    answer: 'Yes, our community moderators verify reports for accuracy and relevance before routing them to authorities. This ensures efficient use of municipal resources.',
  },
]

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="space-y-4">
      {faqItems.map((item, index) => (
        <div
          key={index}
          className="group relative"
        >
          <div
            className={`relative bg-white rounded-2xl border-2 transition-all duration-500 cursor-pointer overflow-hidden ${
              openIndex === index
                ? 'border-[#2a7d2f]/30 shadow-xl shadow-[#2a7d2f]/5'
                : 'border-gray-200 hover:border-[#2a7d2f]/20 hover:shadow-lg'
            }`}
            onClick={() => toggleFAQ(index)}
          >
            {/* Background gradient on hover */}
            <div className={`absolute inset-0 bg-gradient-to-r from-white to-gray-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
              openIndex === index ? 'opacity-100' : ''
            }`} />
            
            <div className="relative p-8">
              <div className="flex items-start justify-between gap-6">
                <div className="flex items-start gap-6">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-500 ${
                    openIndex === index
                      ? 'bg-gradient-to-br from-[#2a7d2f]/10 to-[#2a7d2f]/5'
                      : 'bg-gray-100'
                  }`}>
                    <HelpCircle className={`w-6 h-6 transition-colors duration-500 ${
                      openIndex === index ? 'text-[#2a7d2f]' : 'text-gray-400'
                    }`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {item.question}
                    </h3>
                    {openIndex === index && (
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <p className="text-gray-700 leading-relaxed text-lg">{item.answer}</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex-shrink-0">
                  {openIndex === index ? (
                    <ChevronUp className="w-6 h-6 text-[#2a7d2f] transition-transform duration-500" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-gray-400 group-hover:text-[#2a7d2f] transition-colors duration-500" />
                  )}
                </div>
              </div>
            </div>
            
            {/* Progress indicator */}
            <div
              className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#2a7d2f] to-[#ffcc33] transform origin-left transition-transform duration-1000 ${
                openIndex === index ? 'scale-x-100' : 'scale-x-0'
              }`}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

const faqItems = [
  {
    question: 'Is NagarNirman officially connected to government bodies?',
    answer: 'Yes, NagarNirman partners with municipal corporations and urban development authorities across India. We have formal agreements that ensure reported issues are directed to the correct departments.',
  },
  {
    question: 'Is reporting completely free for citizens?',
    answer: 'Absolutely. NagarNirman is completely free for citizens to use. Our platform is funded through government partnerships and corporate social responsibility initiatives.',
  },
  {
    question: 'How does the reward points system work?',
    answer: 'Users earn points for each verified report. Points can be redeemed for discounts with partner businesses, mobile recharges, or donated to community improvement projects.',
  },
  {
    question: 'Can I report issues anonymously?',
    answer: 'Yes, we offer anonymous reporting for sensitive issues. However, verified reports with contact information typically get faster resolution and allow for status updates.',
  },
  {
    question: 'What is the average resolution time for complaints?',
    answer: 'Resolution time varies by issue type and location. On average, 65% of reports are resolved within 7 days, while critical infrastructure issues are prioritized for immediate attention.',
  },
  {
    question: 'How is my personal data protected?',
    answer: 'We use bank-level encryption and comply with Indian data protection regulations. Your personal information is never shared without consent, except with relevant authorities for issue resolution.',
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
          className="card bg-base-100 border border-base-200 shadow-sm"
        >
          <div
            className="card-body p-6 cursor-pointer hover:bg-base-200/50 transition-colors"
            onClick={() => toggleFAQ(index)}
          >
            <div className="flex items-center justify-between">
              <h3 className="card-title text-lg font-semibold text-primary">
                {item.question}
              </h3>
              {openIndex === index ? (
                <ChevronUp className="w-5 h-5 text-primary" />
              ) : (
                <ChevronDown className="w-5 h-5 text-primary" />
              )}
            </div>
            {openIndex === index && (
              <div className="mt-4 pt-4 border-t border-base-300">
                <p className="text-gray-600">{item.answer}</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
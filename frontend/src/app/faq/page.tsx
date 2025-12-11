'use client';
import {
  ChevronDown,
  Headphones,
  Mail,
  MessageCircle,
  Star,
} from 'lucide-react';
import { useState } from 'react';

const faqs = [
  {
    q: 'Is NagarNirman officially connected with municipal authorities?',
    a: 'Yes, NagarNirman has formal partnerships with municipal corporations across multiple cities. Our platform is integrated with official grievance redressal systems to ensure reported issues reach the right departments promptly.',
  },
  {
    q: 'Is reporting civic issues completely free to use?',
    a: 'Absolutely. NagarNirman is a free public service platform. There are no charges for reporting issues, tracking progress, or receiving resolution updates. Our mission is to make civic participation accessible to everyone.',
  },
  {
    q: 'Can I submit reports anonymously to protect my privacy?',
    a: 'Yes, we offer anonymous reporting options. While providing contact information helps with updates, you can choose to report anonymously. However, anonymous reports may have limited tracking features.',
  },
  {
    q: 'What information do I need to provide when creating a report?',
    a: 'Essential information includes clear photos, exact location, issue description, and category. Optional details include your contact information for updates and priority level assessment.',
  },
  {
    q: 'How long does it usually take to resolve reported issues?',
    a: "Resolution time varies by issue type and location. Simple issues like garbage clearance take 24-48 hours, while complex problems like road repairs may take 7-14 days. You'll receive estimated timelines upon submission.",
  },
  {
    q: 'How can I track the status of my submitted reports?',
    a: 'Each report gets a unique tracking ID. Use this ID on our website or app to view real-time status, department assignments, progress updates, and estimated completion dates.',
  },
  {
    q: 'Is my personal data secure and private on NagarNirman?',
    a: 'We follow strict data protection protocols. Personal information is encrypted and never shared without consent. Read our Privacy Policy for detailed information on data handling.',
  },
];

export default function Faq() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div>
      <section className="py-20 bg-linear-to-br from-gray-50 to-[#f8f8f8]">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">
            Frequently Asked <span className="text-[#004d40]">Questions</span>
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
                    <div
                      className={`w-10 h-10 bg-[#004d40]/10 rounded-full flex items-center justify-center shrink-0 transition-transform ${
                        openFaq === index ? 'rotate-180' : ''
                      }`}
                    >
                      <ChevronDown className="w-5 h-5 text-[#004d40]" />
                    </div>
                  </button>
                  <div
                    className={`px-6 overflow-hidden transition-all duration-300 ${
                      openFaq === index ? 'max-h-96 pb-6' : 'max-h-0'
                    }`}
                  >
                    <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Interactive Info Column */}
            <div className="lg:sticky lg:top-24">
              <div className="bg-linear-to-br from-[#004d40] to-[#1e5a22] rounded-2xl p-10 text-white shadow-2xl">
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Headphones className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Need More Help?</h3>
                  <p className="text-white/90 mb-8">
                    Our support team is here to assist you with any questions
                    about civic reporting.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                        <MessageCircle className="w-6 h-6 text-[#004d40]" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">Live Chat Support</h4>
                        <p className="text-white/80 text-sm">
                          Available 9 AM - 6 PM
                        </p>
                      </div>
                    </div>
                    <button className="w-full bg-white text-[#004d40] font-semibold py-3 rounded-lg hover:bg-gray-100 transition-colors">
                      Start Chat Now
                    </button>
                  </div>

                  <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                        <Mail className="w-6 h-6 text-[#004d40]" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">Email Support</h4>
                        <p className="text-white/80 text-sm">
                          24-hour response time
                        </p>
                      </div>
                    </div>
                    <button className="w-full border-2 border-white text-white font-semibold py-3 rounded-lg hover:bg-white/10 transition-colors">
                      Send Email
                    </button>
                  </div>

                  <div className="text-center pt-6 border-t border-white/20">
                    <p className="text-white/80 mb-4">
                      Average response time:{' '}
                      <span className="font-bold">Under 2 hours</span>
                    </p>
                    <div className="flex items-center justify-center gap-2 text-sm">
                      <Star className="w-4 h-4 fill-[#f2a921] text-[#f2a921]" />
                      <Star className="w-4 h-4 fill-[#f2a921] text-[#f2a921]" />
                      <Star className="w-4 h-4 fill-[#f2a921] text-[#f2a921]" />
                      <Star className="w-4 h-4 fill-[#f2a921] text-[#f2a921]" />
                      <Star className="w-4 h-4 fill-[#f2a921] text-[#f2a921]" />
                      <span className="ml-2">4.9/5 Support Rating</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

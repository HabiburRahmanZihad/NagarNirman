"use client";

import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqs: FAQItem[] = [
  {
    category: "General",
    question: "What is NagarNirman?",
    answer: "NagarNirman is a community-driven platform that connects citizens with problem solvers to address civic issues and improve urban living conditions. We align with UN Sustainable Development Goal 11 - Sustainable Cities and Communities."
  },
  {
    category: "General",
    question: "How does NagarNirman work?",
    answer: "Citizens report civic problems through our platform, authorities review and assign tasks to verified problem solvers, and solvers work on resolving the issues. You can track progress throughout the entire process."
  },
  {
    category: "Reporting",
    question: "What types of issues can I report?",
    answer: "You can report various civic issues including road damage, waste management problems, drainage issues, street lighting problems, park maintenance needs, and other urban infrastructure concerns."
  },
  {
    category: "Reporting",
    question: "Do I need to create an account to report issues?",
    answer: "Yes, you need to register and log in to submit reports. This helps us maintain accountability and allows you to track your submitted reports."
  },
  {
    category: "Reporting",
    question: "Can I upload photos with my report?",
    answer: "Yes! We encourage uploading photos as they help authorities and solvers better understand the issue and verify completion once resolved."
  },
  {
    category: "Problem Solving",
    question: "How do I become a problem solver?",
    answer: "Navigate to 'Become a Solver' from your dashboard, fill out the application form with your details and skills, and submit it for review. Our authorities will review your application and notify you of the decision."
  },
  {
    category: "Problem Solving",
    question: "What are the requirements to become a solver?",
    answer: "You need to be committed to community service, have relevant skills for the types of issues you want to solve, and maintain a good track record. Specific requirements may vary by task type."
  },
  {
    category: "Problem Solving",
    question: "How are tasks assigned to solvers?",
    answer: "Authorities review submitted reports and assign tasks to verified solvers based on their skills, location, availability, and past performance."
  },
  {
    category: "Tracking",
    question: "How can I track my reported issues?",
    answer: "Log in to your dashboard and navigate to 'My Reports' to see all your submitted reports, their current status, assigned solvers, and progress updates."
  },
  {
    category: "Tracking",
    question: "What do the different status labels mean?",
    answer: "Pending: Report submitted, awaiting review. In Progress: Task assigned and solver is working on it. Completed: Issue resolved and verified. Rejected: Report doesn't meet criteria or is duplicate."
  },
  {
    category: "Account",
    question: "How do I reset my password?",
    answer: "Click on 'Forgot Password' on the login page, enter your registered email, and follow the instructions sent to your email to reset your password."
  },
  {
    category: "Account",
    question: "Can I update my profile information?",
    answer: "Yes, go to your dashboard and navigate to Profile Settings where you can update your personal information, contact details, and preferences."
  },
  {
    category: "Privacy",
    question: "Is my personal information secure?",
    answer: "Yes, we take data security seriously. Your personal information is encrypted and protected. We only share necessary information with authorities and assigned solvers for task completion."
  },
  {
    category: "Privacy",
    question: "Will my reports be visible to everyone?",
    answer: "Report locations and issue details are visible on the map to promote transparency. However, your personal contact information remains private and is only shared with relevant authorities and assigned solvers."
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", ...Array.from(new Set(faqs.map(faq => faq.category)))];

  const filteredFAQs = selectedCategory === "All"
    ? faqs
    : faqs.filter(faq => faq.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-600">
            Find answers to common questions about NagarNirman
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${selectedCategory === category
                  ? 'bg-primary text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {filteredFAQs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:border-primary/30 transition-colors"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full mb-2">
                    {faq.category}
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {faq.question}
                  </h3>
                </div>
                <div className="ml-4">
                  {openIndex === index ? (
                    <FaChevronUp className="text-primary text-xl" />
                  ) : (
                    <FaChevronDown className="text-gray-400 text-xl" />
                  )}
                </div>
              </button>

              {openIndex === index && (
                <div className="px-6 pb-5 pt-2 border-t border-gray-100">
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-12 bg-primary/5 border border-primary/20 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Still have questions?
          </h2>
          <p className="text-gray-600 mb-6">
            Can't find the answer you're looking for? Please reach out to our support team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:support@nagarnirman.com"
              className="bg-primary text-white px-6 py-3 rounded-full font-medium hover:bg-accent transition-colors duration-300"
            >
              Email Support
            </a>
            <a
              href="tel:+8801950719346"
              className="bg-accent text-white px-6 py-3 rounded-full font-medium hover:bg-primary transition-colors duration-300"
            >
              Call Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { ChevronDown, Sprout } from "lucide-react";
import Link from "next/link";
import Button from "@/components/common/Button";

const faqs = [
  {
    q: "How do I get started?",
    a: "You can get started by creating an account and submitting your documents. Our easy-to-use platform guides you through each step.",
  },
  {
    q: "What fees do you charge?",
    a: "We charge a small service fee depending on your business type. Transparent pricing with no hidden charges.",
  },
  {
    q: "Where should I incorporate my business?",
    a: "It depends on your business goals and target market. Our experts can guide you through the process.",
  },
  {
    q: "What type of company is measured?",
    a: "We work with startups, LLCs and large scale enterprises. Any organization can benefit from our services.",
  },
  {
    q: "How can I safely use files?",
    a: "All files are encrypted and securely stored in our system with enterprise-grade security protocols.",
  },
];

const avatars = [
  "https://i.pravatar.cc/40?img=3",
  "https://i.pravatar.cc/40?img=5",
  "https://i.pravatar.cc/40?img=7",
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(index === openIndex ? null : index);
  };

  return (
    <section className="">
      <div className="container mx-auto">
        {/* --- HEADER --- */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sprout className="w-5 h-5 text-[#3C6E59]" />
            <span className="text-[#555555] text-lg font-medium tracking-wide">Question & Answer</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-[#003B31]">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-start py-6 md:py-12">
          {/* LEFT FAQ */}
          <div className="space-y-4">
            {faqs.map((item, index) => (
              <div
                key={index}
                className="group bg-linear-to-br from-base-100 to-base-200 px-6 py-5 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-base-300 hover:border-primary/50 cursor-pointer"
              >
                <button
                  className="flex justify-between items-center w-full text-left transition-all duration-300"
                  onClick={() => toggle(index)}
                >
                  <span className="text-base md:text-lg font-semibold text-info group-hover:text-primary transition-colors duration-300">
                    {index + 1}. {item.q}
                  </span>

                  <span className={`w-9 h-9 flex items-center justify-center border-2 border-primary rounded-full text-primary font-bold text-xl shrink-0 ml-4 transition-transform duration-300 ${openIndex === index ? "rotate-180 bg-primary/10" : ""
                    }`}>
                    <ChevronDown size={20} />
                  </span>
                </button>

                {openIndex === index && (
                  <p className="mt-4 text-sm text-neutral leading-relaxed pl-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    {item.a}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* RIGHT CONTENT */}
          <div className="space-y-6">
            <div>
              <p className="text-neutral/80 max-w-md mb-8 leading-relaxed text-base">
                Get quick answers to common questions about our services, pricing, and security. Can't find what you're looking for?
              </p>
            </div>

            {/* BUTTON */}
            <Link href="/about">
              <Button variant="primary" size="lg">
                Have Any Questions?
              </Button>
            </Link>

            {/* REGISTERED */}
            <div className="flex items-center gap-4 pt-6 border-t border-base-300">
              <div className="flex -space-x-3">
                {avatars.map((avatar, i) => (
                  <div key={i} className="relative">
                    <img
                      src={avatar}
                      alt="User"
                      className="w-10 h-10 rounded-full border-2 border-white object-cover shadow-md"
                    />
                    {/* Plus Icon on last avatar */}
                    {i === avatars.length - 1 && (
                      <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center border-2 border-white text-white text-xs font-bold">
                        +
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div>
                <h4 className="font-bold text-info text-lg">2603</h4>
                <p className="text-sm text-neutral/70">Peoples Registered</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

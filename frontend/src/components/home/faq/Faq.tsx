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
    <section className="py-8 sm:py-12 md:py-16 lg:py-20 px-3 xs:px-4 sm:px-6 md:px-8">
      <div className="container mx-auto">
        {/* --- HEADER --- */}
        <div className="text-center mb-8 xs:mb-10 sm:mb-12 md:mb-16">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sprout className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 text-[#3C6E59]" />
            <span className="text-[#555555] text-lg font-medium tracking-wide">Question & Answer</span>
          </div>
          <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-[#003B31]">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 xs:gap-8 sm:gap-10 md:gap-12 items-start py-3 xs:py-4 sm:py-6 md:py-12">
          {/* LEFT FAQ */}
          <div className="space-y-3 xs:space-y-3.5 sm:space-y-4">
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
          <div className="h-full">
            <div className="bg-linear-to-br from-primary/95 via-primary to-primary/90 rounded-3xl shadow-2xl p-8 sm:p-10 border-2 border-accent/30 hover:border-accent/50 transition-all duration-300 hover:shadow-3xl min-h-full flex flex-col justify-between">
              {/* Text Content */}
              <div className="space-y-6 mb-8">
                <div>
                  <p className="text-white/90 max-w-sm leading-relaxed text-base font-medium">
                    Get quick answers to common questions about our services, pricing, and security. Can't find what you're looking for?
                  </p>
                </div>

                {/* BUTTON */}
                <Link href="/about" className="inline-block">
                  <button className="px-8 py-3 bg-linear-to-r from-accent to-accent/80 text-white font-bold rounded-2xl hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 border-2 border-accent/50 hover:border-accent">
                    Have Any Questions?
                  </button>
                </Link>
              </div>

              {/* REGISTERED SECTION */}
              <div className="pt-8 border-t-2 border-white/20">
                <div className="flex items-center gap-5">
                  <div className="flex -space-x-4">
                    {avatars.map((avatar, i) => (
                      <div key={i} className="relative">
                        <img
                          src={avatar}
                          alt="User"
                          className="w-12 h-12 rounded-full border-3 border-white object-cover shadow-lg hover:scale-110 transition-transform duration-300"
                        />
                        {/* Plus Icon on last avatar */}
                        {i === avatars.length - 1 && (
                          <div className="absolute inset-0 bg-white/30 rounded-full flex items-center justify-center border-3 border-white text-white text-sm font-bold hover:bg-white/50 transition-all duration-300">
                            +
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div>
                    <h4 className="font-extrabold text-white text-xl">2603</h4>
                    <p className="text-sm text-white/80 font-semibold">People Registered</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

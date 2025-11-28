"use client";

import { useState } from "react";
import { HelpCircle } from "lucide-react"; // ? icon

const faqs = [
  {
    q: "How do I get started?",
    a: "You can get started by creating an account and submitting your documents.",
  },
  {
    q: "What fees do you charge?",
    a: "We charge a small service fee depending on your business type.",
  },
  {
    q: "Where should I incorporate my business?",
    a: "It depends on your business goals and target market.",
  },
  {
    q: "What type of company is measured?",
    a: "We work with startups, LLCs and large scale enterprises.",
  },
  {
    q: "How can I safely use files?",
    a: "All files are encrypted and securely stored in our system.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(index === openIndex ? null : index);
  };

  return (
    <section className="mt-10 md:mt-0 px-4 md:px-10">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center py-6 md:py-8 ">
        {/* LEFT FAQ */}
        <div className="space-y-4">
          {faqs.map((item, index) => (
            <div
              key={index}
              className="bg-base100 px-6 py-5 rounded-full shadow flex flex-col"
            >
              <button
                className="flex justify-between items-center w-full text-left"
                onClick={() => toggle(index)}
              >
                <span className="text-lg font-medium text-info">
                  {index + 1}. {item.q}
                </span>

                <span className="w-9 h-9 flex items-center justify-center border rounded-full text-primary font-bold text-xl">
                  {openIndex === index ? "−" : <HelpCircle size={20} />}
                </span>
              </button>

              {openIndex === index && (
                <p className="mt-3 text-sm text-neutral px-2">{item.a}</p>
              )}
            </div>
          ))}
        </div>

        {/* RIGHT CONTENT */}
        <div>
          <p className="flex items-center gap-2 text-primary font-medium mb-4">
            🌱 <span>Question & Answer</span>
          </p>

          <h2 className="text-4xl font-bold text-info mb-4">
            Frequently Asked Question <span className="text-accent">?</span>
          </h2>

          <p className="text-neutral max-w-md mb-8 leading-relaxed">
            The implant fixture is first placed, so that it likely to then a
            dental prosthetic is added then dental prosthetic occaecat laborum.
          </p>

          {/* BUTTON */}
          <button
            className="group  px-5 py-2 rounded-full  
                             bg-secondary flex items-center gap-2
                              transition-all duration-300 ease-in-out
                          hover:bg-primary hover:text-white hover:shadow-lg">
            Have You Any Questions?
            <span
              className="border bg-black text-white border-none rounded-full w-10 h-10 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-2 -mr-4">
              →
            </span>
          </button>

          {/* REGISTERED */}
          <div className="flex items-center gap-3 mt-6">
            <div className="flex -space-x-3">
              <img
                src="https://i.pravatar.cc/40?img=3"
                className="w-10 h-10 rounded-full border-2 border-white"
              />
              <img
                src="https://i.pravatar.cc/40?img=5"
                className="w-10 h-10 rounded-full border-2 border-white"
              />
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                +
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-info">2603</h4>
              <p className="text-sm text-neutral">Peoples Registered</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import React from "react";

const StepsProgress = () => {
  const steps = [
    {
      id: 1,
      title: "Identify Issue",
      subtitle: "Spot a problem around your area (roads, sanitation, lights, etc.)",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
    },
    {
      id: 2,
      title: "Capture Photo",
      subtitle: "Take a clear photo to help authorities verify the issue.",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      id: 3,
      title: "Pin Location",
      subtitle: "Use the map to mark the exact location of the issue.",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      id: 4,
      title: "Submit Report",
      subtitle: "Describe the issue and submit your report instantly.",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
        </svg>
      ),
    },
    {
      id: 5,
      title: "Track Status",
      subtitle: "Follow the progress as authorities review and assign tasks.",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
      ),
    },
    {
      id: 6,
      title: "Get Notified",
      subtitle: "Receive updates until the issue is fully resolved.",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
        </svg>
      ),
    },
  ];

  return (
    <section className="bg-white py-8 md:py-16 px-5">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-16">
          <p className="text-gray-500 uppercase text-sm tracking-wider mb-3 font-medium">
            HOW TO REPORT
          </p>
          <h2 className="text-2xl md:text-4xl font-bold text-[#002E2E]">
            Complete Every <span className="font-bold">Step Carefully</span>
          </h2>
        </div>

        {/* Mobile Vertical Layout */}
        <div className="block md:hidden">
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-[#004d40]"></div>

            {steps.map((step, index) => (
              <div key={step.id} className="relative flex items-start mb-8 pl-16">
                {/* Step Circle */}
                <div className="absolute left-0 w-12 h-12 rounded-full bg-white border border-[#004d40] shadow-lg flex items-center justify-center z-10">
                  <div className="text-[#004d40]">
                    {step.icon}
                  </div>
                </div>

                {/* Step Content */}
                <div className="flex-1">
                  <h3 className="font-bold text-[#002E2E] text-lg mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {step.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop S-Shaped Layout - Your Original Code with Responsive Classes */}
        <div className="hidden md:block relative">
          <div className="relative h-[500px]">
            {/* Top Horizontal Line */}
            <div className="absolute top-5 left-0 right-0 h-1.5 bg-[#004d40]" />

            {/* S-Curve Path */}
            <div className="absolute border-[#004d40] border-t-5 border-b-6 border-r-6 rounded-r-full top-5 -right-9 lg:-right-20 w-45 h-45.5 " />
            <div className="absolute top-49 rounded-full right-10 lg:right-0 left-0 md:left-8 h-1.5 bg-[#004d40]" />
            <div className="absolute border-[#004d40] border-t-6 border-b-6 border-l-6 rounded-l-full top-49 -left-9 lg:-left-20 w-45 h-44 " />

            {/* Bottom Horizontal Line */}
            <div className="absolute bottom-32 left-0 right-0 h-1.5 bg-[#004d40]" />

            {/* Step Circles and Content */}
            {steps.map((step, index) => {
              const isTopRow = index < 3;
              const isLeftColumn = index % 3 === 0;
              const isMiddleColumn = index % 3 === 1;
              const isRightColumn = index % 3 === 2;

              let positionClass = "";
              if (isTopRow) {
                if (isLeftColumn) positionClass = "top-20 left-20 -translate-x-1/2 -translate-y-1/2";
                if (isMiddleColumn) positionClass = "top-20 left-1/2 -translate-x-1/2 -translate-y-1/2";
                if (isRightColumn) positionClass = "top-20 right-20 translate-x-1/2 -translate-y-1/2";
              } else {
                if (isLeftColumn) positionClass = "bottom-20 left-20 -translate-x-1/2 translate-y-1/2";
                if (isMiddleColumn) positionClass = "bottom-20 left-1/2 -translate-x-1/2 translate-y-1/2";
                if (isRightColumn) positionClass = "bottom-20 right-20 translate-x-1/2 translate-y-1/2";
              }

              return (
                <div
                  key={step.id}
                  className={`absolute ${positionClass} flex flex-col items-center ${
                    isTopRow ? "mb-20" : "mt-20"
                  } ${isLeftColumn ? "items-start" : isRightColumn ? "items-end" : "items-center"}`}
                  style={{ width: "220px" }}
                >
                  {/* Step Content */}
                  <div
                    className={`text-center mb-4 ${
                      isTopRow ? "order-2 mt-4" : "order-2 mb-4"
                    } ${isLeftColumn ? "text-left" : isRightColumn ? "text-right" : "text-center"}`}
                  >
                    <h3 className="font-bold text-[#002E2E] text-lg mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {step.subtitle}
                    </p>
                  </div>

                  {/* Step Circle */}
                  <div
                    className={`relative z-10 w-14 h-14 rounded-full bg-white border border-accent shadow-lg flex items-center justify-center ${
                      isTopRow ? "order-1" : "order-1"
                    }`}
                  >
                    <div className="text-[#004d40]">
                      {step.icon}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StepsProgress;
"use client";

import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

export default function CountUpSection() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 });

  const stats = [
    { value: 64, label: "Districts Covered" },
    { value: 1000, label: "Issues Reported", suffix: "+" },
    { value: 500, label: "Issues Resolved", suffix: "+" },
    { value: 100, label: "Problem Solvers", suffix: "+" },
  ];

  return (
    <section className="bg-[#002E2E] text-white py-16">
      <div className="container mx-auto px-4">
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, i) => (
            <div key={i}>
              <p className="text-4xl font-bold text-[#81d586] mb-2">
                {inView ? (
                  <CountUp end={stat.value} duration={2} suffix={stat.suffix || ""} />
                ) : (
                  0
                )}
              </p>
              <p className="text-gray-300">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

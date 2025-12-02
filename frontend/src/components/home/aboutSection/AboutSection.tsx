"use client";
import Image from "next/image";
import { useState } from "react";

export default function AboutSection() {
  const [activeTab, setActiveTab] = useState("history");

  const tabs = [
    { id: "history", label: "Our History" },
    { id: "mission", label: "Our Mission" },
    { id: "vision", label: "Our Vision" },
  ];

  const tabContent = {
    history:
      "The implant fixture is first placed, so that it likely to then a dental prosthetic is added then dental prosthetic.",
    mission:
      "Nature ecologically acceptable, organisms environment. Ecology is the study of the relationship between living.",
    vision:
      "Focus on your important tasks and orders. Building greener future together and protect our nature.",
  };

  return (
    <section className=" w-full bg-base-100 py-20 px-4 md:px-10 lg:px-20 mb-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        
        {/* LEFT IMAGES */}
        <div className="relative w-full flex items-center justify-center">
          
         


          {/* Badge */}
          {/* <div className="absolute bottom-5 left-0 bg-secondary text-white px-5 py-3 rounded-xl flex items-center gap-3 shadow-lg">
            <Image
              src="https://i.postimg.cc/GpZKH1pX/icon-6.jpg"
              alt="Award Icon"
              width={40}
              height={40}
            />
            <p className="text-sm font-medium">2024 – We are the best award winner</p>
          </div> */}
        </div>

        {/* RIGHT CONTENT */}
        <div>
          <p className="text-primary font-semibold mb-3 flex items-center gap-2">
            <span className="text-xl">🌿</span> About Us
          </p>

          <h2 className="text-info text-4xl font-bold leading-tight mb-6">
            Building Greener Future <br /> Together And Protect
          </h2>

          {/* Tabs */}
          <div className="flex gap-5 mb-6">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`pb-1 font-medium text-lg  ${
                  activeTab === t.id
                    ? "text-primary border-b-2 border-accent"
                    : "text-neutral hover:text-primary"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* <p className="text-neutral leading-relaxed mb-6">
            {tabContent[activeTab]}
          </p> */}

          <ul className="space-y-3 text-neutral">
            <li className="flex items-center gap-2">• Nature ecologically acceptable, organisms environment</li>
            <li className="flex items-center gap-2">• Ecology is study of relationships between living</li>
            <li className="flex items-center gap-2">• Focus on your important tasks and orders</li>
          </ul>

          <div className="mt-8 flex items-center gap-6">
            <button className="flex items-center gap-2 bg-accent text-primary px-7 py-3 rounded-full font-semibold shadow-md">
              Explore More →
            </button>

            <div className="text-neutral text-sm">
              <p className="font-semibold flex items-center gap-2">
                ⭐ Trustpilot
                <span>⭐⭐⭐⭐⭐</span>
              </p>
              <p>Excellent 4.9 out of 5</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

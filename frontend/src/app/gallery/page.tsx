"use client";
import Image from "next/image";
import React from "react";


// gallery image
const images = [
  "https://www.nicdarkthemes.com/themes/donation/wp/demo/wildlife/wp-content/uploads/sites/5/2020/09/square-1.jpg",
  "https://www.nicdarkthemes.com/themes/donation/wp/demo/wildlife/wp-content/uploads/sites/5/2020/09/cause-1.jpg",
  "https://www.nicdarkthemes.com/themes/donation/wp/demo/wildlife/wp-content/uploads/sites/5/2020/09/square-3.jpg",
  "https://www.nicdarkthemes.com/themes/donation/wp/demo/wildlife/wp-content/uploads/sites/5/2020/09/square-4.jpg",
  "https://www.nicdarkthemes.com/themes/donation/wp/demo/wildlife/wp-content/uploads/sites/5/2020/09/square-5.jpg",
  "https://www.nicdarkthemes.com/themes/donation/wp/demo/wildlife/wp-content/uploads/sites/5/2020/09/square-6.jpg",
  "https://www.nicdarkthemes.com/themes/donation/wp/demo/wildlife/wp-content/uploads/sites/5/2020/09/square-7.jpg",
  "https://www.nicdarkthemes.com/themes/donation/wp/demo/wildlife/wp-content/uploads/sites/5/2020/09/square-8.jpg",
];

const gallery = () => {
  return (
    <div>
      {/* team section */}
      <section className="bg-base300 py-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          {/* Left Text */}
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-info leading-snug">
              Hello. Our company has been present for over 20 years in the
              world. We make the best for help everyone.
            </h2>
          </div>

          {/* Right Team Images */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Member 1 */}
            <div className="relative overflow-hidden rounded-xl group">
              <Image
                src="https://www.nicdarkthemes.com/themes/donation/wp/demo/wildlife/wp-content/uploads/sites/5/2020/06/team-8.jpg"
                alt="Team 1"
                width={400}
                height={400}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-lg font-bold">Phoebe Allen</h3>
                <span className="text-sm uppercase text-secondary tracking-wider">
                  Organizer
                </span>
              </div>
            </div>

            {/* Member 2 */}
            <div className="relative overflow-hidden rounded-xl group">
              <Image
                src="https://www.nicdarkthemes.com/themes/donation/wp/demo/wildlife/wp-content/uploads/sites/5/2020/06/team-7.jpg"
                alt="Team 2"
                width={400}
                height={400}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-lg font-bold">Christina Lewis</h3>
                <span className="text-sm uppercase text-secondary tracking-wider">
                  Coordinator
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* gallery section */}
      <section className="bg-base100 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {images.map((img, index) => (
              <div
                key={index}
                className="relative overflow-hidden rounded-lg aspect-square group"
              >
                <Image
                  src={img}
                  alt={`Gallery ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                  <span className="text-white text-lg font-semibold">View</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* banner section */}
      {/* <section className="relative w-full h-[220px] sm:h-[280px] md:h-[350px]">
        <Image
          src="https://www.nicdarkthemes.com/themes/donation/wp/demo/wildlife/wp-content/uploads/sites/5/2020/09/cause-15.jpg"
          alt="Wildlife Banner"
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-black/60 flex justify-center items-center px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-6 text-white text-center w-full max-w-5xl">
            {[
              { num: 13, label: "PROJECTS" },
              { num: 45, label: "TARGETS" },
              { num: 26, label: "DONATIONS" },
              { num: 78, label: "CAUSES" },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-center gap-3 md:gap-5"
              >
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
                  {item.num}
                </h1>

                <div className="text-left">
                  <p className="text-xs sm:text-sm md:text-base font-semibold tracking-wide">
                    {item.label}
                  </p>
                  <span className="text-[10px] sm:text-xs md:text-sm text-gray-200">
                    Dolor Sit Amet
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
       */}
    </div>
  );
};

export default gallery;

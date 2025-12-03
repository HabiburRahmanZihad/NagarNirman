import { Sprout, Users } from "lucide-react";
import { FaHandHoldingHeart } from "react-icons/fa";

const logos = [
  "https://i.postimg.cc/kM1YpgrX/signature.png",
];

const images = [
  "https://i.postimg.cc/xdgfM2W6/pexels-fauxels-3184357.jpg",
  "https://i.postimg.cc/7ZqH5pYg/pexels-tomfisk-3856433.jpg",
  "https://i.postimg.cc/h4ZXN9Zy/pexels-rdne-6646967.jpg",
];

export default function OurImpact() {
  return (
    <section className="">
      {/* Text & Logo Section */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Sprout className="w-5 h-5 text-[#3C6E59]" />
          <span className="text-[#555555] text-lg font-medium tracking-wide">
            Together for a Better Community
          </span>
        </div>

        <h2 className="text-4xl md:text-5xl font-bold text-[#003B31]">
          Your support creates better communities.
        </h2>

        <p className="text-[#444] max-w-2xl text-center mx-auto pt-3">
          Every contribution you make brings real change. From repairing streets
          to improving public facilities, your support helps create a healthier
          environment and a brighter future for everyone in the community.
        </p>

        {/* Logos */}
        <div className="flex justify-center mt-6 gap-6">
          {logos.map((logo, i) => (
            <img
              key={i}
              src={logo}
              alt={`Logo ${i + 1}`}
              className="h-12 object-contain"
            />
          ))}
        </div>
      </div>

      {/* Images + Icons */}
      <div className="relative container mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Left Image */}
        <div className="rounded-xl overflow-hidden shadow-md">
          <img
            src={images[0]}
            alt="Impact Left"
            className="w-full h-80 object-cover"
          />
        </div>

        {/* Middle Image */}
        <div className="rounded-xl overflow-hidden shadow-md">
          <img
            src={images[0]}
            alt="Impact Middle"
            className="w-full h-80 object-cover"
          />
        </div>

        {/* Right Image */}
        <div className="rounded-xl overflow-hidden shadow-md">
          <img
            src={images[2]}
            alt="Impact Right"
            className="w-full h-80 object-cover"
          />
        </div>

        {/* Left Icon - Between Left and Middle */}
        <div className="hidden md:block absolute top-1/2 left-[33.33%] -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="bg-white w-20 h-20 rounded-full shadow-xl flex items-center justify-center">
            <FaHandHoldingHeart size={40} className="text-[#3C6E59]" />
          </div>
        </div>

        {/* Right Icon - Between Middle and Right */}
        <div className="hidden md:block absolute top-1/2 left-[66.66%] -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="bg-white w-20 h-20 rounded-full shadow-xl flex items-center justify-center">
            <Users size={40} className="text-[#3C6E59]" />
          </div>
        </div>

      </div>
    </section>
  );
}

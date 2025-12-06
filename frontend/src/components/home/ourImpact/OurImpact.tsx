import { Sprout, Users } from "lucide-react";
import { FaHandHoldingHeart } from "react-icons/fa";

const images = [
  "https://i.postimg.cc/xdgfM2W6/pexels-fauxels-3184357.jpg",
  "https://i.postimg.cc/7ZqH5pYg/pexels-tomfisk-3856433.jpg",
  "https://i.postimg.cc/h4ZXN9Zy/pexels-rdne-6646967.jpg",
];

export default function OurImpact() {
  return (
    <section className="container mx-auto">
      {/* Text & Logo Section */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Sprout className="w-5 h-5 text-primary" />
          <span className="text-gray-600 text-lg font-medium tracking-wide">
            Building Sustainable Cities Together
          </span>
        </div>

        <h2 className="text-4xl md:text-5xl font-bold text-[#003B31]">
          Every report makes our city better.
        </h2>

        <p className="text-gray-600 max-w-4xl text-center mx-auto pt-3 text-lg">
          NagarNirman connects citizens with problem solvers to address civic issues in real-time.
          From fixing potholes to maintaining public spaces, your active participation helps build
          cleaner, safer, and more sustainable communities for everyone.
        </p>
      </div>

      {/* Images + Icons */}
      <div className="relative container mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Left Image */}
        <div className="group rounded-xl overflow-hidden shadow-md relative">
          <img
            src={images[0]}
            alt="Impact Left"
            className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-l-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        </div>

        {/* Middle Image */}
        <div className="group rounded-xl overflow-hidden shadow-md relative">
          <img
            src={images[0]}
            alt="Impact Middle"
            className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-l-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        </div>

        {/* Right Image */}
        <div className="group rounded-xl overflow-hidden shadow-md relative">
          <img
            src={images[2]}
            alt="Impact Right"
            className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
        </div>

        {/* Left Icon - Between Left and Middle */}
        <div className="hidden md:block absolute top-1/2 left-[33.33%] -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="bg-white w-20 h-20 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-2xl group">
            <FaHandHoldingHeart size={40} className="text-primary group-hover:text-accent transition-colors duration-300" />
          </div>
        </div>

        {/* Right Icon - Between Middle and Right */}
        <div className="hidden md:block absolute top-1/2 left-[66.66%] -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="bg-white w-20 h-20 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-2xl group">
            <Users size={40} className="text-primary group-hover:text-accent transition-colors duration-300" />
          </div>
        </div>

      </div>
    </section>
  );
}

import { Sprout, Users } from "lucide-react";
import { FaHandHoldingHeart } from "react-icons/fa";

const images = [
  "https://images.unsplash.com/photo-1633788989414-8a8d43ff985e?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1622760219088-90c1576336a1?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1615560480284-64ad1051fc4e?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
];

export default function OurImpact() {
  return (
    <section className="py-8 sm:py-12 md:py-16 lg:py-20 px-3 xs:px-4 sm:px-6 md:px-8 container mx-auto">
      {/* Text & Logo Section */}
      <div className="text-center mb-8 xs:mb-10 sm:mb-12 md:mb-16">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Sprout className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 text-primary" />
          <span className="text-gray-600 text-xs xs:text-sm sm:text-base md:text-lg font-medium tracking-wide">
            Building Sustainable Cities Together
          </span>
        </div>

        <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-[#003B31]">
          Every report makes our city better.
        </h2>

        <p className="text-gray-600 max-w-4xl text-center mx-auto pt-3 text-xs xs:text-sm sm:text-base md:text-lg">
          NagarNirman connects citizens with problem solvers to address civic issues in real-time.
          From fixing potholes to maintaining public spaces, your active participation helps build
          cleaner, safer, and more sustainable communities for everyone.
        </p>
      </div>

      {/* Images + Icons */}
      <div className="relative container mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 xs:gap-5 sm:gap-6 md:gap-8">

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
            src={images[1]}
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

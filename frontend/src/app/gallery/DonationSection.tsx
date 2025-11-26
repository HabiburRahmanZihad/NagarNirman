"use client";

import Image from "next/image";
import { useState } from "react";

const images = [
  "https://www.nicdarkthemes.com/themes/donation/wp/demo/wildlife/wp-content/uploads/sites/5/2020/09/cause-1.jpg",
  "https://www.nicdarkthemes.com/themes/donation/wp/demo/wildlife/wp-content/uploads/sites/5/2020/09/cause-2.jpg",
  "https://www.nicdarkthemes.com/themes/donation/wp/demo/wildlife/wp-content/uploads/sites/5/2020/09/cause-20.jpg",
];

const icons = [
  {
    src: "https://www.nicdarkthemes.com/themes/donation/wp/demo/wildlife/wp-content/uploads/sites/5/2020/09/icon-4.png",
    title: "Voluntary Donations",
    text: "Proin at varius arcu. Sed posuere orci bibendum pharetra dapibus.",
  },
  {
    src: "https://www.nicdarkthemes.com/themes/donation/wp/demo/wildlife/wp-content/uploads/sites/5/2020/09/icon-2.png",
    title: "Many Medicines",
    text: "Proin at varius arcu. Sed posuere orci bibendum pharetra dapibus.",
  },
  {
    src: "https://www.nicdarkthemes.com/themes/donation/wp/demo/wildlife/wp-content/uploads/sites/5/2020/09/icon-1.png",
    title: "New Volunteers",
    text: "Proin at varius arcu. Sed posuere orci bibendum pharetra dapibus.",
  },
];

export default function DonationSection() {
  const [index, setIndex] = useState(0);

  const nextSlide = () => setIndex((i) => (i + 1) % images.length);
  const prevSlide = () =>
    setIndex((i) => (i - 1 + images.length) % images.length);

  return (
    <section className="bg-base100 max-w-6xl mx-auto py-12 grid grid-cols-1 md:grid-cols-2 gap-6 items-center md:my-12">
      {/* LEFT TEXT SECTION */}
      <div>
        <p className="text-primary font-medium mb-2">
          A help to those who need it
        </p>
        <h2 className="text-4xl font-bold text-info mb-4">
          Each donation is <br className="md:block" /> essential to us
        </h2>
        <p className="text-neutral mb-6 mx-auto">
          Lorem ipsum, dolor sit amet consectetur easlink{" "}
          <br className="md:block" /> adipisicing elit. Deserunt ea sit dicta
          eos optio <br className="md:block" /> aspernatur fugit soluta
          accusantium corrupti architecto.
        </p>
        <button className="bg-primary text-white px-6 py-3 rounded-md font-semibold hover:opacity-90 transition">
          DETAILS
        </button>
      </div>

      {/* RIGHT SLIDER */}
      <div className="relative w-full h-[300px] md:h-[350px] md:w-[600px]  rounded-2xl shadow">
        <Image
          src={images[index]}
          alt="carousel"
          fill
          className="object-cover rounded-xl"
        />
        {/* Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow hover:scale-105"
        >
          ◀
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow hover:scale-105"
        >
          ▶
        </button>
        {/* Bottom Bar */}
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-full md:w-[500px] bg-accent/80 text-white py-4 grid grid-cols-4 text-center text-sm font-semibold rounded-lg shadow-lg z-10 backdrop-blur-sm">
          <div>
            4+
            <br />
            MEDICINES
          </div>
          <div>
            *13
            <br />
            NEEDED
          </div>
          <div>
            15k
            <br />
            DONATIONS
          </div>
          <div>
            [26]
            <br />
            VOLUNTEERS
          </div>
        </div>
      </div>

      {/* ICON GRID */}
      <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-8 mt-10">
        {icons.map((icon, i) => (
          <div
            key={i}
            className="text-center p-6 bg-base200 rounded-xl shadow hover:shadow-lg transition"
          >
            <div className="flex justify-center mb-4">
              <Image src={icon.src} alt="icon" width={60} height={60} />
            </div>
            <h3 className="text-xl font-semibold text-info mb-2">
              {icon.title}
            </h3>
            <p className="text-neutral text-sm mb-4">{icon.text}</p>
            <button className="text-primary font-semibold hover:underline">
              MORE INFO
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

'use client';

import { motion } from 'framer-motion';

const cards = [
  {
    id: 1,
    number: "01",
    title: "Road & Infrastructure",
    description: "Report potholes, broken sidewalks, and damaged roads.",
    icon: (
      <svg className="w-5 h-5 text-[#0A4D3C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
      </svg>
    )
  },
  {
    id: 2,
    number: "02",
    title: "Garbage & Sanitation",
    description: "Help keep your area clean by reporting waste issues.",
    icon: (
      <svg className="w-5 h-5 text-[#0A4D3C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    )
  },
  {
    id: 3,
    number: "03",
    title: "Streetlights & Electrical",
    description: "Fix unsafe dark areas by reporting faulty streetlights.",
    icon: (
      <svg className="w-5 h-5 text-[#0A4D3C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    )
  },
  {
    id: 4,
    number: "04",
    title: "Water & Drainage",
    description: "Submit drainage blockages and water supply issues.",
    icon: (
      <svg className="w-5 h-5 text-[#0A4D3C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
      </svg>
    )
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export default function ImpactCards() {
  return (
    <section className="relative z-20 py-16 -mt-50">
      <div className="container mx-auto px-4">

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {cards.map((card) => (
            <motion.div
              key={card.id}
              variants={cardVariants}
              whileHover={{ y: -5 }}
              className="relative bg-[#F7F6F2] rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300 border border-[#EFEDE8] group"
            >

              {/* Number Background */}
              <span className="absolute top-4 right-4 text-[72px] font-bold text-[#dbd8cf] opacity-60 select-none">
                {card.number}
              </span>

              {/* Icon Section with Hover Effect */}
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-16 h-16 rounded-full border border-accent flex items-center justify-center bg-white mb-6 
                         group-hover:border-[#0A4D3C] group-hover:bg-[#0A4D3C]/10 transition-all duration-300"
              >
                <div className="group-hover:scale-110 group-hover:text-[#0A4D3C] transition-all duration-300">
                  {card.icon}
                </div>
              </motion.div>

              {/* Title */}
              <h3 className="text-xl font-semibold text-[#0A4D3C] leading-snug mb-3">
                {card.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed">
                {card.description}
              </p>

            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
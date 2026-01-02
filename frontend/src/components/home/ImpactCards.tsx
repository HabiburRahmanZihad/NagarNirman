'use client';

import { motion } from 'framer-motion';

const cards = [
  {
    id: 1,
    number: "01",
    title: "Road & Infrastructure",
    description: "Report potholes, broken sidewalks, and damaged roads to get your locality fixed faster.",
    fullText: "Help maintain safe streets by reporting infrastructure issues directly to authorities.",
    icon: (
      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
      </svg>
    )
  },
  {
    id: 2,
    number: "02",
    title: "Garbage & Sanitation",
    description: "Report waste accumulation, garbage piles, and cleaning issues in your community.",
    fullText: "Keep neighborhoods clean by alerting authorities to sanitation problems and dirty areas.",
    icon: (
      <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    )
  },
  {
    id: 3,
    number: "03",
    title: "Streetlights & Electrical",
    description: "Report faulty streetlights, damaged electrical lines, and unsafe dark spots.",
    fullText: "Ensure public safety by reporting broken lights and electrical hazards in your area.",
    icon: (
      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0114 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    )
  },
  {
    id: 4,
    number: "04",
    title: "Water & Drainage",
    description: "Report overflowing drains, waterlogging, and water supply interruptions.",
    fullText: "Combat flooding and drainage issues by reporting water-related problems immediately.",
    icon: (
      <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 }
  }
};

export default function ImpactCards() {
  return (
    <section className="relative z-20 py-16 -mt-50">
      <div className="container mx-auto px-4">

        {/* Styles for thin running border exactly on card border */}
        <style>{`
  .card-root {
    position: relative;
    --accent-color: var(--color-primary, #003B31);
  }

  .card-root.accent-card {
    --accent-color: var(--color-accent, #F7CE50);
  }

  /* make SVG sit ON TOP of the card so the stroke is visible */
  .card-svg-trace {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 2; /* <-- IMPORTANT: above the card-inner */
  }

  .card-svg-trace svg {
    width: 100%;
    height: 100%;
    display: block;
  }

  /* trace settings — use a dash size near the rect perimeter for smooth motion */
  .trace-path {
    fill: none;
    stroke: var(--accent-color);
    stroke-width: 2.8;
    stroke-linecap: round;
    stroke-linejoin: round;
    vector-effect: non-scaling-stroke;

    /* perimeter of your rect (~392) — choose a value that creates a continuous moving look */
    stroke-dasharray: 150;
    stroke-dashoffset: 0;

    animation: borderMove 30s linear infinite;
    opacity: 0.9;
    filter: drop-shadow(0 0 5px var(--accent-color));
    mix-blend-mode: normal;
  }

  @keyframes borderMove {
    0%   { stroke-dashoffset: 0; }
    100% { stroke-dashoffset: -1010; }
  }

  /* Hover — speed up and glow */
  .card-root:hover .trace-path {
    animation-duration: 10s;
    opacity: 1;
    filter: drop-shadow(0 0 8px var(--accent-color));
  }

  .card-inner {
    position: relative;
    z-index: 1; /* keep card content under the SVG trace */
    background: white;
    border-radius: 2.2rem;
    padding: 2rem;
    height: 100%;
    border: 2px solid var(--accent-color);
    transition: all 0.28s ease;
  }

  .card-inner:hover {
    box-shadow: 0 18px 30px rgba(0,0,0,0.14);
  }

  .card-content { position: relative; z-index: 3; } /* ensure text/icons remain interactive above svg if needed */

  .card-number {
    position: absolute;
    top: 1.5rem;
    right: 1.5rem;
    font-size: 3rem;
    font-weight: bold;
    opacity: 0.1;
    user-select: none;
    color: var(--accent-color);
  }

  .card-title {
    font-size: 1.25rem;
    font-weight: bold;
    margin-bottom: 0.75rem;
    line-height: 1.4;
    color: var(--accent-color);
  }

  /* Respect user's reduced motion preference */
  @media (prefers-reduced-motion: reduce) {
    .trace-path { animation: none; opacity: 0.7; }
  }
`}</style>



        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 xs:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {cards.map((card, index) => {
            const isEven = index % 2 === 0;

            return (
              <motion.div
                key={card.id}
                variants={cardVariants}
                whileHover={{ y: -8 }}
                className={`relative group card-root ${isEven ? '' : 'accent-card'}`}
              >
                {/* SVG trace (thin running line on border) */}
                <div className="card-svg-trace" aria-hidden>
                  <svg viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                    <rect
                      x="2"
                      y="2"
                      width="96"
                      height="96"
                      rx="10"
                      ry="10"
                      className="trace-path"
                    />
                  </svg>
                </div>

                {/* Card Content */}
                <div className="card-inner">

                  {/* Visible content must be above the svg trace */}
                  <div className="card-content">
                    {/* Number Background */}
                    <div className="card-number">
                      {card.number}
                    </div>

                    {/* Icon Section */}
                    <motion.div
                      whileHover={{ scale: 1.15, rotate: 5 }}
                      className="mb-5 relative inline-block"
                    >
                      {card.icon}
                    </motion.div>

                    {/* Title */}
                    <h3 className="card-title">
                      {card.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-gray-700 leading-relaxed mb-2">
                      {card.description}
                    </p>

                    {/* Additional Text */}
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {card.fullText}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

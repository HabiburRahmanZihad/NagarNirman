'use client';

import React, { useEffect, useRef, useState, CSSProperties } from 'react';
import { Play, Pause } from 'lucide-react';
// Import Framer Motion and CountUp
import { motion, useInView, animate } from 'framer-motion';
import CountUp from 'react-countup';
import Link from 'next/link';

const AUDIO_SRC = '/audio/national-anthem-bd.mp3';

const formatTime = (seconds: number) => {
  if (!seconds || Number.isNaN(seconds)) return '00:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  const mm = m < 10 ? `0${m}` : `${m}`;
  const ss = s < 10 ? `0${s}` : `${s}`;
  return `${mm}:${ss}`;
};

const NationalAnthemSection: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // Audio progress
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // --- Animation Refs & State ---
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" }); // Trigger when card is visible
  const [circleValue, setCircleValue] = useState(0); // For radial progress animation

  // Handle Audio Play/Pause
  const handleTogglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  // Handle Audio Events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      if (audio.duration) {
        setDuration(audio.duration);
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  // Handle Circular Progress Animation (0 -> 85)
  useEffect(() => {
    if (isInView) {
      // Animate from 0 to 85 over 2 seconds
      const controls = animate(0, 85, {
        duration: 2.5,
        ease: "easeOut",
        onUpdate: (latest) => setCircleValue(Math.round(latest)),
      });

      return () => controls.stop();
    }
  }, [isInView]);

  // Dynamic style for the DaisyUI radial progress
  const radialStyle = {
    '--value': circleValue,
    '--size': '6rem',
    '--thickness': '6px',
  } as CSSProperties;

  return (
    <section
      id="national-anthem"
      className="relative w-full min-h-[420px] md:min-h-[480px] lg:min-h-[520px] overflow-hidden"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/national-anthem-bg.jpg')",
        }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 lg:px-8 py-16 lg:py-20 flex flex-col lg:flex-row items-center gap-10 lg:gap-16">

        {/* Left: text + audio card */}
        <div className="w-full lg:w-[60%] text-white">
          <p className="text-sm tracking-[0.25em] uppercase text-[#f2a921] mb-3">
            Civic Inspiration
          </p>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight mb-4">
            Fuel Your Spirit with the
            <br />
            Anthem of Bangladesh
          </h2>

          <p className="text-sm md:text-base text-white/80 max-w-xl mb-8">
            Ignite your patriotism. As we build smarter cities, let &quot;Amar Shonar Bangla&quot;
            remind us of our duty to protect our environment, resolve issues, and
            rebuild our nation together.
          </p>

          {/* Audio player card */}
          <div className="w-full max-w-xl bg-[#fff8df] border border-[#f2a921] rounded-2xl shadow-xl px-6 py-4 md:py-5 flex flex-col gap-3">
            {/* Track info + play button */}
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-[#002E2E]">
                  National Anthem of Bangladesh
                </p>
                <p className="text-xs text-[#6B7280]">
                  Amar Shonar Bangla
                </p>
              </div>

              <button
                type="button"
                onClick={handleTogglePlay}
                className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-[#f2a921] text-[#002E2E] shadow-md hover:bg-[#f5b739] transition-colors"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5 translate-x-[1px]" />
                )}
              </button>
            </div>

            {/* Progress bar */}
            <div className="mt-2">
              <div className="w-full h-2 rounded-full bg-[#ffeebe] overflow-hidden">
                <div
                  className="h-2 bg-[#f2a921] transition-[width] duration-200"
                  style={{ width: `${progress || 0}%` }}
                />
              </div>

              <div className="mt-1 flex items-center justify-between text-[11px] text-[#6B7280]">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Hidden audio element */}
            <audio ref={audioRef} src={AUDIO_SRC} preload="metadata" />
          </div>
        </div>

        {/* Right: Impact Stats card */}
        {/* We use Framer Motion 'motion.div' to fade the whole card in */}
        <motion.div
          ref={ref} // Attach ref here to detect visibility
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full lg:w-[40%] flex justify-center lg:justify-end"
        >
          <div className="relative w-full max-w-sm lg:max-w-[320px] bg-[#2a7d2f] rounded-[40px] lg:rounded-l-[40px] lg:rounded-r-[40px] px-8 py-10 text-white shadow-2xl">
            {/* Subtle pattern overlay */}
            <div className="pointer-events-none absolute inset-0 opacity-[0.08] bg-[radial-gradient(circle_at_center,#ffffff_1px,transparent_1px)] bg-[length:24px_24px]" />

            <div className="relative z-10 flex flex-col items-center gap-6">
              <h3 className="text-2xl md:text-3xl font-semibold text-center leading-snug">
                Building a cleaner,
                <br />
                safer future.
              </h3>

              {/* Progress circle + amount */}
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center justify-center">
                  <div className="bg-black/10 rounded-full p-3">
                    {/* Animated Radial Progress */}
                    <div
                      className="radial-progress text-[#f2a921]"
                      style={radialStyle}
                      role="progressbar"
                    >
                      {/* Using CountUp for the percentage text as well to be smooth */}
                      <span className="font-bold">
                        {isInView ? <CountUp start={0} end={85} duration={2.5} /> : 0}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-3xl md:text-4xl font-bold">
                     {/* Number Counter Animation */}
                     {isInView ? (
                        <CountUp
                          start={0}
                          end={12450}
                          duration={2.5}
                          separator=","
                          suffix="+"
                        />
                     ) : "0+"}
                  </p>
                  <p className="text-sm tracking-wide uppercase text-white/80 mt-1">
                    Issues Resolved
                  </p>
                </div>
              </div>

              {/* CTA button */}
              <Link
                type='button'
                href="/dashboard/user/reports/new"
                className="mt-2 inline-flex items-center justify-center rounded-full bg-[#f2a921] text-[#002E2E] px-8 py-3 text-sm font-semibold shadow-md hover:bg-[#f5b739] transition-colors"
              >
                Report an Issue
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default NationalAnthemSection;
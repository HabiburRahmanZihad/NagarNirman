'use client';

import React, { useEffect, useRef, useState, CSSProperties } from 'react';
import { Play, Pause } from 'lucide-react';
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
      className="relative w-full min-h-[480px] xs:min-h-[500px] sm:min-h-[520px] md:min-h-[540px] lg:min-h-[600px] overflow-hidden"
    >
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/national-anthem-bg.jpg')",
        }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-3 xs:px-4 sm:px-6 md:px-8 py-8 xs:py-10 sm:py-12 md:py-16 lg:py-20 flex flex-col lg:flex-row items-center gap-6 xs:gap-8 sm:gap-10 md:gap-12 lg:gap-16">

        {/* Left: text + audio card */}
        <div className="w-full text-center lg:w-[60%] text-white">
          <p className="text-xs xs:text-sm sm:text-base tracking-[0.25em] uppercase text-[#f2a921] mb-2 xs:mb-3 sm:mb-4">
            Civic Inspiration
          </p>

          <h2 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight mb-3 xs:mb-4 sm:mb-5 md:mb-6">
            Fuel Your Spirit with the
            <br />
            <span className="text-accent">Anthem of Bangladesh</span>
          </h2>

          <p className="text-xs xs:text-sm sm:text-base md:text-base text-white/80 max-w-xl mb-6 xs:mb-7 sm:mb-8">
            Ignite your patriotism. As we build smarter cities, let &quot;Amar Shonar Bangla&quot;
            remind us of our duty to protect our environment, resolve issues, and
            rebuild our nation together.
          </p>

          {/* Audio player card */}
          <div className="w-full max-w-xl mx-auto bg-[#fff8df] border border-accent rounded-xl xs:rounded-2xl shadow-xl px-4 xs:px-5 sm:px-6 py-3 xs:py-4 sm:py-5 flex flex-col gap-2 xs:gap-3">
            {/* Track info + play button */}
            <div className="flex items-center justify-between gap-2 xs:gap-3 sm:gap-4">
              <div>
                <p className="text-xs xs:text-sm font-semibold text-primary">
                  National Anthem of Bangladesh
                </p>
                <p className="text-[10px] xs:text-xs text-neutral mt-0.5 xs:mt-1">
                  Amar Shonar Bangla
                </p>
              </div>

              <button
                type="button"
                onClick={handleTogglePlay}
                className="inline-flex items-center justify-center w-9 xs:w-10 sm:w-11 h-9 xs:h-10 sm:h-11 rounded-full bg-accent text-primary shadow-md hover:bg-[#f5b739] transition-colors flex-shrink-0"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause className="w-4 xs:w-5 h-4 xs:h-5" />
                ) : (
                  <Play className="w-4 xs:w-5 h-4 xs:h-5 translate-x-px" />
                )}
              </button>
            </div>

            {/* Progress bar */}
            <div className="mt-1 xs:mt-2">
              <div className="w-full h-1.5 xs:h-2 rounded-full bg-[#ffeebe] overflow-hidden">
                <div
                  className="h-1.5 xs:h-2 bg-[#f2a921] transition-[width] duration-200"
                  style={{ width: `${progress || 0}%` }}
                />
              </div>

              <div className="mt-1 flex items-center justify-between text-[10px] xs:text-[11px] text-[#6B7280]">
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
          <div className="relative w-full max-w-sm xs:max-w-md sm:max-w-lg md:max-w-[380px] lg:max-w-[400px] bg-primary rounded-2xl xs:rounded-3xl sm:rounded-4xl lg:rounded-l-[40px] lg:rounded-r-[40px] px-5 xs:px-6 sm:px-8 md:px-10 py-8 xs:py-9 sm:py-10 md:py-12 text-white shadow-2xl">
            {/* Subtle pattern overlay */}
            <div className="pointer-events-none absolute inset-0 opacity-[0.08] bg-[radial-gradient(circle_at_center,#ffffff_1px,transparent_1px)] bg-[length:24px_24px]" />

            <div className="relative z-10 flex flex-col items-center gap-5 xs:gap-6 sm:gap-7 md:gap-8">
              <h3 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-semibold text-center leading-snug">
                Building a cleaner,
                <br />
                safer future.
              </h3>

              {/* Progress circle + amount */}
              <div className="flex flex-col items-center gap-3 xs:gap-4 sm:gap-5">
                <div className="flex items-center justify-center">
                  <div className="bg-black/10 rounded-full p-2 xs:p-3 sm:p-4">
                    {/* Animated Radial Progress */}
                    <div
                      className="radial-progress text-accent"
                      style={radialStyle}
                      role="progressbar"
                    >
                      {/* Using CountUp for the percentage text as well to be smooth */}
                      <span className="font-bold text-xs xs:text-sm sm:text-base">
                        {isInView ? <CountUp start={0} end={85} duration={2.5} /> : 0}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold">
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
                  <p className="text-[10px] xs:text-xs sm:text-sm tracking-wide uppercase text-white/80 mt-1 xs:mt-2">
                    Issues Resolved
                  </p>
                </div>
              </div>

              {/* CTA button */}
              <Link
                href="/dashboard/user/reports/new"
                className="mt-2 xs:mt-3 sm:mt-4 inline-flex items-center justify-center rounded-full bg-accent text-primary px-6 xs:px-7 sm:px-8 md:px-10 py-2 xs:py-2.5 sm:py-3 text-xs xs:text-sm sm:text-base md:text-lg font-semibold shadow-md hover:bg-[#f5b739] transition-colors"
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
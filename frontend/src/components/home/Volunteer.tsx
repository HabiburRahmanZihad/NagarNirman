"use client";

import {
  Sprout,
  Share2,
  Github,
  Linkedin,
  Globe,
  Facebook,
} from "lucide-react";
import Link from "next/link";
import Button from "@/components/common/Button";

// --- TEAM DATA ---
const teamMembers = [
  {
    id: 1,
    name: "Habibur Rahman Zihad",
    role: "Founder & Community Director",
    image: "https://res.cloudinary.com/dvq3pcykn/image/upload/v1758785330/IMG-20241101-WA0192_vyojiv.jpg",
    social: {
      github: "https://github.com/HabiburRahmanZihad",
      linkedin: "https://linkedin.com/in/habiburrahmanzihad",
      portfolio: "https://habibur-rahman-zihad.vercel.app/",
      facebook: "https://www.facebook.com/habiburrahmanzihad.zihad",
    },
  },
  {
    id: 2,
    name: "Md. Shahariar Hafiz",
    role: "Co-Founder & Tech Lead",
    image: "https://avatars.githubusercontent.com/u/102473526?v=4",
    social: {
      github: "https://github.com/mdshahariarhafizofficial",
      linkedin: "https://www.linkedin.com/in/devshahariarhafiz",
      portfolio: "https://shahariar-hafiz.netlify.app/",
      facebook: "https://www.facebook.com/mdshahariarhafizofficial",
    },
  },
  {
    id: 3,
    name: "MD Mizanur Malita",
    role: "Operations Manager",
    image: "https://avatars.githubusercontent.com/u/193724330?v=4",
    social: {
      github: "https://github.com/mizanur2734",
      linkedin: "https://www.linkedin.com/in/md-mizanur-malita",
      portfolio: "https://my-portfolio-4wlb.vercel.app/",
      facebook: "https://www.facebook.com/md.mizanur.rahman.959549",
    },
  },
  {
    id: 4,
    name: "Mohammad Bin Amin",
    role: "Outreach Coordinator",
    image: "https://res.cloudinary.com/dfm0bhtyb/image/upload/v1765699151/qmbjzklvweuy3brrnt3v.png",
    social: {
      github: "https://github.com/Mohammad7558/",
      linkedin: "www.linkedin.com/in/iammohammad",
      portfolio: "https://iam-mohammad.vercel.app/",
      facebook: "https://www.facebook.com/imMOHAMMOD/",
    },
  },
];

// Social icon configuration with colors
const socialIcons = [
  {
    key: 'github',
    Icon: Github,
    label: 'GitHub',
    color: 'hover:bg-gray-800 hover:text-white',
    iconColor: 'text-gray-700 group-hover:text-white'
  },
  {
    key: 'linkedin',
    Icon: Linkedin,
    label: 'LinkedIn',
    color: 'hover:bg-[#0077B5] hover:text-white',
    iconColor: 'text-[#0077B5] group-hover:text-white'
  },
  {
    key: 'portfolio',
    Icon: Globe,
    label: 'Portfolio',
    color: 'hover:bg-[#10B981] hover:text-white',
    iconColor: 'text-[#10B981] group-hover:text-white'
  },
  {
    key: 'facebook',
    Icon: Facebook,
    label: 'Facebook',
    color: 'hover:bg-[#1877F2] hover:text-white',
    iconColor: 'text-[#1877F2] group-hover:text-white'
  }
];

export default function TeamSection() {
  return (
    <section>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* --- HEADER --- */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sprout className="w-5 h-5 text-[#3C6E59]" />
            <span className="text-[#555555] text-base sm:text-lg font-medium tracking-wide">We Are Volunteer</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#003B31] px-4">
            Together For The Planet
          </h2>
        </div>

        {/* --- TEAM GRID --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-12 sm:mb-20">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="group p-3 sm:p-4 rounded-2xl sm:rounded-[30px] bg-base-200 hover:shadow-xl transition-all duration-300"
            >
              {/* IMAGE WRAPPER */}
              <div className="relative h-[250px] sm:h-[280px] md:h-[300px] w-full overflow-hidden rounded-xl sm:rounded-[20px]">
                {/* Main Image with Zoom Effect */}
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  loading="lazy"
                />

                {/* Share Button (Top Right) */}
                <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-20">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-[#F7CE50] rounded-full flex items-center justify-center cursor-pointer shadow-md transition-transform duration-300 hover:scale-110 active:scale-95">
                    <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#003B31]" />
                  </div>
                </div>

                {/* Social Icons (Vertical Stack) */}
                <div className="absolute top-14 sm:top-16 right-3 sm:right-4 z-10 flex flex-col gap-2 items-center">
                  {socialIcons.map((social, i) => {
                    const socialUrl = member.social[social.key as keyof typeof member.social];
                    return (
                      <a
                        key={i}
                        href={socialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Visit ${member.name} on ${social.label}`}
                        className={`
                          w-8 h-8 sm:w-10 sm:h-10 bg-accent/60 rounded-full flex items-center justify-center
                          shadow-sm transition-all duration-500 ease-out
                          ${social.color}
                          opacity-0 -translate-y-4 invisible
                          group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible
                        `}
                        style={{ transitionDelay: `${i * 100}ms` }}
                      >
                        <social.Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${social.iconColor}`} />
                      </a>
                    );
                  })}
                </div>
              </div>

              {/* BOTTOM INFO BOX */}
              <div
                className="mt-3 py-4 sm:py-6 text-center rounded-xl sm:rounded-[20px] transition-colors duration-500 bg-white group-hover:bg-[#003B31]"
              >
                <h3
                  className="text-lg sm:text-xl font-bold mb-1 text-[#003B31] transition-colors duration-300 group-hover:text-[#F7CE50]"
                >
                  {member.name}
                </h3>
                <p
                  className="text-xs sm:text-sm font-medium text-[#777777] transition-colors duration-300 group-hover:text-white"
                >
                  {member.role}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* --- BOTTOM CTA BAR --- */}
        <div className="flex justify-center">
          <div className="bg-white rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.08)] py-3 px-4 flex flex-col md:flex-row items-center gap-6 border border-gray-100">

            <Link href="/about">
              <Button
                variant="primary"
                size="lg"
                iconPosition="right"
              >
                If you want, you can join us
              </Button>
            </Link>

          </div>
        </div>

      </div>
    </section>
  );
}
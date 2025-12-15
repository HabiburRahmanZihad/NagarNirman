"use client";

import HeroSlider from "@/components/home/HeroSlider";
import ImpactCards from "@/components/home/ImpactCards";
import FaqSection from "@/components/home/faq/Faq";
import WhatWeDo from "@/components/home/whatWeDo/WhatWeDo";
import NationalAnthemSection from "@/components/home/NationalAnthemSection";
import Volunteer from "@/components/home/Volunteer";
import EventsSection from "@/components/home/EventsSection";
import PartnersMarquee from "@/components/home/partnersMarquee/PartnersMarquee";
import EmergencyHotlineMarquee from "@/components/home/emergencyHotlineMarquee/EmergencyHotlineMarquee";
import Testimonials from "@/components/testimonials/Testimonials";
import AboutSection from "@/components/home/aboutSection/AboutSection";
import HowToReport from "@/components/home/HowToReport/HowToReport";
import OurImpact from "@/components/home/ourImpact/OurImpact";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section>
        <HeroSlider />
        <ImpactCards />
      </section>

      {/* About Section */}
      <section className="py-8  lg:py-20">
        <AboutSection />
      </section>

      {/* What We Do Section */}
      <section className="py-8  lg:py-20 bg-base-200 overflow-hidden">
        <WhatWeDo />
      </section>

      {/* Partners Marquee */}
      <section className="py-8  lg:py-20 overflow-hidden">
        <PartnersMarquee />
      </section>

      {/* National Anthem Section */}
      <section className="py-8  lg:py-20 bg-base-100 overflow-hidden">
        <NationalAnthemSection />
      </section>

      {/* How To Report */}
      <section className="py-8  lg:py-20 bg-base-100 overflow-hidden">
        <HowToReport />
      </section>

      {/* Testimonials */}
      <section className="py-8  lg:py-20">
        <Testimonials />
      </section>

      {/* Volunteer */}
      <section className="py-8  lg:py-20 bg-base-300 overflow-hidden">
        <Volunteer />
      </section>

      {/* Events Section */}
      <section className="py-8  lg:py-20 bg-base-100 overflow-hidden">
        <EventsSection />
      </section>

      {/* Emergency Hotline Marquee */}
      <section className="py-8  lg:py-20 overflow-hidden">
        <EmergencyHotlineMarquee />
      </section>

      {/* Our Impact */}
      <section className="py-8  lg:py-20 bg-base-300 overflow-hidden">
        <OurImpact />
      </section>

      {/* FAQ Section */}
      <section className="py-8  lg:py-20 bg-base-100 overflow-hidden">
        <FaqSection />
      </section>
    </>
  );
}
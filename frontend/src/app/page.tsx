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
        <HeroSlider></HeroSlider>
        <ImpactCards></ImpactCards>
      </section>

      <section>
        <AboutSection></AboutSection>
      </section>

      <section className="py-24 px-6 lg:px-0 bg-base-200 overflow-hidden">
        <WhatWeDo></WhatWeDo>
      </section>

      <section className="py-24 px-6 lg:px-0 overflow-hidden">
        <PartnersMarquee></PartnersMarquee>
      </section>

      <section className="pb-24 px-6 lg:px-0 bg-base-100 overflow-hidden">
        <NationalAnthemSection />
      </section>

      <section className="pb-4 px-6 lg:px-0 bg-base-100 overflow-hidden">
        <HowToReport></HowToReport>
      </section>

      <section className="lg:pt-24 ">
        <Testimonials></Testimonials>
      </section>

      <section className="py-24 px-6 lg:px-0 bg-base-300 overflow-hidden">
        <Volunteer></Volunteer>
      </section>

      <section className="pb-4 px-6 lg:px-0 bg-base-100 overflow-hidden">
        <EventsSection></EventsSection>
      </section>

      <section className="container mx-auto px-6 py-24 lg:px-0 overflow-hidden">
        <EmergencyHotlineMarquee></EmergencyHotlineMarquee>
      </section>

      <section className=" pt-24 pb-20 bg-base-300">
        <OurImpact></OurImpact>
      </section>

      <section className="py-24 px-6 lg:px-0 bg-base-100 overflow-hidden">
        <FaqSection></FaqSection>
      </section>

    </>
  );
}

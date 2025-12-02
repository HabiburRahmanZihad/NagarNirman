"use client";

import { useAuth } from "@/context/AuthContext";
import HeroSlider from "@/components/home/HeroSlider";
import ImpactCards from "@/components/home/ImpactCards";
import FaqSection from "@/components/home/faq/Faq";
import WhatWeDo from "@/components/home/whatWeDo/WhatWeDo";
import NationalAnthemSection from "@/components/home/NationalAnthemSection";
import ContactSection from "@/components/home/ContactSection/ContactSection";
import Volunteer from "@/components/home/Volunteer";
import EventsSection from "@/components/home/EventsSection";
import PartnersMarquee from "@/components/home/partnersMarquee/PartnersMarquee";
import EmergencyHotlineMarquee from "@/components/home/emergencyHotlineMarquee/EmergencyHotlineMarquee";
import Testimonials from "@/components/testimonials/Testimonials";
import CountUpSection from "@/components/countUp/Count";
import GreenFutureCard from "@/components/home/greenFutureCard/GreenFutureCard";
import HowToReport from "@/components/home/HowToReport/HowToReport";



export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {/* Hero Section */}
      <section>
        <HeroSlider></HeroSlider>
        <ImpactCards></ImpactCards>
      </section>

      <section>
        <CountUpSection></CountUpSection>
      </section>

      {/* <section className="py-24 px-6 lg:px-0 bg-base-100 overflow-hidden">
      </section> */}
      <FaqSection></FaqSection>

      <section className="py-24 px-6 lg:px-0 bg-base-100 overflow-hidden">
        <WhatWeDo></WhatWeDo>
      </section>

      <section className="pb-26 px-6 lg:px-0 overflow-hidden">
        <PartnersMarquee></PartnersMarquee>
      </section>

      <section className="pb-24 px-6 lg:px-0 bg-base-100 overflow-hidden">
        <NationalAnthemSection />
      </section>

      {/* <section className="pb-4 px-6 lg:px-0 bg-base-100 overflow-hidden">
        <ContactSection />
      </section> */}

      <section className="pb-24 px-6 lg:px-0 bg-base-300 overflow-hidden">
        <Volunteer></Volunteer>
      </section>

      <section className="pb-4 px-6 lg:px-0 bg-base-100 overflow-hidden">
        <HowToReport></HowToReport>
      </section>

      <section className="pb-4 px-6 lg:px-0 bg-base-100 overflow-hidden">
        <EventsSection></EventsSection>
      </section>

      <section className="container mx-auto px-6 lg:px-0 overflow-hidden">
        <EmergencyHotlineMarquee></EmergencyHotlineMarquee>
      </section>

      <section className="pt-24 pb-20">
        <Testimonials></Testimonials>
      </section>

      <section>
        <GreenFutureCard></GreenFutureCard>
      </section>

    </>
  );
}

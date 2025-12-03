"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail, MapPin, Phone, Send,
  Copy, Check, ArrowRight, MessageSquare
} from "lucide-react";
import Button from "@/components/common/Button";

export default function ContactSection() {
  const [copied, setCopied] = useState(false);
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });

  const handleCopy = () => {
    navigator.clipboard.writeText("e241024@ugrad.iiuc.ac.bd");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="">


      <div className="container mx-auto ">

        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-[#2a7d2f]/10 text-[#2a7d2f] text-xs font-bold uppercase tracking-widest mb-4">
              Get in Touch
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-[#002E2E] mb-6">
              Let&apos;s Build a <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-[#2a7d2f] to-[#aef452]">
                Cleaner Future
              </span> Together
            </h2>
            <p className="text-neutral text-lg max-w-2xl mx-auto">
              Have a suggestion, a partnership inquiry, or need help reporting an issue?
              Our team is ready to listen.
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 max-w-6xl mx-auto">

          {/* --- LEFT: INFO BENTO GRID (2 Columns) --- */}
          <div className="lg:col-span-2 flex flex-col gap-4">

            {/* 1. Email Card (Click to Copy) */}
            <motion.button
              onClick={handleCopy}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group relative bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md text-left transition-all overflow-hidden w-full"
            >
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                {copied ? <Check className="text-[#2a7d2f] w-5 h-5" /> : <Copy className="text-neutral w-5 h-5" />}
              </div>
              <div className="w-12 h-12 bg-[#F6FFF9] rounded-2xl flex items-center justify-center mb-4 text-[#2a7d2f]">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#002E2E] mb-1">Email Us</h3>
              <p className="text-neutral text-sm font-mono break-all">e241024@ugrad.iiuc.ac.bd</p>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-linear-to-r from-[#2a7d2f] to-[#aef452] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </motion.button>

            {/* 2. Location Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-[#002E2E] p-6 rounded-3xl border border-[#2a7d2f] shadow-lg text-white relative overflow-hidden group"
            >
              {/* Map Abstract Background */}
              <div className="absolute inset-0 opacity-20 grayscale mix-blend-overlay group-hover:scale-110 transition-transform duration-700">

                [Image of dark abstract city map]

                {/* Fallback pattern if image fails */}
                <div className="w-full h-full bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover bg-center" />
              </div>

              <div className="relative z-10">
                <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 text-[#aef452]">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold mb-1">Our HQ</h3>
                <p className="text-white/70 text-sm">
                  IIUC Campus, Kumira,<br /> Chittagong, Bangladesh
                </p>
              </div>
            </motion.div>

            {/* 3. Social/Quick Links */}
            <div className="grid grid-cols-2 gap-4">
              <motion.a
                href="#"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-[#aef452] p-5 rounded-3xl flex flex-col items-center justify-center text-[#002E2E] hover:bg-[#9de045] transition-colors cursor-pointer group"
              >
                <MessageSquare className="w-6 h-6 mb-2 group-hover:-translate-y-1 transition-transform" />
                <span className="font-bold text-sm">Live Chat</span>
              </motion.a>

              <motion.a
                href="#"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="bg-white border border-gray-100 p-5 rounded-3xl flex flex-col items-center justify-center text-[#002E2E] hover:border-[#2a7d2f] transition-colors cursor-pointer group"
              >
                <Phone className="w-6 h-6 mb-2 text-neutral group-hover:text-[#2a7d2f] transition-colors" />
                <span className="font-bold text-sm">Call Us</span>
              </motion.a>
            </div>

          </div>

          {/* --- RIGHT: INTERACTIVE FORM (3 Columns) --- */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:col-span-3 bg-white rounded-[2.5rem] p-8 md:p-10 shadow-xl shadow-[#2a7d2f]/5 border border-white relative"
          >
            <h3 className="text-2xl font-bold text-[#002E2E] mb-6">Send us a message</h3>

            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#2a7d2f] uppercase tracking-wide ml-3">Your Name</label>
                  <input
                    type="text"
                    placeholder="Ahmed Rahman"
                    className="w-full bg-[#F6FFF9] border border-gray-200 rounded-2xl px-6 py-4 text-[#002E2E] placeholder:text-gray-400 focus:outline-none focus:border-[#2a7d2f] focus:ring-4 focus:ring-[#2a7d2f]/10 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#2a7d2f] uppercase tracking-wide ml-3">Email Address</label>
                  <input
                    type="email"
                    placeholder="hello@example.com"
                    className="w-full bg-[#F6FFF9] border border-gray-200 rounded-2xl px-6 py-4 text-[#002E2E] placeholder:text-gray-400 focus:outline-none focus:border-[#2a7d2f] focus:ring-4 focus:ring-[#2a7d2f]/10 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-[#2a7d2f] uppercase tracking-wide ml-3">Subject</label>
                <select className="w-full bg-[#F6FFF9] border border-gray-200 rounded-2xl px-6 py-4 text-[#002E2E] focus:outline-none focus:border-[#2a7d2f] focus:ring-4 focus:ring-[#2a7d2f]/10 transition-all appearance-none cursor-pointer">
                  <option>I want to report an issue</option>
                  <option>Partnership Inquiry</option>
                  <option>Technical Support</option>
                  <option>Join the Team</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-[#2a7d2f] uppercase tracking-wide ml-3">Message</label>
                <textarea
                  rows={4}
                  placeholder="Tell us how we can help..."
                  className="w-full bg-[#F6FFF9] border border-gray-200 rounded-2xl px-6 py-4 text-[#002E2E] placeholder:text-gray-400 focus:outline-none focus:border-[#2a7d2f] focus:ring-4 focus:ring-[#2a7d2f]/10 transition-all resize-none"
                />
              </div>

              <Button
                variant="primary"
                size="xl"
                iconPosition="right"
                fullWidth
              >
                Send Message
              </Button>
            </form>

            {/* Decorative Corner */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-bl from-[#aef452]/20 to-transparent rounded-bl-full -z-0 pointer-events-none" />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
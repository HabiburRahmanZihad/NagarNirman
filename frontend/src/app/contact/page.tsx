"use client";

import React, { useState } from 'react';
import { FaMapMarkerAlt, FaEnvelope, FaPhone, FaClock } from 'react-icons/fa';
import Button from '@/components/common/Button';
import Link from 'next/link';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    // console.log('Form submitted:', formData);
    alert('Thank you for contacting us! We will get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Get in Touch
          </h1>
          <p className="text-lg text-gray-600">
            {`Have questions? We'd love to hear from you. Send us a message!`}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="How can we help?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                  placeholder="Tell us more about your inquiry..."
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                iconPosition="right"
              >
                Send Message
              </Button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary w-12 h-12 flex items-center justify-center rounded-xl flex-shrink-0">
                    <FaMapMarkerAlt className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Address</h3>
                    <p className="text-gray-600">
                      Dhaka, Bangladesh
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-accent w-12 h-12 flex items-center justify-center rounded-xl flex-shrink-0">
                    <FaEnvelope className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                    <a
                      href="mailto:support@nagarnirman.com"
                      className="text-primary hover:text-accent transition-colors"
                    >
                      support@nagarnirman.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary w-12 h-12 flex items-center justify-center rounded-xl flex-shrink-0">
                    <FaPhone className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                    <a
                      href="tel:+8801950719346"
                      className="text-primary hover:text-accent transition-colors"
                    >
                      +880 1950 719346
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-accent w-12 h-12 flex items-center justify-center rounded-xl flex-shrink-0">
                    <FaClock className="text-white text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Working Hours</h3>
                    <p className="text-gray-600">
                      Monday - Saturday<br />
                      10:00 AM - 07:30 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Links</h3>
              <div className="space-y-3">
                <a
                  href="/help"
                  className="block text-gray-700 hover:text-primary transition-colors font-medium"
                >
                  → Help Center
                </a>
                <a
                  href="/faq"
                  className="block text-gray-700 hover:text-primary transition-colors font-medium"
                >
                  → Frequently Asked Questions
                </a>
                <a
                  href="/guidelines"
                  className="block text-gray-700 hover:text-primary transition-colors font-medium"
                >
                  → Community Guidelines
                </a>
                <Link
                  href="/reports/new"
                  className="block text-gray-700 hover:text-primary transition-colors font-medium"
                >
                  → Submit a Report
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import HeroSlider from "@/components/home/HeroSlider";
import ImpactCards from "@/components/home/ImpactCards";
import FaqSection from "@/components/home/faq/Faq";
import WhatWeDo from "@/components/home/whatWeDo/WhatWeDo";

// Help section
const data = [
  {
    img: "https://www.nicdarkthemes.com/themes/donation/wp/demo/wildlife/wp-content/uploads/sites/5/2020/06/team-3-150x150.jpg",
    title: "Aliquam semper diam in",
    desc: "Proin lobortis mauris sed lorem convallis",
    badge: "green",
  },
  {
    img: "https://www.nicdarkthemes.com/themes/donation/wp/demo/wildlife/wp-content/uploads/sites/5/2020/06/team-8-150x150.jpg",
    title: "Vestibulum eleifend lacus",
    desc: "Proin lobortis mauris sed lorem convallis",
    badge: "orange",
  },
  {
    img: "https://www.nicdarkthemes.com/themes/donation/wp/demo/wildlife/wp-content/uploads/sites/5/2020/06/team-6-150x150.jpg",
    title: "Nullam pulvinar massa posuere",
    desc: "Proin lobortis mauris sed lorem convallis",
    badge: "orange",
  },
  {
    img: "https://www.nicdarkthemes.com/themes/donation/wp/demo/wildlife/wp-content/uploads/sites/5/2020/06/team-2-150x150.jpg",
    title: "Donec sed euismod neque",
    desc: "Proin lobortis mauris sed lorem convallis",
    badge: "green",
  },
  {
    img: "https://www.nicdarkthemes.com/themes/donation/wp/demo/wildlife/wp-content/uploads/sites/5/2020/06/team-5-150x150.jpg",
    title: "Suspendisse gravida augue",
    desc: "Proin lobortis mauris sed lorem convallis",
    badge: "green",
  },
  {
    img: "https://www.nicdarkthemes.com/themes/donation/wp/demo/wildlife/wp-content/uploads/sites/5/2020/06/team-7-150x150.jpg",
    title: "Praesent quis maximus libero",
    desc: "Proin lobortis mauris sed lorem convallis",
    badge: "orange",
  },
];

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {/* Hero Section */}
      <section>
        <HeroSlider></HeroSlider>
        <ImpactCards></ImpactCards>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-[#002E2E] text-center mb-12">
          How NagarNirman Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card hover>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#81d586] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📸</span>
              </div>
              <h3 className="text-xl font-bold text-[#002E2E] mb-3">
                Report Issues
              </h3>
              <p className="text-[#6B7280]">
                Capture and submit infrastructure problems with photos,
                location, and details.
              </p>
            </div>
          </Card>

          <Card hover>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#aef452] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🔧</span>
              </div>
              <h3 className="text-xl font-bold text-[#002E2E] mb-3">
                Track Progress
              </h3>
              <p className="text-[#6B7280]">
                Monitor the status of reported issues from submission to
                resolution.
              </p>
            </div>
          </Card>

          <Card hover>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#f2a921] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✅</span>
              </div>
              <h3 className="text-xl font-bold text-[#002E2E] mb-3">
                See Results
              </h3>
              <p className="text-[#6B7280]">
                Celebrate solutions as problem solvers and authorities fix
                issues.
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-[#002E2E] text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-[#81d586] mb-2">64</p>
              <p className="text-gray-300">Districts Covered</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-[#81d586] mb-2">1000+</p>
              <p className="text-gray-300">Issues Reported</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-[#81d586] mb-2">500+</p>
              <p className="text-gray-300">Issues Resolved</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-[#81d586] mb-2">100+</p>
              <p className="text-gray-300">Problem Solvers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Routes & Features Section */}
      <section className="container mx-auto px-4 py-16 bg-white">
        <h2 className="text-3xl font-bold text-[#002E2E] text-center mb-12">
          Explore NagarNirman
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Public Routes */}
          <Card>
            <h3 className="text-xl font-bold text-[#002E2E] mb-4 flex items-center gap-2">
              <span className="text-2xl">🌐</span>
              Public Access
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/reports"
                  className="text-[#81d586] hover:underline flex items-center gap-2"
                >
                  <span>→</span> Browse All Reports
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-[#81d586] hover:underline flex items-center gap-2"
                >
                  <span>→</span> About NagarNirman
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-[#81d586] hover:underline flex items-center gap-2"
                >
                  <span>→</span> Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/auth/register"
                  className="text-[#81d586] hover:underline flex items-center gap-2"
                >
                  <span>→</span> Create Account
                </Link>
              </li>
              <li>
                <Link
                  href="/auth/login"
                  className="text-[#81d586] hover:underline flex items-center gap-2"
                >
                  <span>→</span> Login
                </Link>
              </li>
            </ul>
          </Card>

          {/* Citizen Routes */}
          <Card>
            <h3 className="text-xl font-bold text-[#002E2E] mb-4 flex items-center gap-2">
              <span className="text-2xl">👤</span>
              For Citizens
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/dashboard/user"
                  className="text-[#81d586] hover:underline flex items-center gap-2"
                >
                  <span>→</span> User Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/reports/new"
                  className="text-[#81d586] hover:underline flex items-center gap-2"
                >
                  <span>→</span> Report New Issue
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/user/my-reports"
                  className="text-[#81d586] hover:underline flex items-center gap-2"
                >
                  <span>→</span> My Reports
                </Link>
              </li>
              <li>
                <Link
                  href="/apply"
                  className="text-[#81d586] hover:underline flex items-center gap-2"
                >
                  <span>→</span> Apply as Solver
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/user/profile"
                  className="text-[#81d586] hover:underline flex items-center gap-2"
                >
                  <span>→</span> Profile Settings
                </Link>
              </li>
            </ul>
          </Card>

          {/* Authority Routes */}
          <Card>
            <h3 className="text-xl font-bold text-[#002E2E] mb-4 flex items-center gap-2">
              <span className="text-2xl">🏛️</span>
              For Authorities
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/dashboard/authority"
                  className="text-[#81d586] hover:underline flex items-center gap-2"
                >
                  <span>→</span> Authority Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/authority/reports"
                  className="text-[#81d586] hover:underline flex items-center gap-2"
                >
                  <span>→</span> Manage Reports
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/authority/assign"
                  className="text-[#81d586] hover:underline flex items-center gap-2"
                >
                  <span>→</span> Assign Tasks
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/authority/solvers"
                  className="text-[#81d586] hover:underline flex items-center gap-2"
                >
                  <span>→</span> Manage Solvers
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/authority/analytics"
                  className="text-[#81d586] hover:underline flex items-center gap-2"
                >
                  <span>→</span> View Analytics
                </Link>
              </li>
            </ul>
          </Card>

          {/* Problem Solver Routes */}
          <Card>
            <h3 className="text-xl font-bold text-[#002E2E] mb-4 flex items-center gap-2">
              <span className="text-2xl">🔧</span>
              For Problem Solvers
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/dashboard/problemSolver"
                  className="text-[#81d586] hover:underline flex items-center gap-2"
                >
                  <span>→</span> Solver Dashboard
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/problemSolver/tasks"
                  className="text-[#81d586] hover:underline flex items-center gap-2"
                >
                  <span>→</span> My Tasks
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/problemSolver/completed"
                  className="text-[#81d586] hover:underline flex items-center gap-2"
                >
                  <span>→</span> Completed Tasks
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/problemSolver/leaderboard"
                  className="text-[#81d586] hover:underline flex items-center gap-2"
                >
                  <span>→</span> Leaderboard
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/problemSolver/rewards"
                  className="text-[#81d586] hover:underline flex items-center gap-2"
                >
                  <span>→</span> My Rewards
                </Link>
              </li>
            </ul>
          </Card>

          {/* Reports & Tracking */}
          <Card>
            <h3 className="text-xl font-bold text-[#002E2E] mb-4 flex items-center gap-2">
              <span className="text-2xl">📊</span>
              Reports & Tracking
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/reports"
                  className="text-[#81d586] hover:underline flex items-center gap-2"
                >
                  <span>→</span> All Reports
                </Link>
              </li>
              <li>
                <Link
                  href="/reports?status=pending"
                  className="text-[#81d586] hover:underline flex items-center gap-2"
                >
                  <span>→</span> Pending Reports
                </Link>
              </li>
              <li>
                <Link
                  href="/reports?status=inProgress"
                  className="text-[#81d586] hover:underline flex items-center gap-2"
                >
                  <span>→</span> In Progress
                </Link>
              </li>
              <li>
                <Link
                  href="/reports?status=resolved"
                  className="text-[#81d586] hover:underline flex items-center gap-2"
                >
                  <span>→</span> Resolved Issues
                </Link>
              </li>
              <li>
                <Link
                  href="/reports/map"
                  className="text-[#81d586] hover:underline flex items-center gap-2"
                >
                  <span>→</span> Map View
                </Link>
              </li>
            </ul>
          </Card>

          {/* Help & Support */}
          <Card>
            <h3 className="text-xl font-bold text-[#002E2E] mb-4 flex items-center gap-2">
              <span className="text-2xl">💬</span>
              Help & Support
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/help"
                  className="text-[#81d586] hover:underline flex items-center gap-2"
                >
                  <span>→</span> Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="text-[#81d586] hover:underline flex items-center gap-2"
                >
                  <span>→</span> FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/guidelines"
                  className="text-[#81d586] hover:underline flex items-center gap-2"
                >
                  <span>→</span> Reporting Guidelines
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-[#81d586] hover:underline flex items-center gap-2"
                >
                  <span>→</span> Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-[#81d586] hover:underline flex items-center gap-2"
                >
                  <span>→</span> Terms of Service
                </Link>
              </li>
            </ul>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold text-[#002E2E] mb-6">
          Ready to Make a Difference?
        </h2>
        <p className="text-lg text-[#374151] mb-8 max-w-2xl mx-auto">
          Join thousands of citizens working together to improve
          Bangladesh&apos;s infrastructure. Your voice matters!
        </p>
        <Link href="/auth/register">
          <Button variant="primary" size="lg">
            Join NagarNirman Today
          </Button>
        </Link>
      </section>
      {/* Help Section */}
      <section className="container mx-auto px-4 md:px-0 py-20 text-info">
       <div className="">
         <div className="text-center mb-16">
          <p className="text-sm text-primary">Thanks to your help</p>
          <h2 className="text-4xl font-bold mt-2">
            The ways to help others in the <br className="md:block"/> best possible way
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl mx-auto">
          {data.map((item, i) => (
            <div key={i} className="flex items-center gap-6">
              <Image
                src={item.img}
                alt={item.title}
                width={150}
                height={150}
                className="rounded-lg"
              />

              <div>
                <h3 className="text-xl font-semibold text-info">
                  {item.title}
                </h3>
                <p className="text-neutral mb-2">{item.desc}</p>

                <span
                  className={`px-3 py-1 text-white text-xs font-semibold rounded ${
                    item.badge === "green" ? "bg-primary" : "bg-accent"
                  }`}
                >
                  NEW
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom banner */}
        <div
          className="md:mt-20  text-white relative"
          style={{
            backgroundImage:
              "url(https://www.nicdarkthemes.com/themes/donation/wp/demo/wildlife/wp-content/uploads/sites/5/2020/09/logo-white-300x50.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute left-6 top-6">
            <Image
              src="https://www.nicdarkthemes.com/themes/donation/wp/demo/wildlife/wp-content/uploads/sites/5/2020/05/icon-white.png"
              width={60}
              height={60}
              alt="icon"
            />
          </div>

          
        </div>
       </div>
      </section>
      <FaqSection></FaqSection>
      <WhatWeDo></WhatWeDo>
    </>
  );
}

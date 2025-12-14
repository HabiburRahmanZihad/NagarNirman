'use client';

import {
  AlertCircle,
  Baby,
  CheckCircle,
  ChevronRight,
  Clock,
  Database,
  Eye,
  FileText,
  Lock,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  Shield,
  UserCheck,
  Users,
} from 'lucide-react';
import Image from 'next/image';
import { useMemo, useEffect } from 'react';

export default function PrivacyPage() {
  const currentDateShow = useMemo(() => {
    return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, []);

  useEffect(() => {
    const handleLinkClick = (e: Event) => {
      const target = e.currentTarget as HTMLAnchorElement;
      const href = target.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const id = href.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          const offset = 100;
          const elementPosition = element.offsetTop - offset;
          window.scrollTo({
            top: elementPosition,
            behavior: 'smooth' as ScrollBehavior
          });
          window.history.pushState(null, '', href);
        }
      }
    };

    const internalLinks = document.querySelectorAll('a[href^="#"]');
    internalLinks.forEach(link => {
      link.addEventListener('click', handleLinkClick);
    });

    return () => {
      internalLinks.forEach(link => {
        link.removeEventListener('click', handleLinkClick);
      });
    };
  }, []);

  const sections = [
    {
      icon: <FileText className="w-5 h-5" />,
      title: 'Introduction',
      content: (
        <div className="space-y-4">
          <p className="text-neutral leading-relaxed">
            {`Welcome to NagarNirman ("we," "our," or "us"). We are committed to`}
            protecting your privacy and handling your data with transparency and
            care. This Privacy Policy explains how we collect, use, disclose,
            and safeguard your information when you use our platform.
          </p>
          <div className="bg-primary/10 border-l-4 border-primary p-4 rounded-r-lg">
            <p className="text-primary text-sm">
              <span className="font-semibold">Note:</span> By using our
              platform, you agree to the terms outlined in this policy. We
              encourage you to read it carefully.
            </p>
          </div>
        </div>
      ),
    },
    {
      icon: <Eye className="w-5 h-5" />,
      title: 'Information We Collect',
      content: (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-linear-to-br from-primary/5 to-base-100 p-6 rounded-xl border border-primary/20">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <UserCheck className="w-4 h-4 text-primary" />
                </div>
                <h4 className="font-semibold text-info">
                  Personal Information
                </h4>
              </div>
              <ul className="space-y-3">
                {[
                  'Name & contact details',
                  'Account credentials',
                  'Profile information',
                  'Location data',
                  'Photos & descriptions',
                  'Communication history',
                ].map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-2 text-neutral"
                  >
                    <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-linear-to-br from-primary/5 to-base-100 p-6 rounded-xl border border-primary/20">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Database className="w-4 h-4 text-primary" />
                </div>
                <h4 className="font-semibold text-info">
                  Automated Collection
                </h4>
              </div>
              <ul className="space-y-3">
                {[
                  'Device information',
                  'IP address',
                  'Browser type',
                  'Usage patterns',
                  'Geographic location',
                  'Interaction data',
                ].map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-2 text-neutral"
                  >
                    <ChevronRight className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: 'How We Use Your Information',
      content: (
        <div className="space-y-4">
          <p className="text-neutral mb-4">
            We use your information responsibly to:
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: 'Service Delivery',
                desc: 'Provide and improve our platform services',
              },
              {
                title: 'Issue Resolution',
                desc: 'Process and manage your reports efficiently',
              },
              {
                title: 'Communication',
                desc: 'Keep you updated on your activities',
              },
              {
                title: 'Matching',
                desc: 'Connect problem solvers with issues',
              },
              {
                title: 'Security',
                desc: 'Protect platform integrity and prevent fraud',
              },
              {
                title: 'Analytics',
                desc: 'Enhance user experience through insights',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-base-100 border border-base-200 rounded-xl p-4 hover:shadow-md transition-all hover:border-primary/30"
              >
                <div className="w-10 h-10 bg-linear-to-br from-primary to-info text-white rounded-lg flex items-center justify-center mb-3">
                  <span className="font-bold">{idx + 1}</span>
                </div>
                <h4 className="font-semibold text-info mb-2">
                  {item.title}
                </h4>
                <p className="text-neutral text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: 'Information Sharing',
      content: (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 bg-linear-to-br from-primary/5 to-base-100 border border-primary/20 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <h4 className="font-semibold text-info">
                  With Other Users
                </h4>
              </div>
              <ul className="space-y-2">
                {[
                  'Report locations are publicly visible on maps',
                  'Your name is shared with assigned problem solvers',
                  'Profile details are accessible to authorities',
                ].map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2 text-neutral"
                  >
                    <ChevronRight className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex-1 bg-linear-to-br from-primary/5 to-base-100 border border-primary/20 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <h4 className="font-semibold text-info">
                  With Authorities
                </h4>
              </div>
              <p className="text-neutral text-sm">
                We share necessary information with local authorities and
                verified problem solvers to facilitate effective issue
                resolution and maintain public safety.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      icon: <Lock className="w-5 h-5" />,
      title: 'Data Security',
      content: (
        <div className="space-y-4">
          <div className="bg-linear-to-r from-primary to-info text-white rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-lg">Enterprise-Grade Security</h4>
                <p className="text-white">
                  Your data is protected with multiple layers of security
                </p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                'End-to-end encryption',
                'Secure servers',
                'Regular audits',
                'Access controls',
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center"
                >
                  <p className="text-sm font-medium">{item}</p>
                </div>
              ))}
            </div>
          </div>
          <p className="text-neutral text-sm text-center">
            While we implement industry-standard security measures, no method of
            transmission over the internet is 100% secure.
          </p>
        </div>
      ),
    },
    {
      icon: <UserCheck className="w-5 h-5" />,
      title: 'Your Rights & Choices',
      content: (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              title: 'Access & Review',
              desc: 'View your personal information anytime',
            },
            {
              title: 'Update & Correct',
              desc: 'Edit or modify your data as needed',
            },
            {
              title: 'Data Deletion',
              desc: 'Request account and data removal',
            },
            { title: 'Opt-Out', desc: 'Control marketing communications' },
            {
              title: 'Data Export',
              desc: 'Request a copy of your information',
            },
            {
              title: 'Processing Control',
              desc: 'Object to certain data activities',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="group relative bg-base-100 border border-base-200 rounded-xl p-5 hover:border-primary/40 hover:shadow-lg transition-all"
            >
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">
                {idx + 1}
              </div>
              <div className="w-10 h-10 bg-linear-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center mb-3 group-hover:from-primary/20 transition-colors">
                <CheckCircle className="w-5 h-5 text-primary" />
              </div>
              <h4 className="font-semibold text-info mb-2">{item.title}</h4>
              <p className="text-neutral text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      ),
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: 'Data Retention',
      content: (
        <div className="space-y-4">
          <div className="bg-linear-to-br from-primary/5 to-base-100 border border-primary/20 rounded-xl p-6">
            <p className="text-neutral leading-relaxed">
              We retain your personal information only for as long as necessary
              to fulfill the purposes outlined in this privacy policy. Completed
              reports may be retained for statistical analysis and historical
              archiving while ensuring your privacy is maintained.
            </p>
          </div>
          <div className="flex items-start gap-3 bg-primary/10 border border-primary/30 rounded-lg p-4">
            <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <p className="text-primary text-sm">
              <span className="font-semibold">Note:</span> Some data may be
              retained longer if required by law or for legitimate business
              purposes.
            </p>
          </div>
        </div>
      ),
    },
    {
      icon: <Baby className="w-5 h-5" />,
      title: "Children's Privacy",
      content: (
        <div className="bg-linear-to-br from-primary/5 to-base-100 border border-primary/20 rounded-xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Baby className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h4 className="font-bold text-info">
                Age Restriction Notice
              </h4>
              <p className="text-primary text-sm">
                Our platform is designed for users 18 years and older
              </p>
            </div>
          </div>
          <p className="text-neutral">
            We do not knowingly collect personal information from individuals
            under the age of 18. If you believe we have inadvertently collected
            information from a minor, please contact us immediately, and we will
            take prompt action to remove such information from our systems.
          </p>
        </div>
      ),
    },
    {
      icon: <RefreshCw className="w-5 h-5" />,
      title: 'Policy Updates',
      content: (
        <div className="space-y-4">
          <div className="bg-linear-to-br from-primary/5 to-base-100 border border-primary/20 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <RefreshCw className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-info">Staying Updated</h4>
                <p className="text-primary text-sm">
                  {`We're committed to transparency in our updates`}
                </p>
              </div>
            </div>
            <p className="text-neutral">
              This privacy policy may be updated periodically to reflect changes
              in our practices or legal requirements. Significant changes will
              be communicated through platform notifications, and we encourage
              you to review this page regularly.
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-neutral">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span>Last updated on {currentDateShow}</span>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-base-300 to-base-100">
      <section className="relative overflow-hidden mb-16">
        <div className="absolute inset-0">
          <Image
            src="https://res.cloudinary.com/dfm0bhtyb/image/upload/v1765539312/abs0rzoa8la3okcveayy.png"
            alt="Legal documents background"
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-linear-to-r from-primary/90 via-primary/75 to-transparent"></div>
        </div>

        <div className="container relative mx-auto px-4 py-20 md:py-28">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Privacy Policy & Data Protection
            </h1>
            <p className="text-xl text-gray-100 mb-8 max-w-2xl">
              How we collect, use, secure, and protect your personal information
              with full transparency and accountability.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4">
                <p className="text-gray-100">
                  <span className="font-semibold">Last Updated:</span>{' '}
                  {currentDateShow || 'Loading...'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 pb-16">
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-3">
            <div className="sticky top-24 bg-base-100 rounded-2xl shadow-lg p-6 border border-base-200">
              <h3 className="font-bold text-lg text-info mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Table of Contents
              </h3>
              <nav className="space-y-2">
                {sections.map((section, idx) => (
                  <a
                    key={idx}
                    href={`#section-${idx + 1}`}
                    className="flex items-center gap-3 p-3 text-neutral hover:bg-primary/5 hover:text-primary rounded-lg transition-all group"
                  >
                    <div className="w-6 h-6 bg-base-200 group-hover:bg-primary/10 rounded flex items-center justify-center text-xs font-medium">
                      {idx + 1}
                    </div>
                    <span className="font-medium">{section.title}</span>
                    <ChevronRight className="w-4 h-4 ml-auto text-neutral group-hover:text-primary" />
                  </a>
                ))}
              </nav>
            </div>
          </div>

          <div className="lg:col-span-9 space-y-8">
            {sections.map((section, idx) => (
              <div
                key={idx}
                id={`section-${idx + 1}`}
                className="scroll-mt-28 bg-base-100 rounded-2xl shadow-lg border border-base-200 hover:shadow-xl transition-all"
              >
                <div className="p-6 md:p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-linear-to-br from-primary to-info text-white rounded-xl flex items-center justify-center">
                      {section.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-primary font-bold">
                          Section {idx + 1}
                        </span>
                        <div className="w-1 h-1 bg-base-200 rounded-full"></div>
                        <span className="text-sm text-neutral">
                          {sections.length} total sections
                        </span>
                      </div>
                      <h2 className="text-2xl font-bold text-info">
                        {section.title}
                      </h2>
                    </div>
                  </div>
                  <div className="border-t border-base-200 pt-6">
                    {section.content}
                  </div>
                </div>
              </div>
            ))}

            <div className="bg-linear-to-br from-primary to-info text-white rounded-2xl shadow-xl overflow-hidden">
              <div className="p-8 md:p-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-linear-to-br from-primary/80 to-info/80 rounded-xl flex items-center justify-center">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-white font-medium mb-1">
                      Need Help?
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold">
                      Contact Our Privacy Team
                    </h2>
                  </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                  {[
                    {
                      icon: <Mail className="w-5 h-5" />,
                      title: 'Email Support',
                      contact: 'support@nagarnirman.com',
                      link: 'mailto:support@nagarnirman.com',
                      desc: 'For privacy concerns and data requests',
                    },
                    {
                      icon: <Phone className="w-5 h-5" />,
                      title: 'Phone Support',
                      contact: '+880 1950 719346',
                      link: 'tel:+8801950719346',
                      desc: 'Available Monday-Friday, 9AM-6PM',
                    },
                    {
                      icon: <MapPin className="w-5 h-5" />,
                      title: 'Office Address',
                      contact: 'Dhaka, Bangladesh',
                      link: '#',
                      desc: 'Registered headquarters location',
                    },
                  ].map((method, idx) => (
                    <a
                      key={idx}
                      href={method.link}
                      className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all hover:scale-[1.02]"
                    >
                      <div className="w-12 h-12 bg-linear-to-br from-white/20 to-white/10 rounded-lg flex items-center justify-center mb-4">
                        {method.icon}
                      </div>
                      <h3 className="font-semibold mb-2">{method.title}</h3>
                      <p className="text-white text-sm mb-3">
                        {method.desc}
                      </p>
                      <div className="text-white font-medium bg-white/10 px-3 py-2 rounded-lg hover:bg-white/20 transition-colors">
                        {method.contact}
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
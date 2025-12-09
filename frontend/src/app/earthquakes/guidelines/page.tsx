'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Shield,
  Home,
  Lightbulb,
  AlertCircle,
  Radio,
  Users,
  Building2,
  ChevronDown,
  CheckCircle2,
} from 'lucide-react';

interface GuidelineSection {
  title: string;
  icon: React.ReactNode;
  color: string;
  tips: string[];
}

const guidelines: GuidelineSection[] = [
  {
    title: 'Before an Earthquake',
    icon: <Lightbulb className="w-6 h-6" />,
    color: 'from-blue-500 to-blue-600',
    tips: [
      'Identify safe spots in your home: sturdy table, interior wall, or hallway',
      'Secure heavy furniture and appliances to walls with brackets and straps',
      'Store breakable items in low, closed cabinets with latches',
      'Keep an emergency kit with water, food, first aid, and flashlight',
      'Know how to turn off gas, water, and electricity',
      'Practice "Drop, Cover, and Hold On" drills with family members',
      'Create a family emergency plan and share contact information',
      'Identify meeting spots outside your home and in your neighborhood',
    ],
  },
  {
    title: 'During an Earthquake',
    icon: <AlertTriangle className="w-6 h-6" />,
    color: 'from-red-500 to-red-600',
    tips: [
      'DROP to hands and knees immediately',
      'COVER your head and neck with your arms',
      'HOLD ON to a sturdy table or shelter',
      'If indoors: Move away from windows and heavy objects that may fall',
      'If outdoors: Move away from buildings, power lines, and trees',
      'If driving: Pull over safely, stay in vehicle with seatbelt on',
      'If on upper floor: Stay where you are if structure is safe',
      'Do NOT use elevators - use stairs if you must move',
      'Protect yourself from falling objects and debris',
    ],
  },
  {
    title: 'After an Earthquake',
    icon: <Shield className="w-6 h-6" />,
    color: 'from-green-500 to-green-600',
    tips: [
      'Check yourself and others for injuries; provide first aid if needed',
      'Look for hazards: broken glass, gas leaks, structural damage',
      'Expect aftershocks; be ready to drop, cover, and hold on again',
      'Exit building only if it is safe; check for structural damage first',
      'Stay out of damaged buildings and areas with hazards',
      'Turn off utilities if you smell gas or detect leaks',
      'Listen to local emergency broadcast for instructions',
      'Use telephone only for emergencies; keep lines open',
      'Help others who may need assistance',
      'Document damage for insurance and reporting purposes',
    ],
  },
  {
    title: 'Safety at Different Locations',
    icon: <Building2 className="w-6 h-6" />,
    color: 'from-purple-500 to-purple-600',
    tips: [
      'Home: Take shelter under sturdy table or against interior walls',
      'Office: Move away from windows; take shelter under desk or table',
      'School: Follow evacuation procedures; gather in designated safe areas',
      'Vehicle: Pull over safely; stay inside with seatbelt fastened',
      'Outside: Move away from buildings, power lines, and trees',
      'Beach: Be alert for tsunamis; move to higher ground if one occurs',
      'Crowded places: Protect head and neck; avoid windows and exits',
      'Near structures: Be aware of falling debris and hazards',
    ],
  },
  {
    title: 'Emergency Supplies Kit',
    icon: <Home className="w-6 h-6" />,
    color: 'from-yellow-500 to-yellow-600',
    tips: [
      'Water: 1 gallon per person per day (for several days)',
      'Non-perishable food for at least 3 days',
      'First aid kit and essential medications',
      'Flashlight with extra batteries',
      'Battery-powered or hand-crank radio',
      'Whistle for signaling help',
      'Dust mask or N95 respirator',
      'Moist towelettes, garbage bags, plastic ties',
      'Manual can opener',
      'Local maps and important documents in waterproof container',
      'Cell phone with chargers and backup battery',
      'Cash and credit cards',
    ],
  },
  {
    title: 'Communication & Resources',
    icon: <Radio className="w-6 h-6" />,
    color: 'from-indigo-500 to-indigo-600',
    tips: [
      'Sign up for earthquake alerts from local emergency services',
      'Know the emergency numbers in your area (911 in USA)',
      'Have a family communication plan for contacting each other',
      'Register with local emergency management agencies',
      'Follow local authorities and official earthquake info sources',
      'Stay informed through official weather and seismic services',
      'Join community emergency response team (CERT) training',
      'Take a CPR and first aid certification course',
    ],
  },
];

export default function EarthquakeGuidelinesPage() {
  const [expandedSection, setExpandedSection] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-base-200 p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-linear-to-r from-primary to-secondary text-white rounded-3xl shadow-2xl p-8 sm:p-12 border-t-4 border-accent"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="text-5xl">🛡️</div>
            <h1 className="text-4xl sm:text-5xl font-extrabold">Earthquake Safety Guide</h1>
          </div>
          <p className="text-white/90 text-lg">
            Essential information to prepare, protect yourself, and respond to earthquakes
          </p>
        </motion.div>

        {/* Quick Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-linear-to-r from-accent/20 via-accent/10 to-transparent rounded-2xl border-2 border-accent/30 p-6 md:p-8"
        >
          <div className="flex items-start gap-4 mb-6">
            <AlertCircle className="w-8 h-8 text-accent shrink-0 mt-1" />
            <h2 className="text-2xl font-extrabold text-primary">Remember: DROP. COVER. HOLD ON.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="text-4xl font-extrabold text-error">1️⃣</div>
              <h3 className="text-xl font-bold text-primary">DROP</h3>
              <p className="text-neutral">Drop to your hands and knees immediately when you feel shaking</p>
            </div>
            <div className="space-y-3">
              <div className="text-4xl font-extrabold text-warning">2️⃣</div>
              <h3 className="text-xl font-bold text-primary">COVER</h3>
              <p className="text-neutral">Cover your head and neck with your arms under a sturdy table</p>
            </div>
            <div className="space-y-3">
              <div className="text-4xl font-extrabold text-success">3️⃣</div>
              <h3 className="text-xl font-bold text-primary">HOLD ON</h3>
              <p className="text-neutral">Hold on until shaking stops and it's safe to move</p>
            </div>
          </div>
        </motion.div>

        {/* Guidelines Sections */}
        <div className="space-y-4">
          {guidelines.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg border-2 border-accent/20 overflow-hidden"
            >
              {/* Section Header */}
              <button
                onClick={() => setExpandedSection(expandedSection === index ? null : index)}
                className={`w-full flex items-center justify-between p-6 transition-all duration-300 ${expandedSection === index ? `bg-linear-to-r ${section.color}` : 'bg-base-50'
                  }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`p-3 rounded-xl transition-all duration-300 ${expandedSection === index
                        ? 'bg-white text-current'
                        : `bg-linear-to-r ${section.color} text-white`
                      }`}
                  >
                    {section.icon}
                  </div>
                  <h3
                    className={`text-xl font-extrabold transition-all duration-300 ${expandedSection === index ? 'text-white' : 'text-primary'
                      }`}
                  >
                    {section.title}
                  </h3>
                </div>
                <ChevronDown
                  className={`w-6 h-6 transition-transform duration-300 ${expandedSection === index
                      ? 'rotate-180 text-white'
                      : `text-base-400`
                    }`}
                />
              </button>

              {/* Section Content */}
              {expandedSection === index && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="px-6 py-8 space-y-3 border-t-2 border-accent/20"
                >
                  {section.tips.map((tip, tipIndex) => (
                    <motion.div
                      key={tipIndex}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: tipIndex * 0.05 }}
                      className="flex items-start gap-4 p-4 rounded-xl bg-base-50 hover:bg-base-100 transition-colors duration-300"
                    >
                      <CheckCircle2 className={`w-5 h-5 shrink-0 mt-1 gradient-text-to-r ${section.color}`} />
                      <p className="text-neutral leading-relaxed">{tip}</p>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Additional Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-linear-to-r from-primary via-secondary to-primary/90 text-white rounded-3xl shadow-2xl p-8 sm:p-12 border-t-4 border-accent"
        >
          <h2 className="text-2xl font-extrabold mb-6">Additional Resources</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="text-lg font-bold">Organizations & Services</h3>
              <ul className="space-y-2 text-white/90">
                <li>• USGS Earthquake Hazards Program</li>
                <li>• Federal Emergency Management Agency (FEMA)</li>
                <li>• Red Cross Disaster Relief</li>
                <li>• Local Emergency Management Agencies</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h3 className="text-lg font-bold">What to Do Now</h3>
              <ul className="space-y-2 text-white/90">
                <li>✓ Create an emergency plan with your family</li>
                <li>✓ Assemble an emergency supplies kit</li>
                <li>✓ Secure heavy furniture to walls</li>
                <li>✓ Practice earthquake drills regularly</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Safety Tips Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg border-2 border-accent/20 p-8"
        >
          <h2 className="text-2xl font-extrabold text-primary mb-6">Key Safety Tips</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { emoji: '🏠', title: 'At Home', desc: 'Know where the safest places in your home are' },
              { emoji: '🏢', title: 'At Work', desc: 'Identify safe locations in your workplace' },
              { emoji: '🚗', title: 'In Your Car', desc: 'Pull over safely and stay in the vehicle' },
              { emoji: '📞', title: 'Emergency Contact', desc: 'Have important numbers saved in your phone' },
              { emoji: '🎒', title: 'Grab & Go Bag', desc: 'Keep emergency supplies in an accessible bag' },
              { emoji: '👨‍👩‍👧‍👦', title: 'Family Plan', desc: 'Create a communication plan with family' },
            ].map((tip, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                className="p-6 bg-linear-to-br from-base-50 to-base-100 rounded-xl border-2 border-accent/20 hover:border-accent/50 transition-all duration-300"
              >
                <div className="text-4xl mb-3">{tip.emoji}</div>
                <h3 className="text-lg font-bold text-primary mb-2">{tip.title}</h3>
                <p className="text-neutral/70">{tip.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

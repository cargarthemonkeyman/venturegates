"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  Brain,
  Filter,
  Sparkles,
  BarChart3,
  CheckCircle2,
  XCircle,
  Zap,
  TrendingUp,
  Users,
  Target,
  Lightbulb,
  Rocket,
  Gem,
  Globe,
  FlaskConical,
  AlertTriangle,
  Funnel,
  Diamond,
  Layers,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Entrepreneur types for preview
const entrepreneurTypes = [
  {
    icon: Brain,
    title: "The Architect",
    description: "Designs systems, processes, frameworks. Obsessed with how pieces fit together.",
  },
  {
    icon: Sparkles,
    title: "The Creative",
    description: "Designs products, experiences, brands. Obsessed with making things feel incredible.",
  },
  {
    icon: BarChart3,
    title: "The Analyst",
    description: "Data, metrics, optimization. Obsessed with finding patterns.",
  },
  {
    icon: Users,
    title: "The Communicator",
    description: "Narrative, sales, community. Obsessed with connecting with people.",
  },
  {
    icon: Zap,
    title: "The Builder",
    description: "Code, infrastructure, making things work. Obsessed with building.",
  },
];

// Market Gates
const marketGates = [
  { name: "Real Scale", icon: TrendingUp, desc: "Core repeatable, grows without proportional team growth" },
  { name: "Explosive Growth", icon: Rocket, desc: "Viral dynamics, network effects, or similar" },
  { name: "Fast to Market", icon: Zap, desc: "Validates in days/weeks with simple tests" },
  { name: "WOW Demo", icon: Sparkles, desc: "Understood in 30 seconds, generates 'want to try'" },
  { name: "Sellable Spinoff", icon: Gem, desc: "Can become independent sellable asset" },
  { name: "Be Early", icon: Target, desc: "Arrive first, do what others don't dare" },
  { name: "Real Disruption", icon: AlertTriangle, desc: "Brave/risky/new focus, not small market" },
  { name: "Talent Retention", icon: Users, desc: "Interesting enough to keep team engaged 6-12 months" },
  { name: "Scale Within Clients", icon: Layers, desc: "Accelerates expansion without reinventing GTM" },
  { name: "Clear ROI", icon: BarChart3, desc: "Convertible return into growth" },
  { name: "Category/Standard", icon: Diamond, desc: "Not a replaceable feature" },
  { name: "Strong Foundation", icon: Funnel, desc: "Strong WHY, impact, purpose beyond money" },
];

// Personal Gates
const personalGates = [
  { name: "Personal Energy", icon: Zap, desc: "Do you wake up thinking about this?" },
  { name: "Speed to First Signal", icon: Rocket, desc: "Something in users' hands in <2 weeks" },
  { name: "Fast Feedback Loop", icon: TrendingUp, desc: "Clear user signals in days, not months" },
  { name: "Profile Alignment", icon: Target, desc: "Uses your strengths (systems + product + narrative)" },
  { name: "Pain Size", icon: AlertTriangle, desc: "People actively complain and search for solutions" },
  { name: "AI as Core Advantage", icon: Brain, desc: "Without AI the product wouldn't exist" },
  { name: "Clear Monetization", icon: Gem, desc: "Know who pays, how much, why from day 1" },
  { name: "Can Be The User", icon: Users, desc: "You'd use this product, understand problem first-hand" },
  { name: "Compelling Narrative", icon: Lightbulb, desc: "Explain in 30s and someone says 'I want that'" },
  { name: "No External Permission", icon: CheckCircle2, desc: "Advance without partnerships, APIs, or regulation" },
  { name: "Habit Potential", icon: Funnel, desc: "User returns naturally, no forced notifications" },
];

// Mock Venture DNA Preview
const mockVentureDNA = {
  type: "The Architect",
  nonNegotiables: [
    { name: "Feedback loop <2 weeks", icon: Zap },
    { name: "Systemic complexity", icon: Layers },
    { name: "No hardware dependency", icon: CheckCircle2 },
  ],
  accelerators: [
    { name: "Can be the user", icon: Users },
    { name: "AI-native product", icon: Brain },
  ],
  redFlags: [
    { name: "Heavy operations", icon: AlertTriangle },
    { name: "Slow sales cycles", icon: XCircle },
  ],
};

// Comparison data
const comparisonData = [
  { feature: "Ideas", generic: "Same curated lists for everyone", ventureGates: "AI-generated, filtered by your profile" },
  { feature: "Personalization", generic: "None", ventureGates: "Gate system based on who you are" },
  { feature: "Founder-fit", generic: "Doesn't exist", ventureGates: "Core of the product" },
  { feature: "Output", generic: "Flat list", ventureGates: "Ideas + Scorecard + Venture DNA" },
  { feature: "Validation", generic: "Superficial", ventureGates: "Market + Personal gates + real signals" },
];

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-neutral-200/80 bg-[#f5f5f5]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                <Diamond className="w-5 h-5 text-white" />
              </div>
              <span className="font-serif font-bold text-xl text-neutral-900">VentureGates</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <Link href="#how-it-works" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">
                How It Works
              </Link>
              <Link href="#gates" className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">
                The System
              </Link>
              <Link href="/discover">
                <Button className="bg-neutral-900 hover:bg-neutral-800 text-white border-0 font-medium">
                  Discover Your DNA
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Section 1: Hero */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="text-center"
          >
            <motion.div variants={fadeInUp} className="mb-6">
              <Badge className="bg-white/80 text-neutral-600 border-neutral-200 px-4 py-1.5 text-sm font-mono">
                Powered by AI · Built by The Agile Monkeys
              </Badge>
            </motion.div>
            <motion.h1
              variants={fadeInUp}
              className="text-4xl sm:text-5xl lg:text-7xl font-serif font-bold tracking-tight mb-6 text-neutral-900"
            >
              Discover What Venture You{" "}
              <span className="gradient-text">Should Build</span>
              <br className="hidden sm:block" /> — Based on Who You Are
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-lg sm:text-xl text-neutral-600 max-w-3xl mx-auto mb-10 font-light"
            >
              No more generic ideas. VentureGates analyzes your founder profile, generates a
              personalized Gate system, and shows you ventures that fit{" "}
              <span className="text-neutral-900 font-medium">YOU</span> — not just the market.
            </motion.p>
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/discover">
                <Button
                  size="lg"
                  className="bg-neutral-900 hover:bg-neutral-800 text-white border-0 px-8 py-6 text-lg font-medium"
                >
                  Discover Your Venture DNA
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </motion.div>
            <motion.p
              variants={fadeInUp}
              className="mt-8 text-sm text-neutral-500 flex items-center justify-center gap-2 font-mono"
            >
              <span>Inspired by</span>
              <span className="font-semibold text-neutral-700">The Agile Monkeys</span>
              <span className="text-neutral-400">real venture building process</span>
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Section 2: The Problem - Colorful Gradient Cards */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold mb-6 text-neutral-900">
              90% of startups fail.
              <br />
              <span className="text-neutral-500 font-normal">Most because founders build something that doesn&apos;t fit them.</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Before Card - Warm Gradient */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Card className="gradient-card-warm border-0 text-white h-full glow-orange overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white/90 font-serif">
                    <XCircle className="w-5 h-5" />
                    Before: Generic Idea Lists
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-white/90">
                    Most tools give you the same curated lists regardless of who you are. A
                    delivery app idea for everyone — whether you&apos;re a technical builder or a
                    creative marketer.
                  </p>
                  <ul className="space-y-2 text-sm text-white/80">
                    <li>• No consideration of founder strengths</li>
                    <li>• Generic market opportunities</li>
                    <li>• Ideas that ignore your context</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            {/* After Card - Cool Purple Gradient */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Card className="gradient-card-purple border-0 text-white h-full glow-purple overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white/90 font-serif">
                    <CheckCircle2 className="w-5 h-5" />
                    After: Your Personalized Gate System
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-white/90">
                    Y Combinator considers founder-market fit the #1 success factor. VentureGates
                    makes that alignment visible and actionable through a system of Gates.
                  </p>
                  <ul className="space-y-2 text-sm text-white/80">
                    <li>• Ideas filtered by YOUR profile</li>
                    <li>• Visual scorecard per venture</li>
                    <li>• Founder-market fit as core metric</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section 3: How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <Badge className="bg-white/80 text-neutral-600 border-neutral-200 mb-4 font-mono">
              How It Works
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-neutral-900">
              From Profile to Actionable Ventures
            </h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                icon: Users,
                title: "Tell Us Who You Are",
                description:
                  "The AI asks about your entrepreneurial personality, strengths, context, and obsessions.",
                gradient: "from-violet-500/20 to-fuchsia-500/20",
              },
              {
                step: "02",
                icon: Filter,
                title: "We Generate Your Gates",
                description:
                  "We create your personalized filter system: non-negotiables, accelerators, and red flags.",
                gradient: "from-blue-500/20 to-cyan-500/20",
              },
              {
                step: "03",
                icon: Sparkles,
                title: "Ideas That Pass YOUR Filters",
                description:
                  "We generate disruptive ventures and run them through your gates + market gates.",
                gradient: "from-amber-500/20 to-orange-500/20",
              },
              {
                step: "04",
                icon: BarChart3,
                title: "Compare with Scorecard",
                description:
                  "Each idea has a visual scorecard (green/yellow/red) per gate for easy comparison.",
                gradient: "from-emerald-500/20 to-teal-500/20",
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className={`bg-gradient-to-br ${item.gradient} border-0 h-full hover:shadow-lg transition-shadow group`}>
                  <CardContent className="pt-6">
                    <div className="text-xs font-mono text-neutral-500 mb-4">{item.step}</div>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-4`}>
                      <item.icon className="w-6 h-6 text-neutral-700" />
                    </div>
                    <h3 className="font-serif font-semibold text-lg mb-2 text-neutral-900">{item.title}</h3>
                    <p className="text-sm text-neutral-600">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: What Makes Us Different - Colorful Gradient */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <Badge className="bg-white/80 text-neutral-600 border-neutral-200 mb-4 font-mono">
              Comparison
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-neutral-900">
              What Makes VentureGates Different
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="gradient-card-ocean border-0 text-white overflow-hidden">
              <CardContent className="p-8">
                <div className="grid grid-cols-3 gap-4 mb-6 text-sm font-mono text-white/70">
                  <div>Feature</div>
                  <div>Generic Tools</div>
                  <div>VentureGates</div>
                </div>
                <div className="space-y-4">
                  {comparisonData.map((item, index) => (
                    <div
                      key={item.feature}
                      className="grid grid-cols-3 gap-4 items-center p-4 rounded-xl bg-white/10 backdrop-blur-sm"
                    >
                      <div className="font-medium text-white font-serif">{item.feature}</div>
                      <div className="text-sm text-white/70">{item.generic}</div>
                      <div className="text-sm text-white font-medium">{item.ventureGates}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Section 5: Preview of Venture DNA - Colorful Card */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <Badge className="bg-white/80 text-neutral-600 border-neutral-200 mb-4 font-mono">
              Preview
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold mb-4 text-neutral-900">
              Your Venture DNA Profile
            </h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Every founder gets a unique Venture DNA — a personalized system of Gates that filters
              opportunities based on who you are.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <Card className="gradient-card-green border-0 text-white overflow-hidden glow-green">
              <CardContent className="p-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8 pb-8 border-b border-white/20">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-white/70 mb-1 font-mono">Entrepreneur Type</div>
                    <div className="text-2xl font-serif font-bold">{mockVentureDNA.type}</div>
                    <p className="text-sm text-white/80 mt-1">
                      Designs systems, processes, frameworks. Obsessed with how pieces fit together.
                    </p>
                  </div>
                </div>

                {/* Gates Grid */}
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Non-negotiables */}
                  <div>
                    <h4 className="text-sm font-mono text-white/70 mb-4 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      Non-Negotiables
                    </h4>
                    <div className="space-y-3">
                      {mockVentureDNA.nonNegotiables.map((gate) => (
                        <div
                          key={gate.name}
                          className="flex items-center gap-3 p-3 rounded-lg bg-white/10 backdrop-blur-sm"
                        >
                          <gate.icon className="w-4 h-4 text-white" />
                          <span className="text-sm">{gate.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Accelerators */}
                  <div>
                    <h4 className="text-sm font-mono text-white/70 mb-4 flex items-center gap-2">
                      <Zap className="w-4 h-4" />
                      Accelerators
                    </h4>
                    <div className="space-y-3">
                      {mockVentureDNA.accelerators.map((gate) => (
                        <div
                          key={gate.name}
                          className="flex items-center gap-3 p-3 rounded-lg bg-white/10 backdrop-blur-sm"
                        >
                          <gate.icon className="w-4 h-4 text-white" />
                          <span className="text-sm">{gate.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Red Flags */}
                  <div>
                    <h4 className="text-sm font-mono text-white/70 mb-4 flex items-center gap-2">
                      <XCircle className="w-4 h-4" />
                      Red Flags
                    </h4>
                    <div className="space-y-3">
                      {mockVentureDNA.redFlags.map((gate) => (
                        <div
                          key={gate.name}
                          className="flex items-center gap-3 p-3 rounded-lg bg-white/10 backdrop-blur-sm"
                        >
                          <gate.icon className="w-4 h-4 text-white" />
                          <span className="text-sm">{gate.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="mt-8 pt-8 border-t border-white/20 flex items-center justify-between">
                  <div className="text-sm text-white/70 font-mono">
                    Share your Venture DNA on LinkedIn or Twitter
                  </div>
                  <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-0">
                    Share My DNA
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Section 6: The Gate System */}
      <section id="gates" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <Badge className="bg-white/80 text-neutral-600 border-neutral-200 mb-4 font-mono">
              The System
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold mb-4 text-neutral-900">
              It&apos;s Not Intuition. It&apos;s a System.
            </h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              VentureGates uses 22 real Gates divided into Market Gates (objective criteria) and
              Personal Gates (founder fit).
            </p>
          </motion.div>

          {/* Market Gates - Colorful Cards */}
          <div className="mb-12">
            <h3 className="text-xl font-serif font-semibold mb-6 flex items-center gap-2 text-neutral-900">
              <Globe className="w-5 h-5 text-violet-500" />
              12 Market Gates
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {marketGates.map((gate, index) => (
                <motion.div
                  key={gate.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                >
                  <Card className="bg-white border-neutral-200 hover:border-violet-300 transition-colors group hover:shadow-md">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-100 to-fuchsia-100 flex items-center justify-center flex-shrink-0">
                          <gate.icon className="w-4 h-4 text-violet-600" />
                        </div>
                        <div>
                          <h4 className="font-serif font-medium text-sm mb-1 text-neutral-900">{gate.name}</h4>
                          <p className="text-xs text-neutral-500">{gate.desc}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Personal Gates - Different Color */}
          <div>
            <h3 className="text-xl font-serif font-semibold mb-6 flex items-center gap-2 text-neutral-900">
              <Users className="w-5 h-5 text-cyan-500" />
              11 Personal Gates
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {personalGates.map((gate, index) => (
                <motion.div
                  key={gate.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                >
                  <Card className="bg-white border-neutral-200 hover:border-cyan-300 transition-colors group hover:shadow-md">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-100 to-blue-100 flex items-center justify-center flex-shrink-0">
                          <gate.icon className="w-4 h-4 text-cyan-600" />
                        </div>
                        <div>
                          <h4 className="font-serif font-medium text-sm mb-1 text-neutral-900">{gate.name}</h4>
                          <p className="text-xs text-neutral-500">{gate.desc}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section 7: CTA Final - Sunset Gradient */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card className="gradient-card-sunset border-0 overflow-hidden">
              <CardContent className="p-12 text-center">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold mb-6 text-neutral-800">
                  Ready to discover which venture{" "}
                  <span className="italic">fits you?</span>
                </h2>
                <p className="text-neutral-700 mb-10 max-w-2xl mx-auto">
                  Join founders who are building ventures aligned with who they are — not just what the
                  market says is hot.
                </p>
                <Link href="/discover">
                  <Button
                    size="lg"
                    className="bg-neutral-900 hover:bg-neutral-800 text-white border-0 px-10 py-6 text-lg font-medium"
                  >
                    Start Free
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-neutral-200 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                  <Diamond className="w-5 h-5 text-white" />
                </div>
                <span className="font-serif font-bold text-lg text-neutral-900">VentureGates</span>
              </div>
              <div className="h-6 w-px bg-neutral-300" />
              <Image
                src="/theagilemonkeys-logo.png"
                alt="The Agile Monkeys"
                width={120}
                height={30}
                className="h-6 w-auto opacity-60"
              />
            </div>
            <div className="flex items-center gap-6 text-sm text-neutral-500 font-mono">
              <Link href="/" className="hover:text-neutral-900 transition-colors">
                Home
              </Link>
              <Link href="/discover" className="hover:text-neutral-900 transition-colors">
                Discover
              </Link>
              <Link href="/ventures" className="hover:text-neutral-900 transition-colors">
                Ventures
              </Link>
              <Link href="#" className="hover:text-neutral-900 transition-colors">
                About
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-neutral-200 text-center text-sm text-neutral-400 font-mono">
            Powered by AI · Built by The Agile Monkeys · © 2025
          </div>
        </div>
      </footer>
    </main>
  );
}

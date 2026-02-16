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
    <main className="min-h-screen bg-[#0a0a0a]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Diamond className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl">VentureGates</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <Link href="#how-it-works" className="text-sm text-zinc-400 hover:text-white transition-colors">
                How It Works
              </Link>
              <Link href="#gates" className="text-sm text-zinc-400 hover:text-white transition-colors">
                The System
              </Link>
              <Link href="/discover">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white border-0">
                  Discover Your DNA
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Section 1: Hero */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="text-center"
          >
            <motion.div variants={fadeInUp} className="mb-6">
              <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 px-4 py-1.5 text-sm">
                Powered by AI · Built by The Agile Monkeys
              </Badge>
            </motion.div>
            <motion.h1
              variants={fadeInUp}
              className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-6"
            >
              Discover What Venture You{" "}
              <span className="gradient-text">Should Build</span>
              <br className="hidden sm:block" /> — Based on Who You Are
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-lg sm:text-xl text-zinc-400 max-w-3xl mx-auto mb-10"
            >
              No more generic ideas. VentureGates analyzes your founder profile, generates a
              personalized Gate system, and shows you ventures that fit{" "}
              <span className="text-white font-medium">YOU</span> — not just the market.
            </motion.p>
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/discover">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white border-0 px-8 py-6 text-lg glow-blue"
                >
                  Discover Your Venture DNA
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </motion.div>
            <motion.p
              variants={fadeInUp}
              className="mt-8 text-sm text-zinc-500 flex items-center justify-center gap-2"
            >
              <span>Inspired by</span>
              <span className="font-semibold text-zinc-300">The Agile Monkeys</span>
              <span className="text-zinc-600">real venture building process</span>
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Section 2: The Problem */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              90% of startups fail.
              <br />
              <span className="text-zinc-500">Most because founders build something that doesn&apos;t fit them.</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-zinc-900/50 border-zinc-800 h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-zinc-400">
                    <XCircle className="w-5 h-5 text-red-500" />
                    Before: Generic Idea Lists
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-zinc-400">
                    Most tools give you the same curated lists regardless of who you are. A
                    delivery app idea for everyone — whether you&apos;re a technical builder or a
                    creative marketer.
                  </p>
                  <ul className="space-y-2 text-sm text-zinc-500">
                    <li>• No consideration of founder strengths</li>
                    <li>• Generic market opportunities</li>
                    <li>• Ideas that ignore your context</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-zinc-900/50 border-blue-500/30 h-full glow-blue">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-white">
                    <CheckCircle2 className="w-5 h-5 text-blue-500" />
                    After: Your Personalized Gate System
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-zinc-300">
                    Y Combinator considers founder-market fit the #1 success factor. VentureGates
                    makes that alignment visible and actionable through a system of Gates.
                  </p>
                  <ul className="space-y-2 text-sm text-zinc-400">
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
      <section id="how-it-works" className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 mb-4">
              How It Works
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
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
              },
              {
                step: "02",
                icon: Filter,
                title: "We Generate Your Gates",
                description:
                  "We create your personalized filter system: non-negotiables, accelerators, and red flags.",
              },
              {
                step: "03",
                icon: Sparkles,
                title: "Ideas That Pass YOUR Filters",
                description:
                  "We generate disruptive ventures and run them through your gates + market gates.",
              },
              {
                step: "04",
                icon: BarChart3,
                title: "Compare with Scorecard",
                description:
                  "Each idea has a visual scorecard (green/yellow/red) per gate for easy comparison.",
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="bg-zinc-900/50 border-zinc-800 h-full hover:border-zinc-700 transition-colors group">
                  <CardContent className="pt-6">
                    <div className="text-xs font-mono text-zinc-600 mb-4">{item.step}</div>
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center mb-4 group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-colors">
                      <item.icon className="w-6 h-6 text-blue-400" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                    <p className="text-sm text-zinc-400">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: What Makes Us Different */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 mb-4">
              Comparison
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              What Makes VentureGates Different
            </h2>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-4">
            {comparisonData.map((item, index) => (
              <motion.div
                key={item.feature}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="grid grid-cols-3 gap-4 items-center p-4 rounded-xl bg-zinc-900/30 border border-zinc-800/50"
              >
                <div className="font-medium text-zinc-300">{item.feature}</div>
                <div className="text-sm text-zinc-500">{item.generic}</div>
                <div className="text-sm text-blue-400 font-medium">{item.ventureGates}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: Preview of Venture DNA */}
      <section className="py-20 border-t border-white/5 bg-gradient-to-b from-transparent via-blue-950/10 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 mb-4">
              Preview
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Your Venture DNA Profile
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
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
            <Card className="bg-zinc-900/80 border-zinc-700/50 glow-blue overflow-hidden">
              <CardContent className="p-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8 pb-8 border-b border-zinc-800">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-zinc-500 mb-1">Entrepreneur Type</div>
                    <div className="text-2xl font-bold">{mockVentureDNA.type}</div>
                    <p className="text-sm text-zinc-400 mt-1">
                      Designs systems, processes, frameworks. Obsessed with how pieces fit together.
                    </p>
                  </div>
                </div>

                {/* Gates Grid */}
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Non-negotiables */}
                  <div>
                    <h4 className="text-sm font-medium text-zinc-500 mb-4 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      Non-Negotiables
                    </h4>
                    <div className="space-y-3">
                      {mockVentureDNA.nonNegotiables.map((gate) => (
                        <div
                          key={gate.name}
                          className="flex items-center gap-3 p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/50"
                        >
                          <gate.icon className="w-4 h-4 text-blue-400" />
                          <span className="text-sm">{gate.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Accelerators */}
                  <div>
                    <h4 className="text-sm font-medium text-zinc-500 mb-4 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-green-500" />
                      Accelerators
                    </h4>
                    <div className="space-y-3">
                      {mockVentureDNA.accelerators.map((gate) => (
                        <div
                          key={gate.name}
                          className="flex items-center gap-3 p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/50"
                        >
                          <gate.icon className="w-4 h-4 text-green-400" />
                          <span className="text-sm">{gate.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Red Flags */}
                  <div>
                    <h4 className="text-sm font-medium text-zinc-500 mb-4 flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-red-500" />
                      Red Flags
                    </h4>
                    <div className="space-y-3">
                      {mockVentureDNA.redFlags.map((gate) => (
                        <div
                          key={gate.name}
                          className="flex items-center gap-3 p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/50"
                        >
                          <gate.icon className="w-4 h-4 text-red-400" />
                          <span className="text-sm">{gate.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="mt-8 pt-8 border-t border-zinc-800 flex items-center justify-between">
                  <div className="text-sm text-zinc-500">
                    Share your Venture DNA on LinkedIn or Twitter
                  </div>
                  <Button variant="outline" className="border-zinc-700 hover:bg-zinc-800">
                    Share My DNA
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Section 6: The Gate System */}
      <section id="gates" className="py-20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 mb-4">
              The System
            </Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              It&apos;s Not Intuition. It&apos;s a System.
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              VentureGates uses 22 real Gates divided into Market Gates (objective criteria) and
              Personal Gates (founder fit).
            </p>
          </motion.div>

          {/* Market Gates */}
          <div className="mb-12">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-400" />
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
                  <Card className="bg-zinc-900/50 border-zinc-800 hover:border-blue-500/30 transition-colors group">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500/20 transition-colors">
                          <gate.icon className="w-4 h-4 text-blue-400" />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm mb-1">{gate.name}</h4>
                          <p className="text-xs text-zinc-500">{gate.desc}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Personal Gates */}
          <div>
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-400" />
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
                  <Card className="bg-zinc-900/50 border-zinc-800 hover:border-purple-500/30 transition-colors group">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-500/20 transition-colors">
                          <gate.icon className="w-4 h-4 text-purple-400" />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm mb-1">{gate.name}</h4>
                          <p className="text-xs text-zinc-500">{gate.desc}</p>
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

      {/* Section 7: CTA Final */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Ready to discover which venture{" "}
              <span className="gradient-text">fits you?</span>
            </h2>
            <p className="text-zinc-400 mb-10 max-w-2xl mx-auto">
              Join founders who are building ventures aligned with who they are — not just what the
              market says is hot.
            </p>
            <Link href="/discover">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white border-0 px-10 py-6 text-lg glow-purple"
              >
                Start Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Diamond className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-lg">VentureGates</span>
              </div>
              <div className="h-6 w-px bg-zinc-800" />
              <Image
                src="/theagilemonkeys-logo.png"
                alt="The Agile Monkeys"
                width={120}
                height={30}
                className="h-6 w-auto opacity-70"
              />
            </div>
            <div className="flex items-center gap-6 text-sm text-zinc-500">
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <Link href="/discover" className="hover:text-white transition-colors">
                Discover
              </Link>
              <Link href="/ventures" className="hover:text-white transition-colors">
                Ventures
              </Link>
              <Link href="#" className="hover:text-white transition-colors">
                About
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-zinc-900 text-center text-sm text-zinc-600">
            Powered by AI · Built by The Agile Monkeys · © 2025
          </div>
        </div>
      </footer>
    </main>
  );
}

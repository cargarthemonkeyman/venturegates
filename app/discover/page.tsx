"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowRight,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Compass,
  Flame,
  Heart,
  Scale,
  Lightbulb,
  Target,
  CircleDot,
  Clock,
  Briefcase,
  TrendingUp,
  Palette,
  Code,
  Building2,
  Search,
  Shield,
  Crown,
  BarChart3,
  Users,
  Zap,
  Brain,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Types
interface Option {
  value: string;
  label: string;
  icon?: React.ElementType;
  description?: string;
}

interface Question {
  id: string;
  type: "single" | "multi" | "single-with-other" | "multi-with-other" | "text";
  title: string;
  subtitle?: string;
  description?: string;
  options?: Option[];
  placeholder?: string;
  otherPlaceholder?: string;
  maxSelections?: number;
}

const questions: Question[] = [
  {
    id: "archetype",
    type: "single-with-other",
    title: "What's your founder archetype?",
    subtitle: "Your fundamental nature",
    description: "Not what you do, but who you are when you're in your element",
    options: [
      { value: "visionary", label: "The Visionary", icon: Lightbulb, description: "I see the future before others. Possibilities excite me more than limitations." },
      { value: "craftsman", label: "The Craftsman", icon: Palette, description: "I lose myself perfecting details. Quality is my religion." },
      { value: "strategist", label: "The Strategist", icon: Compass, description: "I see patterns where others see chaos. Chess is my language." },
      { value: "catalyst", label: "The Catalyst", icon: Flame, description: "I move people. Conversations with me change trajectories." },
      { value: "architect", label: "The Architect", icon: Building2, description: "I build systems that outlive me. Structure over everything." },
      { value: "hacker", label: "The Hacker", icon: Code, description: "I find shortcuts others miss. 'Impossible' is a challenge." },
    ],
    otherPlaceholder: "Describe your unique archetype in your own words...",
  },
  {
    id: "eneagram",
    type: "single-with-other",
    title: "What drives you at your core?",
    subtitle: "Your internal engine",
    description: "Select what resonates most deeply with you",
    options: [
      { value: "1", label: "The Reformer", icon: Scale, description: "I seek what's right. The world should work better." },
      { value: "3", label: "The Achiever", icon: Crown, description: "I need to be recognized. Success is my fuel." },
      { value: "5", label: "The Investigator", icon: Search, description: "I understand before acting. Knowledge is power." },
      { value: "7", label: "The Enthusiast", icon: Brain, description: "I explore possibilities. Routine suffocates me." },
      { value: "8", label: "The Challenger", icon: Flame, description: "I control my destiny. Weakness is not an option." },
      { value: "9", label: "The Peacemaker", icon: CircleDot, description: "I seek harmony. Conflict exhausts me." },
    ],
    otherPlaceholder: "Describe your core driver another way...",
  },
  {
    id: "availability",
    type: "single-with-other",
    title: "Your current reality",
    subtitle: "No filters",
    description: "Where are you right now?",
    options: [
      { value: "full_time", label: "100% Available", icon: Clock, description: "I can dedicate body and soul" },
      { value: "side_hustle", label: "Side Project", icon: Briefcase, description: "I have a job but can dedicate 20h/week" },
      { value: "limited", label: "Limited Time", icon: Clock, description: "Less than 10 hours per week available" },
      { value: "transitioning", label: "Transitioning", icon: TrendingUp, description: "Leaving my job, 1-3 month window" },
    ],
    otherPlaceholder: "Describe your specific situation...",
  },
  {
    id: "stress_response",
    type: "single-with-other",
    title: "Under pressure, what do you do?",
    subtitle: "Your stress pattern",
    description: "This determines which venture types are toxic for you",
    options: [
      { value: "overthink", label: "Overthink", icon: Brain, description: "I freeze analyzing all scenarios" },
      { value: "rash", label: "Act Rashly", icon: Zap, description: "I make quick decisions that cost later" },
      { value: "withdraw", label: "Withdraw", icon: CircleDot, description: "I disappear until the storm passes" },
      { value: "seek_help", label: "Seek Help", icon: Users, description: "I need to talk it through with someone" },
      { value: "intensify", label: "Double Down", icon: Flame, description: "Stress activates me, I compete harder" },
    ],
    otherPlaceholder: "How do you react under pressure?",
  },
  {
    id: "motivation",
    type: "single-with-other",
    title: "What makes you wake up at 5am without an alarm?",
    subtitle: "Your real fuel",
    description: "Not what you say you want, but what truly moves you",
    options: [
      { value: "freedom", label: "Absolute Freedom", icon: Compass, description: "Never asking permission from anyone again" },
      { value: "mastery", label: "Mastery", icon: Brain, description: "Being the best in the world at something specific" },
      { value: "impact", label: "Legacy Impact", icon: Heart, description: "Changing millions of lives" },
      { value: "creation", label: "Create From Scratch", icon: Lightbulb, description: "Seeing something born from my head into the real world" },
      { value: "wealth", label: "Extreme Wealth", icon: BarChart3, description: "Never worrying about money again, total freedom" },
      { value: "recognition", label: "Recognition", icon: Crown, description: "Being seen as the best, absolute authority" },
    ],
    otherPlaceholder: "What REALLY moves you?",
  },
  {
    id: "runway",
    type: "single-with-other",
    title: "Your runway",
    subtitle: "Available resources",
    options: [
      { value: "bootstrap", label: "Bootstrapping", icon: Shield, description: "Just my savings, under $5k" },
      { value: "angel", label: "Angel Ready", icon: Users, description: "Access to $20k-$100k if I validate" },
      { value: "funded", label: "Funded", icon: Crown, description: "$100k+ committed" },
      { value: "survival", label: "Survival Mode", icon: Flame, description: "Less than 6 months runway, high pressure" },
    ],
    otherPlaceholder: "Describe your capital situation...",
  },
  {
    id: "obsession",
    type: "text",
    title: "What do you research when nobody's paying you?",
    subtitle: "Your organic obsession",
    description: "The topic you consume on YouTube at 2am, the books you buy and don't read, the podcasts you listen to while walking",
    placeholder: "Ex: 'How blockchain is changing music IP rights' or 'Color psychology in conversion rates'...",
  },
  {
    id: "strengths",
    type: "multi-with-other",
    title: "Your superpowers (max 3)",
    subtitle: "What you do better than 95% of people",
    description: "No modesty. What do people constantly ask your help with?",
    maxSelections: 3,
    options: [
      { value: "systems", label: "Systems Thinking" },
      { value: "design", label: "Product/Experience Design" },
      { value: "storytelling", label: "Storytelling & Persuasion" },
      { value: "code", label: "Programming/Tech" },
      { value: "sales", label: "Sales & Closing" },
      { value: "data", label: "Data Analysis" },
      { value: "marketing", label: "Growth/Marketing" },
      { value: "operations", label: "Operations & Processes" },
      { value: "networking", label: "Relationships & Networking" },
      { value: "creativity", label: "Creativity & Ideation" },
      { value: "leadership", label: "Team Leadership" },
      { value: "execution", label: "Relentless Execution" },
    ],
    otherPlaceholder: "Any superpower not on the list?",
  },
  {
    id: "drains",
    type: "multi-with-other",
    title: "Your kryptonite (max 3)",
    subtitle: "What drains your life energy",
    description: "Tasks that, even if you know how to do them, leave you exhausted",
    maxSelections: 3,
    options: [
      { value: "bureaucracy", label: "Bureaucracy & Paperwork" },
      { value: "accounting", label: "Accounting/Finance" },
      { value: "support", label: "Technical Support" },
      { value: "cold_calls", label: "Cold Calling" },
      { value: "content", label: "Repetitive Content Creation" },
      { value: "meetings", label: "Long Meetings" },
      { value: "management", label: "People Management" },
      { value: "details", label: "Administrative Details" },
      { value: "hardware", label: "Logistics/Hardware" },
      { value: "compliance", label: "Legal/Compliance" },
    ],
    otherPlaceholder: "What else completely drains you?",
  },
  {
    id: "technical",
    type: "single-with-other",
    title: "Your technical arsenal",
    subtitle: "What can you build yourself?",
    options: [
      { value: "full_stack", label: "Full-Stack Developer", icon: Code, description: "I can build the product solo" },
      { value: "no_code", label: "No-Code/Low-Code", icon: Zap, description: "Fast MVP with visual tools" },
      { value: "designer", label: "Designer", icon: Palette, description: "Flows, UI, user experience" },
      { value: "business", label: "Business/Ops", icon: Briefcase, description: "Strategy, operations, sales" },
      { value: "need_tech", label: "Need Technical Cofounder", icon: Users, description: "I have vision, seeking the builder" },
    ],
    otherPlaceholder: "Describe your specific technical skills...",
  },
  {
    id: "team",
    type: "single-with-other",
    title: "Who's on your side?",
    subtitle: "Your support environment",
    options: [
      { value: "solo", label: "Solo Founder", icon: Target, description: "100% independent, single decision maker" },
      { value: "tech_cofounder", label: "Technical Cofounder", icon: Code, description: "I have the builder, need validation" },
      { value: "biz_cofounder", label: "Business Cofounder", icon: Briefcase, description: "I have the seller/ops person" },
      { value: "advisors", label: "Advisors/Mentors", icon: Users, description: "Expert guidance available" },
      { value: "small_team", label: "Small Team", icon: Building2, description: "2-3 committed people" },
    ],
    otherPlaceholder: "Describe your team situation...",
  },
  {
    id: "industries",
    type: "multi-with-other",
    title: "Where do you have unfair advantage?",
    subtitle: "Sectors where you know things others don't",
    description: "Industries where you've worked or researched deeply",
    maxSelections: 4,
    options: [
      { value: "fintech", label: "Fintech/Payments" },
      { value: "health", label: "Health/Medtech" },
      { value: "education", label: "EdTech" },
      { value: "ecommerce", label: "E-commerce/D2C" },
      { value: "saas", label: "SaaS/B2B" },
      { value: "marketplaces", label: "Marketplaces" },
      { value: "content", label: "Media/Content" },
      { value: "real_estate", label: "Real Estate/PropTech" },
      { value: "retail", label: "Retail/Food" },
      { value: "travel", label: "Travel/Hospitality" },
      { value: "gaming", label: "Gaming" },
      { value: "web3", label: "Web3/Crypto" },
    ],
    otherPlaceholder: "Another sector where you have expertise?",
  },
  {
    id: "success",
    type: "single-with-other",
    title: "How will you know you made it?",
    subtitle: "Your definition of success",
    description: "If everything goes perfectly, what will you have built?",
    options: [
      { value: "unicorn", label: "Unicorn", icon: Crown, description: "$1B+ valuation, change the world at scale" },
      { value: "lifestyle", label: "Lifestyle Business", icon: Compass, description: "$50k-$100k/month, total freedom, 4-hour weeks" },
      { value: "impact", label: "Deep Impact", icon: Heart, description: "Change 1M+ lives" },
      { value: "category", label: "Category King", icon: Target, description: "Be the standard, the name everyone knows" },
      { value: "exit", label: "Million Dollar Exit", icon: BarChart3, description: "Sell for 8-9 figures and do the next thing" },
    ],
    otherPlaceholder: "How do YOU define success?",
  },
];

const STORAGE_KEY = "ventureGates_answers_v1";
const STORAGE_STEP_KEY = "ventureGates_current_step";

export default function DiscoverPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [otherText, setOtherText] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Load saved progress
  useEffect(() => {
    setIsClient(true);
    try {
      const savedAnswers = localStorage.getItem(STORAGE_KEY);
      const savedStep = localStorage.getItem(STORAGE_STEP_KEY);
      
      if (savedAnswers) {
        setAnswers(JSON.parse(savedAnswers));
      }
      if (savedStep) {
        const step = parseInt(savedStep, 10);
        if (step >= 0 && step < questions.length) {
          setCurrentStep(step);
        }
      }
    } catch (err) {
      console.error("Error loading progress:", err);
    }
  }, []);

  // Save progress
  useEffect(() => {
    if (!isClient) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
      localStorage.setItem(STORAGE_STEP_KEY, currentStep.toString());
    } catch (err) {
      console.error("Error saving:", err);
    }
  }, [answers, currentStep, isClient]);

  const currentQuestion = useMemo(() => questions[currentStep], [currentStep]);
  const progress = ((currentStep + 1) / questions.length) * 100;

  const handleSingleSelect = useCallback((value: string) => {
    setError(null);
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
  }, [currentQuestion.id]);

  const handleMultiSelect = useCallback((value: string) => {
    setError(null);
    const current = (answers[currentQuestion.id] as string[]) || [];
    const max = currentQuestion.maxSelections || 3;
    
    if (value === "__other__") {
      if (current.includes("__other__")) {
        setAnswers((prev) => ({ ...prev, [currentQuestion.id]: current.filter((v) => v !== "__other__") }));
        setOtherText((prev) => ({ ...prev, [currentQuestion.id]: "" }));
      } else if (current.length < max) {
        setAnswers((prev) => ({ ...prev, [currentQuestion.id]: [...current, "__other__"] }));
      }
    } else if (current.includes(value)) {
      setAnswers((prev) => ({ ...prev, [currentQuestion.id]: current.filter((v) => v !== value) }));
    } else if (current.length < max) {
      setAnswers((prev) => ({ ...prev, [currentQuestion.id]: [...current, value] }));
    }
  }, [answers, currentQuestion.id, currentQuestion.maxSelections]);

  const handleTextChange = useCallback((value: string) => {
    setError(null);
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
  }, [currentQuestion.id]);

  const handleOtherTextChange = useCallback((value: string) => {
    setOtherText((prev) => ({ ...prev, [currentQuestion.id]: value }));
  }, [currentQuestion.id]);

  const getCurrentAnswer = useCallback(() => {
    const raw = answers[currentQuestion.id];
    const other = otherText[currentQuestion.id];
    
    if (currentQuestion.type === "single-with-other" && raw === "__other__") {
      return other?.trim() || null;
    }
    
    if (currentQuestion.type === "multi-with-other") {
      const selections = (raw as string[]) || [];
      const hasOther = selections.includes("__other__");
      const clean = selections.filter((s) => s !== "__other__");
      
      if (hasOther && other?.trim()) {
        return [...clean, other.trim()];
      }
      return clean.length > 0 ? clean : null;
    }
    
    return raw;
  }, [answers, otherText, currentQuestion.id, currentQuestion.type]);

  const canProceed = useCallback(() => {
    const answer = getCurrentAnswer();
    if (!answer) return false;
    if (Array.isArray(answer)) return answer.length > 0;
    return typeof answer === "string" && answer.length > 0;
  }, [getCurrentAnswer]);

  const handleNext = useCallback(() => {
    const finalAnswer = getCurrentAnswer();
    
    if (currentStep < questions.length - 1) {
      setAnswers((prev) => ({ ...prev, [currentQuestion.id]: finalAnswer }));
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      handleSubmit(finalAnswer);
    }
  }, [currentStep, currentQuestion.id, getCurrentAnswer]);

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentStep]);

  const handleSubmit = useCallback(async (finalAnswer: any) => {
    setIsSubmitting(true);
    setError(null);
    
    const finalAnswers = { ...answers, [currentQuestion.id]: finalAnswer };
    
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_STEP_KEY);
      localStorage.setItem("ventureGates_answers", JSON.stringify(finalAnswers));
      router.push("/discover/processing");
    } catch (err) {
      setError("Failed to save. Please try again.");
      setIsSubmitting(false);
    }
  }, [answers, currentQuestion.id, router]);

  const isOtherSelected = useCallback(() => {
    if (currentQuestion.type === "single-with-other") {
      return answers[currentQuestion.id] === "__other__";
    }
    if (currentQuestion.type === "multi-with-other") {
      return (answers[currentQuestion.id] as string[])?.includes("__other__");
    }
    return false;
  }, [answers, currentQuestion.type, currentQuestion.id]);

  const getSelectedCount = useCallback(() => {
    if (currentQuestion.type === "multi-with-other") {
      const arr = (answers[currentQuestion.id] as string[]) || [];
      return arr.filter((v) => v !== "__other__").length;
    }
    return answers[currentQuestion.id] && answers[currentQuestion.id] !== "__other__" ? 1 : 0;
  }, [answers, currentQuestion.type, currentQuestion.id]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && canProceed() && !isSubmitting) {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [canProceed, isSubmitting, handleNext]);

  if (!isClient) {
    return (
      <main className="min-h-screen dot-pattern-bg py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-neutral-200 rounded w-1/4"></div>
            <div className="h-64 bg-white rounded-lg"></div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen dot-pattern-bg py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <Link href="/" className="text-sm text-neutral-500 hover:text-neutral-900 inline-flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
            {(currentStep > 0 || Object.keys(answers).length > 0) && (
              <button
                onClick={() => {
                  if (confirm("Start over? All progress will be lost.")) {
                    localStorage.removeItem(STORAGE_KEY);
                    localStorage.removeItem(STORAGE_STEP_KEY);
                    setAnswers({});
                    setOtherText({});
                    setCurrentStep(0);
                  }
                }}
                className="text-xs text-neutral-400 hover:text-red-500"
              >
                Start over
              </button>
            )}
          </div>
          
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-500">{currentStep + 1} / {questions.length}</span>
            <span className="text-sm font-medium text-neutral-900">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-white border-neutral-200 shadow-sm">
              <CardContent className="p-6 sm:p-8">
                {/* Question header */}
                <div className="mb-6">
                  {currentQuestion.subtitle && (
                    <span className="text-xs font-medium text-indigo-600 uppercase tracking-wider">
                      {currentQuestion.subtitle}
                    </span>
                  )}
                  <h2 className="text-2xl font-bold text-neutral-900 mt-1">{currentQuestion.title}</h2>
                  {currentQuestion.description && (
                    <p className="text-neutral-600 mt-2 text-sm">{currentQuestion.description}</p>
                  )}
                </div>

                {/* Single Select with Other */}
                {(currentQuestion.type === "single" || currentQuestion.type === "single-with-other") && currentQuestion.options && (
                  <div className="space-y-3">
                    {currentQuestion.options.map((option) => {
                      const Icon = option.icon;
                      const isSelected = answers[currentQuestion.id] === option.value;
                      
                      return (
                        <button
                          key={option.value}
                          onClick={() => handleSingleSelect(option.value)}
                          className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                            isSelected
                              ? "border-neutral-900 bg-neutral-900 text-white"
                              : "border-neutral-200 hover:border-neutral-400 bg-white text-neutral-900"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            {Icon && (
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                isSelected ? "bg-white/20" : "bg-neutral-100"
                              }`}>
                                <Icon className={`w-5 h-5 ${isSelected ? "text-white" : "text-neutral-600"}`} />
                              </div>
                            )}
                            <div className="flex-1">
                              <div className="font-semibold">{option.label}</div>
                              {option.description && (
                                <div className={`text-sm mt-1 ${isSelected ? "text-white/80" : "text-neutral-500"}`}>
                                  {option.description}
                                </div>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                    
                    {currentQuestion.type === "single-with-other" && (
                      <>
                        <button
                          onClick={() => handleSingleSelect("__other__")}
                          className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                            isOtherSelected()
                              ? "border-neutral-900 bg-neutral-900 text-white"
                              : "border-neutral-200 hover:border-neutral-400 bg-white text-neutral-900"
                          }`}
                        >
                          <div className="font-semibold flex items-center gap-2">
                            <span>✏️</span>
                            <span>Other (specify)</span>
                          </div>
                        </button>
                        
                        {isOtherSelected() && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="mt-3"
                          >
                            <Textarea
                              value={otherText[currentQuestion.id] || ""}
                              onChange={(e) => handleOtherTextChange(e.target.value)}
                              placeholder={currentQuestion.otherPlaceholder}
                              className="w-full min-h-[100px]"
                              autoFocus
                            />
                          </motion.div>
                        )}
                      </>
                    )}
                  </div>
                )}

                {/* Multi Select with Other */}
                {(currentQuestion.type === "multi" || currentQuestion.type === "multi-with-other") && currentQuestion.options && (
                  <div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {currentQuestion.options.map((option) => {
                        const isSelected = (answers[currentQuestion.id] as string[])?.includes(option.value);
                        
                        return (
                          <button
                            key={option.value}
                            onClick={() => handleMultiSelect(option.value)}
                            className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-all ${
                              isSelected
                                ? "border-neutral-900 bg-neutral-900 text-white"
                                : "border-neutral-200 hover:border-neutral-400 bg-white text-neutral-700"
                            }`}
                          >
                            {option.label}
                          </button>
                        );
                      })}
                      
                      {currentQuestion.type === "multi-with-other" && (
                        <button
                          onClick={() => handleMultiSelect("__other__")}
                          className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-all ${
                            isOtherSelected()
                              ? "border-neutral-900 bg-neutral-900 text-white"
                              : "border-neutral-200 hover:border-neutral-400 bg-white text-neutral-700"
                          }`}
                        >
                          ✏️ Other
                        </button>
                      )}
                    </div>
                    
                    {currentQuestion.type === "multi-with-other" && isOtherSelected() && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mb-4"
                      >
                        <Textarea
                          value={otherText[currentQuestion.id] || ""}
                          onChange={(e) => handleOtherTextChange(e.target.value)}
                          placeholder={currentQuestion.otherPlaceholder}
                          className="w-full min-h-[80px]"
                          autoFocus
                        />
                      </motion.div>
                    )}
                    
                    <p className="text-sm text-neutral-500">Selected: {getSelectedCount()} / {currentQuestion.maxSelections}</p>
                  </div>
                )}

                {/* Text Input */}
                {currentQuestion.type === "text" && (
                  <Textarea
                    value={(answers[currentQuestion.id] as string) || ""}
                    onChange={(e) => handleTextChange(e.target.value)}
                    placeholder={currentQuestion.placeholder}
                    rows={4}
                    className="w-full"
                    autoFocus
                  />
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0 || isSubmitting}
            className="border-neutral-300 hover:bg-white"
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back
          </Button>
          
          <Button
            onClick={handleNext}
            disabled={!canProceed() || isSubmitting}
            className="bg-neutral-900 hover:bg-neutral-800 text-white"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : currentStep === questions.length - 1 ? (
              <>
                Generate My DNA
                <ArrowRight className="ml-2 w-4 h-4" />
              </>
            ) : (
              <>
                Next
                <ArrowRight className="ml-2 w-4 h-4" />
              </>
            )}
          </Button>
        </div>
        
        <p className="mt-4 text-center text-xs text-neutral-400">
          Press Cmd/Ctrl + Enter to continue
        </p>
      </div>
    </main>
  );
}

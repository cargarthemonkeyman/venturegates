"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  Brain, ArrowLeft, Target, Share2, Sparkles, RefreshCw,
  Star, MessageSquare, Plus, Loader2, ChevronRight,
  ChevronDown, Diamond
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Gate { name: string; description: string; icon?: string; }
interface VentureDNA { entrepreneur_type: string; type_description: string; non_negotiables: Gate[]; accelerators: Gate[]; red_flags: Gate[]; enneagram_type?: string; }
interface Venture { 
  name: string; 
  tagline: string; 
  category: string; 
  description: string; 
  total_score: number; 
  founder_market_fit_score: number; 
}
interface ResultData { venture_dna: VentureDNA; ventures: Venture[]; share_slug?: string; answers?: Record<string, any>; }
interface ChatMessage { role: 'user' | 'assistant'; content: string; timestamp: Date; }

export default function ResultsPage() {
  const router = useRouter();
  const [data, setData] = useState<ResultData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [generatingMore, setGeneratingMore] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: "Hi! I'm your Venture Coach. Try asking:\n\n• \"I want more ambitious ventures\"\n• \"Focus on B2B SaaS\"\n• \"Show me lower risk options\"\n• \"What about climate tech?\"", timestamp: new Date() }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [shareCooldown, setShareCooldown] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadData = () => {
      try {
        const resultJson = localStorage.getItem("ventureGates_result");
        console.log("[Results] Raw result:", resultJson?.substring(0, 200));
        if (!resultJson) { 
          console.log("[Results] No result found, redirecting to /discover");
          router.push("/discover"); 
          return; 
        }
        const parsedData = JSON.parse(resultJson);
        console.log("[Results] Parsed data:", parsedData);
        console.log("[Results] venture_dna:", parsedData?.venture_dna);
        console.log("[Results] ventures:", parsedData?.ventures);
        if (!parsedData.venture_dna || !parsedData.ventures) { 
          console.log("[Results] Missing venture_dna or ventures, redirecting");
          router.push("/discover"); 
          return; 
        }
        setData(parsedData);
      } catch (error) { 
        console.error("[Results] Error loading data:", error);
        router.push("/discover"); 
      }
      finally { setIsLoading(false); }
    };
    loadData();
  }, [router]);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatMessages]);

  const handleShare = () => {
    if (shareCooldown) return;
    const url = data?.share_slug ? `https://venturegates.vercel.app/profile/${data.share_slug}` : window.location.href;
    navigator.clipboard.writeText(url);
    setShareCooldown(true);
    setTimeout(() => setShareCooldown(false), 2000);
  };

  const handleRegenerate = () => {
    localStorage.removeItem("ventureGates_ventures");
    localStorage.removeItem("ventureGates_result");
    router.push("/discover/processing-ventures");
  };

  const generateMoreVentures = async () => {
    setGeneratingMore(true);
    try {
      await new Promise(r => setTimeout(r, 1500));
      alert("This feature is coming soon! For now, try regenerating with different parameters.");
    } finally { setGeneratingMore(false); }
  };

  const handleChatSubmit = async () => {
    if (!chatInput.trim() || !data) return;
    const userMessage: ChatMessage = { role: 'user', content: chatInput, timestamp: new Date() };
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput("");
    setIsChatLoading(true);

    await new Promise(r => setTimeout(r, 1500));
    
    let response = "";
    const input = chatInput.toLowerCase();
    if (input.includes("ambitious") || input.includes("bigger")) {
      response = "I love the ambition! Based on your profile as a " + data.venture_dna.entrepreneur_type + ", here are ways to scale up:\n\n1. Target enterprise clients instead of SMB\n2. Add a platform/network component\n3. Consider venture-backed growth vs bootstrapped\n\nWould you like me to regenerate ventures with this lens?";
    } else if (input.includes("b2b") || input.includes("saas")) {
      response = "Great focus! B2B SaaS aligns well with your strengths. I'll prioritize recurring revenue models with clear ROI for business customers.";
    } else if (input.includes("risk") || input.includes("safe")) {
      response = "Smart approach. I'll focus on proven markets with existing demand, validated business models, and clear paths to profitability within 12 months.";
    } else {
      response = "Interesting direction! I can help you explore that. Based on your founder DNA, this could be a good fit. Would you like me to:\n\n• Adjust the current ventures\n• Generate new ones in this direction\n• Deep dive into a specific opportunity?";
    }
    
    setChatMessages(prev => [...prev, { role: 'assistant', content: response, timestamp: new Date() }]);
    setIsChatLoading(false);
  };

  if (isLoading || !data) {
    return (
      <div className="min-h-screen dot-pattern-bg flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
          <span className="text-neutral-600">Loading your ventures...</span>
        </div>
      </div>
    );
  }

  const { ventures } = data;

  return (
    <main className="min-h-screen dot-pattern-bg">
      {/* Fixed Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-xl border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Left: Back to DNA */}
          <Link 
            href="/discover/dna-results" 
            className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline text-sm font-medium">Back to DNA Results</span>
            <span className="sm:hidden text-sm font-medium">Back</span>
          </Link>

          {/* Center: Title */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center">
              <Target className="w-4 h-4 text-white" />
            </div>
            <h1 className="font-semibold text-lg text-neutral-900 hidden sm:block">Your Ventures</h1>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleShare}
              disabled={shareCooldown}
              className="text-neutral-600 hover:text-neutral-900"
            >
              <Share2 className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">{shareCooldown ? "Copied!" : "Share"}</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleRegenerate}
              className="text-neutral-600 hover:text-neutral-900"
            >
              <RefreshCw className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Regenerate</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Badge className="mb-4 bg-violet-100 text-violet-700 border-violet-200">
              <Sparkles className="w-3 h-3 mr-1" /> AI-Generated Opportunities
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 mb-3">
              Your Matched Ventures
            </h2>
            <p className="text-neutral-600 max-w-2xl mx-auto">
              Based on your founder DNA, we've identified {ventures.length} venture opportunities that align with your strengths and preferences.
            </p>
          </motion.div>

          {/* Ventures Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {ventures.map((venture, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: index * 0.1 }}
              >
                <Card className="group bg-white border-neutral-200 hover:border-neutral-300 transition-all duration-300 hover:shadow-lg overflow-hidden h-full flex flex-col">
                  {/* Top accent bar */}
                  <div className="h-1.5 bg-gradient-to-r from-cyan-500 via-violet-500 to-amber-500" />
                  <CardContent className="p-6 flex flex-col flex-1">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <Badge 
                        variant="outline"
                        className="bg-neutral-50 text-neutral-700 border-neutral-200"
                      >
                        {venture.category}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm font-bold text-neutral-900">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        {venture.total_score?.toFixed(1)}
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-neutral-900 mb-2 group-hover:text-cyan-600 transition-colors">
                      {venture.name}
                    </h3>
                    <p className="text-neutral-600 mb-4 flex-1 text-sm leading-relaxed">
                      {venture.tagline}
                    </p>

                    {/* Progress */}
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-neutral-500">Founder-Market Fit</span>
                        <span className="font-bold text-neutral-900">{venture.founder_market_fit_score}%</span>
                      </div>
                      <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                        <motion.div 
                          className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-violet-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${venture.founder_market_fit_score}%` }}
                          transition={{ duration: 0.8, delay: index * 0.1 }}
                        />
                      </div>
                    </div>

                    {/* CTA */}
                    <Link href={`/venture/${index}`} className="mt-auto">
                      <Button className="w-full bg-neutral-900 hover:bg-neutral-800 text-white group/btn">
                        Explore Venture
                        <ChevronRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Generate More */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Button 
              onClick={generateMoreVentures} 
              disabled={generatingMore} 
              variant="outline" 
              className="border-neutral-300 text-neutral-700 hover:bg-neutral-100 px-6 py-4"
            >
              {generatingMore ? (
                <><Loader2 className="mr-2 w-4 h-4 animate-spin" />Generating...</>
              ) : (
                <><Plus className="mr-2 w-4 h-4" />Generate More Ventures</>
              )}
            </Button>
          </motion.div>

          {/* Venture Coach Chat */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="max-w-3xl mx-auto"
          >
            <Card className="bg-white border-neutral-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-neutral-900">Venture Coach</h3>
                    <p className="text-sm text-neutral-500">Adjust your ventures through conversation</p>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="bg-neutral-50 rounded-xl p-4 mb-4 h-64 overflow-y-auto space-y-3 border border-neutral-100">
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-xl px-4 py-2 whitespace-pre-line text-sm ${
                        msg.role === 'user' 
                          ? 'bg-neutral-900 text-white' 
                          : 'bg-white border border-neutral-200 text-neutral-800'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {isChatLoading && (
                    <div className="flex justify-start">
                      <div className="bg-white border border-neutral-200 rounded-lg px-4 py-2">
                        <Loader2 className="w-4 h-4 animate-spin text-neutral-400" />
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Input */}
                <div className="flex gap-2">
                  <Textarea 
                    value={chatInput} 
                    onChange={(e) => setChatInput(e.target.value)} 
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleChatSubmit())}
                    placeholder="I want more ambitious ventures..."
                    className="flex-1 resize-none border-neutral-200 focus:border-neutral-400"
                    rows={2}
                  />
                  <Button 
                    onClick={handleChatSubmit} 
                    disabled={isChatLoading || !chatInput.trim()} 
                    className="bg-neutral-900 hover:bg-neutral-800 text-white px-4"
                  >
                    {isChatLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ChevronDown className="w-4 h-4 rotate-[-90deg]" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </main>
  );
}

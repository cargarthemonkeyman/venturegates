"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Brain, XCircle, ArrowRight, Target, Share2, Sparkles, Crown,
  Shield, Rocket, CheckCircle2, ChevronRight, Download, Star,
  AlertOctagon, Gauge, MessageSquare, Plus,
  Lightbulb, Compass, Heart, Zap as ZapIcon,
  Target as TargetIcon, BarChart3, ChevronDown,
  Loader2, AlertTriangle
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Gate { name: string; description: string; icon?: string; }
interface VentureDNA { entrepreneur_type: string; type_description: string; non_negotiables: Gate[]; accelerators: Gate[]; red_flags: Gate[]; enneagram_type?: string; }
interface Venture { name: string; tagline: string; category: string; description: string; total_score: number; founder_market_fit_score: number; }
interface ResultData { venture_dna: VentureDNA; ventures: Venture[]; share_slug?: string; answers?: Record<string, any>; }
interface ChatMessage { role: 'user' | 'assistant'; content: string; timestamp: Date; }

const ENNEAGRAM_DATA: Record<string, { name: string; traits: string[]; founder_style: string }> = {
  "1": { name: "The Reformer", traits: ["Principled", "Purposeful", "Self-controlled", "Perfectionist"], founder_style: "Builds mission-driven companies with high ethical standards" },
  "2": { name: "The Helper", traits: ["Generous", "Empathetic", "People-focused"], founder_style: "Excels at customer-centric products and community building" },
  "3": { name: "The Achiever", traits: ["Adaptable", "Ambitious", "Driven", "Results-oriented"], founder_style: "Natural at scaling and building high-growth startups" },
  "4": { name: "The Individualist", traits: ["Expressive", "Creative", "Unique", "Passionate"], founder_style: "Builds unique, design-forward products that stand out" },
  "5": { name: "The Investigator", traits: ["Perceptive", "Innovative", "Analytical", "Deep-thinker"], founder_style: "Excels at deep-tech and research-heavy ventures" },
  "6": { name: "The Loyalist", traits: ["Engaging", "Responsible", "Committed", "Team-player"], founder_style: "Builds stable, trustworthy companies with strong teams" },
  "7": { name: "The Enthusiast", traits: ["Spontaneous", "Versatile", "Optimistic", "Energetic"], founder_style: "Great at launching fast and exploring multiple opportunities" },
  "8": { name: "The Challenger", traits: ["Self-confident", "Decisive", "Willful", "Powerful"], founder_style: "Natural disruptor, builds industry-changing companies" },
  "9": { name: "The Peacemaker", traits: ["Receptive", "Reassuring", "Agreeable", "Supportive"], founder_style: "Builds harmonious teams and user-friendly products" }
};

export default function ResultsPage() {
  const router = useRouter();
  const [data, setData] = useState<ResultData | null>(null);
  const [activeTab, setActiveTab] = useState<"dna" | "ventures">("dna");
  const [isLoading, setIsLoading] = useState(true);
  const [generatingMore, setGeneratingMore] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: "Hi! I'm your Venture Coach. Try asking:\n\n• \"I want more ambitious ventures\"\n• \"Focus on B2B SaaS\"\n• \"Show me lower risk options\"\n• \"What about climate tech?\"", timestamp: new Date() }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadData = () => {
      try {
        const resultJson = localStorage.getItem("ventureGates_result");
        if (!resultJson) { router.push("/discover"); return; }
        const parsedData = JSON.parse(resultJson);
        if (!parsedData.venture_dna || !parsedData.ventures) { router.push("/discover"); return; }
        if (!parsedData.venture_dna.enneagram_type) {
          parsedData.venture_dna.enneagram_type = inferEnneagram(parsedData.venture_dna.entrepreneur_type);
        }
        setData(parsedData);
      } catch (error) { router.push("/discover"); }
      finally { setIsLoading(false); }
    };
    loadData();
  }, [router]);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatMessages]);

  const inferEnneagram = (type: string): string => {
    const typeLower = type.toLowerCase();
    if (typeLower.includes("visionary")) return "7";
    if (typeLower.includes("hacker")) return "5";
    if (typeLower.includes("hustler")) return "3";
    if (typeLower.includes("artist")) return "4";
    if (typeLower.includes("operator")) return "1";
    return "3";
  };

  const handleShare = () => {
    const url = data?.share_slug ? `https://venturegates.vercel.app/profile/${data.share_slug}` : window.location.href;
    navigator.clipboard.writeText(url);
    alert("Link copied!");
  };

  const generateMoreVentures = async () => {
    if (!data) return;
    setGeneratingMore(true);
    try {
      await new Promise(r => setTimeout(r, 2000));
      alert("Generate more feature requires backend API. For now, try adjusting your answers in the wizard!");
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
      response = "Great focus! B2B SaaS aligns well with your strengths in " + (data.venture_dna.accelerators?.[0]?.name || "execution") + ". I'll prioritize recurring revenue models with clear ROI for business customers.";
    } else if (input.includes("risk") || input.includes("safe")) {
      response = "Smart approach. I'll focus on proven markets with existing demand, validated business models, and clear paths to profitability within 12 months.";
    } else {
      response = "Interesting direction! I can help you explore that. Based on your founder DNA, this could be a good fit. Would you like me to:\n\n• Adjust the current ventures\n• Generate new ones in this direction\n• Deep dive into a specific opportunity?";
    }
    
    setChatMessages(prev => [...prev, { role: 'assistant', content: response, timestamp: new Date() }]);
    setIsChatLoading(false);
  };

  if (isLoading || !data) return null;
  const { venture_dna, ventures } = data;
  const enneagramInfo = venture_dna.enneagram_type ? ENNEAGRAM_DATA[venture_dna.enneagram_type] : null;

  return (
    <main className="min-h-screen dot-pattern-bg print:bg-white">
      <style jsx global>{`@media print { .dot-pattern-bg { background: white !important; } .no-print { display: none !important; } }`}</style>

      {/* Hero */}
      <div className="bg-gradient-to-b from-neutral-900 via-neutral-800 to-neutral-900 text-white py-16 px-4 no-print">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-6">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-medium">Your Personalized Analysis</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Venture DNA</span>
            </h1>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto mb-8">
              Based on your profile, we've identified your unique founder archetype and the ventures that match your DNA
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button onClick={handleShare} variant="outline" className="border-white/30 text-white hover:bg-white/10 bg-transparent">
                <Share2 className="mr-2 w-4 h-4" />Share Results
              </Button>
              <Button onClick={() => window.print()} variant="outline" className="border-white/30 text-white hover:bg-white/10 bg-transparent">
                <Download className="mr-2 w-4 h-4" />Download Report
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "dna" | "ventures")} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12 bg-neutral-200 p-1 no-print">
            <TabsTrigger value="dna" className="data-[state=active]:bg-neutral-900 data-[state=active]:text-white"><Brain className="mr-2 w-4 h-4" />Your DNA</TabsTrigger>
            <TabsTrigger value="ventures" className="data-[state=active]:bg-neutral-900 data-[state=active]:text-white"><Rocket className="mr-2 w-4 h-4" />Your Ventures ({ventures.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="dna" className="space-y-8">
            {/* Founder Type Hero */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card className="bg-gradient-to-br from-neutral-900 to-neutral-800 border-0 overflow-hidden">
                <CardContent className="p-8 md:p-12">
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center flex-shrink-0">
                      <Crown className="w-16 h-16 text-white" />
                    </div>
                    <div className="text-center md:text-left">
                      <Badge className="bg-white/10 text-white border-0 mb-4">Founder Archetype</Badge>
                      <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">{venture_dna.entrepreneur_type}</h2>
                      <p className="text-lg text-neutral-400 leading-relaxed">{venture_dna.type_description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Enneagram Section */}
            {enneagramInfo && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Card className="bg-white border-neutral-200">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-2xl">🔮</div>
                      <div>
                        <h3 className="text-xl font-bold text-neutral-900">Enneagram Type {venture_dna.enneagram_type}: {enneagramInfo.name}</h3>
                        <p className="text-sm text-neutral-500">Core personality pattern</p>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-neutral-900 mb-3">Key Traits</h4>
                        <div className="flex flex-wrap gap-2">
                          {enneagramInfo.traits.map((trait, i) => <Badge key={i} className="bg-purple-50 text-purple-700 border-0">{trait}</Badge>)}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-neutral-900 mb-3">Founder Style</h4>
                        <p className="text-neutral-600">{enneagramInfo.founder_style}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Core Analysis Grid */}
            <div className="grid md:grid-cols-3 gap-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <Card className="bg-white border-neutral-200 h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center"><Gauge className="w-6 h-6 text-green-600" /></div>
                      <h3 className="text-lg font-bold text-neutral-900">Where You Excel</h3>
                    </div>
                    <ul className="space-y-3">
                      {venture_dna.accelerators?.map((acc, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <div><div className="font-medium text-neutral-900">{acc.name}</div><div className="text-sm text-neutral-500">{acc.description}</div></div>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Card className="bg-white border-neutral-200 h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center"><Shield className="w-6 h-6 text-amber-600" /></div>
                      <h3 className="text-lg font-bold text-neutral-900">Your Non-Negotiables</h3>
                    </div>
                    <ul className="space-y-3">
                      {venture_dna.non_negotiables?.map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <Target className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                          <div><div className="font-medium text-neutral-900">{item.name}</div><div className="text-sm text-neutral-500">{item.description}</div></div>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                <Card className="bg-white border-neutral-200 h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center"><AlertOctagon className="w-6 h-6 text-red-600" /></div>
                      <h3 className="text-lg font-bold text-neutral-900">What to Avoid</h3>
                    </div>
                    <ul className="space-y-3">
                      {venture_dna.red_flags?.map((flag, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                          <div><div className="font-medium text-neutral-900">{flag.name}</div><div className="text-sm text-neutral-500">{flag.description}</div></div>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Extended Profile */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <Card className="bg-white border-neutral-200">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-neutral-900 mb-6 flex items-center gap-2"><Lightbulb className="w-6 h-6 text-amber-500" />Your Founder Profile</h3>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <div className="flex items-center gap-2 mb-3"><Compass className="w-5 h-5 text-blue-600" /><h4 className="font-bold text-neutral-900">Work Style</h4></div>
                      <p className="text-neutral-600 leading-relaxed">You thrive in environments where {venture_dna.accelerators?.[0]?.description.toLowerCase() || 'you can apply your strengths'}. Your natural rhythm favors deep work sessions followed by collaborative bursts.</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-3"><TargetIcon className="w-5 h-5 text-green-600" /><h4 className="font-bold text-neutral-900">Decision Making</h4></div>
                      <p className="text-neutral-600 leading-relaxed">You make decisions based on a balance of data and gut feeling. While you value thorough analysis, you're not paralyzed by it.</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-3"><Heart className="w-5 h-5 text-red-500" /><h4 className="font-bold text-neutral-900">Under Stress</h4></div>
                      <p className="text-neutral-600 leading-relaxed">When pressure mounts, you tend to {venture_dna.red_flags?.[0]?.name.toLowerCase() || 'double down'}. Watch for signs of burnout and step back when needed.</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-3"><ZapIcon className="w-5 h-5 text-yellow-500" /><h4 className="font-bold text-neutral-900">Ideal Environment</h4></div>
                      <p className="text-neutral-600 leading-relaxed">You perform best in {venture_dna.non_negotiables?.[0]?.description.toLowerCase() || 'environments that align with your values'}.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Personal Scorecard */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
              <Card className="bg-gradient-to-br from-neutral-900 to-neutral-800 border-0 text-white">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-2"><BarChart3 className="w-6 h-6 text-amber-400" />Your Personal Scorecard</h3>
                  <p className="text-neutral-400 mb-6">Use this when evaluating opportunities. High scores = better fit.</p>
                  <div className="space-y-3">
                    {venture_dna.accelerators?.map((acc, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                        <div className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-green-400" /><span>{acc.name}</span></div>
                        <Badge className="bg-green-500/20 text-green-300 border-0">High Priority</Badge>
                      </div>
                    ))}
                    {venture_dna.non_negotiables?.map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                        <div className="flex items-center gap-3"><AlertTriangle className="w-5 h-5 text-amber-400" /><span>Must have: {item.name}</span></div>
                        <Badge className="bg-amber-500/20 text-amber-300 border-0">Required</Badge>
                      </div>
                    ))}
                    {venture_dna.red_flags?.map((flag, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                        <div className="flex items-center gap-3"><XCircle className="w-5 h-5 text-red-400" /><span>Avoid: {flag.name}</span></div>
                        <Badge className="bg-red-500/20 text-red-300 border-0">Dealbreaker</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* CTA */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="text-center no-print">
              <Button onClick={() => setActiveTab("ventures")} className="bg-neutral-900 hover:bg-neutral-800 text-white text-lg px-8 py-6">
                See Your Matched Ventures<ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>
          </TabsContent>

          <TabsContent value="ventures" className="space-y-8">
            {/* Venture Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              {ventures.map((venture, index) => (
                <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                  <Card className="group bg-white border-neutral-200 hover:border-neutral-400 transition-all duration-300 hover:shadow-xl overflow-hidden h-full flex flex-col">
                    <div className="h-2 bg-gradient-to-r from-neutral-900 via-neutral-700 to-neutral-900" />
                    <CardContent className="p-6 flex flex-col flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <Badge className="bg-neutral-100 text-neutral-700 border-0">{venture.category}</Badge>
                        <div className="flex items-center gap-1 text-sm font-bold text-neutral-900">
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                          {venture.total_score?.toFixed(1)}
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-neutral-900 mb-2 group-hover:text-neutral-700 transition-colors">{venture.name}</h3>
                      <p className="text-neutral-600 mb-4 flex-1">{venture.tagline}</p>
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-neutral-500">Founder-Market Fit</span>
                          <span className="font-bold text-neutral-900">{venture.founder_market_fit_score}%</span>
                        </div>
                        <Progress value={venture.founder_market_fit_score} className="h-2" />
                      </div>
                      <Link href={`/venture/${index}`} className="mt-auto no-print">
                        <Button className="w-full bg-neutral-900 hover:bg-neutral-800 text-white">
                          Explore Venture<ChevronRight className="ml-2 w-4 h-4" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Generate More */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-center no-print">
              <Button onClick={generateMoreVentures} disabled={generatingMore} variant="outline" className="border-neutral-300 text-neutral-700 hover:bg-neutral-100 px-6 py-4">
                {generatingMore ? <><Loader2 className="mr-2 w-4 h-4 animate-spin" />Generating...</> : <><Plus className="mr-2 w-4 h-4" />Generate More Ventures</>}
              </Button>
            </motion.div>

            {/* Chat */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="no-print">
              <Card className="bg-white border-neutral-200">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-lg">🎯</div>
                    <div>
                      <h3 className="font-bold text-neutral-900">Venture Coach</h3>
                      <p className="text-sm text-neutral-500">Adjust your ventures through conversation</p>
                    </div>
                  </div>

                  <div className="bg-neutral-50 rounded-lg p-4 mb-4 h-64 overflow-y-auto space-y-3">
                    {chatMessages.map((msg, i) => (
                      <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-lg px-4 py-2 whitespace-pre-line ${msg.role === 'user' ? 'bg-neutral-900 text-white' : 'bg-white border border-neutral-200 text-neutral-800'}`}>
                          <p className="text-sm">{msg.content}</p>
                        </div>
                      </div>
                    ))}
                    {isChatLoading && <div className="flex justify-start"><div className="bg-white border border-neutral-200 rounded-lg px-4 py-2"><Loader2 className="w-4 h-4 animate-spin" /></div></div>}
                    <div ref={chatEndRef} />
                  </div>

                  <div className="flex gap-2">
                    <Textarea 
                      value={chatInput} 
                      onChange={(e) => setChatInput(e.target.value)} 
                      onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleChatSubmit())}
                      placeholder="I want more ambitious ventures..."
                      className="flex-1 resize-none"
                      rows={2}
                    />
                    <Button onClick={handleChatSubmit} disabled={isChatLoading || !chatInput.trim()} className="bg-neutral-900 hover:bg-neutral-800 text-white">
                      {isChatLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ChevronDown className="w-4 h-4 rotate-[-90deg]" />}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}

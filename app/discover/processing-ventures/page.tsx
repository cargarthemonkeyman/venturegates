"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Target,
  Sparkles,
  Lightbulb,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ArrowRight,
  Loader2,
  Brain,
  Zap,
} from "lucide-react";

const DNA_KEY = "ventureGates_dna";
const VENTURES_KEY = "ventureGates_ventures";
const RESULT_KEY = "ventureGates_result";
const ANSWERS_KEY = "ventureGates_answers";

const steps = [
  { icon: Brain, text: "Analyzing your DNA...", description: "Loading profile data", color: "#8B5CF6" },
  { icon: Lightbulb, text: "Crafting venture #1...", description: "Generating first opportunity", color: "#06B6D4" },
  { icon: Lightbulb, text: "Crafting venture #2...", description: "Generating second opportunity", color: "#06B6D4" },
  { icon: Lightbulb, text: "Crafting venture #3...", description: "Generating third opportunity", color: "#06B6D4" },
  { icon: Target, text: "Evaluating fit...", description: "Calculating compatibility scores", color: "#F59E0B" },
  { icon: Sparkles, text: "Finalizing...", description: "Preparing your ventures", color: "#10B981" },
];

export default function ProcessingVenturesPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [ventures, setVentures] = useState<any[]>([]);
  const [isRetrying, setIsRetrying] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [failedIndices, setFailedIndices] = useState<number[]>([]);

  const generateVenture = useCallback(async (
    answers: any,
    dna: any,
    index: number
  ): Promise<any> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 45000);

    try {
      const response = await fetch("/api/generate-ventures", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          answers, 
          venture_dna: dna, 
          ventureIndex: index 
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      return response.json();
    } catch (err) {
      clearTimeout(timeoutId);
      throw err;
    }
  }, []);

  const runGeneration = useCallback(async () => {
    try {
      setIsRetrying(false);
      setError(null);
      setFailedIndices([]);
      
      const dnaJson = localStorage.getItem(DNA_KEY);
      const answersJson = localStorage.getItem(ANSWERS_KEY);
      
      if (!dnaJson || !answersJson) {
        router.push("/discover");
        return;
      }

      const rawDna = JSON.parse(dnaJson);
      const dna = rawDna.founder_dna || rawDna.venture_dna || rawDna;
      const answers = JSON.parse(answersJson);

      const savedVentures = JSON.parse(localStorage.getItem(VENTURES_KEY) || "[]");
      let newVentures = [...savedVentures];
      let startIndex = savedVentures.length;
      let newFailedIndices: number[] = [];

      for (let i = startIndex; i < 3; i++) {
        setCurrentStep(i + 1);
        setProgress(((i + 1) / 6) * 100);
        
        try {
          let venture = null;
          let attempts = 0;
          
          while (!venture && attempts < 2) {
            try {
              venture = await generateVenture(answers, dna, i);
            } catch (err) {
              attempts++;
              if (attempts >= 2) throw err;
              await new Promise(r => setTimeout(r, 2000));
            }
          }
          
          if (venture) {
            newVentures.push(venture);
            setVentures([...newVentures]);
            localStorage.setItem(VENTURES_KEY, JSON.stringify(newVentures));
          }
        } catch (err) {
          console.error(`Error generating venture ${i + 1}:`, err);
          newFailedIndices.push(i);
          setFailedIndices([...newFailedIndices]);
          
          newVentures.push({
            id: `v${i + 1}`,
            name: `Venture ${i + 1}`,
            error: true,
            description: "Failed to generate. You can retry from the results page."
          });
        }
      }

      setCurrentStep(5);
      setProgress(100);
      
      // Guardar en el formato que results espera
      const resultData = {
        venture_dna: {
          entrepreneur_type: dna?.archetype?.name || "Founder",
          type_description: dna?.archetype?.description || "",
          non_negotiables: dna?.the_shadow?.cognitive_biases?.map((b: any) => ({ 
            name: b.bias, 
            description: b.mitigation 
          })) || [],
          accelerators: dna?.the_edge?.superpowers?.map((s: any) => ({ 
            name: s.name, 
            description: s.description 
          })) || [],
          red_flags: dna?.the_shadow?.blind_spots?.map((s: any) => ({ 
            name: "Watch out", 
            description: s 
          })) || [],
          enneagram_type: answers?.eneagram || ""
        },
        ventures: newVentures.filter(v => !v.error),
        answers: answers
      };
      localStorage.setItem(RESULT_KEY, JSON.stringify(resultData));
      
      setTimeout(() => {
        setCompleted(true);
      }, 500);
      
    } catch (err) {
      console.error("Generation error:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  }, [generateVenture, router]);

  useEffect(() => {
    runGeneration();
  }, [runGeneration]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 dot-pattern-bg">
        <Card className="max-w-md w-full bg-white border-neutral-200 shadow-sm">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-rose-500" />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-neutral-900">Generation Paused</h2>
            <p className="mb-6 text-neutral-600">{error}</p>
            <div className="flex gap-3 justify-center">
              <Button 
                variant="outline" 
                onClick={() => router.push("/discover/dna-results")}
                className="border-neutral-300 text-neutral-700 hover:bg-neutral-100"
              >
                Back to DNA
              </Button>
              <Button 
                onClick={() => { setError(null); setIsRetrying(true); runGeneration(); }}
                className="bg-neutral-900 text-white hover:bg-neutral-800"
              >
                <RefreshCw className="w-4 h-4 mr-2" /> Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (completed) {
    const hasErrors = ventures.some(v => v.error);
    const successCount = ventures.filter(v => !v.error).length;
    
    return (
      <div className="min-h-screen flex items-center justify-center px-4 dot-pattern-bg">
        <Card className="max-w-md w-full bg-white border-neutral-200 shadow-sm">
          <CardContent className="p-8 text-center">
            <motion.div 
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ backgroundColor: hasErrors ? "#FEF3C7" : "#D1FAE5" }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
            >
              {hasErrors ? (
                <AlertCircle className="w-8 h-8 text-amber-500" />
              ) : (
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              )}
            </motion.div>
            <h2 className="text-2xl font-bold mb-2 text-neutral-900">
              {hasErrors ? "Partially Ready" : "All Set!"}
            </h2>
            <p className="mb-6 text-neutral-600">
              {successCount} venture{successCount !== 1 ? 's' : ''} generated
              {hasErrors && ` (${failedIndices.length} failed)`}
            </p>
            <Button 
              onClick={() => router.push("/discover/results")}
              className="bg-neutral-900 text-white hover:bg-neutral-800"
            >
              View Ventures <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const CurrentIcon = steps[currentStep]?.icon || Sparkles;
  const currentStepData = steps[currentStep];
  const currentColor = currentStepData?.color || "#8B5CF6";

  return (
    <div className="min-h-screen flex items-center justify-center p-4 dot-pattern-bg">
      <div className="max-w-md w-full">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Badge className="mb-4 bg-cyan-100 text-cyan-700 border-cyan-200">
            <Zap className="w-3 h-3 mr-1" /> AI Generation
          </Badge>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Generating Your Ventures</h1>
          <p className="text-neutral-600">Creating personalized opportunities based on your founder DNA</p>
        </motion.div>

        <Card className="bg-white border-neutral-200 shadow-sm">
          <CardContent className="p-8">
            {/* Progress */}
            <div className="mb-8">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-neutral-500">Progress</span>
                <span className="font-medium text-neutral-900">{Math.round(progress)}%</span>
              </div>
              <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: currentColor }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Current Step */}
            <div className="text-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col items-center"
                >
                  <motion.div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                    style={{ 
                      backgroundColor: `${currentColor}15`,
                      border: `2px solid ${currentColor}30`
                    }}
                    animate={{ 
                      scale: [1, 1.05, 1],
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <CurrentIcon className="w-8 h-8" style={{ color: currentColor }} />
                  </motion.div>
                  <h2 className="text-lg font-semibold mb-1 text-neutral-900">
                    {currentStepData?.text || "Finalizing..."}
                  </h2>
                  <p className="text-sm text-neutral-500">
                    {currentStepData?.description || "Processing"}
                  </p>
                  
                  {/* Show venture count if in venture generation phase */}
                  {currentStep >= 1 && currentStep <= 3 && ventures.length > 0 && (
                    <motion.p 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs mt-3 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700"
                    >
                      <CheckCircle2 className="w-3 h-3 inline mr-1" />
                      {ventures.length} venture{ventures.length !== 1 ? 's' : ''} ready
                    </motion.p>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Step indicators */}
            <div className="flex justify-center gap-2 mt-8">
              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: i <= currentStep ? step.color : "#E5E5E5",
                  }}
                  animate={i === currentStep ? { scale: [1, 1.3, 1] } : {}}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              ))}
            </div>
            
            {/* Timeout hint */}
            {progress > 60 && progress < 100 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-xs mt-6 text-neutral-400"
              >
                Creating detailed venture plans with market analysis...
              </motion.p>
            )}
          </CardContent>
        </Card>

        <motion.p 
          className="text-center mt-6 text-sm text-neutral-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <span className="text-cyan-600 font-medium">Tip:</span> Each venture includes market analysis,
          business model, and execution plan
        </motion.p>
      </div>
    </div>
  );
}

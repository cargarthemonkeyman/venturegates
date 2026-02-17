"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
} from "lucide-react";

const DNA_KEY = "ventureGates_dna";
const VENTURES_KEY = "ventureGates_ventures";
const ANSWERS_KEY = "ventureGates_answers";

const COLORS = {
  bg: "#0A0A0A",
  card: "#111111",
  border: "#262626",
  text: "#FFFFFF",
  textMuted: "#A3A3A3",
  textDim: "#737373",
  accent: "#4F46E5",
  danger: "#DC2626",
  success: "#16A34A",
  warning: "#F59E0B",
};

const steps = [
  { icon: Target, text: "Analyzing your DNA...", description: "Loading profile data" },
  { icon: Lightbulb, text: "Crafting venture #1...", description: "Generating first opportunity" },
  { icon: Lightbulb, text: "Crafting venture #2...", description: "Generating second opportunity" },
  { icon: Lightbulb, text: "Crafting venture #3...", description: "Generating third opportunity" },
  { icon: TrendingUp, text: "Evaluating fit...", description: "Calculating compatibility scores" },
  { icon: Sparkles, text: "Finalizing...", description: "Preparing results" },
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
    const timeoutId = setTimeout(() => controller.abort(), 45000); // 45s timeout

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

      // Generate ventures sequentially but with individual error handling
      for (let i = startIndex; i < 3; i++) {
        setCurrentStep(i + 1);
        setProgress(((i + 1) / 6) * 100);
        
        try {
          // Try up to 2 times per venture
          let venture = null;
          let attempts = 0;
          
          while (!venture && attempts < 2) {
            try {
              venture = await generateVenture(answers, dna, i);
            } catch (err) {
              attempts++;
              if (attempts >= 2) throw err;
              // Wait before retry
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
          
          // Add placeholder with error flag
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
      
      // Small delay for visual completion
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
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: COLORS.bg }}>
        <div className="text-center max-w-md">
          <AlertCircle className="w-16 h-16 mx-auto mb-4" style={{ color: COLORS.danger }} />
          <h2 className="text-2xl font-bold mb-2" style={{ color: COLORS.text }}>Generation Paused</h2>
          <p className="mb-6" style={{ color: COLORS.textMuted }}>{error}</p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => router.push("/discover/dna-results")} style={{ borderColor: COLORS.border, color: COLORS.text }}>
              Back to DNA
            </Button>
            <Button onClick={() => { setError(null); setIsRetrying(true); runGeneration(); }} style={{ backgroundColor: COLORS.accent }}>
              <RefreshCw className="w-4 h-4 mr-2" /> Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (completed) {
    const hasErrors = ventures.some(v => v.error);
    const successCount = ventures.filter(v => !v.error).length;
    
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: COLORS.bg }}>
        <Card className="max-w-md w-full" style={{ backgroundColor: COLORS.card, borderColor: COLORS.border }}>
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: hasErrors ? `${COLORS.warning}20` : `${COLORS.success}20` }}>
              {hasErrors ? (
                <AlertCircle className="w-8 h-8" style={{ color: COLORS.warning }} />
              ) : (
                <CheckCircle2 className="w-8 h-8" style={{ color: COLORS.success }} />
              )}
            </div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: COLORS.text }}>
              {hasErrors ? "Partially Ready" : "Ready"}
            </h2>
            <p className="mb-6" style={{ color: COLORS.textMuted }}>
              {successCount} venture{successCount !== 1 ? 's' : ''} generated
              {hasErrors && ` (${failedIndices.length} failed)`}
            </p>
            <Button onClick={() => router.push("/discover/results")} style={{ backgroundColor: COLORS.accent }}>
              View Ventures <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const CurrentIcon = steps[currentStep]?.icon || Sparkles;
  const currentStepData = steps[currentStep];

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: COLORS.bg }}>
      <div className="max-w-md w-full">
        <Card style={{ backgroundColor: COLORS.card, borderColor: COLORS.border }}>
          <CardContent className="p-8">
            {/* Progress */}
            <div className="mb-8">
              <div className="flex justify-between text-xs mb-2" style={{ color: COLORS.textDim }}>
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: COLORS.border }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: COLORS.accent }}
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
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: COLORS.border }}>
                    <CurrentIcon className="w-6 h-6" style={{ color: COLORS.accent }} />
                  </div>
                  <h2 className="text-lg font-semibold mb-1" style={{ color: COLORS.text }}>
                    {currentStepData?.text || "Finalizing..."}
                  </h2>
                  <p className="text-sm" style={{ color: COLORS.textMuted }}>
                    {currentStepData?.description || "Processing"}
                  </p>
                  
                  {/* Show venture count if in venture generation phase */}
                  {currentStep >= 1 && currentStep <= 3 && ventures.length > 0 && (
                    <p className="text-xs mt-3" style={{ color: COLORS.success }}>
                      ✓ {ventures.length} venture{ventures.length !== 1 ? 's' : ''} ready
                    </p>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Step indicators */}
            <div className="flex justify-center gap-2 mt-8">
              {steps.map((_, i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: i <= currentStep ? COLORS.accent : COLORS.border,
                  }}
                  animate={i === currentStep ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              ))}
            </div>
            
            {/* Timeout hint */}
            {progress > 60 && progress < 100 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-xs mt-6"
                style={{ color: COLORS.textDim }}
              >
                Creating detailed venture plans...
              </motion.p>
            )}
          </CardContent>
        </Card>

        <p className="text-center mt-6 text-sm" style={{ color: COLORS.textDim }}>
          <span style={{ color: COLORS.accent }}>Tip:</span> Each venture includes market analysis,
          business model, and execution plan
        </p>
      </div>
    </div>
  );
}

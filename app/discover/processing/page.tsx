"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const DNA_KEY = "ventureGates_dna";
const ANSWERS_KEY = "ventureGates_answers";

const loadingSteps = [
  "Analyzing decision patterns...",
  "Mapping cognitive functions...",
  "Identifying superpowers...",
  "Detecting blind spots...",
  "Calculating venture fit...",
  "Synthesizing profile...",
];

export default function ProcessingPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const stepIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const clearIntervals = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    if (stepIntervalRef.current) {
      clearInterval(stepIntervalRef.current);
      stepIntervalRef.current = null;
    }
  }, []);

  const startAnimations = useCallback(() => {
    progressIntervalRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return prev;
        const increment = Math.max(0.3, (95 - prev) / 20);
        return Math.min(95, prev + increment);
      });
    }, 600);

    stepIntervalRef.current = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % loadingSteps.length);
    }, 2500);
  }, []);

  const generateDNA = useCallback(async () => {
    if (hasStarted) return;
    setHasStarted(true);
    startAnimations();

    try {
      // Check for existing DNA first
      const existingDNA = localStorage.getItem(DNA_KEY);
      if (existingDNA) {
        const parsed = JSON.parse(existingDNA);
        if (parsed.founder_dna || parsed.venture_dna) {
          clearIntervals();
          router.push("/discover/dna-results");
          return;
        }
      }

      const answersJson = localStorage.getItem(ANSWERS_KEY);
      if (!answersJson) {
        clearIntervals();
        router.push("/discover");
        return;
      }

      const answers = JSON.parse(answersJson);

      // Validate we have the required slider answers
      if (!answers.structure_chaos || !answers.risk_security || !answers.individual_tribal) {
        console.warn("Missing key personality dimensions");
      }

      const response = await fetch("/api/generate-venture-dna", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.founder_dna && !data.venture_dna) {
        throw new Error("Invalid response structure from server");
      }

      // Save DNA
      localStorage.setItem(DNA_KEY, JSON.stringify(data));
      
      clearIntervals();
      setProgress(100);
      
      setTimeout(() => {
        router.push("/discover/dna-results");
      }, 800);

    } catch (err) {
      clearIntervals();
      console.error("Generation error:", err);
      setError(err instanceof Error ? err.message : "Failed to generate profile");
    }
  }, [router, hasStarted, clearIntervals, startAnimations]);

  useEffect(() => {
    generateDNA();
    return () => clearIntervals();
  }, []);

  const handleRetry = () => {
    setError(null);
    setHasStarted(false);
    setProgress(0);
    generateDNA();
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 dot-pattern-bg">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold mb-2 text-neutral-900">Generation Failed</h2>
          <p className="mb-6 text-neutral-600">{error}</p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => router.push("/discover")}>
              Back
            </Button>
            <Button onClick={handleRetry}>
              <RefreshCw className="w-4 h-4 mr-2" /> Try Again
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 dot-pattern-bg">
      <div className="max-w-md w-full text-center">
        <div className="relative w-24 h-24 mx-auto mb-8">
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-neutral-300"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute top-0 left-1/2 w-2 h-2 -translate-x-1/2 rounded-full bg-neutral-800" />
          </motion.div>
          
          <motion.div
            className="absolute inset-3 rounded-full border-2 border-neutral-300"
            animate={{ rotate: -360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute bottom-0 left-1/2 w-2 h-2 -translate-x-1/2 rounded-full bg-neutral-500" />
          </motion.div>
          
          <div className="absolute inset-6 rounded-full flex items-center justify-center bg-white border-2 border-neutral-300">
            <Loader2 className="w-6 h-6 animate-spin text-neutral-800" />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6"
          >
            <h2 className="text-xl font-medium mb-2 text-neutral-900">
              {loadingSteps[currentStep]}
            </h2>
            <p className="text-sm text-neutral-500">
              This takes 20-40 seconds
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="relative h-2 rounded-full overflow-hidden bg-neutral-200">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full bg-neutral-800"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        
        <p className="text-xs mt-2 text-neutral-400">
          {Math.round(progress)}%
        </p>
      </div>
    </div>
  );
}

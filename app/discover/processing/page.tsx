"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Loader2,
  Brain,
  Filter,
  Sparkles,
  BarChart3,
  Search,
  Lightbulb,
  AlertCircle,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";

const steps = [
  { icon: Brain, text: "Analyzing your founder profile...", duration: 3000 },
  { icon: Filter, text: "Generating your personalized Gates...", duration: 4000 },
  { icon: Search, text: "Scanning market signals...", duration: 4000 },
  { icon: Sparkles, text: "Synthesizing market intelligence...", duration: 5000 },
  { icon: Lightbulb, text: "Evaluating founder-market fit...", duration: 4000 },
  { icon: BarChart3, text: "Building detailed scorecards...", duration: 4000 },
];

const TOTAL_ESTIMATED_TIME = 25000; // 25 seconds

export default function ProcessingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [attemptCount, setAttemptCount] = useState(0);

  // Track elapsed time
  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      setElapsedTime(Date.now() - startTime);
      setProgress(Math.min(95, ((Date.now() - startTime) / TOTAL_ESTIMATED_TIME) * 100));
    }, 100);
    return () => clearInterval(interval);
  }, [isRetrying]);

  const generateVentureDNA = useCallback(async () => {
    try {
      setAttemptCount(prev => prev + 1);
      
      // Get answers from localStorage
      const answersJson = localStorage.getItem("ventureGates_answers");
      if (!answersJson) {
        router.push("/discover");
        return;
      }

      const answers = JSON.parse(answersJson);

      // Animate through steps
      let stepIndex = 0;
      const runStepAnimation = () => {
        if (stepIndex < steps.length) {
          setCurrentStep(stepIndex);
          stepIndex++;
          setTimeout(runStepAnimation, steps[stepIndex - 1]?.duration || 3000);
        }
      };
      runStepAnimation();

      // Call API with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 35000); // 35 second timeout

      const response = await fetch("/api/generate-venture-dna", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const data = await response.json();

      // Validate response data thoroughly
      if (!data.venture_dna || !data.ventures || !Array.isArray(data.ventures)) {
        throw new Error("Invalid response structure from server");
      }

      if (data.ventures.length === 0) {
        throw new Error("No ventures generated");
      }

      // Validate each venture has required fields
      const requiredFields = ['name', 'tagline', 'description', 'total_score'];
      for (let i = 0; i < data.ventures.length; i++) {
        const venture = data.ventures[i];
        for (const field of requiredFields) {
          if (!venture[field]) {
            throw new Error(`Venture ${i + 1} is missing ${field}`);
          }
        }
      }

      // Store result
      localStorage.setItem("ventureGates_result", JSON.stringify(data));
      
      // Show completion
      setProgress(100);
      setCurrentStep(steps.length - 1);
      
      // Small delay for visual completion
      setTimeout(() => {
        router.push("/discover/results");
      }, 500);

    } catch (err) {
      console.error("Error generating DNA:", err);
      
      let errorMessage = "Something went wrong";
      if (err instanceof Error) {
        if (err.name === "AbortError") {
          errorMessage = "Request timed out. The AI is taking longer than expected.";
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
    }
  }, [router]);

  useEffect(() => {
    generateVentureDNA();
  }, [generateVentureDNA, isRetrying]);

  const handleRetry = () => {
    if (attemptCount >= 3) {
      // After 3 attempts, suggest starting over
      setError("Multiple attempts failed. Please try with different inputs.");
      return;
    }
    setError(null);
    setCurrentStep(0);
    setProgress(0);
    setElapsedTime(0);
    setIsRetrying(prev => !prev);
  };

  const handleStartOver = () => {
    localStorage.removeItem("ventureGates_answers");
    localStorage.removeItem("ventureGates_result");
    router.push("/discover");
  };

  if (error) {
    return (
      <main className="min-h-screen dot-pattern-bg flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">Generation Failed</h1>
          <p className="text-neutral-600 mb-2">{error}</p>
          <p className="text-sm text-neutral-400 mb-6">
            Attempt {attemptCount} of 3
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {attemptCount < 3 && (
              <Button
                onClick={handleRetry}
                className="bg-neutral-900 hover:bg-neutral-800 text-white"
              >
                <RefreshCw className="mr-2 w-4 h-4" />
                Try Again
              </Button>
            )}
            <Button
              onClick={handleStartOver}
              variant="outline"
              className="border-neutral-300 hover:bg-white"
            >
              <ArrowLeft className="mr-2 w-4 h-4" />
              Start Over
            </Button>
          </div>
        </div>
      </main>
    );
  }

  const estimatedSecondsLeft = Math.max(0, Math.ceil((TOTAL_ESTIMATED_TIME - elapsedTime) / 1000));

  return (
    <main className="min-h-screen dot-pattern-bg flex items-center justify-center px-4">
      <div className="text-center max-w-lg w-full">
        {/* Animated brain/logo */}
        <div className="relative w-28 h-28 mx-auto mb-8">
          <motion.div
            className="absolute inset-0 rounded-full bg-neutral-900"
            animate={{ scale: [1, 1.15, 1], opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <motion.div 
            className="absolute inset-2 rounded-full bg-neutral-800"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Brain className="w-12 h-12 text-white" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-neutral-900 mb-2">
          Building Your Venture DNA
        </h1>
        <p className="text-neutral-500 mb-6">
          Our AI is analyzing your profile and generating personalized ventures
        </p>

        {/* Progress bar */}
        <div className="mb-8">
          <Progress value={progress} className="h-2 mb-2" />
          <div className="flex justify-between text-sm text-neutral-400">
            <span>{Math.round(progress)}% complete</span>
            {estimatedSecondsLeft > 0 && (
              <span>~{estimatedSecondsLeft}s remaining</span>
            )}
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-3">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index <= currentStep;
            const isCurrent = index === currentStep;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{
                  opacity: isActive ? 1 : 0.4,
                  x: 0,
                  scale: isCurrent ? 1.02 : 1,
                }}
                transition={{ duration: 0.3 }}
                className={`flex items-center gap-3 p-4 rounded-xl transition-all ${
                  isCurrent ? "bg-white shadow-lg border border-neutral-100" : ""
                } ${!isActive ? "grayscale" : ""}`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                    isCurrent 
                      ? "bg-neutral-900 text-white" 
                      : isActive 
                        ? "bg-neutral-200 text-neutral-700"
                        : "bg-neutral-100 text-neutral-300"
                  }`}
                >
                  {isCurrent ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Icon className="w-5 h-5" />
                  )}
                </div>
                <span
                  className={`font-medium flex-1 text-left ${
                    isCurrent ? "text-neutral-900" : isActive ? "text-neutral-600" : "text-neutral-300"
                  }`}
                >
                  {step.text}
                </span>
                {isCurrent && (
                  <motion.div
                    className="w-2 h-2 rounded-full bg-green-500"
                    animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
                {isActive && !isCurrent && (
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                )}
              </motion.div>
            );
          })}
        </div>

        <p className="mt-8 text-xs text-neutral-400">
          This usually takes 20-30 seconds. Please don&apos;t close this window.
        </p>
      </div>
    </main>
  );
}

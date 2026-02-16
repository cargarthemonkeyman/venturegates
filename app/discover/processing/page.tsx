"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Brain,
  Filter,
  Sparkles,
  BarChart3,
  Search,
  Lightbulb,
} from "lucide-react";

const steps = [
  { icon: Brain, text: "Analyzing your founder profile..." },
  { icon: Filter, text: "Generating your personalized Gates..." },
  { icon: Search, text: "Scanning market signals..." },
  { icon: Sparkles, text: "Creating disruptive venture ideas..." },
  { icon: Lightbulb, text: "Evaluating founder-market fit..." },
  { icon: BarChart3, text: "Calculating scorecards..." },
];

export default function ProcessingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    const generateVentureDNA = async () => {
      try {
        // Get answers from localStorage
        const answersJson = localStorage.getItem("ventureGates_answers");
        if (!answersJson) {
          router.push("/discover");
          return;
        }

        const answers = JSON.parse(answersJson);

        // Animate through steps
        const stepInterval = setInterval(() => {
          setCurrentStep((prev) => {
            if (prev >= steps.length - 1) {
              clearInterval(stepInterval);
              return prev;
            }
            return prev + 1;
          });
        }, 1200);

        // Call API
        const response = await fetch("/api/generate-venture-dna", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers }),
        });

        clearInterval(stepInterval);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Server error: ${response.status}`);
        }

        const data = await response.json();

        // Validate response data
        if (!data.venture_dna || !data.ventures || !Array.isArray(data.ventures)) {
          throw new Error("Invalid response from server");
        }

        // Store result
        localStorage.setItem("ventureGates_result", JSON.stringify(data));
        
        // Navigate to results
        router.push("/discover/results");

      } catch (err) {
        console.error("Error generating DNA:", err);
        setError(err instanceof Error ? err.message : "Something went wrong");
      }
    };

    generateVentureDNA();
  }, [router, isRetrying]);

  const handleRetry = () => {
    setError(null);
    setCurrentStep(0);
    setIsRetrying(!isRetrying); // Toggle to trigger useEffect
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
            <span className="text-3xl">😕</span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">Oops, something went wrong</h1>
          <p className="text-neutral-600 mb-6">{error}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={handleRetry}
              className="bg-neutral-900 hover:bg-neutral-800 text-white"
            >
              Try Again
            </Button>
            <Button
              onClick={handleStartOver}
              variant="outline"
              className="border-neutral-300 hover:bg-white"
            >
              Start Over
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen dot-pattern-bg flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="relative w-24 h-24 mx-auto mb-8">
          <motion.div
            className="absolute inset-0 rounded-full bg-neutral-900"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-10 h-10 text-white animate-spin" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-neutral-900 mb-8">
          Building Your Venture DNA
        </h1>

        <div className="space-y-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index <= currentStep;
            const isCurrent = index === currentStep;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: isActive ? 1 : 0.3,
                  y: 0,
                  scale: isCurrent ? 1.02 : 1,
                }}
                className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${
                  isCurrent ? "bg-white shadow-md" : ""
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    isActive ? "bg-neutral-900 text-white" : "bg-neutral-200 text-neutral-400"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className={`font-medium ${
                    isActive ? "text-neutral-900" : "text-neutral-400"
                  }`}
                >
                  {step.text}
                </span>
                {isCurrent && (
                  <motion.div
                    className="ml-auto w-2 h-2 rounded-full bg-green-500"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
              </motion.div>
            );
          })}
        </div>

        <p className="mt-8 text-sm text-neutral-500">
          This usually takes 20-30 seconds...
        </p>
      </div>
    </main>
  );
}

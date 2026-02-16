"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
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
        }, 1500);

        // Call API with metadata
        const response = await fetch("/api/generate-venture-dna", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            answers,
            ip_address: "", // Will be captured server-side or left empty
            user_agent: navigator.userAgent,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to generate venture DNA");
        }

        const data = await response.json();

        // Store result with Supabase IDs
        localStorage.setItem("ventureGates_result", JSON.stringify(data));
        
        // If we have a share slug, redirect to profile page
        if (data.share_slug) {
          router.push(`/profile/${data.share_slug}`);
        } else {
          router.push("/discover/results");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      }
    };

    generateVentureDNA();
  }, [router]);

  if (error) {
    return (
      <main className="min-h-screen dot-pattern-bg flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">😕</span>
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">Something went wrong</h1>
          <p className="text-neutral-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800"
          >
            Try Again
          </button>
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

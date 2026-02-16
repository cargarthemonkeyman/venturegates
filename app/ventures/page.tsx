"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock } from "lucide-react";
import Link from "next/link";

export default function VenturesPage() {
  return (
    <main className="min-h-screen dot-pattern-bg flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center px-4"
      >
        <div className="w-20 h-20 rounded-2xl bg-neutral-900 flex items-center justify-center mx-auto mb-6">
          <Clock className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-neutral-900">Coming Soon</h1>
        <p className="text-neutral-600 max-w-md mx-auto mb-8">
          The ventures catalog is being built. Soon you&apos;ll be able to browse all generated
          ventures with filtering by category, score, and type.
        </p>
        <Link href="/">
          <Button variant="outline" className="border-neutral-300 hover:bg-white text-neutral-700">
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Home
          </Button>
        </Link>
      </motion.div>
    </main>
  );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  Brain,
  Sparkles,
  BarChart3,
  Users,
  Zap,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Search,
  Compass,
  Flame,
  Heart,
  Scale,
  Lightbulb,
  Target,
  Shield,
  PartyPopper,
  CircleDot,
  Crown,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Question types
interface Option {
  value: string;
  label: string;
  icon?: React.ElementType;
  description?: string;
}

interface Question {
  id: string;
  type: "single" | "multi" | "single-with-other" | "multi-with-other";
  title: string;
  description?: string;
  options: Option[];
  placeholder?: string;
  otherPlaceholder?: string;
  maxSelections?: number;
}

const questions: Question[] = [
  // === PERSONALIDAD / ENEAGRAMA (Nuevas) ===
  {
    id: "eneagrama",
    type: "single-with-other",
    title: "¿Cuál es tu tipo de personalidad (Eneagrama)?",
    description: "Selecciona el número que mejor te describe, o 'Otro' si prefieres especificar",
    options: [
      { value: "1", label: "Tipo 1 - El Reformador", icon: Scale, description: "Perfeccionista, ético, busca lo correcto" },
      { value: "2", label: "Tipo 2 - El Ayudador", icon: Heart, description: "Cariñoso, generoso, orientado a personas" },
      { value: "3", label: "Tipo 3 - El Triunfador", icon: Crown, description: "Adaptable, exitoso, orientado a resultados" },
      { value: "4", label: "Tipo 4 - El Individualista", icon: Sparkles, description: "Expresivo, creativo, busca autenticidad" },
      { value: "5", label: "Tipo 5 - El Investigador", icon: Search, description: "Intensivo, innovador, aislado" },
      { value: "6", label: "Tipo 6 - El Leal", icon: Shield, description: "Comprometido, responsable, orientado a seguridad" },
      { value: "7", label: "Tipo 7 - El Entusiasta", icon: PartyPopper, description: "Versátil, espontáneo, busca experiencias" },
      { value: "8", label: "Tipo 8 - El Desafiador", icon: Flame, description: "Autoconfiable, decisivo, orientado a control" },
      { value: "9", label: "Tipo 9 - El Pacificador", icon: CircleDot, description: "Receptivo, reconfortante, busca armonía" },
    ],
    otherPlaceholder: "Describe tu personalidad en tus propias palabras...",
  },
  {
    id: "estres_reaccion",
    type: "single-with-other",
    title: "¿Cómo reaccionas ante el estrés?",
    description: "Esto nos ayuda a entender qué tipo de ventures evitar para ti",
    options: [
      { value: "analizo", label: "Analizo y planifico", icon: Brain, description: "Me paralizo pensando demasiado" },
      { value: "actuo", label: "Actúo rápido", icon: Zap, description: "Tomo decisiones impulsivas bajo presión" },
      { value: "delego", label: "Busco ayuda", icon: Users, description: "Necesito hablarlo con alguien" },
      { value: "evito", label: "Evito el conflicto", icon: CircleDot, description: "Me retraigo hasta que pasa" },
      { value: "compito", label: "Compito más", icon: Target, description: "El estrés me motiva a ganar" },
    ],
    otherPlaceholder: "¿Cómo manejas el estrés de otra forma?",
  },
  {
    id: "motivacion_profunda",
    type: "single-with-other",
    title: "¿Qué te mueve realmente?",
    description: "La motivación que te hace levantarte a las 5am sin despertador",
    options: [
      { value: "libertad", label: "Libertad total", icon: Compass, description: "No tener jefes ni horarios" },
      { value: "reconocimiento", label: "Reconocimiento", icon: Crown, description: "Ser visto como el mejor en algo" },
      { value: "impacto", label: "Cambiar el mundo", icon: Heart, description: "Dejar un legado positivo" },
      { value: "creacion", label: "Crear algo grande", icon: Lightbulb, description: "Construir desde cero" },
      { value: "riqueza", label: "Riqueza", icon: BarChart3, description: "Generar abundancia económica" },
      { value: "maestria", label: "Maestría", icon: Target, description: "Ser el mejor en lo que hago" },
    ],
    otherPlaceholder: "¿Qué otra motivación profunda tienes?",
  },
  
  // === PERFIL EMPRENDEDOR ===
  {
    id: "entrepreneur_type",
    type: "single-with-other",
    title: "What type of entrepreneur are you?",
    description: "Select the description that fits you best, or describe your own style",
    options: [
      { value: "architect", label: "The Architect", icon: Brain, description: "Designs systems, processes, frameworks. Obsessed with how pieces fit together." },
      { value: "creative", label: "The Creative", icon: Sparkles, description: "Designs products, experiences, brands. Obsessed with making things feel incredible." },
      { value: "analyst", label: "The Analyst", icon: BarChart3, description: "Data, metrics, optimization. Obsessed with finding patterns." },
      { value: "communicator", label: "The Communicator", icon: Users, description: "Narrative, sales, community. Obsessed with connecting with people." },
      { value: "builder", label: "The Builder", icon: Zap, description: "Code, infrastructure, making things work. Obsessed with building." },
    ],
    otherPlaceholder: "Describe tu estilo emprendedor único...",
  },
  {
    id: "obsession",
    type: "single-with-other",
    title: "What topic do you research without being asked?",
    description: "In your free time, before bed... what do you explore?",
    options: [
      { value: "ai_tech", label: "IA y tecnología", icon: Brain, description: "Nuevos modelos, herramientas, posibilidades" },
      { value: "consumer_behavior", label: "Comportamiento del consumidor", icon: Users, description: "Por qué la gente compra lo que compra" },
      { value: "market_trends", label: "Tendencias de mercado", icon: BarChart3, description: "Lo que viene, oportunidades emergentes" },
      { value: "product_design", label: "Diseño de producto", icon: Sparkles, description: "Cómo hacer cosas que la gente ame" },
      { value: "business_models", label: "Modelos de negocio", icon: Target, description: "Cómo monetizar diferentes ideas" },
    ],
    otherPlaceholder: "¿Qué otro tema te obsesiona investigar?",
  },
  {
    id: "strengths",
    type: "multi-with-other",
    title: "Select your top 3 strengths",
    description: "Where do you excel the most? Choose up to 3, or add your own",
    maxSelections: 3,
    options: [
      { value: "systemic_thinking", label: "Systemic thinking" },
      { value: "product_design", label: "Product design" },
      { value: "storytelling", label: "Storytelling & narrative" },
      { value: "programming", label: "Programming" },
      { value: "sales", label: "Sales & negotiation" },
      { value: "data_analysis", label: "Data analysis" },
      { value: "marketing", label: "Marketing digital" },
      { value: "ux_ui", label: "UX/UI" },
      { value: "operations", label: "Operations" },
      { value: "networking", label: "Networking & relationships" },
      { value: "leadership", label: "Leadership" },
      { value: "creativity", label: "Creativity & ideation" },
    ],
    otherPlaceholder: "¿Otra fortaleza que tengas?",
  },
  {
    id: "drains",
    type: "multi-with-other",
    title: "What drains your energy?",
    description: "What do you NOT want to do in your venture? Choose up to 3",
    maxSelections: 3,
    options: [
      { value: "bureaucracy", label: "Bureaucratic management" },
      { value: "support", label: "Technical support" },
      { value: "cold_calls", label: "Cold sales calls" },
      { value: "content", label: "Repetitive content creation" },
      { value: "regulation", label: "Regulation & compliance" },
      { value: "inventory", label: "Inventory management" },
      { value: "customer_service", label: "Customer service" },
      { value: "hardware", label: "Hardware/logistics" },
      { value: "accounting", label: "Accounting" },
      { value: "negotiations", label: "Long negotiations" },
    ],
    otherPlaceholder: "¿Qué otra cosa te drena energía?",
  },
  
  // === CONTEXTO ===
  {
    id: "context",
    type: "single-with-other",
    title: "What's your current situation?",
    options: [
      { value: "full_time", label: "Full-time available" },
      { value: "nights_weekends", label: "Nights and weekends" },
      { value: "few_hours", label: "Few hours per week" },
    ],
    otherPlaceholder: "Describe tu situación específica...",
  },
  {
    id: "capital",
    type: "single-with-other",
    title: "What's your capital situation?",
    options: [
      { value: "can_invest", label: "I can invest something" },
      { value: "bootstrapping", label: "Bootstrapping only" },
      { value: "has_funding", label: "I have access to funding" },
    ],
    otherPlaceholder: "¿Tu situación de capital es diferente?",
  },
  {
    id: "team",
    type: "single-with-other",
    title: "What's your team status?",
    options: [
      { value: "solo", label: "Solo founder" },
      { value: "cofounder", label: "With technical cofounder" },
      { value: "small_team", label: "Small team" },
    ],
    otherPlaceholder: "Describe tu equipo...",
  },
  {
    id: "tech_skills",
    type: "single-with-other",
    title: "Your technical skills?",
    options: [
      { value: "can_code", label: "I can code" },
      { value: "no_code", label: "I use no-code tools" },
      { value: "need_technical", label: "I need a technical partner" },
    ],
    otherPlaceholder: "Describe tus habilidades técnicas...",
  },
  {
    id: "industries",
    type: "multi-with-other",
    title: "Industries you've worked in?",
    description: "Select all that apply, or add your own",
    maxSelections: 5,
    options: [
      { value: "fintech", label: "Fintech" },
      { value: "ecommerce", label: "E-commerce" },
      { value: "saas", label: "SaaS" },
      { value: "health", label: "Health" },
      { value: "education", label: "Education" },
      { value: "retail", label: "Retail" },
      { value: "media", label: "Media" },
      { value: "food", label: "Food" },
      { value: "real_estate", label: "Real Estate" },
      { value: "fitness", label: "Fitness" },
      { value: "travel", label: "Travel" },
      { value: "beauty", label: "Beauty" },
      { value: "gaming", label: "Gaming" },
    ],
    otherPlaceholder: "¿Otra industria en la que tengas experiencia?",
  },
  {
    id: "ambition",
    type: "single-with-other",
    title: "What type of venture attracts you?",
    options: [
      { value: "scale_massive", label: "Massive scale", description: "I want to build something that reaches millions" },
      { value: "niche_profitable", label: "Profitable niche", description: "I prefer a small but highly profitable business" },
      { value: "impact_social", label: "Social impact", description: "I want to solve a real world problem" },
      { value: "experiment", label: "Experiment", description: "I want to learn and validate, failure is OK" },
    ],
    otherPlaceholder: "Describe tu ambición...",
  },
];

export default function DiscoverPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [otherText, setOtherText] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  const handleSingleSelect = (value: string) => {
    if (value === "__other__") {
      // Selected "other", keep selection but wait for text input
      setAnswers({ ...answers, [currentQuestion.id]: "__other__" });
    } else {
      setAnswers({ ...answers, [currentQuestion.id]: value });
    }
  };

  const handleMultiSelect = (value: string) => {
    const current = (answers[currentQuestion.id] as string[]) || [];
    const maxSelections = currentQuestion.maxSelections || 3;
    
    if (value === "__other__") {
      // Toggle "other" selection
      if (current.includes("__other__")) {
        setAnswers({
          ...answers,
          [currentQuestion.id]: current.filter((v) => v !== "__other__"),
        });
      } else if (current.length < maxSelections) {
        setAnswers({
          ...answers,
          [currentQuestion.id]: [...current, "__other__"],
        });
      }
    } else if (current.includes(value)) {
      setAnswers({
        ...answers,
        [currentQuestion.id]: current.filter((v) => v !== value),
      });
    } else if (current.length < maxSelections) {
      setAnswers({
        ...answers,
        [currentQuestion.id]: [...current, value],
      });
    }
  };

  const handleOtherTextChange = (value: string) => {
    setOtherText({ ...otherText, [currentQuestion.id]: value });
  };

  const getCurrentAnswer = () => {
    const rawAnswer = answers[currentQuestion.id];
    const otherValue = otherText[currentQuestion.id];
    
    if (currentQuestion.type === "single-with-other" && rawAnswer === "__other__") {
      return otherValue?.trim() || null;
    }
    
    if (currentQuestion.type === "multi-with-other") {
      const selections = (rawAnswer as string[]) || [];
      const hasOther = selections.includes("__other__");
      const cleanSelections = selections.filter(s => s !== "__other__");
      
      if (hasOther && otherValue?.trim()) {
        return [...cleanSelections, otherValue.trim()];
      }
      return cleanSelections.length > 0 ? cleanSelections : null;
    }
    
    return rawAnswer;
  };

  const canProceed = () => {
    const answer = getCurrentAnswer();
    if (!answer) return false;
    
    if (Array.isArray(answer)) {
      return answer.length > 0;
    }
    
    return typeof answer === "string" && answer.length > 0;
  };

  const handleNext = () => {
    const finalAnswer = getCurrentAnswer();
    
    if (currentStep < questions.length - 1) {
      setAnswers({ ...answers, [currentQuestion.id]: finalAnswer });
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit(finalAnswer);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (finalAnswer: any) => {
    setIsSubmitting(true);
    
    const finalAnswers = { ...answers, [currentQuestion.id]: finalAnswer };
    
    try {
      localStorage.setItem("ventureGates_answers", JSON.stringify(finalAnswers));
      router.push("/discover/processing");
    } catch (error) {
      console.error("Error:", error);
      setIsSubmitting(false);
    }
  };

  const isOtherSelected = () => {
    if (currentQuestion.type === "single-with-other") {
      return answers[currentQuestion.id] === "__other__";
    }
    if (currentQuestion.type === "multi-with-other") {
      return (answers[currentQuestion.id] as string[])?.includes("__other__");
    }
    return false;
  };

  const getSelectedCount = () => {
    if (currentQuestion.type === "multi-with-other") {
      const arr = (answers[currentQuestion.id] as string[]) || [];
      return arr.length;
    }
    return answers[currentQuestion.id] ? 1 : 0;
  };

  return (
    <main className="min-h-screen dot-pattern-bg py-20 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-sm text-neutral-500 hover:text-neutral-900 mb-4 inline-flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-500">
              Question {currentStep + 1} of {questions.length}
            </span>
            <span className="text-sm font-medium text-neutral-900">
              {Math.round(progress)}%
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-white border-neutral-200">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                  {currentQuestion.title}
                </h2>
                {currentQuestion.description && (
                  <p className="text-neutral-600 mb-6">{currentQuestion.description}</p>
                )}

                {/* Single Select with Other */}
                {(currentQuestion.type === "single" || currentQuestion.type === "single-with-other") && (
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
                            <div>
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
                    
                    {/* Other option */}
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
                            <span>Otro (especificar)</span>
                          </div>
                        </button>
                        
                        {isOtherSelected() && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="mt-3"
                          >
                            <Input
                              value={otherText[currentQuestion.id] || ""}
                              onChange={(e) => handleOtherTextChange(e.target.value)}
                              placeholder={currentQuestion.otherPlaceholder}
                              className="w-full"
                              autoFocus
                            />
                          </motion.div>
                        )}
                      </>
                    )}
                  </div>
                )}

                {/* Multi Select with Other */}
                {(currentQuestion.type === "multi" || currentQuestion.type === "multi-with-other") && (
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
                      
                      {/* Other option chip */}
                      {currentQuestion.type === "multi-with-other" && (
                        <button
                          onClick={() => handleMultiSelect("__other__")}
                          className={`px-4 py-2 rounded-full border-2 text-sm font-medium transition-all ${
                            isOtherSelected()
                              ? "border-neutral-900 bg-neutral-900 text-white"
                              : "border-neutral-200 hover:border-neutral-400 bg-white text-neutral-700"
                          }`}
                        >
                          ✏️ Otro
                        </button>
                      )}
                    </div>
                    
                    {currentQuestion.type === "multi-with-other" && isOtherSelected() && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mb-4"
                      >
                        <Input
                          value={otherText[currentQuestion.id] || ""}
                          onChange={(e) => handleOtherTextChange(e.target.value)}
                          placeholder={currentQuestion.otherPlaceholder}
                          className="w-full"
                          autoFocus
                        />
                      </motion.div>
                    )}
                    
                    <p className="text-sm text-neutral-500">
                      Selected: {getSelectedCount()} / {currentQuestion.maxSelections}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
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
      </div>
    </main>
  );
}

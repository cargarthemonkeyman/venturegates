"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowRight,
  ArrowLeft,
  Loader2,
  Compass,
  Flame,
  Heart,
  Scale,
  Lightbulb,
  Target,
  CircleDot,
  Clock,
  Briefcase,
  TrendingUp,
  Palette,
  Code,
  Building2,
  Search,
  Shield,
  Crown,
  BarChart3,
  Users,
  Zap,
  Brain,
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
  type: "single" | "multi" | "single-with-other" | "multi-with-other" | "text";
  title: string;
  subtitle?: string;
  description?: string;
  options?: Option[];
  placeholder?: string;
  otherPlaceholder?: string;
  maxSelections?: number;
}

// FLUJO ORGÁNICO: Estudio completo del fundador
// Intercalado: Psicológico → Práctico → Psicológico → Práctico → Conclusión
const questions: Question[] = [
  // === APERTURA: IDENTIDAD FUNDAMENTAL ===
  {
    id: "entrepreneur_archetype",
    type: "single-with-other",
    title: "¿Qué arquetipo te describe mejor?",
    subtitle: "Tu naturaleza fundamental",
    description: "No lo que haces, sino quién eres cuando estás en tu elemento",
    options: [
      { value: "visionary", label: "El Visionario", icon: Lightbulb, description: "Veo el futuro antes que otros. Me obsesionan las posibilidades, no las limitaciones." },
      { value: "craftsman", label: "El Artesano", icon: Palette, description: "Me pierdo perfeccionando detalles. La calidad es mi religión." },
      { value: "strategist", label: "El Estratega", icon: Compass, description: "Veo patrones donde otros ven caos. El ajedrez es mi lenguaje." },
      { value: "catalyst", label: "El Catalizador", icon: Flame, description: "Muevo a la gente. Las conversaciones conmigo cambian trayectorias." },
      { value: "architect", label: "El Arquitecto", icon: Building2, description: "Construyo sistemas que sobreviven sin mí. Estructura sobre todo." },
      { value: "hacker", label: "El Hacker", icon: Code, description: "Encuentro atajos que otros no ven. 'Imposible' es un desafío." },
    ],
    otherPlaceholder: "Describe tu arquetipo único en tus palabras...",
  },
  
  // === PROFUNDIDAD: ENEAGRAMA ===
  {
    id: "eneagrama",
    type: "single-with-other",
    title: "Tu motor interno (Eneagrama)",
    subtitle: "¿Qué te mueve en el fondo?",
    description: "Selecciona el que resuene más profundamente contigo",
    options: [
      { value: "1", label: "El Reformador", icon: Scale, description: "Busco lo correcto. El mundo debería funcionar mejor." },
      { value: "3", label: "El Triunfador", icon: Crown, description: "Necesito ser reconocido. El éxito es mi combustible." },
      { value: "5", label: "El Investigador", icon: Search, description: "Entiendo antes de actuar. El conocimiento es poder." },
      { value: "7", label: "El Entusiasta", icon: Brain, description: "Exploro posibilidades. La rutina me asfixia." },
      { value: "8", label: "El Desafiador", icon: Flame, description: "Controlo mi destino. La debilidad no es opción." },
      { value: "9", label: "El Pacificador", icon: CircleDot, description: "Busco armonía. El conflicto me agota." },
    ],
    otherPlaceholder: "Describe tu motor interno de otra forma...",
  },
  
  // === PRÁCTICO: CONTEXTO ACTUAL ===
  {
    id: "reality_check",
    type: "single-with-other",
    title: "Tu realidad actual",
    subtitle: "Sin filtros",
    description: "¿Dónde estás ahora mismo?",
    options: [
      { value: "full_time_ready", label: "100% disponible", icon: Clock, description: "Puedo dedicarme en cuerpo y alma" },
      { value: "side_hustle", label: "Proyecto paralelo", icon: Briefcase, description: "Tengo trabajo pero puedo dedicar 20h/semana" },
      { value: "limited_time", label: "Tiempo limitado", icon: Clock, description: "Menos de 10h semanaales disponibles" },
      { value: "transitioning", label: "En transición", icon: TrendingUp, description: "Dejando mi trabajo, ventana de 1-3 meses" },
    ],
    otherPlaceholder: "Describe tu situación específica...",
  },
  
  // === PROFUNDIDAD: MANEJO DEL ESTRÉS ===
  {
    id: "stress_pattern",
    type: "single-with-other",
    title: "Bajo presión, ¿qué haces?",
    subtitle: "Tu patrón bajo estrés",
    description: "Esto determina qué tipo de ventures son tóxicas para ti",
    options: [
      { value: "overthink", label: "Analizo en exceso", icon: Brain, description: "Me paralizo pensando todos los escenarios" },
      { value: "act_rash", label: "Actúo impulsivo", icon: Zap, description: "Tomo decisiones rápidas que luego cuestan" },
      { value: "withdraw", label: "Me aislo", icon: CircleDot, description: "Desaparezco hasta que pasa la tormenta" },
      { value: "delegate", label: "Busco ayuda", icon: Users, description: "Necesito hablarlo con alguien de confianza" },
      { value: "intensify", label: "Doblo apuesta", icon: Flame, description: "El estrés me activa, compito más" },
    ],
    otherPlaceholder: "¿Cómo reaccionas tú bajo presión?",
  },
  
  // === PROFUNDIDAD: MOTIVACIÓN PROFUNDA ===
  {
    id: "core_motivation",
    type: "single-with-other",
    title: "¿Qué te hace levantarte a las 5am sin despertador?",
    subtitle: "Tu combustible real",
    description: "No lo que dices querer, sino lo que realmente te mueve",
    options: [
      { value: "freedom", label: "Libertad absoluta", icon: Compass, description: "No tener que pedir permiso a nadie nunca más" },
      { value: "mastery", label: "Maestría", icon: Brain, description: "Ser el mejor del mundo en algo específico" },
      { value: "impact", label: "Impacto legado", icon: Heart, description: "Cambiar la vida de millones de personas" },
      { value: "creation", label: "Crear desde cero", icon: Lightbulb, description: "Ver algo nacer de mi cabeza al mundo real" },
      { value: "wealth", label: "Riqueza extrema", icon: BarChart3, description: "Nunca más preocuparme por dinero, libertad total" },
      { value: "recognition", label: "Reconocimiento", icon: Crown, description: "Ser visto como el mejor, autoridad absoluta" },
    ],
    otherPlaceholder: "¿Qué es lo que REALMENTE te mueve a ti?",
  },
  
  // === PRÁCTICO: CAPITAL ===
  {
    id: "capital_runway",
    type: "single-with-other",
    title: "Tu pista de despegue",
    subtitle: "Recursos disponibles",
    options: [
      { value: "self_funded", label: "Bootstrapping", icon: Shield, description: "Solo mis ahorros, menos de $5k" },
      { value: "angel_ready", label: "Ángel potencial", icon: Users, description: "Tengo acceso a $20k-$100k si valido" },
      { value: "vc_backed", label: "Con funding", icon: Crown, description: "Tengo $100k+ comprometidos" },
      { value: "ramen", label: "Modo supervivencia", icon: Flame, description: "Menos de 6 meses de pista, presión alta" },
    ],
    otherPlaceholder: "Describe tu situación de capital...",
  },
  
  // === PROFUNDIDAD: OBSESIÓN ===
  {
    id: "obsession_topic",
    type: "text",
    title: "¿Qué investigas cuando nadie te paga por ello?",
    subtitle: "Tu obsesión orgánica",
    description: "El tema que consumes en YouTube a las 2am, los libros que compras y no lees, los podcasts que escuchas caminando",
    placeholder: "Ej: 'Cómo el blockchain está cambiando la propiedad intelectual en música' o 'Psicología del color en conversiones'...",
  },
  
  // === PROFUNDIDAD: SUPERPODER + KRYPTONITA ===
  {
    id: "superpower",
    type: "multi-with-other",
    title: "Tus superpoderes (máx. 3)",
    subtitle: "Lo que haces mejor que el 95% de la población",
    description: "No modestia. ¿En qué te piden ayuda constantemente?",
    maxSelections: 3,
    options: [
      { value: "systems", label: "Pensamiento sistémico" },
      { value: "design", label: "Diseño de producto/experiencias" },
      { value: "storytelling", label: "Narrativa y persuasión" },
      { value: "code", label: "Programación/tech" },
      { value: "sales", label: "Ventas y cierre" },
      { value: "data", label: "Análisis de datos" },
      { value: "marketing", label: "Growth/marketing" },
      { value: "operations", label: "Operaciones y procesos" },
      { value: "networking", label: "Relaciones y networking" },
      { value: "creativity", label: "Creatividad e ideación" },
      { value: "leadership", label: "Liderazgo de equipos" },
      { value: "execution", label: "Ejecución implacable" },
    ],
    otherPlaceholder: "¿Algún superpoder que no esté en la lista?",
  },
  
  // === PROFUNDIDAD: LO QUE TE DRENA ===
  {
    id: "kryptonite",
    type: "multi-with-other",
    title: "Tu kriptonita (máx. 3)",
    subtitle: "Lo que te drena energía vital",
    description: "Tareas que, aunque sepas hacerlas, te dejan exhausto",
    maxSelections: 3,
    options: [
      { value: "bureaucracy", label: "Burocracia y papeleo" },
      { value: "accounting", label: "Contabilidad/finanzas" },
      { value: "support", label: "Soporte técnico" },
      { value: "cold_calls", label: "Llamadas en frío" },
      { value: "content", label: "Crear contenido repetitivo" },
      { value: "meetings", label: "Reuniones largas" },
      { value: "management", label: "Gestión de gente" },
      { value: "details", label: "Detalles administrativos" },
      { value: "hardware", label: "Logística/hardware" },
      { value: "compliance", label: "Legal/compliance" },
    ],
    otherPlaceholder: "¿Qué otra cosa te drena completamente?",
  },
  
  // === PRÁCTICO: HABILIDADES TÉCNICAS ===
  {
    id: "technical_arsenal",
    type: "single-with-other",
    title: "Tu arsenal técnico",
    subtitle: "¿Qué puedes construir tú mismo?",
    options: [
      { value: "full_stack", label: "Full-stack developer", icon: Code, description: "Puedo construir el producto yo solo" },
      { value: "no_code", label: "No-code/low-code", icon: Zap, description: "MVP rápido con herramientas visuales" },
      { value: "designer", label: "Diseñador", icon: Palette, description: "Flujos, UI, experiencia de usuario" },
      { value: "business", label: "Business/ops", icon: Briefcase, description: "Estrategia, operaciones, ventas" },
      { value: "need_tech", label: "Necesito cofounder técnico", icon: Users, description: "Tengo la visión, busco al builder" },
    ],
    otherPlaceholder: "Describe tus habilidades técnicas específicas...",
  },
  
  // === PRÁCTICO: EQUIPO ===
  {
    id: "team_status",
    type: "single-with-other",
    title: "¿Con quién cuentas?",
    subtitle: "Tu entorno de soporte",
    options: [
      { value: "solo", label: "Solo founder", icon: Target, description: "100% independiente, decisión única" },
      { value: "cofounder_tech", label: "Cofounder técnico", icon: Code, description: "Tengo al builder, falta validar" },
      { value: "cofounder_biz", label: "Cofounder business", icon: Briefcase, description: "Tengo al vendedor/ops" },
      { value: "advisors", label: "Advisors/mentores", icon: Users, description: "Tengo gente experta que me guía" },
      { value: "small_team", label: "Equipo pequeño", icon: Building2, description: "2-3 personas comprometidas" },
    ],
    otherPlaceholder: "Describe tu situación de equipo...",
  },
  
  // === PROFUNDIDAD: EXPERIENCIA SECTORIAL ===
  {
    id: "domain_expertise",
    type: "multi-with-other",
    title: "¿Dónde tienes ventaja injusta?",
    subtitle: "Sectores donde sabes cosas que otros no",
    description: "Industrias donde has trabajado o investigado profundamente",
    maxSelections: 4,
    options: [
      { value: "fintech", label: "Fintech/Payments" },
      { value: "health", label: "Health/Medtech" },
      { value: "education", label: "EdTech" },
      { value: "ecommerce", label: "E-commerce/D2C" },
      { value: "saas", label: "SaaS/B2B" },
      { value: "marketplaces", label: "Marketplaces" },
      { value: "content", label: "Media/Content" },
      { value: "real_estate", label: "Real Estate/PropTech" },
      { value: "retail", label: "Retail/Food" },
      { value: "travel", label: "Travel/Hospitality" },
      { value: "gaming", label: "Gaming" },
      { value: "web3", label: "Web3/Crypto" },
    ],
    otherPlaceholder: "¿Otro sector donde tengas expertise?",
  },
  
  // === CIERRE: VISIÓN DE ÉXITO ===
  {
    id: "success_definition",
    type: "single-with-other",
    title: "¿Cómo sabrás que lo lograste?",
    subtitle: "Tu definición de éxito",
    description: "Si todo sale perfecto, ¿qué habrás construido?",
    options: [
      { value: "unicorn", label: "Unicornio", icon: Crown, description: "$1B+ valuation, cambiar el mundo a escala" },
      { value: "lifestyle", label: "Lifestyle business", icon: Compass, description: "$50k-$100k/mes, libertad total, 4h semanales" },
      { value: "impact", label: "Impacto profundo", icon: Heart, description: "Cambiar la vida de 1M+ personas" },
      { value: "category", label: "Rey de la categoría", icon: Target, description: "Ser el estándar, el nombre que todos conocen" },
      { value: "exit", label: "Exit millonario", icon: BarChart3, description: "Vender por 8-9 figuras y hacer lo siguiente" },
    ],
    otherPlaceholder: "¿Cómo defines TÚ el éxito?",
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
      setAnswers({ ...answers, [currentQuestion.id]: "__other__" });
    } else {
      setAnswers({ ...answers, [currentQuestion.id]: value });
    }
  };

  const handleMultiSelect = (value: string) => {
    const current = (answers[currentQuestion.id] as string[]) || [];
    const maxSelections = currentQuestion.maxSelections || 3;
    
    if (value === "__other__") {
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

  const handleTextChange = (value: string) => {
    setAnswers({ ...answers, [currentQuestion.id]: value });
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
      return arr.filter(v => v !== "__other__").length;
    }
    return answers[currentQuestion.id] && answers[currentQuestion.id] !== "__other__" ? 1 : 0;
  };

  return (
    <main className="min-h-screen dot-pattern-bg py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href="/" className="text-sm text-neutral-500 hover:text-neutral-900 mb-4 inline-flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-neutral-500">
              {currentStep + 1} / {questions.length}
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="bg-white border-neutral-200 shadow-sm">
              <CardContent className="p-6 sm:p-8">
                {/* Question header with subtle styling */}
                <div className="mb-6">
                  {currentQuestion.subtitle && (
                    <span className="text-xs font-medium text-indigo-600 uppercase tracking-wider">
                      {currentQuestion.subtitle}
                    </span>
                  )}
                  <h2 className="text-2xl font-bold text-neutral-900 mt-1">
                    {currentQuestion.title}
                  </h2>
                  {currentQuestion.description && (
                    <p className="text-neutral-600 mt-2 text-sm">{currentQuestion.description}</p>
                  )}
                </div>

                {/* Single Select with Other */}
                {(currentQuestion.type === "single" || currentQuestion.type === "single-with-other") && currentQuestion.options && (
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
                            <div className="flex-1">
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
                            <Textarea
                              value={otherText[currentQuestion.id] || ""}
                              onChange={(e) => handleOtherTextChange(e.target.value)}
                              placeholder={currentQuestion.otherPlaceholder}
                              className="w-full min-h-[100px]"
                              autoFocus
                            />
                          </motion.div>
                        )}
                      </>
                    )}
                  </div>
                )}

                {/* Multi Select with Other */}
                {(currentQuestion.type === "multi" || currentQuestion.type === "multi-with-other") && currentQuestion.options && (
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
                        <Textarea
                          value={otherText[currentQuestion.id] || ""}
                          onChange={(e) => handleOtherTextChange(e.target.value)}
                          placeholder={currentQuestion.otherPlaceholder}
                          className="w-full min-h-[80px]"
                          autoFocus
                        />
                      </motion.div>
                    )}
                    
                    <p className="text-sm text-neutral-500">
                      Seleccionados: {getSelectedCount()} / {currentQuestion.maxSelections}
                    </p>
                  </div>
                )}

                {/* Text Input */}
                {currentQuestion.type === "text" && (
                  <Textarea
                    value={(answers[currentQuestion.id] as string) || ""}
                    onChange={(e) => handleTextChange(e.target.value)}
                    placeholder={currentQuestion.placeholder}
                    rows={4}
                    className="w-full"
                    autoFocus
                  />
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
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
                Procesando...
              </>
            ) : currentStep === questions.length - 1 ? (
              <>
                Generar mi DNA
                <ArrowRight className="ml-2 w-4 h-4" />
              </>
            ) : (
              <>
                Siguiente
                <ArrowRight className="ml-2 w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </main>
  );
}

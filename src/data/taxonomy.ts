export type ResearchStage =
  | "design"
  | "measures"
  | "data_qc"
  | "analysis"
  | "interpretation"
  | "writing"
  | "polishing"
  | "visualization"
  | "review"

export type ResearchType =
  | "qualitative"
  | "quantitative"
  | "mixed_methods"
  | "computational"
  | "experimental"
  | "systematic_review"
  | "theoretical"

export const STAGES: { id: ResearchStage; label: string; description: string }[] = [
  {
    id: "design",
    label: "Design",
    description: "Frame the question, map the literature, and define the study.",
  },
  {
    id: "measures",
    label: "Measures",
    description: "Define variables, instruments, protocols, and operationalization.",
  },
  {
    id: "data_qc",
    label: "Data QC",
    description: "Assess quality, clean data, and validate assumptions.",
  },
  {
    id: "analysis",
    label: "Analysis",
    description: "Run analyses, build models, and stress-test results.",
  },
  {
    id: "interpretation",
    label: "Interpretation",
    description: "Synthesize findings, connect to theory, and surface implications.",
  },
  {
    id: "visualization",
    label: "Visualization",
    description: "Create figures, diagrams, and visual summaries.",
  },
  {
    id: "writing",
    label: "Writing",
    description: "Draft, revise, and format publishable output.",
  },
  {
    id: "polishing",
    label: "Polishing",
    description: "Refine language, shorten/expand text, and fix style.",
  },
  {
    id: "review",
    label: "Peer Review",
    description: "Critique work, respond to reviewers, and ensure compliance.",
  },
]

export const RESEARCH_TYPES: { id: ResearchType; label: string; description: string }[] = [
  {
    id: "qualitative",
    label: "Qualitative",
    description: "Interviews, field notes, thematic coding, and interpretive analysis.",
  },
  {
    id: "quantitative",
    label: "Quantitative",
    description: "Statistical modeling, hypothesis testing, and numerical inference.",
  },
  {
    id: "mixed_methods",
    label: "Mixed Methods",
    description: "Integrated qualitative + quantitative workflows.",
  },
  {
    id: "computational",
    label: "Computational",
    description: "Code-driven experiments, simulations, and algorithmic analysis.",
  },
  {
    id: "experimental",
    label: "Experimental",
    description: "Lab studies, protocol design, and controlled interventions.",
  },
  {
    id: "systematic_review",
    label: "Systematic Review",
    description: "Structured evidence synthesis, PRISMA, and audit trails.",
  },
  {
    id: "theoretical",
    label: "Theoretical",
    description: "Conceptual frameworks, argumentation, and model-building.",
  },
]

export const STAGE_LABELS = Object.fromEntries(
  STAGES.map((stage) => [stage.id, stage.label])
) as Record<ResearchStage, string>


export const RESEARCH_TYPE_LABELS = Object.fromEntries(
  RESEARCH_TYPES.map((type) => [type.id, type.label])
) as Record<ResearchType, string>

export const TAG_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  // Research Types
  qualitative: { bg: "bg-blue-100 dark:bg-blue-500/10", text: "text-blue-700 dark:text-blue-400", border: "border-blue-200 dark:border-blue-800" },
  quantitative: { bg: "bg-purple-100 dark:bg-purple-500/10", text: "text-purple-700 dark:text-purple-400", border: "border-purple-200 dark:border-purple-800" },
  mixed_methods: { bg: "bg-orange-100 dark:bg-orange-500/10", text: "text-orange-700 dark:text-orange-400", border: "border-orange-200 dark:border-orange-800" },
  computational: { bg: "bg-cyan-100 dark:bg-cyan-500/10", text: "text-cyan-700 dark:text-cyan-400", border: "border-cyan-200 dark:border-cyan-800" },
  experimental: { bg: "bg-pink-100 dark:bg-pink-500/10", text: "text-pink-700 dark:text-pink-400", border: "border-pink-200 dark:border-pink-800" },
  systematic_review: { bg: "bg-emerald-100 dark:bg-emerald-500/10", text: "text-emerald-700 dark:text-emerald-400", border: "border-emerald-200 dark:border-emerald-800" },
  theoretical: { bg: "bg-yellow-100 dark:bg-yellow-500/10", text: "text-yellow-700 dark:text-yellow-400", border: "border-yellow-200 dark:border-yellow-800" },

  // Research Stages
  design: { bg: "bg-indigo-100 dark:bg-indigo-500/10", text: "text-indigo-700 dark:text-indigo-400", border: "border-indigo-200 dark:border-indigo-800" },
  measures: { bg: "bg-violet-100 dark:bg-violet-500/10", text: "text-violet-700 dark:text-violet-400", border: "border-violet-200 dark:border-violet-800" },
  data_qc: { bg: "bg-teal-100 dark:bg-teal-500/10", text: "text-teal-700 dark:text-teal-400", border: "border-teal-200 dark:border-teal-800" },
  analysis: { bg: "bg-fuchsia-100 dark:bg-fuchsia-500/10", text: "text-fuchsia-700 dark:text-fuchsia-400", border: "border-fuchsia-200 dark:border-fuchsia-800" },
  interpretation: { bg: "bg-sky-100 dark:bg-sky-500/10", text: "text-sky-700 dark:text-sky-400", border: "border-sky-200 dark:border-sky-800" },
  visualization: { bg: "bg-lime-100 dark:bg-lime-500/10", text: "text-lime-700 dark:text-lime-400", border: "border-lime-200 dark:border-lime-800" },
  writing: { bg: "bg-amber-100 dark:bg-amber-500/10", text: "text-amber-700 dark:text-amber-400", border: "border-amber-200 dark:border-amber-800" },
  polishing: { bg: "bg-rose-100 dark:bg-rose-500/10", text: "text-rose-700 dark:text-rose-400", border: "border-rose-200 dark:border-rose-800" },
  review: { bg: "bg-red-100 dark:bg-red-500/10", text: "text-red-700 dark:text-red-400", border: "border-red-200 dark:border-red-800" },
}

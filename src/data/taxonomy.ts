export type ResearchStage =
  | "design"
  | "measures"
  | "data_qc"
  | "analysis"
  | "interpretation"
  | "writing"

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
    id: "writing",
    label: "Writing",
    description: "Draft, revise, and format publishable output.",
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

import type { ResearchStage, ResearchType } from "@/data/taxonomy"

export interface GuideSection {
  id: string
  title: string
  body?: string
  bullets?: string[]
}

export interface Guide {
  id: string
  title: string
  summary: string
  stages: ResearchStage[]
  researchTypes: ResearchType[]
  tags: string[]
  sections: GuideSection[]
  sourceNote?: string
}

export const GUIDES: Guide[] = [
  {
    id: "ai-research-overview",
    title: "AI in Research: Executive Summary",
    summary:
      "A high-level briefing on using AI for rigorous research without sacrificing integrity.",
    stages: ["design", "analysis", "interpretation", "writing"],
    researchTypes: [
      "qualitative",
      "quantitative",
      "mixed_methods",
      "computational",
      "experimental",
      "systematic_review",
      "theoretical",
    ],
    tags: ["overview", "strategy", "policy"],
    sections: [
      {
        id: "strategy",
        title: "Strategic Takeaways",
        bullets: [
          "Use structured prompting frameworks, not ad-hoc queries.",
          "Verification is mandatory: AI predicts patterns, not facts.",
          "Parameter control (temperature, top-p/top-k) affects rigor.",
          "Maintain reproducibility via literate programming and audit trails.",
        ],
      },
      {
        id: "responsibility",
        title: "Ethical Accountability",
        body:
          "Publishers prohibit AI authorship. Human researchers retain responsibility for all AI-assisted content.",
      },
    ],
    sourceNote: "AI in research report.md (Executive Summary)",
  },
  {
    id: "prompting-fundamentals",
    title: "Prompting Fundamentals",
    summary: "Core frameworks for reliable research prompting.",
    stages: ["design", "analysis", "interpretation", "writing"],
    researchTypes: [
      "qualitative",
      "quantitative",
      "mixed_methods",
      "computational",
      "experimental",
      "systematic_review",
      "theoretical",
    ],
    tags: ["frameworks", "COSTAR", "TIDD-EC"],
    sections: [
      {
        id: "costar",
        title: "COSTAR",
        body:
          "Context, Objective, Style, Tone, Audience, Response. Best for conceptual tasks, writing, and role-based synthesis.",
      },
      {
        id: "tidd-ec",
        title: "TIDD-EC",
        body:
          "Task, Instructions, Do, Don’t, Examples, Content. Best for technical or data-processing tasks to reduce variance.",
      },
      {
        id: "temperature",
        title: "Parameter Tuning",
        bullets: [
          "Low temperature (0–0.2) for factual, deterministic tasks.",
          "Higher temperature for brainstorming only.",
          "Lower top-p/top-k to reduce wandering logic.",
        ],
      },
    ],
    sourceNote: "AI in research report.md (Prompting Fundamentals)",
  },
  {
    id: "verification-integrity",
    title: "Verification & Integrity",
    summary: "Protocols to validate AI outputs and reduce hallucinations.",
    stages: ["analysis", "interpretation", "writing"],
    researchTypes: [
      "qualitative",
      "quantitative",
      "mixed_methods",
      "computational",
      "experimental",
      "systematic_review",
      "theoretical",
    ],
    tags: ["verification", "integrity"],
    sections: [
      {
        id: "verify",
        title: "VERIFY Heuristic",
        bullets: [
          "Vague matches: does the output lack concrete detail?",
          "Excessive specificity: are numbers suspiciously perfect?",
          "Recent claims: does it cite papers beyond the model’s knowledge?",
        ],
      },
      {
        id: "high-five",
        title: "High-Five Verification Protocol",
        bullets: [
          "Replicate: run on a second model.",
          "Verify citations: click every link and DOI.",
          "Check against primary sources and canonical references.",
        ],
      },
    ],
    sourceNote: "AI in research report.md (Verification)",
  },
  {
    id: "ethics-policies",
    title: "Ethics, Privacy, and Disclosure",
    summary: "Publisher policies and human-in-the-loop requirements.",
    stages: ["design", "analysis", "writing"],
    researchTypes: [
      "qualitative",
      "quantitative",
      "mixed_methods",
      "computational",
      "experimental",
      "systematic_review",
      "theoretical",
    ],
    tags: ["ethics", "privacy", "policy"],
    sections: [
      {
        id: "disclosure",
        title: "Disclosure Requirements",
        body:
          "AI use must be disclosed in Methods or Acknowledgements. AI cannot be listed as an author.",
      },
      {
        id: "privacy",
        title: "Privacy and PII",
        bullets: [
          "Redact PII before using external tools.",
          "Avoid uploading sensitive human-subject data.",
          "Maintain decision authority with researchers, not models.",
        ],
      },
    ],
    sourceNote: "AI in research report.md (Ethics)",
  },
  {
    id: "focus-guide",
    title: "FOCUS Workflow Guide",
    summary:
      "A practical framework for discovery, synthesis, and evidence-backed validation.",
    stages: ["design", "data_qc", "interpretation", "writing"],
    researchTypes: ["qualitative", "quantitative", "mixed_methods", "systematic_review", "theoretical"],
    tags: ["workflow", "FOCUS"],
    sections: [
      {
        id: "focus-overview",
        title: "Why FOCUS",
        body:
          "FOCUS is designed to move from noisy information streams to validated academic synthesis without losing provenance.",
      },
      {
        id: "focus-phases",
        title: "Phases",
        bullets: [
          "Find: identify signals across community and academic sources.",
          "Organize: clean and structure raw media and discussions.",
          "Condense: summarize with quote-supported evidence.",
          "Understand: build layered explanations and fact checks.",
          "Synthesize: assess novelty and validate claims.",
        ],
      },
    ],
    sourceNote: "Academic Use Toolkit.md (FOCUS workflow)",
  },
  {
    id: "quickstart",
    title: "Research Atlas Quickstart",
    summary: "A 5-step path to get immediate value from the library.",
    stages: ["design", "analysis", "writing"],
    researchTypes: [
      "qualitative",
      "quantitative",
      "mixed_methods",
      "computational",
      "experimental",
      "systematic_review",
      "theoretical",
    ],
    tags: ["quickstart"],
    sections: [
      {
        id: "qs-steps",
        title: "Steps",
        bullets: [
          "Choose a seed asset aligned with your research stage.",
          "Set model parameters (low temperature for rigor).",
          "Provide context: datasets, aims, or methodological notes.",
          "Run a workflow (e.g., FOCUS or Plan-Execute-Test-Fix).",
          "Verify citations and claims before reuse.",
        ],
      },
    ],
    sourceNote: "AI in research report.md (Quickstart)",
  },
  {
    id: "glossary",
    title: "Glossary",
    summary: "Core terms used throughout Research Atlas.",
    stages: ["design", "analysis", "interpretation", "writing"],
    researchTypes: [
      "qualitative",
      "quantitative",
      "mixed_methods",
      "computational",
      "experimental",
      "systematic_review",
      "theoretical",
    ],
    tags: ["glossary"],
    sections: [
      {
        id: "rag",
        title: "RAG",
        body:
          "Retrieval-Augmented Generation: connects a model to external sources to reduce hallucinations.",
      },
      {
        id: "temperature",
        title: "Temperature",
        body:
          "Randomness control (0–1). Lower values are more deterministic and factual.",
      },
      {
        id: "hallucination",
        title: "Hallucination",
        body:
          "When a model generates plausible but false information.",
      },
      {
        id: "semantic-search",
        title: "Semantic Search",
        body:
          "Search by meaning and intent rather than keyword matching.",
      },
      {
        id: "chain-of-thought",
        title: "Chain-of-Thought (CoT)",
        body:
          "Prompting technique that encourages stepwise reasoning.",
      },
    ],
    sourceNote: "AI in research report.md (Glossary)",
  },
]

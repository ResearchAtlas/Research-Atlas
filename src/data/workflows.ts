import type { ResearchStage, ResearchType } from "@/data/taxonomy"

export interface WorkflowStep {
  id: string
  title: string
  summary: string
  promptIds?: string[]
  stage?: ResearchStage
}

export interface WorkflowPhase {
  id: string
  title: string
  description: string
  steps: WorkflowStep[]
}

export interface Workflow {
  id: string
  title: string
  description: string
  stages: ResearchStage[]
  researchTypes: ResearchType[]
  tags: string[]
  phases?: WorkflowPhase[]
  steps?: WorkflowStep[]
  sourceNote?: string
}

export const WORKFLOWS: Workflow[] = [
  {
    id: "focus",
    title: "FOCUS: Find → Organize → Condense → Understand → Synthesize",
    description:
      "A research discovery workflow that moves from signal collection to validated synthesis.",
    stages: ["design", "data_qc", "interpretation", "writing"],
    researchTypes: ["qualitative", "quantitative", "mixed_methods", "systematic_review", "theoretical"],
    tags: ["literature", "verification", "synthesis"],
    phases: [
      {
        id: "find",
        title: "Find",
        description: "Locate signals across communities and formal literature.",
        steps: [
          {
            id: "trend_scan",
            title: "Social Media Trend Scan",
            summary: "Scan fast-moving community discussions for new developments.",
            promptIds: ["focus_trend_scan"],
            stage: "design",
          },
          {
            id: "academic_deep_search",
            title: "Academic Deep Search",
            summary: "Collect high-quality, recent academic sources and map themes.",
            promptIds: ["focus_academic_deep_search"],
            stage: "design",
          },
        ],
      },
      {
        id: "organize",
        title: "Organize",
        description: "Convert messy media into structured, analyzable artifacts.",
        steps: [
          {
            id: "transcription_cleaning",
            title: "Multimodal Transcription & Cleaning",
            summary: "Transcribe and clean audio/video for citation and coding.",
            promptIds: ["focus_transcription_cleaning"],
            stage: "data_qc",
          },
          {
            id: "discussion_mining",
            title: "Discussion Mining",
            summary: "Extract claims, debates, and implications from forums.",
            promptIds: ["focus_discussion_mining"],
            stage: "interpretation",
          },
        ],
      },
      {
        id: "condense",
        title: "Condense",
        description: "Summarize sources with evidence-backed notes.",
        steps: [
          {
            id: "deep_paper_summary",
            title: "Deep Paper Summary",
            summary: "Section-by-section summaries with quote-supported claims.",
            promptIds: ["focus_deep_paper_summary"],
            stage: "interpretation",
          },
          {
            id: "quote_extraction",
            title: "Key Quote Extraction",
            summary: "Extract high-signal quotes with pointers for citation.",
            promptIds: ["focus_quote_extraction"],
            stage: "writing",
          },
        ],
      },
      {
        id: "understand",
        title: "Understand",
        description: "Turn complex ideas into clear, layered explanations.",
        steps: [
          {
            id: "concept_explanation",
            title: "Concept Deep Explanation",
            summary: "Socratic ladder from high school to PhD-level nuance.",
            promptIds: ["focus_concept_explanation"],
            stage: "interpretation",
          },
          {
            id: "internal_fact_check",
            title: "Internal Fact Check",
            summary: "Validate claims strictly against attached documents.",
            promptIds: ["focus_internal_fact_check"],
            stage: "interpretation",
          },
        ],
      },
      {
        id: "synthesize",
        title: "Synthesize",
        description: "Assess novelty and validate claims externally.",
        steps: [
          {
            id: "novelty_assessment",
            title: "Novelty Assessment",
            summary: "Compare new ideas against recent literature.",
            promptIds: ["focus_novelty_assessment"],
            stage: "design",
          },
          {
            id: "external_verification",
            title: "External Source Verification",
            summary: "Find supporting and contradicting evidence for claims.",
            promptIds: ["focus_external_verification"],
            stage: "writing",
          },
        ],
      },
    ],
    sourceNote: "Academic Use Toolkit.md (FOCUS workflow)",
  },
  {
    id: "exhyte",
    title: "EXHYTE Cycle (Explore → Hypothesize → Test)",
    description:
      "A data-intensive discovery loop that formalizes exploration, hypothesis generation, and validation.",
    stages: ["design", "analysis", "interpretation"],
    researchTypes: ["quantitative", "computational", "experimental", "mixed_methods"],
    tags: ["ideation", "hypotheses", "validation"],
    steps: [
      {
        id: "exhyte_explore",
        title: "Explore",
        summary: "Structure queries, retrieve data, and assemble knowledge gaps.",
        promptIds: ["focus_academic_deep_search", "p05_semantic_gap"],
        stage: "design",
      },
      {
        id: "exhyte_hypothesize",
        title: "Hypothesize",
        summary: "Generate and prioritize hypotheses with novelty checks.",
        promptIds: ["focus_novelty_assessment"],
        stage: "design",
      },
      {
        id: "exhyte_test",
        title: "Test",
        summary: "Design experiments or analyses and iterate on results.",
        promptIds: ["p01_hybrid_stats", "workflow_plan_execute_test_fix"],
        stage: "analysis",
      },
    ],
    sourceNote: "Academic Use Toolkit.md (EXHYTE)",
  },
  {
    id: "autoresearcher",
    title: "AutoResearcher: 4-Stage Ideation Pipeline",
    description:
      "Structured ideation with knowledge curation, idea generation, filtering, and expert synthesis.",
    stages: ["design"],
    researchTypes: ["qualitative", "quantitative", "mixed_methods", "theoretical"],
    tags: ["ideation", "knowledge_graphs"],
    steps: [
      {
        id: "auto_curate",
        title: "Structured Knowledge Curation",
        summary: "Retrieve literature and build a lightweight knowledge graph.",
        promptIds: ["focus_academic_deep_search"],
        stage: "design",
      },
      {
        id: "auto_generate",
        title: "Diversified Idea Generation",
        summary: "Generate candidate directions using structured exploration.",
        promptIds: ["p05_semantic_gap"],
        stage: "design",
      },
      {
        id: "auto_select",
        title: "Multi-stage Idea Selection",
        summary: "Deduplicate and align ideas against prior work.",
        promptIds: ["focus_novelty_assessment"],
        stage: "design",
      },
      {
        id: "auto_panel",
        title: "Expert Panel Review & Synthesis",
        summary: "Simulate reviewers to critique and refine ideas.",
        promptIds: ["p02_reviewer_logic_audit"],
        stage: "design",
      },
    ],
    sourceNote: "Academic Use Toolkit.md (AutoResearcher)",
  },
  {
    id: "deepresearch-eco",
    title: "DeepResearchEco: Recursive Search Workflow",
    description:
      "A recursive literature search loop balancing depth and breadth for complex questions.",
    stages: ["design"],
    researchTypes: ["systematic_review", "qualitative", "quantitative", "mixed_methods"],
    tags: ["literature", "recursion"],
    steps: [
      {
        id: "dre_query",
        title: "Query Generation",
        summary: "Convert questions into diverse search queries and goals.",
        promptIds: ["focus_academic_deep_search"],
        stage: "design",
      },
      {
        id: "dre_loop",
        title: "Recursive Search Loop",
        summary: "Search, summarize, and iterate until depth is reached.",
        promptIds: ["focus_deep_paper_summary"],
        stage: "design",
      },
      {
        id: "dre_report",
        title: "Report Generation",
        summary: "Synthesize findings into a structured report with citations.",
        promptIds: ["p06_evidence_table"],
        stage: "writing",
      },
    ],
    sourceNote: "Academic Use Toolkit.md (DeepResearchEco)",
  },
  {
    id: "scideator",
    title: "Scideator: Facet-Based Recombination",
    description:
      "Breaks fixation by recombining purpose, mechanism, and evaluation facets.",
    stages: ["design"],
    researchTypes: ["theoretical", "qualitative", "mixed_methods"],
    tags: ["creativity", "novelty"],
    steps: [
      {
        id: "scideator_facets",
        title: "Facet Extraction",
        summary: "Extract purpose, mechanism, and evaluation from seed papers.",
        promptIds: ["focus_deep_paper_summary"],
        stage: "design",
      },
      {
        id: "scideator_retrieve",
        title: "Analogous Retrieval",
        summary: "Find analogous papers across near/far domains.",
        promptIds: ["focus_academic_deep_search"],
        stage: "design",
      },
      {
        id: "scideator_recombine",
        title: "Recombination",
        summary: "Mix facets to generate new hypotheses or concepts.",
        promptIds: ["p05_semantic_gap"],
        stage: "design",
      },
      {
        id: "scideator_verify",
        title: "Novelty Verification",
        summary: "Validate novelty of the recombined idea.",
        promptIds: ["focus_novelty_assessment"],
        stage: "design",
      },
    ],
    sourceNote: "Academic Use Toolkit.md (Scideator)",
  },
  {
    id: "plan-execute-test-fix",
    title: "Plan → Execute → Test → Fix (Code & Data Analysis)",
    description:
      "Reliable AI-assisted coding workflow with testing and iterative repair.",
    stages: ["data_qc", "analysis"],
    researchTypes: ["quantitative", "computational"],
    tags: ["code", "analysis"],
    steps: [
      {
        id: "petf_plan",
        title: "Plan",
        summary: "Outline objectives, libraries, and evaluation criteria.",
        promptIds: ["workflow_plan_execute_test_fix"],
        stage: "data_qc",
      },
      {
        id: "petf_execute",
        title: "Execute",
        summary: "Generate code to run the analysis.",
        promptIds: ["workflow_plan_execute_test_fix"],
        stage: "analysis",
      },
      {
        id: "petf_test",
        title: "Test",
        summary: "Run code in a sandbox and capture failures.",
        promptIds: ["workflow_plan_execute_test_fix"],
        stage: "analysis",
      },
      {
        id: "petf_fix",
        title: "Fix",
        summary: "Iteratively correct failures and document changes.",
        promptIds: ["workflow_plan_execute_test_fix"],
        stage: "analysis",
      },
    ],
    sourceNote: "Academic Use Toolkit.md (Plan-Execute-Test-Fix)",
  },
  {
    id: "bioplanner",
    title: "BioPlanner: Protocol Formulation",
    description:
      "Convert high-level goals into executable lab protocols with validation.",
    stages: ["measures", "analysis"],
    researchTypes: ["experimental"],
    tags: ["protocols", "lab"],
    steps: [
      {
        id: "bio_decompose",
        title: "Task Decomposition",
        summary: "Break goals into discrete lab steps.",
        stage: "measures",
      },
      {
        id: "bio_pseudocode",
        title: "Protocol Pseudocode",
        summary: "Translate steps into structured, machine-readable actions.",
        stage: "analysis",
      },
      {
        id: "bio_validate",
        title: "Protocol Validation",
        summary: "Check protocol accuracy against references.",
        stage: "analysis",
      },
    ],
    sourceNote: "Academic Use Toolkit.md (BioPlanner)",
  },
  {
    id: "six-stage-autonomous-scientist",
    title: "Six-Stage Autonomous Scientist Framework",
    description:
      "High-level map of the research lifecycle for organizing resources and flows.",
    stages: ["design", "measures", "data_qc", "analysis", "interpretation", "writing"],
    researchTypes: ["qualitative", "quantitative", "mixed_methods", "computational", "experimental", "systematic_review", "theoretical"],
    tags: ["lifecycle", "framework"],
    steps: [
      {
        id: "stage_literature",
        title: "Literature Review",
        summary: "Extract and structure prior work.",
        stage: "design",
      },
      {
        id: "stage_idea",
        title: "Idea Generation",
        summary: "Form hypotheses and research questions.",
        stage: "design",
      },
      {
        id: "stage_prep",
        title: "Experimental Preparation",
        summary: "Define variables, datasets, and protocols.",
        stage: "measures",
      },
      {
        id: "stage_execution",
        title: "Experimental Execution",
        summary: "Run experiments or simulations.",
        stage: "analysis",
      },
      {
        id: "stage_writing",
        title: "Scientific Writing",
        summary: "Organize evidence and craft narrative.",
        stage: "writing",
      },
      {
        id: "stage_publication",
        title: "Paper Generation",
        summary: "Finalize the manuscript and submission artifacts.",
        stage: "writing",
      },
    ],
    sourceNote: "Academic Use Toolkit.md (Six-Stage Framework)",
  },
  {
    id: "manuscript-review-pipeline",
    title: "Manuscript Review Pipeline",
    description:
      "A staged peer-review simulation to stress-test logic, structure, and language.",
    stages: ["interpretation", "writing"],
    researchTypes: ["qualitative", "quantitative", "mixed_methods", "theoretical"],
    tags: ["peer_review", "revision"],
    steps: [
      {
        id: "review_setup",
        title: "Review Setup",
        summary: "Define venue, role, and review priorities.",
        promptIds: ["toolkit_peer_review_setup"],
        stage: "writing",
      },
      {
        id: "review_structure",
        title: "Macro Structure & Logic",
        summary: "Validate the argument chain and section alignment.",
        promptIds: ["toolkit_macro_logic_review"],
        stage: "interpretation",
      },
      {
        id: "review_critique",
        title: "Deep Critique & Novelty",
        summary: "Stress-test methodology, overclaims, and novelty.",
        promptIds: ["toolkit_deep_critique", "focus_novelty_assessment"],
        stage: "interpretation",
      },
      {
        id: "review_language",
        title: "Language & Formatting",
        summary: "Polish language and check formatting consistency.",
        promptIds: ["toolkit_language_polish", "toolkit_formatting_check"],
        stage: "writing",
      },
    ],
    sourceNote: "Academic Use Toolkit.md (Sample Workflow)",
  },
]

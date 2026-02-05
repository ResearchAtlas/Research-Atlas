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
    tags: ["Literature", "Verification", "Synthesis"],
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
            promptIds: ["focus_1_social_scan"],
            stage: "design",
          },
          {
            id: "academic_deep_search",
            title: "Academic Deep Search",
            summary: "Collect high-quality, recent academic sources and map themes.",
            promptIds: ["focus_2_deep_search"],
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
            promptIds: ["focus_3_transcription"],
            stage: "data_qc",
          },
          {
            id: "discussion_mining",
            title: "Discussion Mining",
            summary: "Extract claims, debates, and implications from forums.",
            promptIds: ["focus_4_discussion"],
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
            promptIds: ["focus_5_paper_summary"],
            stage: "interpretation",
          },
          {
            id: "quote_extraction",
            title: "Key Quote Extraction",
            summary: "Extract high-signal quotes with pointers for citation.",
            promptIds: ["focus_6_quotes"],
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
            promptIds: ["focus_7_concept"],
            stage: "interpretation",
          },
          {
            id: "internal_fact_check",
            title: "Internal Fact Check",
            summary: "Validate claims strictly against attached documents.",
            promptIds: ["focus_8_fact_check"],
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
            promptIds: ["focus_9_novelty"],
            stage: "design",
          },
          {
            id: "external_verification",
            title: "External Source Verification",
            summary: "Find supporting and contradicting evidence for claims.",
            promptIds: ["focus_10_verification"],
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
    tags: ["Ideation", "Hypotheses", "Validation"],
    steps: [
      {
        id: "exhyte_explore",
        title: "Explore",
        summary: "Structure queries, retrieve data, and assemble knowledge gaps.",
        promptIds: ["focus_2_deep_search", "p05_semantic_gap"],
        stage: "design",
      },
      {
        id: "exhyte_hypothesize",
        title: "Hypothesize",
        summary: "Generate and prioritize hypotheses with novelty checks.",
        promptIds: ["focus_9_novelty"],
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
    tags: ["Ideation", "Knowledge_Graphs"],
    steps: [
      {
        id: "auto_curate",
        title: "Structured Knowledge Curation",
        summary: "Retrieve literature and build a lightweight knowledge graph.",
        promptIds: ["focus_2_deep_search"],
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
        promptIds: ["focus_9_novelty"],
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
    tags: ["Literature", "Recursion"],
    steps: [
      {
        id: "dre_query",
        title: "Query Generation",
        summary: "Convert questions into diverse search queries and goals.",
        promptIds: ["focus_2_deep_search"],
        stage: "design",
      },
      {
        id: "dre_loop",
        title: "Recursive Search Loop",
        summary: "Search, summarize, and iterate until depth is reached.",
        promptIds: ["focus_5_paper_summary"],
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
    tags: ["Creativity", "Novelty"],
    steps: [
      {
        id: "scideator_facets",
        title: "Facet Extraction",
        summary: "Extract purpose, mechanism, and evaluation from seed papers.",
        promptIds: ["focus_5_paper_summary"],
        stage: "design",
      },
      {
        id: "scideator_retrieve",
        title: "Analogous Retrieval",
        summary: "Find analogous papers across near/far domains.",
        promptIds: ["focus_2_deep_search"],
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
        promptIds: ["focus_9_novelty"],
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
    tags: ["Code", "Analysis"],
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
    tags: ["Protocols", "Lab"],
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
    tags: ["Lifecycle", "Framework"],
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
    tags: ["Peer_Review", "Revision"],
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
        promptIds: ["toolkit_deep_critique", "focus_9_novelty"],
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
  {
    id: "w1_ops",
    title: "Operationalization",
    description: "Systematic conceptual refinement and variable definition.",
    stages: ["design", "measures"],
    researchTypes: ["quantitative", "mixed_methods", "experimental"],
    tags: ["Toolkit", "Operationalization", "Design"],
    steps: [
      { id: "w1_s1_construct", title: "Scale of Abstraction", summary: "Define the ladder from abstract to concrete.", promptIds: ["w1_s1_construct"], stage: "design" },
      { id: "w1_s2_measurement", title: "Measurement Strategy", summary: "Select and justify measurement approach.", promptIds: ["w1_s2_measurement"], stage: "measures" },
      { id: "w1_s3_protocol", title: "Protocol Design", summary: "Draft step-by-step data collection protocol.", promptIds: ["w1_s3_protocol"], stage: "measures" },
      { id: "w1_s4_sanity", title: "Sanity Checks", summary: "Pre-mortem and reality check.", promptIds: ["w1_s4_sanity"], stage: "design" },
      { id: "w1_s5_ethics", title: "Ethics Audit", summary: "Review ethical implications.", promptIds: ["w1_s5_ethics"], stage: "design" },
      { id: "w1_s6_prereg", title: "Pre-registration", summary: "Generate pre-registration draft.", promptIds: ["w1_s6_prereg"], stage: "design" },
    ],
    sourceNote: "Academic Use Toolkit.md (Workflow 1)",
  },
  {
    id: "w2_comp",
    title: "Compliance-Ready Data",
    description: "Ensure data handling meets privacy and ethics standards.",
    stages: ["data_qc", "design"],
    researchTypes: ["quantitative", "mixed_methods", "qualitative"],
    tags: ["Toolkit", "Compliance", "Ethics"],
    steps: [
      { id: "w2_s1_checklist", title: "Compliance Checklist", summary: "Initial regulatory assessment.", promptIds: ["w2_s1_checklist"], stage: "design" },
      { id: "w2_s2_data", title: "Data Minimization", summary: "Reduce data collection to essentials.", promptIds: ["w2_s2_data"], stage: "design" },
      { id: "w2_s3_privacy", title: "Privacy Impact", summary: "Assess privacy risks.", promptIds: ["w2_s3_privacy"], stage: "design" },
      { id: "w2_s4_bias", title: "Bias Audit", summary: "Check for sampling and algorithmic bias.", promptIds: ["w2_s4_bias"], stage: "design" },
      { id: "w2_s5_statement", title: "Ethics Statement", summary: "Draft formal ethics statement.", promptIds: ["w2_s5_statement"], stage: "writing" },
    ],
    sourceNote: "Academic Use Toolkit.md (Workflow 2)",
  },
  {
    id: "w3_stress",
    title: "Stress Test",
    description: "Rigorous robustness checks and sensitivity analysis.",
    stages: ["analysis"],
    researchTypes: ["quantitative", "computational"],
    tags: ["Toolkit", "Robustness", "Analysis"],
    steps: [
      { id: "w3_s1_baseline", title: "Baseline Spec", summary: "Document core model.", promptIds: ["w3_s1_baseline"], stage: "analysis" },
      { id: "w3_s2_assumptions", title: "Assumption Audit", summary: "Map assumptions to tests.", promptIds: ["w3_s2_assumptions"], stage: "analysis" },
      { id: "w3_s3_alternatives", title: "Alternative Specs", summary: "Generate robustness variants.", promptIds: ["w3_s3_alternatives"], stage: "analysis" },
      { id: "w3_s4_heterogeneity", title: "Heterogeneity", summary: "Plan subgroup analysis.", promptIds: ["w3_s4_heterogeneity"], stage: "analysis" },
      { id: "w3_s5_placebo", title: "Placebo Tests", summary: "Design falsification tests.", promptIds: ["w3_s5_placebo"], stage: "analysis" },
      { id: "w3_s6_missingness", title: "Missing Data", summary: "Evaluate missingness impact.", promptIds: ["w3_s6_missingness"], stage: "analysis" },
      { id: "w3_s7_matrix", title: "Robustness Matrix", summary: "Synthesize all checks.", promptIds: ["w3_s7_matrix"], stage: "writing" },
    ],
    sourceNote: "Academic Use Toolkit.md (Workflow 3)",
  },
  {
    id: "w4_cite",
    title: "Citation Hygiene",
    description: "Ensure claims are supported and citations are correct.",
    stages: ["writing", "review"],
    researchTypes: ["theoretical", "systematic_review", "mixed_methods"],
    tags: ["Toolkit", "Citations", "Writing"],
    steps: [
      { id: "w4_s1_claims", title: "Atomic Claims", summary: "List citeable claims.", promptIds: ["w4_s1_claims"], stage: "writing" },
      { id: "w4_s2_policy", title: "Evidence Policy", summary: "Define acceptable evidence.", promptIds: ["w4_s2_policy"], stage: "design" },
      { id: "w4_s3_alignment", title: "Claim Alignment", summary: "Audit claims against sources.", promptIds: ["w4_s3_alignment"], stage: "review" },
      { id: "w4_s4_bib", title: "Bibliography", summary: "Format references.", promptIds: ["w4_s4_bib"], stage: "writing" },
      { id: "w4_s5_audit", title: "Audit Log", summary: "Track changes and gaps.", promptIds: ["w4_s5_audit"], stage: "review" },
    ],
    sourceNote: "Academic Use Toolkit.md (Workflow 4)",
  },
  {
    id: "w5_repro",
    title: "Repro Pack",
    description: "Prepare a complete replication package.",
    stages: ["data_qc", "writing"],
    researchTypes: ["quantitative", "computational"],
    tags: ["Toolkit", "Reproducibility", "Packaging"],
    steps: [
      { id: "w5_s1_inventory", title: "Inventory", summary: "Map repo structure.", promptIds: ["w5_s1_inventory"], stage: "data_qc" },
      { id: "w5_s2_env", title: "Environment", summary: "Spec environment requirements.", promptIds: ["w5_s2_env"], stage: "data_qc" },
      { id: "w5_s3_provenance", title: "Provenance", summary: "Document data lineage.", promptIds: ["w5_s3_provenance"], stage: "data_qc" },
      { id: "w5_s4_runbook", title: "Runbook", summary: "Write reproduction guide.", promptIds: ["w5_s4_runbook"], stage: "writing" },
      { id: "w5_s5_manifest", title: "Manifest", summary: "Define acceptance criteria.", promptIds: ["w5_s5_manifest"], stage: "data_qc" },
    ],
    sourceNote: "Academic Use Toolkit.md (Workflow 5)",
  },
  {
    id: "w6_rebut",
    title: "Revise and Rebut",
    description: "Manage peer review responses and revisions.",
    stages: ["review", "writing"],
    researchTypes: ["qualitative", "quantitative", "mixed_methods", "theoretical"],
    tags: ["Toolkit", "Revision", "Peer_Review"],
    steps: [
      { id: "w6_s1_triage", title: "Triage", summary: "Classify reviewer comments.", promptIds: ["w6_s1_triage"], stage: "review" },
      { id: "w6_s2_mapping", title: "Mapping", summary: "Link comments to sections.", promptIds: ["w6_s2_mapping"], stage: "review" },
      { id: "w6_s3_plan", title: "Revision Plan", summary: "Prioritize tasks.", promptIds: ["w6_s3_plan"], stage: "review" },
      { id: "w6_s4_matrix", title: "Response Matrix", summary: "Draft response table.", promptIds: ["w6_s4_matrix"], stage: "writing" },
      { id: "w6_s5_rebuttal", title: "Rebuttal Letter", summary: "Draft cover letter.", promptIds: ["w6_s5_rebuttal"], stage: "writing" },
    ],
    sourceNote: "Academic Use Toolkit.md (Workflow 6)",
  },
]

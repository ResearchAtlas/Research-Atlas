import type { ResearchStage, ResearchType } from "@/data/taxonomy"

export type GuideGroup =
  | "Introduction"
  | "Core Guides"
  | "Research Stages"
  | "Methodology"

export interface GuideSection {
  id: string
  title: string
  body?: string
  bullets?: string[]
}

export interface GuideSource {
  title: string
  url?: string
}

export interface Guide {
  id: string
  title: string
  summary: string
  group: GuideGroup
  stages: ResearchStage[]
  researchTypes: ResearchType[]
  tags: string[]
  sections: GuideSection[]
  lastUpdated: string
  sources: GuideSource[]
  sourceNote?: string
}

type GuideDraft = Omit<Guide, "lastUpdated" | "sources">

const RAW_GUIDES: GuideDraft[] = [
  {
    id: "welcome",
    title: "Welcome to Research Atlas",
    summary: "Your central hub for rigorous, AI-enabled research workflows.",
    group: "Introduction",
    stages: ["design"],
    researchTypes: ["qualitative", "quantitative", "mixed_methods"],
    tags: ["welcome", "onboarding"],
    sections: [
      {
        id: "intro",
        title: "Introduction",
        body: "Research Atlas is designed to bridge the gap between academic rigor and agentic AI. As the landscape of scientific inquiry shifts from discrete automation to autonomous discovery, this platform provides the structured cognitive scaffolding necessary to ensure your AI-assisted research remains valid, reproducible, and ethically sound."
      },
      {
        id: "getting-started",
        title: "Getting Started",
        body: "To get the most out of Research Atlas, we recommend following this path:",
        bullets: [
          "**Explore the Core Guides**: Understand the fundamental frameworks like COSTAR and the VERIFY protocol.",
          "**Select Your Stage**: Use the sidebar to find resources tailored to your current research phase (Design, Analysis, Writing).",
          "**Use the Library**: Copy field-tested prompts directly into your workflows."
        ]
      },
      {
        id: "philosophy",
        title: "Our Philosophy: Rigor First",
        body: "Speed is a byproduct, not the goal. All workflows and prompts in this hub are designed to prioritize verification and depth over simple generation. We believe that AI should be an instrument of insight, not just a shortcut."
      }
    ]
  },
  {
    id: "about-research-atlas",
    title: "About Research Atlas",
    summary: "The mission, methodology, and philosophy behind this platform.",
    group: "Introduction",
    stages: ["design"],
    researchTypes: ["qualitative", "quantitative", "mixed_methods"],
    tags: ["about", "mission"],
    sections: [
      {
        id: "mission",
        title: "Our Mission",
        body: "Research Atlas exists to safeguard the integrity of scientific inquiry in the age of AI. We provide a curated, verified, and rigorous set of tools that empower researchers to leverage agency without compromising on accuracy."
      },
      {
        id: "methodology",
        title: "Our Methodology",
        body: "Every prompt and guide in this library adheres to three core principles:",
        bullets: [
          "**Traceability**: Every output must have a clear provenance.",
          "**Verifiability**: Claims must be checkable against primary sources.",
          "**Reproducibility**: Workflows must yield consistent results across runs."
        ]
      },
      {
        id: "community",
        title: "Community & Contribution",
        body: "Research Atlas is an open initiative. We invite researchers from all disciplines to contribute their validated prompts and workflows. Together, we can define the standards for the next generation of AI-assisted science."
      }
    ]
  },
  {
    id: "ai-research-overview",
    title: "AI in Research: Executive Summary",
    summary:
      "A high-level briefing on using AI for rigorous research without sacrificing integrity.",
    group: "Core Guides",
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
        id: "paradigm-shift",
        title: "The Paradigm Shift: From Automation to Agentic Autonomy",
        body: "The landscape of scientific inquiry is undergoing a fundamental transformation as we move beyond \"AI for Science\"—characterized by discrete task automation—into the \"AI Scientist\" paradigm. This shift represents a strategic transition from utilizing AI as a mere instrument to positioning it as a potential originator of scientific knowledge. By leveraging large language models (LLMs) and multi-agent orchestration, modern research architectures now facilitate end-to-end autonomous discovery. These systems independently design, validate, and execute complex workflows, effectively mirroring the roles of human researchers.\n\nThis evolution is anchored in a \"symmetry of discovery\" that creates a self-improving loop: observe–hypothesize–experiment–analyze–publish. Unlike earlier symbolic reasoning systems constrained by domain specificity, modern autonomous systems like The AI Scientist-v2 and AutoResearcher integrate natural language understanding with agentic tree search to navigate complex problem spaces. This systemic development is best categorized by its rapid evolutionary trajectory:\n\n| Phase | Strategic Focus | Characteristics |\n| :--- | :--- | :--- |\n| **Phase 1 (2022–2023)** | Foundational Modules | Task-specific automation; development of discrete modules for hypothesis generation or literature synthesis. |\n| **Phase 2 (2024)** | Closed-Loop Integration | Emergence of autonomous workflows; integration of planning, retrieval, and reasoning into unified agentic pipelines. |\n| **Phase 3 (2025–Present)** | Scalability & Orchestration | High-impact scalability and multi-agent synergy; deployment of \"Deep Research\" tiers ($200/mo) for 50-page comprehensive analyses. |\n\nThis systemic evolution necessitates a move away from ad-hoc queries toward the structured cognitive and software architectures required to govern these agentic researchers."
      },
      {
        id: "prompting-frameworks",
        title: "Strategic Prompting Frameworks and Workflow Architectures",
        body: "Prompt engineering in modern research has matured from \"ad-hoc trial-and-error\" into a rigorous discipline of cognitive scaffolding. In this framework, structured inputs are no longer simple instructions; they function as software architecture that mirrors the logical pathways of human expertise. By implementing specific constraints and reasoning stages, research strategists ensure that LLMs maintain the structural integrity required for high-fidelity scholarly output.\n\n**The Taxonomy of Scholarly Prompting**",
        bullets: [
          "**Zero-Shot vs. Few-Shot Prompting**: While zero-shot relies on pre-trained knowledge for simple tasks, few-shot prompting provides 1–5 high-quality input-output pairs. This is essential for teaching models complex formatting, specific citation styles, or niche academic tones.",
          "**Chain-of-Thought (CoT) and \"Let’s think step by step\"**: By making intermediate reasoning visible, CoT enhances logical fidelity, allowing models to navigate complex logical or mathematical problems with accuracy levels exceeding 90% on tasks where they previously struggled.",
          "**Decomposition & Least-to-Most**: This involves breaking multi-chapter projects into sequential sub-problems. Solving these in order ensures a more cohesive final product and prevents the model from losing context over long-form outputs.",
          "**Self-Consistency & Self-Refine**: These acts as built-in quality control. Self-consistency runs multiple reasoning paths to find a majority consensus, while self-refine allows the model to critique its own work and generate verification questions to identify errors."
        ]
      },
      {
        id: "auto-researcher",
        title: "The AutoResearcher Pipeline",
        body: "A primary example of this structured architecture is the AutoResearcher framework. Operating by default on GPT-5 / GPT-4.1 models with 32K token max operations, it utilizes a four-stage process for grounded ideation:",
        bullets: [
          "**Structured Knowledge Curation**: Anchors the process by building a Knowledge Graph (KG) from retrieved literature to ensure a traceable context.",
          "**Diversified Idea Generation**: Transforms curated context into hypotheses using literature-informed planning and \"Graph-of-Thought\" exploration.",
          "**Multi-stage Idea Selection**: Employs internal scoring and external similarity checks to filter redundant or weakly-supported ideas.",
          "**Expert Panel Review & Synthesis**: Uses parallel agent reviews to consolidate promising ideas into high-quality research proposals."
        ]
      },
      {
        id: "verification-protocols",
        title: "Verification Protocols and Technical Parameter Control",
        body: "Despite their power, LLMs are prone to the \"Snoopy Problem\"—the inherent risk of hallucinations where a model predicts semantically plausible but factually incorrect patterns. Because AI predicts tokens based on probability rather than retrieving static facts, human-in-the-loop verification is mandatory. Precise control of model parameters serves as the first line of defense.\n\n**Precision Parameters for Research Rigor**\n\n| Parameter | Recommended Setting | Impact on Research |\n| :--- | :--- | :--- |\n| **Temperature** | 0.0 – 0.2 (Fact) / 0.8 – 1.0 (Idea) | Low settings ensure deterministic, factual output for data analysis; high settings are reserved for creative brainstorming and ideation. |\n| **Top-P & Top-K** | Limited Selection | These restrict token selection to the most probable next steps, ensuring \"factuality\" is not compromised by excessive randomness. |"
      },
      {
        id: "citation-crisis",
        title: "The Citation Crisis",
        body: "Current data indicates a critical \"citation crisis\" in generative AI: approximately 40% of AI-generated references are fabricated, and only 26.5% are entirely correct. To combat this, researchers must utilize the VERIFY framework to identify suspicious outputs:",
        bullets: [
          "Vague or \"perfect\" matches to the prompt.",
          "Excessive specificity in numbers or fabricated DOIs.",
          "Recent publication claims that post-date the model’s training cut-off."
        ]
      },
      {
        id: "three-layer-verification",
        title: "The Three-Layer Verification Protocol",
        bullets: [
          "**Quick Verification**: Check citations against databases like CrossRef to ensure DOIs resolve correctly.",
          "**Detailed Verification**: Fact-check primary claims by independently searching established peer-reviewed journals or textbooks.",
          "**Expert Verification**: Consult domain experts for critical claims or when automated checks are inconclusive."
        ]
      },
      {
        id: "computational-rigor",
        title: "Computational Rigor: Data Analysis and Reproducible Pipelines",
        body: "Modern research utilizes a \"literate programming\" approach where narrative analysis is tied directly to underlying statistical code. This ensures that the research narrative and the data used to support it are inextricably linked, facilitating transparency.\n\n**Specialized Analysis Toolsets**",
        bullets: [
          "**Julius AI**: Best for interactive data analysis and natural language-to-Python code generation.",
          "**Elicit & SciSpace**: Optimized for question-based synthesis, extracting data points into evidence matrices across millions of papers.",
          "**Litmaps & ResearchRabbit**: Focused on visual citation mapping, helping researchers reduce \"research blind spots\" by identifying orphan studies and tracking chronological idea evolution."
        ]
      },
      {
        id: "reproducibility",
        title: "The Imperative of Reproducibility",
        body: "The credibility of digital research assets depends on strict reproducibility. Advanced pipelines utilize the R package reproducibleRchunks to integrate statistical computing with narrative text. Furthermore, the use of hashing algorithms like sha256 creates digital \"fingerprints\" of research assets. If any change occurs in the underlying data or code, these fingerprints change, immediately flagging potential issues in reproduction attempts."
      },
      {
        id: "ethical-accountability",
        title: "Ethical Accountability and Regulatory Attribution",
        body: "The academic publishing industry has responded to the AI shift by emphasizing that authorship is a \"uniquely human\" responsibility. Because AI cannot take legal responsibility for its content, it is strictly prohibited from being listed as an author.\n\n**Publisher Policy Matrix**\n\n| Publisher | Accountability Requirement | Disclosure Requirement | Image/Data Policy |\n| :--- | :--- | :--- | :--- |\n| **Elsevier** | Full and Final Human Responsibility | Mandatory AI Declaration Statement | Prohibited (narrow exceptions) |\n| **Springer Nature** | Mandatory Human Accountability | Required in Methods Section | Prohibited (narrow exceptions) |\n| **Wiley** | Full Accountability for Submission | Required in Methods/Acknowledgements | Prohibited for original data |\n| **SAGE** | Entirely Responsible | Required via Formal Citation | Generally Discouraged |"
      },
      {
        id: "standardized-citation",
        title: "Standardized Citation Protocols",
        body: "The 2025 APA Style guidelines require explicit citation of generative AI. Researchers must use \"provenance tracing\" to show the path from source text to final output.\n\n*   **Template**: Author (Company). (Date). Title of Chat [Generative AI chat]. Model Name. URL.\n*   **Example**: OpenAI. (2025, May 10). Comparison of clinical trials in oncology [Generative AI chat]. ChatGPT-5. https://chat.openai.com/share/abc123"
      },
      {
        id: "ip-warning",
        title: "Intellectual Property Warning",
        body: "The U.S. Copyright Office maintains that AI-generated content is not eligible for copyright protection; only human-authored portions are protected. Strategists must caution researchers against uploading unpublished research to public models, as this may violate intellectual property laws or data privacy regulations.\n\n**Final Summary Statement**: AI excels at managing information overload; human expertise remains the sole authority for insight."
      }
    ],
    sourceNote: "AI in research report.md (Executive Summary)",
  },
  {
    id: "prompting-fundamentals",
    title: "Prompting Fundamentals",
    summary: "Core frameworks for reliable research prompting.",
    group: "Core Guides",
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
    group: "Core Guides",
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
    group: "Core Guides",
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
    group: "Methodology",
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
    group: "Methodology",
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
    group: "Methodology",
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

  // ── NotebookLM Research Workflow Guide ───────────────────────────────

  {
    id: "nlm-research-workflow",
    title: "NotebookLM Research Workflow Guide",
    summary:
      "A comprehensive guide to using NotebookLM as a source-grounded research assistant with reproducible workflows, verification guardrails, and team-based quality control.",
    group: "Methodology",
    stages: ["design", "data_qc", "analysis", "interpretation", "writing", "review", "visualization"],
    researchTypes: [
      "qualitative",
      "quantitative",
      "mixed_methods",
      "systematic_review",
      "theoretical",
    ],
    tags: ["NotebookLM", "workflow", "verification", "source-grounded", "reproducibility"],
    sections: [
      {
        id: "overview",
        title: "Overview",
        body: "This guide covers a reproducible, source-grounded research workflow built around Google NotebookLM. It is designed for literature reviews, policy scans, technical briefs, stakeholder memos, and early-stage research scoping. NotebookLM excels at answering questions grounded in your uploaded sources with clickable, inspectable citations and producing reusable research artifacts via Studio. See the [NotebookLM Research Workflow](/workflows/nlm-research-workflow) for the step-by-step procedure, and search the [Prompt Library](/library?q=NotebookLM) for all copy-paste prompts.",
      },
      {
        id: "capabilities-and-limits",
        title: "NotebookLM Capabilities and Practical Limits",
        body: "Understanding what NotebookLM does well and where it has limitations is essential for planning your source strategy.",
        bullets: [
          "**Source-grounded answers** with clickable, inspectable citations you can verify.",
          "**Studio outputs**: reports, mind maps, audio and video overviews exportable to Google Docs or Sheets.",
          "**Per-notebook source cap** and per-source size cap require a deliberate source strategy (merge small docs, archive distilled notes).",
          "**Best suited for**: literature reviews, policy scans, technical briefs, and research scoping.",
          "**Not suitable for**: generating new facts without sources, or workflows where citations cannot be verified.",
        ],
      },
      {
        id: "reproducibility-framework",
        title: "Reproducibility Framework",
        body: "Before uploading any sources, define conventions in a pinned note called README - Notebook Protocol. This ensures every notebook is reproducible and traceable.",
        bullets: [
          "**Notebook naming**: `{{project}} | {{topic}} | v{{major.minor}} | {{YYYY-MM-DD}}`",
          "**Source naming by type**: `A01_authority_title_year.pdf`, `E01_empirical_title_year.pdf`, `R01_review_title_year.pdf`, `C01_critique_title_year.pdf`",
          "**Saved Notes naming**: `N01_source_inventory`, `N02_key_definitions`, `N03_conflicts_C1_to_Cn`, `N04_gap_audit`, `N05_synthesis_outline`",
          "**Protocol fields**: topic name, time window, inclusion/exclusion rules, evidence grading (high/medium/low).",
          "**Configuration defaults**: Turn on Learning Guide mode for comprehension, use the **Feynman Technique (teach-back)** to test understanding, use Mind Map for theme structure, and use Audio Overview for repetition during fragmented time or commuting.",
        ],
      },
      {
        id: "information-collision",
        title: "The Information Collision Principle",
        body: "Prevent shallow consensus summaries by deliberately mixing source types. This forces the model to compare claims and evidence rather than just paraphrase.",
        bullets: [
          "For every major claim area, upload at least **1 authoritative source** (guideline, standard, official report), include **industry reviews**, include **empirical papers** (studies or dataset reports), and include **blog posts** or critiques that present opposing viewpoints.",
          "After uploading, ask NotebookLM to map conflicts in opinions, compare multi-faceted arguments and supporting evidence, and explain the logic behind each perspective.",
          "**PDF Megazord strategy**: when hitting source caps, merge many short documents into one mega PDF. Maintain an external index mapping original titles to page ranges. Use the Mega PDF Internal Index prompt to recover granularity.",
        ],
      },
      {
        id: "lab-sop-roles",
        title: "Lab SOP: Roles and Responsibilities",
        body: "Standardized roles for team-based NotebookLM research.",
        bullets: [
          "**Research Lead (RL)**: defines question, scope, acceptance criteria, final sign-off.",
          "**Analyst (AN)**: builds notebook, uploads sources, runs prompt pack, drafts outputs.",
          "**Verifier (VR)**: clicks citations, checks claim fidelity, runs audit prompts, logs issues.",
          "**Archivist (AR)**: manages naming, saved notes, exports, versioning.",
          "**Small teams**: RL + AN, with VR as a second pass before anything is shared externally.",
        ],
      },
      {
        id: "required-artifacts",
        title: "Required Artifacts",
        body: "The following deliverables must be produced and stored in the project folder.",
        bullets: [
          "`00_readme_protocol.md` \u2014 this SOP filled in",
          "`01_source_inventory.csv` \u2014 source inventory table",
          "`02_conflict_matrix.md` \u2014 conflict clusters",
          "`03_gap_audit.md` \u2014 blind spots and missing evidence",
          "`04_synthesis_outline.md` \u2014 citation-anchored outline",
          "`05_final_deliverable.docx` (or .md) \u2014 final output",
          "`verification_log.md` \u2014 attribution audit trail",
        ],
      },
      {
        id: "qc-gates",
        title: "Quality Control Gates",
        body: "Each stage has a QC gate that must be passed before proceeding to the next. These are policy checkpoints, not procedural steps.",
        bullets: [
          "**Framing**: Question is specific, testable, and matches scope; rubric has 5-8 criteria.",
          "**Source inventory**: Each source tagged by type and mapped to a subquestion.",
          "**Comprehension**: Key terms defined with citations; misunderstandings documented and corrected.",
          "**Extraction**: No filler summaries; every bullet cited; methods, sample, measures captured.",
          "**Conflict matrix**: Each cluster has Claim A, Claim B, evidence, and reason; all claims traceable.",
          "**Gap audit**: Missing data identified; next-source plan is concrete (source types, not random links).",
          "**Synthesis**: Each outline bullet includes citation anchors; uncertainty labeled.",
          "**Verification**: All key claims have verified citations; interpretive statements labeled.",
          "**Export**: Deliverable includes a 'What to verify' checklist and notebook version.",
        ],
      },
      {
        id: "verification-principles",
        title: "Verification Principles (Non-Negotiable)",
        body: "Even in source-grounded tools, interpretive overconfidence and hallucinations remain major failure modes: turning attributed statements into universal claims, adding unsupported characterizations, or fabricating document intent. Verification must be part of the workflow, not an afterthought.",
        bullets: [
          "**Click citations** and read the original passage for every key claim. Do not trust summaries without checking the cited text.",
          "Treat every AI summary as a draft: it can still hallucinate, omit context, or overstate certainty.",
          "**Run an attribution stress test** before exporting anything.",
          "If a cited passage cannot be found, **remove the claim** or label it as unverified.",
          "Maintain a running list of **Known uncertainties** in every deliverable.",
          "Any statement that is an interpretation must be **labeled as such**, never presented as fact.",
        ],
      },
      {
        id: "ouroboros-loop",
        title: "The Ouroboros Loop: Distill and Reuse",
        body: "The Ouroboros loop lets you distill high-value outputs into second-generation sources, improving slot efficiency without re-reading everything.",
        bullets: [
          "Save high-value outputs as **Notes**, then convert Notes into Sources for a distilled second-generation source.",
          "Before converting, ensure every claim in the note has **citations back to originals**.",
          "Mark converted sources as **derived** \u2014 do not treat them as primary evidence.",
          "**Trade-off**: slot efficiency improves, but fine-grained provenance can be lost if notes are too abstract.",
        ],
      },
      {
        id: "saved-note-templates",
        title: "Saved Note Templates",
        body: "Standardized templates for consistent note-taking across the workflow.",
        bullets: [
          "**Evidence extraction note**: Title, key claims (with evidence and citations), methods/measures, limitations, uncertainty flags.",
          "**Conflict cluster note**: Title, Claim A (with citation), Claim B (with citation), reason for disagreement, resolution tests.",
        ],
      },
    ],
    sourceNote: "NotebookLM Research Workflow Guide.md",
  },
]

const DEFAULT_GUIDE_LAST_UPDATED = "2026-02-06"

const GUIDE_LAST_UPDATED: Record<string, string> = {
  welcome: "2026-02-06",
  "about-research-atlas": "2026-02-06",
  "ai-research-overview": "2026-02-05",
  "prompting-fundamentals": "2026-02-05",
  "verification-integrity": "2026-02-05",
  "ethics-policies": "2026-02-05",
  "focus-guide": "2026-02-04",
  quickstart: "2026-02-04",
  glossary: "2026-02-04",
  "nlm-research-workflow": "2026-02-08",
}

export const EDITORIAL_POLICY = [
  "Guides are curated by the Research Atlas editorial team and revised when workflows, policies, or tooling materially change.",
  "Factual claims should be traceable to source documents listed in each guide's Sources section.",
  "Generative outputs are treated as drafts and require researcher verification before use in manuscripts or protocols.",
]

const buildGuideSources = (guide: GuideDraft): GuideSource[] => {
  const sources: GuideSource[] = []

  if (guide.sourceNote) {
    const sourceTitle = guide.sourceNote.replace(/\.md\b/gi, "").trim()
    sources.push({ title: sourceTitle })
  }

  if (guide.id === "ethics-policies") {
    sources.push({
      title: "COPE: Authorship and AI tools guidance",
      url: "https://publicationethics.org/resources/discussion-documents/authorship-and-ai-tools",
    })
  }

  if (guide.id === "nlm-research-workflow") {
    sources.push(
      { title: "Google NotebookLM Help", url: "https://support.google.com/notebooklm/answer/16206563" },
      { title: "NotebookLM FAQ", url: "https://support.google.com/notebooklm/answer/16269187" },
      { title: "NotebookLM Enterprise Overview", url: "https://docs.cloud.google.com/gemini/enterprise/notebooklm-enterprise/docs/overview" },
      { title: "Learning Guide in NotebookLM", url: "https://workspaceupdates.googleblog.com/2025/09/learning-guide-notebook-lm-workspace-education.html" },
      { title: "NotebookLM Studio Updates", url: "https://blog.google/innovation-and-ai/models-and-research/google-labs/notebooklm-video-overviews-studio-upgrades/" },
      { title: "Notes in NotebookLM", url: "https://support.google.com/notebooklm/answer/16262519" },
      { title: "Not Wrong, But Untrue: LLM Overconfidence in Document-Based Queries", url: "https://arxiv.org/abs/2509.25498" },
      { title: "6 ways I circumvent NotebookLM source limitations", url: "https://www.xda-developers.com/dodge-notebooklm-source-limitations/" },
      { title: "10 NotebookLM Super Prompts For Pro-Level Productivity - Analytics Vidhya", url: "https://www.analyticsvidhya.com/blog/2026/01/notebooklm-super-prompts-for-pro-level-productivity/" },
      { title: "Audio Overview in NotebookLM", url: "https://support.google.com/notebooklm/answer/16212820" },
    )
  }

  return sources
}

export const GUIDES: Guide[] = RAW_GUIDES.map((guide) => ({
  ...guide,
  lastUpdated: GUIDE_LAST_UPDATED[guide.id] ?? DEFAULT_GUIDE_LAST_UPDATED,
  sources: buildGuideSources(guide),
}))

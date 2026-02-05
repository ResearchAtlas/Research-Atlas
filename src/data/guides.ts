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
    id: "welcome",
    title: "Welcome to Research Atlas",
    summary: "Your central hub for rigorous, AI-enabled research workflows.",
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

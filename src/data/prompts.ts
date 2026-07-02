import type { ResearchStage, ResearchType } from "@/data/taxonomy"
import type { Provenance } from "@/data/provenance"

export interface PromptContent {
  goal: string
  context: string
  instructions: string
  constraints: string
  outputRequirements: string
}

export interface PromptVariable {
  name: string
  type: "text" | "multiline"
  required: boolean
  description?: string
  defaultValue?: string
}

export interface StaticPrompt {
  id: string
  title: string
  description: string
  stages: ResearchStage[]
  researchTypes: ResearchType[]
  tags: string[]
  framework?: string
  difficulty?: "beginner" | "intermediate" | "advanced"
  content: PromptContent
  variables: PromptVariable[]
  outputFormat: "markdown" | "plain" | "json"
  author: {
    name: string
    url?: string
  }
  provenance: Provenance
}

const toolkitAuthor = { name: "Academic Use Toolkit" }
// Note: atlasAuthor was removed as it was unused
const reportAuthor = { name: "AI in Research Report" }
const nlmAuthor = { name: "NotebookLM Research Workflow Guide" }

const toolkitProvenance: Provenance = {
  source: "Academic Use Toolkit",
  owner: "research-atlas",
  status: "reviewed",
  addedAt: "2026-02-04",
  reviewedAt: "2026-07-02",
}
const reportProvenance: Provenance = {
  source: "AI in Research Report",
  owner: "research-atlas",
  status: "reviewed",
  addedAt: "2026-02-04",
  reviewedAt: "2026-07-02",
}
const nlmProvenance: Provenance = {
  source: "NotebookLM Research Workflow Guide",
  owner: "research-atlas",
  status: "reviewed",
  addedAt: "2026-02-08",
  reviewedAt: "2026-07-02",
}

export const PROMPTS: StaticPrompt[] = [
  {
    id: "toolkit_intro_opening",
    title: "Introduction Opening: Three Narrative Strategies",
    description: "Generate three distinct opening paragraphs using different narrative strategies.",
    stages: ["writing"],
    researchTypes: ["qualitative", "quantitative", "mixed_methods", "theoretical"],
    tags: ["Introduction", "Narrative", "Hook"],
    framework: "COSTAR",
    difficulty: "beginner",
    content: {
      goal: "Produce three versions of an opening paragraph for a research introduction.",
      context: "You are a top-tier science writer crafting a doctoral introduction.",
      constraints: "Each version must use a distinct narrative strategy and remain academically rigorous.",
      instructions: `Act as a science writer drafting a doctoral introduction. Develop three distinct versions of the opening paragraph for my doctoral research {{research_topic}} using the following narrative strategies:
- Strategy A: Historical Evolution Approach - Begin with the historical origins of the research question or field, outline a clear evolutionary trajectory, and identify the current critical juncture.

- Strategy B: Paradox-Conflict Approach - Present an apparent contradiction or paradox between a widely accepted view in the field and a puzzling, recent empirical fact to create research tension.

- Strategy C: Case-Story Approach - Open with a typical, vivid, and representative specific case or story, using a microcosmic perspective to introduce broader, worthy-of-study universal issues.

Ensure each version has a distinct style and achieves the goal of engaging readers and establishing research importance.`,
      outputRequirements: "Return three labeled paragraphs, each distinct in style and hook.",
    },
    variables: [
      { name: "research_topic", type: "text", required: true, description: "Research topic" },
    ],
    outputFormat: "markdown",
    author: toolkitAuthor,
    provenance: toolkitProvenance,
  },
  {
    id: "toolkit_significance_urgency",
    title: "Significance & Urgency Rhetorical Enhancement",
    description: "Reframe significance from academic to societal impact with urgency.",
    stages: ["writing"],
    researchTypes: ["qualitative", "quantitative", "mixed_methods", "theoretical"],
    tags: ["Significance", "Grant", "Urgency"],
    framework: "COSTAR",
    difficulty: "beginner",
    content: {
      goal: "Elevate the significance and urgency of a research question.",
      context: "You are a professional grant proposal writer.",
      constraints: "Avoid empty slogans; maintain academic rigor.",
      instructions: `Act as a grant proposal writer. Rhetorically strengthen my plain statement regarding the significance of my research question {{statement}}.
First, expand the argumentative perspective from an academic internal focus to a social external one. Clearly demonstrate the potential, non-negligible negative impacts that would result for {{social_dimension}} if this issue remains unsolved.
Second, infuse a sense of timeliness or urgency into addressing this issue. Argue why now is the optimal—or even the final—time window to research this question (e.g., due to the emergence of new data, the implementation of a policy, or the prominence of a social trend).
Finally, package the above arguments in more impactful and persuasive language, while avoiding empty slogans and maintaining academic rigor.`,
      outputRequirements: "Return a refined, persuasive paragraph.",
    },
    variables: [
      { name: "statement", type: "multiline", required: true, description: "Significance statement" },
      { name: "social_dimension", type: "text", required: false, description: "Specific social dimension, industry, or welfare area affected (optional)" },
    ],
    outputFormat: "markdown",
    author: toolkitAuthor,
    provenance: toolkitProvenance,
  },
  {
    id: "toolkit_lit_debate",
    title: "Literature Review as Academic Debate",
    description: "Restructure a literature review around opposing schools and debates.",
    stages: ["writing"],
    researchTypes: ["qualitative", "quantitative", "mixed_methods", "theoretical"],
    tags: ["Literature_Review", "Debate"],
    framework: "COSTAR",
    difficulty: "intermediate",
    content: {
      goal: "Reframe a literature review as a debate between academic camps.",
      context: "You are an academic debate organizer.",
      constraints: "Avoid chronological order or simple listing.",
      instructions: `As an academic debate organizer, help me restructure the literature review section in my introduction. I will provide my draft literature review.
Avoid chronological order or simple listing of viewpoints. First, identify {{n_camps}} major, opposing academic camps or theoretical schools around the core issue in my research field.
Second, restructure my literature review as an academic debate about the core divergences between these camps. Clearly articulate each side's core arguments, key evidence, and respective theoretical weaknesses.
Finally, precisely position my own research as an intervener in this debate. Clearly indicate how my research will support one side, reconcile contradictions between sides, or transcend the debate itself by providing new evidence or perspectives.

Base the camps and arguments strictly on the literature review draft provided; do not invent studies, authors, or findings not present in the draft, and flag any camp where the evidence is thin.

Draft Literature Review:
{{literature_review_draft}}`,
      outputRequirements: "Return a structured debate-style literature review.",
    },
    variables: [
      { name: "literature_review_draft", type: "multiline", required: true, description: "Literature review draft" },
      { name: "n_camps", type: "text", required: true, description: "Number of camps (e.g., '2-3')" },
    ],
    outputFormat: "markdown",
    author: toolkitAuthor,
    provenance: toolkitProvenance,
  },
  {
    id: "toolkit_pivot_sentences",
    title: "Pivot Sentences: Literature Review → Research Gap",
    description: "Write concise pivot sentences that transition to the research gap.",
    stages: ["writing"],
    researchTypes: ["qualitative", "quantitative", "mixed_methods", "theoretical"],
    tags: ["Transition", "Gap"],
    framework: "COSTAR",
    difficulty: "beginner",
    content: {
      goal: "Craft extremely concise and powerful pivot sentences.",
      context: "You are a rhetorician proficient in academic writing’s cohesion and transition.",
      constraints: "Ensure the transition is inevitable and persuasive.",
      instructions: `As a rhetorician proficient in academic writing's cohesion and transition, please refine the most critical transition section in my introduction. I will provide the concluding paragraph of my literature review and my preliminary statement of research gap.
Your task is to write 1 to 3 extremely concise, logically rigorous, and powerful pivot sentences between these two elements. These sentences need to perfectly transition from summarizing others' work (what they have done) to introducing my research (what I will do).
Attempt to use classic sentence structures such as "Despite extensive research…, they have generally overlooked…" or "These contradictions in the existing literature precisely point to a deeper, unresolved question:…" and ensure the transition is inevitable and persuasive.

Research Topic: {{research_topic}}
Known Limits / Literature Conclusion: {{known_limits}}
Your Contribution / Gap Statement: {{your_contribution}}`,
      outputRequirements: "Return 1–3 pivot sentences.",
    },
    variables: [
      { name: "research_topic", type: "text", required: true },
      { name: "known_limits", type: "multiline", required: true },
      { name: "your_contribution", type: "multiline", required: true },
    ],
    outputFormat: "markdown",
    author: toolkitAuthor,
    provenance: toolkitProvenance,
  },
  {
    id: "toolkit_theoretical_dialogue",
    title: "Theoretical Dialogue Positioning",
    description: "Clarify the theoretical dialogue your research joins.",
    stages: ["writing"],
    researchTypes: ["theoretical", "qualitative", "mixed_methods"],
    tags: ["Theory", "Positioning"],
    framework: "COSTAR",
    difficulty: "intermediate",
    content: {
      goal: "Demonstrate the theoretical dialogue landscape and your role in it.",
      context: "You are an academic cartographer.",
      constraints: "Clearly identify your role: follower, reconciler, critic, or pioneer.",
      instructions: `As an academic cartographer, help me clearly demonstrate to readers in my introduction the theoretical dialogue club that my research aims to join.
My research is about {{research_topic}}, mainly drawing on {{theory_a}} and {{theory_b}}.
First, write a paragraph briefly introducing the broader academic dialogue field represented by {{theory_a}} and {{theory_b}} and their core issues.
Second, clearly identify what role my research wants to play in this dialogue: a follower (adding to existing frameworks), a reconciler (attempting to integrate two seemingly contradictory theories), a critic (aiming to challenge core assumptions of one theory), or a pioneer (attempting to initiate a new dialogue topic).
Finally, clearly identify several core scholars I wish to dialogue with to demonstrate my academic positioning.

Research Topic: {{research_topic}}
Research Question: {{research_question}}
Hypotheses: {{hypotheses}}`,
      outputRequirements: "Return a concise positioning paragraph.",
    },
    variables: [
      { name: "research_topic", type: "text", required: true },
      { name: "theory_a", type: "text", required: true, description: "Name of first theory" },
      { name: "theory_b", type: "text", required: true, description: "Name of second theory" },
      { name: "research_question", type: "text", required: true },
      { name: "hypotheses", type: "text", required: true },
    ],
    outputFormat: "markdown",
    author: toolkitAuthor,
    provenance: toolkitProvenance,
  },
  {
    id: "toolkit_theory_justification",
    title: "Justify Core Theoretical Perspective",
    description: "Defend your chosen theory over alternatives.",
    stages: ["writing"],
    researchTypes: ["theoretical", "qualitative", "mixed_methods"],
    tags: ["Theory", "Methods"],
    framework: "COSTAR",
    difficulty: "intermediate",
    content: {
      goal: "Argue why the chosen theoretical perspective is most suitable.",
      context: "You are a methodology professor.",
      constraints: "Argue why alternatives have limitations or blind spots.",
      instructions: `As a methodology professor, write a defensive argument for my introduction section regarding why choose {{chosen_method}} over others.
My research question is: {{research_topic}}.
My chosen core theoretical perspective is: {{chosen_method}}.
Alternative theoretical perspectives that I did not choose are: {{why_not_others}}.
First, briefly explain the core analytical capabilities and advantages of my chosen theoretical perspective.
Second, clearly argue why other alternative theoretical perspectives have certain fundamental limitations or analytical blind spots when explaining my unique research question.
Finally, conclude that my chosen theoretical perspective is the most suitable and most powerful theoretical lens for addressing the current specific research question.`,
      outputRequirements: "Return a structured argumentative paragraph.",
    },
    variables: [
      { name: "research_topic", type: "multiline", required: true },
      { name: "chosen_method", type: "text", required: true },
      { name: "why_not_others", type: "text", required: true },
    ],
    outputFormat: "markdown",
    author: toolkitAuthor,
    provenance: toolkitProvenance,
  },
  {
    id: "toolkit_chapter_overview_journey",
    title: "Chapter Overview as Intellectual Journey",
    description: "Rewrite chapter overview as an engaging narrative journey.",
    stages: ["writing"],
    researchTypes: ["qualitative", "quantitative", "mixed_methods", "theoretical"],
    tags: ["Chapter_Overview", "Narrative"],
    framework: "COSTAR",
    difficulty: "beginner",
    content: {
      goal: "Transform a dry chapter overview into an engaging intellectual journey.",
      context: "You are an excellent tour guide for an intellectual journey.",
      constraints: "Do not simply list chapters; create a dynamic narrative.",
      instructions: `As an excellent tour guide, transform the dry “chapter overview” at the end of my introduction into an engaging preview of an “intellectual journey.”
The original version might be: “Chapter 2 reviews literature, Chapter 3 introduces methods…”
Rewrite it as a logically dynamic narrative: “To solve this puzzle, our exploration journey will depart from the academic history retrospective in Chapter 2, where we will sort out…; immediately following, in Chapter 3, we will forge unique analytical tools for this exploration…; Chapters 4 and 5 will be the core of this journey, where we will delve into the dense forest of data to discover…; Finally, in Chapters 6 and 7, we will return to the theoretical landscape with all our discoveries to mark the new continent we have opened up.”

Research Topic: {{research_topic}}
Dataset Name: {{dataset_name}}
Data Source: {{data_source}}
Sample Scope: {{sample_scope}}`,
      outputRequirements: "Return a revised chapter overview paragraph.",
    },
    variables: [
      { name: "research_topic", type: "text", required: true },
      { name: "dataset_name", type: "text", required: false },
      { name: "data_source", type: "text", required: false },
      { name: "sample_scope", type: "text", required: false },
    ],
    outputFormat: "markdown",
    author: toolkitAuthor,
    provenance: toolkitProvenance,
  },
  {
    id: "toolkit_devils_advocate",
    title: "Devil’s Advocate Introduction Stress Test",
    description: "Identify the most likely fatal flaws in an introduction.",
    stages: ["writing"],
    researchTypes: ["qualitative", "quantitative", "mixed_methods", "theoretical"],
    tags: ["Review", "Critique"],
    framework: "COSTAR",
    difficulty: "advanced",
    content: {
      goal: "Stress-test the introduction for weak claims and logic gaps.",
      context: "You are an extremely critical devil's advocate skilled at finding problems.",
      constraints: "Stand in the position of a most unfriendly reviewer.",
      instructions: `As an extremely critical devil's advocate skilled at finding problems, conduct a comprehensive stress test on my provided introduction draft.
Stand in the position of a most unfriendly reviewer, identify and sharply point out all taken-for-granted assertions, insufficiently supported claims, vaguely defined concepts, and logically flawed reasoning in the introduction.
Provide a list of 5 to 7 most likely to be attacked, fatal logical flaws. For example: "The author claims this issue is 'crucial,' but provides no independent, strong arguments beyond citing two literatures." "The 'research gap' identified by the author has actually been preliminarily explored in the literature of XXX (2023), and the author seems to deliberately avoid this key literature."

Introduction draft: {{introduction_draft}}`,
      outputRequirements: "Return a numbered list of critical flaws.",
    },
    variables: [
      { name: "introduction_draft", type: "multiline", required: true, description: "Full text of the introduction draft to stress-test" },
    ],
    outputFormat: "markdown",
    author: toolkitAuthor,
    provenance: toolkitProvenance,
  },
  {
    id: "toolkit_suspense_foreshadowing",
    title: "Foreshadowing Core Findings",
    description: "Plant suspenseful hints without revealing results.",
    stages: ["writing"],
    researchTypes: ["qualitative", "quantitative", "mixed_methods", "theoretical"],
    tags: ["Narrative", "Hook"],
    framework: "COSTAR",
    difficulty: "intermediate",
    content: {
      goal: "Plant foreshadowing and create suspense for core findings.",
      context: "You are a novelist proficient in narrative techniques.",
      constraints: "Do not directly announce your answer; hint at the direction.",
      instructions: `As a novelist proficient in narrative techniques, guide me on how to skillfully plant foreshadowing and create suspense for my paper's core findings in the introduction.
Do not directly announce your answer in the introduction. Instead, design 1 to 2 suspenseful, thought-provoking sentences for me to implant in the problem statement or research significance section of the introduction. These sentences need to hint at your discovery direction without fully revealing the answer.
For example: "…However, a puzzling phenomenon is that under… circumstances, the predictions of traditional theories seem to completely fail. The core task of this research is to unravel the secrets behind this 'abnormal' phenomenon."

Core Finding: {{core_finding}}
Expected Theory Prediction: {{expected_theory_prediction}}`,
      outputRequirements: "Return 1–2 sentences.",
    },
    variables: [
      { name: "core_finding", type: "multiline", required: true, description: "The core finding or surprising result to foreshadow without revealing" },
      { name: "expected_theory_prediction", type: "text", required: false, description: "What conventional theory would predict, for contrast" },
    ],
    outputFormat: "markdown",
    author: toolkitAuthor,
    provenance: toolkitProvenance,
  },
  {
    id: "toolkit_line_of_inquiry",
    title: "Research Questions → Line of Inquiry",
    description: "Link multiple questions into a coherent investigative line.",
    stages: ["writing"],
    researchTypes: ["qualitative", "quantitative", "mixed_methods"],
    tags: ["Research_Questions", "Structure"],
    framework: "COSTAR",
    difficulty: "intermediate",
    content: {
      goal: "Connect isolated research questions into a coherent line of inquiry.",
      context: "You are a detective novelist.",
      constraints: "Rewrite as a 'detective story' then convert to academic language.",
      instructions: `As a detective novelist, help me connect several isolated research questions into a logically clear and engaging line of inquiry.
First, set an overall case for this line, which is your core research question.
Second, rephrase each sub-question as a key step in solving this case. For example: "To solve this mystery, we must first answer: What is the identity of the 'victim'? (corresponding to sub-question 1). Next, we need to investigate the key clues left at the 'crime scene' (corresponding to sub-question 2). Finally, we need to identify who is the real 'mastermind' (corresponding to sub-question 3)."
Rewrite this detective story into a paragraph of professional academic language and include it in the introduction.

Research Sub-Questions: {{research_questions_list}}
Overall Case: {{overall_case}}`,
      outputRequirements: "Return a paragraph suitable for an introduction.",
    },
    variables: [
      { name: "research_questions_list", type: "multiline", required: true, description: "The isolated research sub-questions to connect, one per line" },
      { name: "overall_case", type: "text", required: false, description: "One-sentence framing of the overall research puzzle" },
    ],
    outputFormat: "markdown",
    author: toolkitAuthor,
    provenance: toolkitProvenance,
  },
  {
    id: "toolkit_why_now",
    title: "Why Now? Timeliness Argument",
    description: "Argue theoretical, technical, and social urgency.",
    stages: ["writing"],
    researchTypes: ["qualitative", "quantitative", "mixed_methods", "theoretical"],
    tags: ["Timeliness", "Significance"],
    framework: "COSTAR",
    difficulty: "intermediate",
    content: {
      goal: "Write a strong argument specifically about research timeliness.",
      context: "You are a trend analysis expert.",
      constraints: "Argue from theoretical, data/tech, and social/policy perspectives.",
      instructions: `As a trend analysis expert, write a strong argument specifically about research timeliness for my introduction section.
My research topic is: {{research_topic}}.
Find and write arguments from the following three perspectives:
1.	Theoretical Timeliness: Have any new theoretical tools or major theoretical debates emerged in academia recently that make re-examining this old question possible and necessary?

2.	Data/Technology Timeliness: Have any brand new datasets, computational methods, or experimental techniques emerged recently that make previously unstudied questions now researchable?

3.	Social/Policy Timeliness: Have any major social events, policy agendas, or technological changes emerged recently that give research on this question unprecedented practical urgency?`,
      outputRequirements: "Return a structured paragraph or 3 short paragraphs.",
    },
    variables: [
      { name: "research_topic", type: "text", required: true },
    ],
    outputFormat: "markdown",
    author: toolkitAuthor,
    provenance: toolkitProvenance,
  },
  {
    id: "toolkit_reader_tailoring",
    title: "Tailor Intro to a Virtual Reader",
    description: "Transform style based on an expert reader profile.",
    stages: ["writing"],
    researchTypes: ["qualitative", "quantitative", "mixed_methods", "theoretical"],
    tags: ["Audience", "Style"],
    framework: "COSTAR",
    difficulty: "intermediate",
    content: {
      goal: "Tailor the argument style of the introduction based on a virtual reader profile.",
      context: "You are a communication strategist.",
      constraints: "Conduct a comprehensive style transformation.",
      instructions: `As a communication strategist, help me tailor the argument style of my introduction based on a virtual reader profile.
My virtual reader profile is: {{reader_profile}}.
My draft introduction is: {{introduction_draft}}.
Conduct a comprehensive style transformation of my introduction based on this reader profile. For example, for the above profile, you might need to:
- Reduce grand, abstract theoretical groundwork.

- Directly present a specific, data-driven empirical puzzle at the beginning of the introduction.

- Clearly identify the testability when proposing research questions.

- Strengthen the preliminary introduction of causal identification strategy.

Output a newly revised version after the style transformation.`,
      outputRequirements: "Return a fully revised introduction.",
    },
    variables: [
      { name: "reader_profile", type: "multiline", required: true },
      { name: "introduction_draft", type: "multiline", required: true },
    ],
    outputFormat: "markdown",
    author: toolkitAuthor,
    provenance: toolkitProvenance,
  },
  {
    id: "toolkit_puzzle_intro",
    title: "Puzzle-Solving Introduction",
    description: "Reconstruct an introduction around a clear academic puzzle.",
    stages: ["writing"],
    researchTypes: ["qualitative", "quantitative", "mixed_methods", "theoretical"],
    tags: ["Introduction", "Puzzle"],
    framework: "COSTAR",
    difficulty: "advanced",
    content: {
      goal: "Reconstruct the introduction with puzzle-solving as the core thread.",
      context: "You are a suspense story creator.",
      constraints: "Present a clear academic puzzle and positioning.",
      instructions: `As a suspense story creator, completely reconstruct my relatively plain introduction into a new version with puzzle-solving as the core thread.
First, present a clear, concise, and highly intellectually challenging academic puzzle at the beginning of the introduction.
Second, reconstruct the literature review section as a commentary on previous puzzle-solving attempts and point out why they failed or only solved half.
Finally, position your research as the key clue or final answer needed to solve this puzzle, and describe your chapter overview as a puzzle-solving path that approaches the truth step by step.

Introduction Draft: {{introduction_draft}}`,
      outputRequirements: "Return a reconstructed introduction.",
    },
    variables: [
      { name: "introduction_draft", type: "multiline", required: true },
    ],
    outputFormat: "markdown",
    author: toolkitAuthor,
    provenance: toolkitProvenance,
  },
  {
    id: "toolkit_academic_map",
    title: "Academic Map Positioning",
    description: "Map your research within an academic landscape.",
    stages: ["writing"],
    researchTypes: ["theoretical", "qualitative", "mixed_methods"],
    tags: ["Positioning", "Map"],
    framework: "COSTAR",
    difficulty: "intermediate",
    content: {
      goal: "Draw an academic map to accurately mark the research position.",
      context: "You are an academic geographer.",
      constraints: "Clarify relationships: pioneering, connecting, or challenging.",
      instructions: `As an academic geographer, help me draw an academic map with words in my introduction and accurately mark my research on the map.
The core fields involved in my research are: {{research_topic}} / {{related_fields_list}}.
Write a paragraph for me containing the following content:
1.	Map Drawing: First, briefly depict the macro academic landscape of my research field and mark several major theoretical continents or research centers within it.

2.	Position Coordinates: Clearly indicate whether my research is located in an uninhabited area of which continent or in the border area between two continents.

3.	Relationship Clarification: Clarify the relationship between my research and these major theoretical continents—whether it is pioneering, connecting, or challenging.`,
      outputRequirements: "Return a single paragraph.",
    },
    variables: [
      { name: "research_topic", type: "text", required: true },
      { name: "related_fields_list", type: "text", required: true },
    ],
    outputFormat: "markdown",
    author: toolkitAuthor,
    provenance: toolkitProvenance,
  },
  {
    id: "toolkit_tone_calibration",
    title: "Tone Calibration: Confidence vs Caution",
    description: "Balance critical tone toward prior work with cautious confidence.",
    stages: ["writing"],
    researchTypes: ["qualitative", "quantitative", "mixed_methods", "theoretical"],
    tags: ["Tone", "Polishing"],
    framework: "COSTAR",
    difficulty: "intermediate",
    content: {
      goal: "Conduct a tone review to balance respect/criticism and confidence/caution.",
      context: "You are a senior scholar.",
      constraints: "Ensure a professional, objective, and constructive tone.",
      instructions: `As a senior scholar, conduct a comprehensive tone review and polishing of my provided introduction draft.
First, check whether the introduction achieves respectful but critical when evaluating previous research, fully acknowledging previous contributions while objectively pointing out their shortcomings, avoiding overly aggressive or derogatory language.
Second, evaluate whether the introduction achieves confident but cautious when stating the value of my own research, clearly demonstrating the research's ambition and potential while avoiding overstatement and unrealistic promises.
Finally, revise all sentences with inappropriate tone to ensure the entire introduction establishes a professional, objective, neither humble nor arrogant, and constructive academic dialogue tone.

Introduction Draft: {{introduction_draft}}
Target Tone: {{target_tone}}`,
      outputRequirements: "Return a revised introduction.",
    },
    variables: [
      { name: "introduction_draft", type: "multiline", required: true },
      { name: "target_tone", type: "text", required: false },
    ],
    outputFormat: "markdown",
    author: toolkitAuthor,
    provenance: toolkitProvenance,
  },
  {
    id: "toolkit_concluding_paragraph",
    title: "Introduction Conclusion: Consolidate Expectations",
    description: "Write a final paragraph that restates objectives and payoffs.",
    stages: ["writing"],
    researchTypes: ["qualitative", "quantitative", "mixed_methods", "theoretical"],
    tags: ["Conclusion", "Introduction"],
    framework: "COSTAR",
    difficulty: "beginner",
    content: {
      goal: "Consolidate expectations and stimulate reading interest in the last paragraph.",
      context: "You are a writing coach.",
      constraints: "Use thought-provoking language.",
      instructions: `As a writing coach, write or revise the last paragraph of my introduction.
This paragraph's function is not to simply repeat the chapter overview, but to perform a final consolidation of expectations and final stimulation of interest. Write a conclusion for me that needs to:
1.	Use one or two sentences to again highly focus on restating this paper's core objectives and unique contribution points.

2.	Clearly convey to readers the intellectual payoff they will obtain after reading the entire paper.

3.	End with a strong, thought-provoking sentence that leaves readers eagerly anticipating turning to the next page.

Context: {{intro_last_paragraph_draft}}
Contibution Claim: {{paper_contribution_claim}}`,
      outputRequirements: "Return one paragraph.",
    },
    variables: [
      { name: "intro_last_paragraph_draft", type: "multiline", required: true },
      { name: "paper_contribution_claim", type: "text", required: true },
    ],
    outputFormat: "markdown",
    author: toolkitAuthor,
    provenance: toolkitProvenance,
  },
  {
    id: "toolkit_scope_criteria",
    title: "Scope Inclusion/Exclusion Criteria",
    description: "Justify research scope boundaries with academic rationale.",
    stages: ["writing"],
    researchTypes: ["qualitative", "quantitative", "mixed_methods", "theoretical"],
    tags: ["Scope", "Methodology"],
    framework: "COSTAR",
    difficulty: "advanced",
    content: {
      goal: "Write a clear definition and justification of research scope.",
      context: "You are a rigorous research designer.",
      constraints: "Provide academic reasons for exclusions, not just resource limits.",
      instructions: `As a rigorous research designer, write a special discussion on the definition and justification of research scope for my introduction section.
My research topic is {{research_topic}}, I plan to focus on {{in_scope}}, while excluding {{out_of_scope}}.
First, clearly state the specific inclusion criteria and exclusion criteria of this research.
Second, provide a strong, convincing academic reason for each of your exclusion decisions, rather than simply limited resources or energy. For example, "We exclude XX situations because according to theory YY, their internal mechanisms are fundamentally different from the core phenomena we focus on."
Finally, conclude that this prudent scope definition is a necessary prerequisite for ensuring research depth and internal validity.`,
      outputRequirements: "Return 1–2 paragraphs.",
    },
    variables: [
      { name: "research_topic", type: "text", required: true },
      { name: "in_scope", type: "text", required: true },
      { name: "out_of_scope", type: "text", required: true },
    ],
    outputFormat: "markdown",
    author: toolkitAuthor,
    provenance: toolkitProvenance,
  },
  {
    id: "toolkit_promise_checklist",
    title: "Academic Promise Checklist",
    description: "List all promises made in an introduction.",
    stages: ["writing"],
    researchTypes: ["qualitative", "quantitative", "mixed_methods", "theoretical"],
    tags: ["Consistency", "Checklist"],
    framework: "COSTAR",
    difficulty: "beginner",
    content: {
      goal: "Generate a checklist of academic promises made in the introduction.",
      context: "You are an editor responsible for logical consistency.",
      constraints: "Identify explicit and implicit promises.",
      instructions: `As an editor responsible for the logical consistency of the entire book, please scan my provided introduction chapter below and generate an academic promise checklist for me.
Your task is to identify and list all promises that the author explicitly or implicitly makes to readers in the introduction. These promises may take forms including:
- "This research will clarify…"
- "This paper aims to answer the following three questions:…"
- "Through…, this research will contribute to… theory."
- "In the following chapters, we will elaborate on…"

Output these promises in a checklist format. This checklist will serve as my reference for subsequent writing and final review to ensure all promises are fulfilled.

Introduction: {{introduction_text}}`,
      outputRequirements: "Return a checklist of promises.",
    },
    variables: [
      { name: "introduction_text", type: "multiline", required: true },
    ],
    outputFormat: "markdown",
    author: toolkitAuthor,
    provenance: toolkitProvenance,
  },
  {
    id: "toolkit_personal_motivation",
    title: "Personal Motivation Narrative",
    description: "Integrate a restrained personal motivation narrative.",
    stages: ["writing"],
    researchTypes: ["qualitative", "mixed_methods", "theoretical"],
    tags: ["Motivation", "Narrative"],
    framework: "COSTAR",
    difficulty: "intermediate",
    content: {
      goal: "Appropriately incorporate a personal research motivation narrative.",
      context: "You are an author skilled at balancing academic and personal emotions.",
      constraints: "Professional and restrained tone; suitable for humanities/social sciences.",
      instructions: `As an author skilled at balancing academic and personal emotions, help me appropriately incorporate a short narrative about personal research motivation at a specific position in the introduction.
My personal motivation is: {{personal_motivation}}.
First, suggest to me the most suitable position in the introduction for this personal narrative (e.g., the opening hook section, or the section arguing research significance), and explain the reason.
Second, rewrite my personal experience into a text that is both sincere and emotionally resonant, while having academic reflection depth. Connect personal experiences with broader, public academic or social concerns.
Finally, ensure the tone of this narrative is professional and restrained, avoiding sounding like a personal essay, but rather serving to strengthen the legitimacy of the research question.

Intro Draft: {{intro_draft}}
Preferred Insertion Point: {{preferred_insertion_point}}`,
      outputRequirements: "Return placement advice + revised narrative.",
    },
    variables: [
      { name: "personal_motivation", type: "multiline", required: true },
      { name: "intro_draft", type: "multiline", required: false },
      { name: "preferred_insertion_point", type: "text", required: false },
    ],
    outputFormat: "markdown",
    author: toolkitAuthor,
    provenance: toolkitProvenance,
  },
  {
    id: "toolkit_problematize_findings",
    title: "Problematize Findings (New Research Puzzle)",
    description: "Turn findings into a new, deeper research puzzle.",
    stages: ["interpretation", "writing"],
    researchTypes: ["qualitative", "quantitative", "mixed_methods", "theoretical"],
    tags: ["Future_Work", "Discussion"],
    framework: "COSTAR",
    difficulty: "advanced",
    content: {
      goal: "Transform the discussion from providing answers to raising deeper questions.",
      context: "You are a scientist skilled at asking questions.",
      constraints: "Greatly enhance the inspirational value of the research.",
      instructions: `As a scientist skilled at asking questions, help me transform my discussion chapter from a place that merely provides answers to a platform that can raise deeper questions and inspire future research.
My research findings have successfully answered {{research_question_a}}.
First, analyze whether my answer itself has given rise to some new, more puzzling puzzles or paradoxes.
Second, clearly and engagingly present this new puzzle, and argue why solving this new puzzle is crucial for the next development of our field.
Finally, reposition the contribution of my entire paper as not only solving old question A, but more importantly, for the first time revealing and defining new question B for the academic community, thereby greatly enhancing the inspirational value of my research.

Findings Summary: {{findings_summary}}
New Question B: {{new_question_b}}`,
      outputRequirements: "Return a discussion-style paragraph.",
    },
    variables: [
      { name: "research_question_a", type: "text", required: true },
      { name: "findings_summary", type: "multiline", required: true },
      { name: "new_question_b", type: "text", required: false },
    ],
    outputFormat: "markdown",
    author: toolkitAuthor,
    provenance: toolkitProvenance,
  },
  {
    id: "p01_hybrid_stats",
    title: "Hybrid Statistical Reasoning",
    description: "Check assumptions before selecting the correct statistical test.",
    stages: ["analysis"],
    researchTypes: ["quantitative", "computational"],
    tags: ["Statistics", "Assumptions"],
    framework: "TIDD-EC",
    difficulty: "intermediate",
    content: {
      goal: "Select the correct test by checking assumptions.",
      context: "You are analyzing a dataset for inferential statistics.",
      constraints: "If assumptions fail, use a nonparametric alternative.",
      instructions: `First, check whether the data meet the assumptions for a t-test (normality and equal variances). 
If the assumptions are met, perform the t-test. If not, select and perform an appropriate 
alternative test. Report the results, including the test statistic, degrees of freedom, and p-value.`,
      outputRequirements: "Return test choice, stats, degrees of freedom, and p-value.",
    },
    variables: [],
    outputFormat: "markdown",
    author: reportAuthor,
    provenance: reportProvenance,
  },
  {
    id: "p02_reviewer_logic_audit",
    title: "Senior Reviewer Logic Audit",
    description: "Simulate peer review to find logical gaps.",
    stages: ["interpretation", "writing"],
    researchTypes: ["qualitative", "quantitative", "mixed_methods", "theoretical"],
    tags: ["Review", "Logic"],
    framework: "COSTAR",
    difficulty: "advanced",
    content: {
      goal: "Identify logical gaps and misalignment before submission.",
      context: "You are a senior reviewer for top-tier venues.",
      constraints: "Be rigorous and critical, not polite.",
      instructions: `# Role You act as an experienced academic reviewer applying rigorous, top-tier-venue-style standards.
# Task Please thoroughly read and analyze the [PDF paper file] I have uploaded. Based on my specified {{submission_target}}, write a strict but constructive review report.
# Constraints
1. Review Tone (Strict Mode): Default attitude: Please conduct the review with a predisposition towards rejection.
2. Review Dimensions: Originality, Rigor, Consistency.
3. Ground every criticism in a specific quoted line or section from the paper; do not invent issues not present in the text; mark speculative concerns as such.
# Output Format: Part 1 [The Review Report], Part 2 [Strategic Advice].`,
      outputRequirements: "Return review report + strategic advice.",
    },
    variables: [
      { name: "submission_target", type: "text", required: true, description: "Target venue" }
    ],
    outputFormat: "markdown",
    author: reportAuthor,
    provenance: reportProvenance,
  },
  {
    id: "p03_latex_polish",
    title: "LaTeX Technical Polish",
    description: "Polish drafts into clean, publication-ready LaTeX.",
    stages: ["writing", "polishing"],
    researchTypes: ["quantitative", "mixed_methods", "theoretical"],
    tags: ["Latex", "Polish"],
    framework: "TIDD-EC",
    difficulty: "advanced",
    content: {
      goal: "Translate and polish text into publication-ready LaTeX.",
      context: "You are a senior academic editor.",
      constraints: "Preserve LaTeX commands and math as-is.",
      instructions: `Role: You are an assistant with the dual identity of a top research writing expert and a senior conference reviewer.
Task: Please process my draft, polishing it into an academic paper fragment.

# Constraints
1. Visuals and Layout: Avoid using bold text, italics, or quotation marks whenever possible. Keep the LaTeX source code clean.
2. Style and Logic: Use precise language and ensure concise and coherent expression.
3. Tense Conventions: Consistently use the simple present tense to describe methods, architecture, and experimental conclusions.`,
      outputRequirements: "Return LaTeX code + change notes.",
    },
    variables: [],
    outputFormat: "markdown",
    author: reportAuthor,
    provenance: reportProvenance,
  },
  {
    id: "p04_data_quality",
    title: "Data Quality Assessment",
    description: "Identify missing values, outliers, and preparation steps.",
    stages: ["data_qc"],
    researchTypes: ["quantitative", "computational", "mixed_methods"],
    tags: ["Data_Qc", "Cleaning"],
    framework: "TIDD-EC",
    difficulty: "beginner",
    content: {
      goal: "Assess dataset structure and quality issues.",
      context: "You are preparing data for analysis.",
      constraints: "Identify data types and preparation steps.",
      instructions: `Please review this dataset and tell me: 1. What type of data we have (numerical, categorical, time-series) 2. Any obvious quality issues you notice 3. What kind of preparation would be needed for analysis.`,
      outputRequirements: "Return a structured QC report.",
    },
    variables: [],
    outputFormat: "markdown",
    author: reportAuthor,
    provenance: reportProvenance,
  },
  {
    id: "p05_semantic_gap",
    title: "Semantic Gap Finder",
    description: "Identify gaps and novelty opportunities in literature.",
    stages: ["design"],
    researchTypes: ["qualitative", "quantitative", "mixed_methods", "theoretical"],
    tags: ["Literature", "Gaps"],
    framework: "COSTAR",
    difficulty: "intermediate",
    content: {
      goal: "Identify research gaps and limitations in current literature.",
      context: "You are scoping a new study.",
      constraints: "Avoid hallucinating non-existent studies.",
      instructions: `Identify the gaps in the current literature on {{topic}}. I need to point out areas where further research is required. What are the limitations and gaps in the existing research? Help me identify areas where the research is lacking and explain how my study will address these gaps.

Base this on the literature you can verify; do not invent studies or citations, and explicitly flag any claim you are not confident about.`,
      outputRequirements: "Return a gap list with explanations.",
    },
    variables: [
      { name: "topic", type: "text", required: true },
    ],
    outputFormat: "markdown",
    author: reportAuthor,
    provenance: reportProvenance,
  },
  {
    id: "p06_evidence_table",
    title: "Evidence Table Synthesis",
    description: "Create comparative evidence matrices for systematic reviews.",
    stages: ["interpretation", "writing"],
    researchTypes: ["systematic_review", "mixed_methods"],
    tags: ["Evidence_Table", "Synthesis"],
    framework: "COSTAR",
    difficulty: "intermediate",
    content: {
      goal: "Build a comparative evidence table for a set of studies.",
      context: "You are preparing a systematic review.",
      constraints: "Use consistent fields across studies.",
      instructions: `Given study abstracts, build a matrix (methods, sample, outcomes, key findings).

Populate the table only from the provided abstracts; mark any field not reported in the source as 'not reported' rather than inferring a value.`,
      outputRequirements: "Return a table in Markdown.",
    },
    variables: [],
    outputFormat: "markdown",
    author: reportAuthor,
    provenance: reportProvenance,
  },
  {
    id: "p07_role_scaffold",
    title: "Role-Based Scaffolding",
    description: "Use professional roles to improve accuracy and tone.",
    stages: ["writing", "interpretation"],
    researchTypes: ["qualitative", "quantitative", "mixed_methods", "theoretical"],
    tags: ["Roles", "Accuracy"],
    framework: "COSTAR",
    difficulty: "beginner",
    content: {
      goal: "Improve output fidelity by setting explicit expert roles.",
      context: "You are choosing a persona for the model.",
      constraints: "Specify scope and deliverables clearly.",
      instructions: `Define a role, task, constraints, and output format to reduce ambiguity.`,
      outputRequirements: "Return with labeled sections: Role, Task, Constraints, Output Format.",
    },
    variables: [],
    outputFormat: "markdown",
    author: reportAuthor,
    provenance: reportProvenance,
  },
  {
    id: "p08_code_to_logic",
    title: "Code-to-Logic Mapping",
    description: "Generate code with explanations for each step.",
    stages: ["analysis"],
    researchTypes: ["quantitative", "computational"],
    tags: ["Code", "Explanation"],
    framework: "TIDD-EC",
    difficulty: "intermediate",
    content: {
      goal: "Produce auditable code with natural language explanations.",
      context: "You are documenting an analysis pipeline.",
      constraints: "Explain each computational step.",
      instructions: `Generate Python/R code and describe the reasoning behind each step.`,
      outputRequirements: "Return code + explanation.",
    },
    variables: [],
    outputFormat: "markdown",
    author: reportAuthor,
    provenance: reportProvenance,
  },
  {
    id: "p09_abstract_opt",
    title: "Abstract Optimization",
    description: "Distill long content into a journal-ready abstract.",
    stages: ["writing"],
    researchTypes: ["qualitative", "quantitative", "mixed_methods", "theoretical"],
    tags: ["Abstract", "Summary"],
    framework: "COSTAR",
    difficulty: "beginner",
    content: {
      goal: "Produce a high-impact abstract tailored to a target venue.",
      context: "You are preparing a submission.",
      constraints: "Stay within length limits and maintain rigor.",
      instructions: `Input: {{content}}\nTarget venue: {{venue}}\nCreate a 150–250 word abstract with clear contributions.`,
      outputRequirements: "Return a single abstract paragraph.",
    },
    variables: [
      { name: "content", type: "multiline", required: true },
      { name: "venue", type: "text", required: false },
    ],
    outputFormat: "plain",
    author: reportAuthor,
    provenance: reportProvenance,
  },
  {
    id: "p10_citation_style",
    title: "Citation Style Few-Shot",
    description: "Use example pairs to enforce strict citation formatting.",
    stages: ["writing"],
    researchTypes: ["quantitative", "mixed_methods", "theoretical"],
    tags: ["Citations", "Formatting"],
    framework: "TIDD-EC",
    difficulty: "intermediate",
    content: {
      goal: "Ensure strict compliance with niche citation rules.",
      context: "You are formatting references for a venue.",
      constraints: "Follow the provided examples exactly.",
      instructions: `Given the following example pairs showing raw references and their correctly formatted citations:

{{example_pairs}}

Format the following new references to match the same style exactly:

{{new_references}}`,
      outputRequirements: "Return formatted citations only.",
    },
    variables: [
      { name: "example_pairs", type: "multiline", required: true, description: "Example raw-reference → formatted-citation pairs demonstrating the target style" },
      { name: "new_references", type: "multiline", required: true, description: "New references to format in the same style" },
    ],
    outputFormat: "plain",
    author: reportAuthor,
    provenance: reportProvenance,
  },
  {
    id: "latex_abbreviate",
    title: "Abbreviate (LaTeX)",
    description: "Syntactically compress text without losing meaning.",
    stages: ["writing", "polishing"],
    researchTypes: ["quantitative", "theoretical", "mixed_methods"],
    tags: ["Latex", "Abbreviate", "Conciseness"],
    framework: "TIDD-EC",
    difficulty: "advanced",
    content: {
      goal: "Reduce word count while preserving core meaning and LaTeX syntax.",
      context: "You are a top academic editor specializing in conciseness.",
      constraints: "Keep LaTeX clean. No major edits. 5-15 word reduction.",
      instructions: `
# Role
I want you to act as a top academic editor who specializes in concise writing. Your strength is reducing length through syntactic optimization without losing any information.

# Task
Please make a light, minimal shortening pass on the LaTeX snippet I provide.

# Constraints
1. Degree of change
   - Target a small reduction in word count (about 5 to 15 words).
   - Do not make major edits. You must preserve all core meaning, technical details, and experimental settings. Do not change the claim.

2. How to shorten
   - Syntactic compression: convert clauses to phrases, and switch passive to active voice only if it becomes shorter.
   - Remove redundancy: delete filler words, for example simplify "in order to" to "to".

3. Visual style
   - Keep the LaTeX source clean. Do not add bold, italics, or quotation marks.
   - Avoid em dashes.
   - Do not use itemized lists. Keep a coherent paragraph.

4. Output format
   - Part 1 [LaTeX]: output only the shortened English LaTeX code.
     * English only.
     * Escape special characters when needed (e.g., %, _, &).
     * Keep math expressions unchanged (preserve $ ... $).
   - Part 2 [Change Log]: briefly list what you changed in plain English (e.g., removed redundant phrase "X", converted clause "Y" to a phrase).
   - Do not output anything beyond Part 1 and Part 2.

# Self-check before output
1. Information integrity: confirm you did not delete any parameter, qualifier, or condition. If you did, restore it.
2. Word count: confirm you did not over-shorten. This is a micro-edit, not a rewrite.

# Input
{{latex_snippet}}`,
      outputRequirements: "Return shortened LaTeX + change log.",
    },
    variables: [
      { name: "latex_snippet", type: "multiline", required: true, description: "LaTeX snippet to shorten" }
    ],
    outputFormat: "markdown",
    author: toolkitAuthor,
    provenance: toolkitProvenance,
  },
  {
    id: "latex_expand",
    title: "Expand (LaTeX)",
    description: "Add logical depth and flow without bloating.",
    stages: ["writing", "polishing"],
    researchTypes: ["quantitative", "theoretical", "mixed_methods"],
    tags: ["Latex", "Expand", "Flow"],
    framework: "TIDD-EC",
    difficulty: "advanced",
    content: {
      goal: "Minimal expansion to improve logical flow and clarity.",
      context: "You are a top academic editor specializing in logical flow.",
      constraints: "5-15 word increase. No fluff. Explicitize implied logic.",
      instructions: `
# Role
I want you to act as a top academic editor who specializes in logical flow and completeness. Your strength is adding depth and connective logic without bloating the text.

# Task
Please make a light, minimal expansion pass on the English LaTeX snippet I provide.

# Constraints
1. Degree of change
   - Target a small increase in word count (about 5 to 15 words).
   - Do not pad with empty adjectives or repetitive sentences.

2. How to expand
   - Deepen what is already implied: make an implicit premise, consequence, or rationale explicit, but only if it is directly supported by the original text.
   - Strengthen connections: add minimal linking language (e.g., "Furthermore", "Notably") only when it clarifies relations between sentences.
   - Upgrade expression: replace vague phrasing with more precise academic wording when it improves clarity.

3. Visual style
   - Keep the LaTeX source clean. Do not add bold, italics, or quotation marks.
   - Avoid em dashes.
   - Do not use itemized lists. Keep a coherent paragraph.

4. Output format
   - Part 1 [LaTeX]: output only the expanded English LaTeX code.
     * English only.
     * Escape special characters when needed (e.g., %, _, &).
     * Keep math expressions unchanged (preserve $ ... $).
   - Part 2 [Change Log]: briefly list what you added or refined in plain English (e.g., made an implicit rationale explicit, added a connective term).
   - Do not output anything beyond Part 1 and Part 2.

# Self-check before output
1. Value check: confirm the new content is a reasonable inference from the original, with no invented data or claims.
2. Style check: confirm the result remains concise and does not become verbose.

# Input
{{latex_snippet}}`,
      outputRequirements: "Return expanded LaTeX + change log.",
    },
    variables: [
      { name: "latex_snippet", type: "multiline", required: true, description: "LaTeX snippet to expand" }
    ],
    outputFormat: "markdown",
    author: toolkitAuthor,
    provenance: toolkitProvenance,
  },
  {
    id: "latex_deep_polish",
    title: "Deep Language Polishing (LaTeX)",
    description: "Elevate writing to top-tier venue standards.",
    stages: ["polishing"],
    researchTypes: ["quantitative", "theoretical", "mixed_methods"],
    tags: ["Latex", "Polish", "Native_English"],
    framework: "TIDD-EC",
    difficulty: "advanced",
    content: {
      goal: "Rewrite for near-flawless academic precision and readability.",
      context: "You are a senior academic editor who polishes writing for top-tier venue standards.",
      constraints: "Rigorous standards. No contractions. Zero errors.",
      instructions: `ENGLISH POLISHING (MANUSCRIPT QUALITY)

# Role
I want you to act as a senior academic editor who improves writing for publication in top-tier venues (e.g., leading journals in the field). Your focus is rigor, clarity, and readability.

# Task
Please deeply polish and rewrite the LaTeX snippet I provide. The goal is not only to fix errors, but to elevate academic precision, logical flow, and overall readability to a near-flawless standard.

# Constraints
1. Academic rigor and sentence-level improvement
   - Increase rigor: adjust structure to match high-standard scholarly writing and improve coherence.
   - Improve syntax: rewrite awkward or non-native phrasing into natural academic English.
   - Zero-error principle: correct spelling, grammar, punctuation, and article usage thoroughly.

2. Vocabulary and register control
   - Formal register: do not use contractions (use "it is", not "it's"; "does not", not "doesn't").
   - Prefer simple, field-standard vocabulary. Do not use needlessly ornate words.
   - Avoid possessive constructions in naming (especially method, model, or system names). Prefer "the performance of METHOD" over "METHOD's performance".

3. Preserve content and LaTeX
   - Keep domain abbreviations as-is (e.g., keep "LLM" as "LLM").
   - Strictly preserve existing LaTeX commands exactly as written (e.g., \\cite{}, \\ref{}, \\eg, \\ie).
   - Preserve any formatting already present (e.g., keep existing \\textbf{}), but do not introduce new emphasis commands.

4. Structure
   - Do not convert paragraphs into itemized lists. Keep paragraph form.

5. Output format
   - Part 1 [LaTeX]: output only the polished English LaTeX code.
     * Escape special characters when needed (e.g., %, _, &).
     * Keep math expressions unchanged (preserve $ ... $).
   - Part 2 [Change Log]: briefly summarize the main edits in plain English (e.g., improved sentence structure, strengthened academic tone, corrected grammar).
   - Do not output anything beyond Part 1 and Part 2.

# Input
{{latex_snippet}}`,
      outputRequirements: "Return polished LaTeX + change log.",
    },
    variables: [
      { name: "latex_snippet", type: "multiline", required: true, description: "LaTeX snippet to polish" }
    ],
    outputFormat: "markdown",
    author: toolkitAuthor,
    provenance: toolkitProvenance,
  },
  {
    id: "latex_logic_check",
    title: "Logic and Consistency Check",
    description: "Final redline review for fatal logic errors.",
    stages: ["review", "polishing"],
    researchTypes: ["quantitative", "theoretical", "mixed_methods"],
    tags: ["Review", "Consistency", "Logic"],
    framework: "TIDD-EC",
    difficulty: "advanced",
    content: {
      goal: "Identify fatal logic issues/contradictions in final draft.",
      context: "You are an academic assistant performing a final proofing.",
      constraints: "High threshold. Only report material blockers.",
      instructions: `
# Role
I want you to act as an academic assistant performing a final, high-threshold proofing pass. Your job is a redline review to prevent serious issues before submission.

# Task
Please perform a final consistency and logic check on the English LaTeX snippet I provide.

# Constraints
1. High tolerance threshold
   - Assume the draft has already been edited multiple times and is fairly strong.
   - Only flag issues that materially block understanding, introduce ambiguity, create internal contradictions, or contain serious grammar errors.
   - Do not suggest optional stylistic improvements. Ignore "could be nicer" edits.

2. Review dimensions
   - Fatal logic: any statements that directly contradict each other.
   - Terminology consistency: key concepts renamed without explanation.
   - Severe non-native phrasing: grammar or structure that makes meaning unclear.

3. Output format
   - If there are no must-fix issues, output exactly:
     [PASS: no substantive issues]
   - If there are issues, output only a short numbered list in English describing the must-fix problems. Keep it brief.

# Input
{{latex_snippet}}`,
      outputRequirements: "Return 'PASS' or numbered list of critical issues.",
    },
    variables: [
      { name: "latex_snippet", type: "multiline", required: true, description: "LaTeX snippet to check" }
    ],
    outputFormat: "markdown",
    author: toolkitAuthor,
    provenance: toolkitProvenance,
  },
  {
    id: "latex_de_ai_rewrite",
    title: "De-AI Rewrite",
    description: "Remove machine-like phrasing for a native tone.",
    stages: ["polishing"],
    researchTypes: ["quantitative", "theoretical", "mixed_methods"],
    tags: ["Rewrite", "Tone", "Humanize"],
    framework: "TIDD-EC",
    difficulty: "intermediate",
    content: {
      goal: "Remove robotic/AI-generated phrasing.",
      context: "You are a senior academic editor adding a human touch.",
      constraints: "Prefer plain terms. Remove stiff transitions. Don't over-edit.",
      instructions: `
# Role
I want you to act as a senior academic editor who improves naturalness and readability. Your task is to rewrite overly mechanical model-generated text into native-like academic English appropriate for top venues (e.g., leading journals in the field).

# Task
Please rewrite the English LaTeX snippet I provide to remove obvious machine-like phrasing, while preserving meaning and technical correctness.

# Constraints
1. Vocabulary normalization
   - Prefer plain, precise academic words. Avoid overused flashy terms (e.g., avoid "leverage", "delve into", "tapestry" unless technically necessary). Prefer "use", "examine", "context".
   - Use technical terms only when needed for meaning.

2. Natural structure
   - Do not use itemized lists. Convert any list-like content into coherent prose.
   - Remove stiff transition openers (e.g., "First and foremost", "It is worth noting that"). Use natural logical flow instead.
   - Avoid em dashes. Use commas, parentheses, or clauses instead.

3. Formatting discipline
   - Do not add emphasis formatting (no new \\textbf or \\emph).
   - Do not introduce unrelated LaTeX formatting commands.

4. Modification threshold
   - If the input already reads natural and native-like, keep it unchanged. Do not edit for the sake of editing.
   - If unchanged, explicitly say so in Part 2.

5. Output format
   - Part 1 [LaTeX]: output the rewritten LaTeX code (or the original if already strong).
     * English only.
     * Escape special characters when needed (e.g., %, _, &).
     * Keep math expressions unchanged (preserve $ ... $).
   - Part 2 [Change Log]:
     * If edited: briefly describe what mechanical patterns you removed.
     * If not edited: output exactly:
       [PASS] The original reads natural and shows no clear machine-like patterns; I recommend keeping it.
   - Do not output anything beyond Part 1 and Part 2.

# Self-check before output
1. Naturalness check: confirm tone sounds human and academically appropriate.
2. Necessity check: confirm each change improves readability. If a change is only a synonym swap, revert it.

# Input
{{latex_snippet}}`,
      outputRequirements: "Return humanized LaTeX + change log.",
    },
    variables: [
      { name: "latex_snippet", type: "multiline", required: true, description: "LaTeX snippet to humanize" }
    ],
    outputFormat: "markdown",
    author: toolkitAuthor,
    provenance: toolkitProvenance,
  },
  {
    id: "figure_method_blueprint",
    title: "Paper Method Figure Blueprint",
    description: "Generate a detailed design blueprint for method figures.",
    stages: ["design", "visualization"],
    researchTypes: ["quantitative", "computational", "mixed_methods"],
    tags: ["Figure", "Blueprint", "Visualization"],
    framework: "COSTAR",
    difficulty: "advanced",
    content: {
      goal: "Design a professional, minimalist method figure blueprint.",
      context: "You are an expert scientific illustrator.",
      constraints: "Flat vector style. Soft palette. White background.",
      instructions: `
# Role
I want you to act as an expert scientific illustrator who creates clear, publication-ready method figures for top-tier research venues. You produce diagrams that are rigorous, minimalist, and easy to parse.

# Task
I will provide a paper abstract and a description of the methodology. First, deeply understand the mechanism, modules, and data flow. Then design a professional architecture figure.

# Visual constraints
1. Overall style
   - Publication-style figure: professional, clean, modern, minimalist.
   - Flat vector look with clean lines, similar to high-quality figures in leading research papers.
   - No cartoon style, no painterly look, no overly artistic decoration.
   - White background only, with no texture and no shadow.

2. Color system
   - Use a restrained pastel or soft palette.
   - Avoid highly saturated or very dark colors. Use subtle variation to distinguish module types.

3. Content and layout
   - Translate the method into clearly labeled modules and arrows that reflect data flow.
   - Use simple, modern vector icons inside modules only when it improves immediate comprehension.

4. Text rules
   - All text in the figure must be English.
   - Add short, legible labels for key modules or key equations (names only).
   - Do not include long sentences, paragraph explanations, or complex formulas. Labels identify components; they do not explain the full theory.

5. Prohibited
   - No photorealistic elements.
   - No messy sketch lines.
   - No unreadable text.
   - No cheap-looking 3D shading.

# Output format (figure blueprint)
Provide a detailed blueprint I can hand to a designer or use in an image generation tool:
A) One-sentence figure goal (what the figure must communicate).
B) Layout plan (left-to-right, top-to-bottom, or other), with 3 to 7 modules.
C) Module list: for each module, give label text and 1-line function.
D) Arrow list: source -> target with a short label when needed (e.g., "features", "loss").
E) Legend: color meanings (soft pastel categories), if applicable.
F) One optional alternative layout if the first is crowded.

# Input
{{method_description}}`,
      outputRequirements: "Return a figure design blueprint.",
    },
    variables: [
      { name: "method_description", type: "multiline", required: true, description: "Method description/abstract" }
    ],
    outputFormat: "markdown",
    author: toolkitAuthor,
    provenance: toolkitProvenance,
  },
  {
    id: "figure_caption_gen",
    title: "Figure Caption Generator (TIDD-EC)",
    description: "Generate precise, publication-ready figure captions.",
    stages: ["writing"],
    researchTypes: ["quantitative", "computational", "mixed_methods"],
    tags: ["Figure", "Caption", "Writing"],
    framework: "TIDD-EC",
    difficulty: "intermediate",
    content: {
      goal: "Convert a description into a standard academic figure caption.",
      context: "You are an experienced academic editor.",
      constraints: "Title Case for noun phrases. Sentence case for sentences. No fancy words.",
      instructions: `
# Role
I want you to act as an experienced academic editor who writes precise, publication-ready figure captions.

# Task
Convert the description I provide into an English figure caption that matches top-tier venue conventions.

# Constraints
1. Formatting
   - If the result is a noun phrase, use Title Case and do not end with a period.
   - If the result is a full sentence, use sentence case (capitalize only the first word, except proper nouns) and end with a period.

2. Style
   - Minimalist: remove filler openers like "The figure shows" and go straight to content (e.g., start with "Architecture", "Performance comparison", "Visualization").
   - Avoid overly fancy or uncommon words. Keep wording plain and precise.

3. Output format
   - Output only the English caption text.
   - Do not add prefixes like "Figure 1:".
   - Escape special characters when needed (e.g., %, _, &).
   - Keep math expressions unchanged (preserve $ ... $).

# Input
{{description}}`,
      outputRequirements: "Return English figure caption only.",
    },
    variables: [
      { name: "description", type: "multiline", required: true, description: "Figure description" }
    ],
    outputFormat: "plain",
    author: toolkitAuthor,
    provenance: toolkitProvenance,
  },
  {
    id: "table_caption_gen",
    title: "Table Caption Generator (TIDD-EC)",
    description: "Generate standard academic table captions.",
    stages: ["writing"],
    researchTypes: ["quantitative", "computational", "mixed_methods"],
    tags: ["Table", "Caption", "Writing"],
    framework: "TIDD-EC",
    difficulty: "intermediate",
    content: {
      goal: "Convert a description into a standard table caption.",
      context: "You are an experienced academic editor.",
      constraints: "Use standard phrases (Comparison with, Ablation study on).",
      instructions: `
# Role
I want you to act as an experienced academic editor who writes precise, publication-ready table captions.

# Task
Convert the description I provide into a table caption that matches top-tier venue conventions.

# Constraints
1. Formatting
   - If the result is a noun phrase, use Title Case and do not end with a period.
   - If the result is a full sentence, use sentence case (capitalize only the first word, except proper nouns) and end with a period.

2. Style
   - Use standard academic table phrasing when appropriate (e.g., "Comparison with", "Ablation study on", "Results on").
   - Avoid words like "showcase" or "depict". Prefer "show", "compare", "present".

3. Output format
   - Output only the English caption text.
   - Do not add prefixes like "Table 1:".
   - Escape special characters when needed (e.g., %, _, &).
   - Keep math expressions unchanged (preserve $ ... $).

# Input
{{description}}`,
      outputRequirements: "Return English table caption only.",
    },
    variables: [
      { name: "description", type: "multiline", required: true, description: "Table description" }
    ],
    outputFormat: "plain",
    author: toolkitAuthor,
    provenance: toolkitProvenance,
  },
  {
    id: "exp_results_analysis",
    title: "Experimental Results Analysis (TIDD-EC)",
    description: "Write publication-quality analysis paragraphs from results.",
    stages: ["analysis", "writing"],
    researchTypes: ["quantitative", "computational"],
    tags: ["Results", "Analysis", "Latex"],
    framework: "TIDD-EC",
    difficulty: "advanced",
    content: {
      goal: "Extract patterns/trends and write LaTeX analysis paragraphs.",
      context: "You are a senior data scientist.",
      constraints: "Strict data fidelity. Comparisons and trends. No itemized lists.",
      instructions: `# Role
I want you to act as a senior data scientist who can interpret experimental results and write publication-quality analysis.

# Task
Read the experimental results I provide, extract key patterns, trends, and comparisons, and write LaTeX analysis paragraphs suitable for a top-tier submission.

# Constraints
1. Data fidelity
   - Every conclusion must be strictly supported by the input data.
   - Do not invent numbers, exaggerate gains, or claim effects that are not present.
   - If the results show no clear advantage or trend, state that plainly.

2. Analytical depth
   - Avoid ledger-style reporting (do not just restate scores).
   - Focus on comparisons and trends: SOTA comparisons, sensitivity to parameters, performance vs efficiency tradeoffs, and contributions of components in ablations.

3. Formatting rules
   - Do not use emphasis formatting: do not use \\textbf or \\emph.
   - Required structure: each point must be written as:
     \\paragraph{Core takeaway} followed immediately by the analysis text in the same paragraph.
     * The \\paragraph{} title must be a concise phrase in Title Case.
   - Do not use itemized lists. Keep prose paragraphs.

4. Output format
   - Part 1 [LaTeX]: output only the LaTeX analysis.
     * Escape special characters when needed (e.g., %, _, &).
     * Keep math expressions unchanged (preserve $ ... $).
     * Leave one blank line between different takeaways.
   - Part 2 [Plain-language check]: provide a short plain-English restatement of each takeaway (no new claims), so I can verify you did not over-interpret.
   - Do not output anything beyond Part 1 and Part 2.

# Input
{{results_data}}`,
      outputRequirements: "Return LaTeX analysis + plain check.",
    },
    variables: [
      { name: "results_data", type: "multiline", required: true, description: "Raw results text or table" }
    ],
    outputFormat: "markdown",
    author: toolkitAuthor,
    provenance: toolkitProvenance,
  },
  {
    id: "latex_strict_review",
    title: "Full Paper Review (Strict Mode)",
    description: "Strict, detail-oriented review based on top-tier standards.",
    stages: ["review"],
    researchTypes: ["quantitative", "computational", "mixed_methods"],
    tags: ["Review", "Critique", "Strict"],
    framework: "COSTAR",
    difficulty: "advanced",
    content: {
      goal: "Perform a tough but constructive review focusing on rigor and originality.",
      context: "You are a strict senior reviewer.",
      constraints: "Default to skepticism. Focus on material issues.",
      instructions: `
# Role
I want you to act as a strict, detail-oriented senior reviewer who understands top-tier scholarly review standards. Your job is to protect the bar for rigor, originality, and internal coherence.

# Task
Read and analyze the PDF of my paper. Based on my specified target venue, write a tough but constructive review.

# Constraints
1. Review stance
   - Default to a skeptical stance and assume rejection unless the paper clearly earns acceptance.
   - Skip empty compliments. Focus on issues that would drive rejection or major revision.

2. Review dimensions
   - Originality: is this a real conceptual advance or a marginal increment? If marginal, say so.
   - Rigor: are there gaps in derivations, unfair comparisons, missing baselines, or weak ablations relative to the central claims?
   - Internal consistency: do the claimed contributions in the introduction actually appear and get validated in results?

3. Style and structure
   - Do not overuse bullet lists. Use coherent paragraphs for complex reasoning.
   - Keep LaTeX clean: do not add unrelated formatting commands.

4. Output format
   - Part 1 [Review Report]: write a realistic top-venue review with these sections:
     * Summary: one sentence capturing the core of the paper.
     * Strengths: 1 to 2 genuinely valuable contributions.
     * Weaknesses (Critical): 3 to 5 serious issues that could directly cause rejection (e.g., missing essential baseline, logic gap in method, overclaimed novelty, insufficient validation).
     * Rating: an estimated score from 1 to 10 (treat 8+ as top 5%).
   - Part 2 [Strategic Advice]: concrete, actionable revision guidance in English:
     * Diagnose the root cause of each critical weakness.
     * Specify what to add or change (which experiments to add, what logic to rewrite, what claims to narrow).
   - Do not output anything beyond Part 1 and Part 2.

# Self-check before output
1. Tone check: if the review reads too gentle, re-check ambiguous results and raise sharper questions.
2. Specificity check: replace vague criticism with concrete items (e.g., "missing robustness analysis on X dataset", "no sensitivity analysis for Y").
3. Grounding check: base every criticism strictly on content present in the uploaded PDF; if a section is unclear, illegible, or missing, say so explicitly rather than inferring or inventing details.

# Input
I have uploaded a PDF. My target venue is: {{venue}}`,
      outputRequirements: "Return strict review report + strategic advice.",
    },
    variables: [
      { name: "venue", type: "text", required: true, description: "Target venue" }
    ],
    outputFormat: "markdown",
    author: toolkitAuthor,
    provenance: toolkitProvenance,
  },
  {
    id: "toolkit_7_fig_caption",
    title: "Figure Caption Generator (COSTAR)",
    description: "Convert descriptions into publication-ready figure captions.",
    stages: ["writing", "visualization"],
    researchTypes: ["quantitative", "mixed_methods", "experimental"],
    tags: ["Toolkit", "Captions", "Visualization"],
    framework: "COSTAR",
    difficulty: "beginner",
    content: {
      goal: "Generate a publication-ready figure caption.",
      context: "You are an experienced academic editor.",
      constraints: "Minimalist, no filler, precise formatting.",
      instructions: `Context: You are an experienced academic editor who writes precise, publication-ready figure captions.

Objective: Convert the description {{description}} into an English figure caption.
- Noun phrase -> Title Case, no period.
- Full sentence -> Sentence case, end with period.

Style: Minimalist. Remove "The figure shows".

Tone: Precise.

Audience: Journal readers.

Response: Output only the caption text. Escape special chars.`,
      outputRequirements: "Figure caption text only.",
    },
    variables: [
      { name: "description", type: "multiline", required: true },
    ],
    outputFormat: "plain",
    author: toolkitAuthor,
    provenance: toolkitProvenance,
  },
  {
    id: "toolkit_8_table_caption",
    title: "Table Caption Generator (COSTAR)",
    description: "Generate standard academic table captions.",
    stages: ["writing", "visualization"],
    researchTypes: ["quantitative", "mixed_methods", "experimental"],
    tags: ["Toolkit", "Captions", "Tables"],
    framework: "COSTAR",
    difficulty: "beginner",
    content: {
      goal: "Generate a publication-ready table caption.",
      context: "You are an experienced academic editor.",
      constraints: "Standard academic phrasing.",
      instructions: `Context: You are an experienced academic editor who writes precise, publication-ready table captions.

Objective: Convert description {{description}} into a table caption.
- Noun phrase -> Title Case, no period.
- Full sentence -> Sentence case, end with period.
- Use "Comparison with", "Ablation study on", etc.

Style: Academic standard.

Tone: Precise.

Audience: Journal readers.

Response: Output only the caption text.`,
      outputRequirements: "Table caption text only.",
    },
    variables: [
      { name: "description", type: "multiline", required: true },
    ],
    outputFormat: "plain",
    author: toolkitAuthor,
    provenance: toolkitProvenance,
  },
  {
    id: "toolkit_9_results_analysis",
    title: "Experimental Results Analysis (COSTAR)",
    description: "Interpret results and write LaTeX analysis paragraphs.",
    stages: ["analysis", "writing"],
    researchTypes: ["quantitative"],
    tags: ["Toolkit", "Analysis", "Latex"],
    framework: "COSTAR",
    difficulty: "advanced",
    content: {
      goal: "Write publication-quality analysis paragraphs.",
      context: "You are a senior data scientist interpreting results.",
      constraints: "Strict data fidelity, no overclaiming.",
      instructions: `Context: You are a senior data scientist who can interpret experimental results and write publication-quality analysis.

Objective: Read results {{results_text}}, extract patterns, and write LaTeX analysis paragraphs.
- Comparisons, trends, tradeoffs.
- No ledger-style reporting.

Style: LaTeX paragraphs with \\paragraph{Core takeaway} headers.

Tone: Matter-of-fact.

Audience: Top-tier submission reviewers.

Response: Part 1 [LaTeX]: Analysis text.
Part 2 [Plain-language check]: Short restatement.`,
      outputRequirements: "LaTeX analysis and plain check.",
    },
    variables: [
      { name: "results_text", type: "multiline", required: true },
    ],
    outputFormat: "markdown",
    author: toolkitAuthor,
    provenance: toolkitProvenance,
  },
  {
    id: "toolkit_10_full_review",
    title: "Full Paper Review",
    description: "Strict reviewer mode analysis of a paper.",
    stages: ["review"],
    researchTypes: ["quantitative", "mixed_methods", "theoretical"],
    tags: ["Toolkit", "Review", "Critique"],
    framework: "COSTAR",
    difficulty: "advanced",
    content: {
      goal: "Write a tough, constructive review.",
      context: "You are a strict, detail-oriented senior reviewer.",
      constraints: "Skeptical stance. Assume rejection unless earned.",
      instructions: `Context: You are a strict, detail-oriented senior reviewer who understands top-tier scholarly review standards.

Objective: Analyze the paper (PDF content {{pdf_content}} or text) for target venue {{venue}}.
- Originality, Rigor, Internal consistency.
- Base all critique strictly on the supplied paper content ({{pdf_content}}); do not infer or invent claims, baselines, or results not present in the text.

Style: Realistic top-venue review.

Tone: Tough but constructive.

Audience: Authors and Editor.

Response: Part 1 [Review Report]: Summary, Strengths, Weaknesses (Critical), Rating (1-10).
Part 2 [Strategic Advice]: Actionable revision guidance.`,
      outputRequirements: "Review report and advice.",
    },
    variables: [
      { name: "pdf_content", type: "multiline", required: true },
      { name: "venue", type: "text", required: true },
    ],
    outputFormat: "markdown",
    author: toolkitAuthor,
    provenance: toolkitProvenance,
  },
  {
    id: "focus_1_social_scan",
    title: "Social Media Trend Scan",
    description: "Track fast-moving developments on social platforms.",
    stages: ["design", "interpretation"],
    researchTypes: ["qualitative", "mixed_methods"],
    tags: ["Focus", "Trends", "Social_Media"],
    framework: "FOCUS",
    difficulty: "beginner",
    content: {
      goal: "Identify new developments and use cases.",
      context: "Tracking fast-moving developments in {{topic}}.",
      constraints: "Forensic, source-first, skeptical of hype.",
      instructions: `Context: I’m tracking fast-moving developments in {{topic}} and need a snapshot.
Objective: Search {{platforms}} for {{time_window}} and identify developments.
Style: Forensic, source-first.
Tone: Crisp, research-notes.
Audience: Researcher.
Response: 1. Trend brief
2. Top threads/posts
3. Capabilities/Use cases
4. Open questions
5. Follow-up terms
Only report posts/sources you actually located; do not invent handles, post text, or engagement numbers. If coverage is sparse, say so explicitly.`,
      outputRequirements: "Trend brief and threads.",
    },
    variables: [
      { name: "topic", type: "text", required: true },
      { name: "platforms", type: "text", required: false, defaultValue: "X, Reddit, Hacker News" },
      { name: "time_window", type: "text", required: false, defaultValue: "past 14 days" },
    ],
    outputFormat: "markdown",
    author: toolkitAuthor,
    provenance: toolkitProvenance,
  },
  {
    id: "focus_2_deep_search",
    title: "Academic Deep Search",
    description: "Find high-quality recent academic sources.",
    stages: ["design", "writing"],
    researchTypes: ["theoretical", "systematic_review"],
    tags: ["Focus", "Literature", "Search"],
    framework: "FOCUS",
    difficulty: "intermediate",
    content: {
      goal: "Find peer-reviewed papers relevant to topic.",
      context: "Drafting a paper on {{topic}}.",
      constraints: "Systematic mini-review style.",
      instructions: `Context: Drafting a paper on {{topic}}.
Objective: Find papers from last {{n_years}} years.
Style: Systematic.
Tone: Neutral.
Audience: Researcher.
Response: 1. Search strategy
2. Annotated bibliography (8-20 sources)
3. Concept map
4. Next steps
Only include sources you actually located via search; do not invent titles, authors, or DOIs. If fewer than 8 verifiable sources exist, say so rather than padding the list.`,
      outputRequirements: "Annotated bibliography of only verifiably retrieved sources.",
    },
    variables: [
      { name: "topic", type: "text", required: true },
      { name: "n_years", type: "text", required: false, defaultValue: "5" },
    ],
    outputFormat: "markdown",
    author: toolkitAuthor,
    provenance: toolkitProvenance,
  },
  {
    id: "focus_3_transcription",
    title: "Multimodal Transcription",
    description: "Transcribe and clean audio/video content.",
    stages: ["data_qc", "analysis"],
    researchTypes: ["qualitative"],
    tags: ["Focus", "Transcription", "Data_Cleaning"],
    framework: "FOCUS",
    difficulty: "beginner",
    content: {
      goal: "Transcribe verbatim and clean for readability.",
      context: "Lecture/interview at {{url}}.",
      constraints: "Transcript-editor style.",
      instructions: `Context: Content at {{url}} needs transcription.
Objective: Transcribe verbatim then clean.
Style: Editor style.
Tone: Professional.
Audience: Researcher.
Response: 1. Verbatim transcript (timestamps every {{interval}})
2. Cleaned transcript
3. Glossary
4. Key segments index`,
      outputRequirements: "Transcripts and glossary.",
    },
    variables: [
      { name: "url", type: "text", required: true },
      { name: "interval", type: "text", required: false, defaultValue: "30-60 seconds" },
    ],
    outputFormat: "markdown",
    author: toolkitAuthor,
    provenance: toolkitProvenance,
  },
  {
    id: "focus_4_discussion",
    title: "Discussion Mining",
    description: "Extract insights from community discussions.",
    stages: ["design", "interpretation"],
    researchTypes: ["qualitative", "mixed_methods"],
    tags: ["Focus", "Qualitative", "Forums"],
    framework: "FOCUS",
    difficulty: "intermediate",
    content: {
      goal: "Locate threads and extract insights.",
      context: "Understanding practitioner perspectives on {{topic}}.",
      constraints: "Qualitative synthesis with attribution.",
      instructions: `Context: Understanding perspectives on {{topic}} beyond papers.
Objective: Locate threads, extract insights/disagreements.
Style: Synthesis.
Tone: Analytic.
Audience: Researcher.
Response: 1. Thread briefs
2. Evidence excerpts (quotes)
3. Theme synthesis
4. Research implications
Quote only text found verbatim in real threads; include a link or identifier for each thread. If you cannot locate genuine discussion threads on this topic, say so rather than fabricating them.`,
      outputRequirements: "Discussion synthesis.",
    },
    variables: [
      { name: "topic", type: "text", required: true },
    ],
    outputFormat: "markdown",
    author: toolkitAuthor,
    provenance: toolkitProvenance,
  },
  {
    id: "focus_5_paper_summary",
    title: "Deep Paper Summary",
    description: "Summarize major points section-by-section with quotes.",
    stages: ["design", "analysis"],
    researchTypes: ["theoretical", "systematic_review"],
    tags: ["Focus", "Summary", "Reading"],
    framework: "FOCUS",
    difficulty: "intermediate",
    content: {
      goal: "Summarize every major point with specific details.",
      context: "Reading {{paper_title}} rigorously.",
      constraints: "Meticulous reading notes.",
      instructions: `Context: Reading {{paper_title}}.
Objective: Summarize section-by-section.
Style: Meticulous notes.
Tone: Matter-of-fact.
Audience: Researcher.
Response: For each section:
- Key claims (bullets)
- Evidence (short quotes)
- Reproducibility checklist
- Limitations
Quote only text verified as present in the actual paper; if full text is unavailable, state that explicitly rather than fabricating quotes or claims.`,
      outputRequirements: "Detailed paper summary.",
    },
    variables: [
      { name: "paper_title", type: "text", required: true },
    ],
    outputFormat: "markdown",
    author: toolkitAuthor,
    provenance: toolkitProvenance,
  },
  {
    id: "focus_6_quotes",
    title: "Key Quote Extraction",
    description: "Extract most important insights as direct quotes.",
    stages: ["writing", "interpretation"],
    researchTypes: ["qualitative", "theoretical"],
    tags: ["Focus", "Quotes", "Notes"],
    framework: "FOCUS",
    difficulty: "beginner",
    content: {
      goal: "Extract headers and quotes only.",
      context: "Need passages from {{book_or_text_title}}.",
      constraints: "Curator style. No paraphrase.",
      instructions: `Context: Need quotes from {{book_or_text_title}}.
Objective: Extract insights as direct quotes.
Style: Curator.
Tone: Minimal.
Audience: Researcher.
Response: Numbered list:
- Bold concept label
- Direct quote
- Location pointer
Only extract quotes and location pointers you can verify are accurate to the source text; if the text is not accessible, state that rather than inventing quotes or page numbers.`,
      outputRequirements: "Structured quote list.",
    },
    variables: [
      { name: "book_or_text_title", type: "text", required: true },
    ],
    outputFormat: "markdown",
    author: toolkitAuthor,
    provenance: toolkitProvenance,
  },
  {
    id: "focus_7_concept",
    title: "Concept Deep Explanation",
    description: "Teach a concept progressively from simple to PHD level.",
    stages: ["design", "interpretation"],
    researchTypes: ["theoretical"],
    tags: ["Focus", "Learning", "Concept"],
    framework: "FOCUS",
    difficulty: "beginner",
    content: {
      goal: "Teach concept progressively.",
      context: "Fully understand {{concept}}.",
      constraints: "Socratic and pedagogical.",
      instructions: `Context: Understanding {{concept}}.
Objective: Teach progressively.
Style: Socratic.
Tone: Clear, patient.
Audience: Learner.
Response: 1. Definition (HS level)
2. Intuition + analogy
3. Undergrad explanation
4. Grad formalization
5. PhD nuance`,
      outputRequirements: "Progressive explanation.",
    },
    variables: [
      { name: "concept", type: "text", required: true },
    ],
    outputFormat: "markdown",
    author: toolkitAuthor,
    provenance: toolkitProvenance,
  },
  {
    id: "focus_8_fact_check",
    title: "Internal Fact Check",
    description: "Verify a statement against attached documents.",
    stages: ["review", "writing"],
    researchTypes: ["mixed_methods", "systematic_review"],
    tags: ["Focus", "Verification", "Fact_Check"],
    framework: "FOCUS",
    difficulty: "intermediate",
    content: {
      goal: "Verify statement against documents.",
      context: "Verify \"{{statement}}\".",
      constraints: "Evidence-led. No external knowledge.",
      instructions: `Context: Verify statement against attached docs.
Objective: Determine support/contradiction for: "{{statement}}".
Style: Evidence-led.
Tone: Precise.
Audience: Researcher.
Response: - Verdict
- Reasoning
- Evidence quotes
- Correction if needed
If the attached documents do not contain enough information to verify the statement, say so explicitly rather than guessing.`,
      outputRequirements: "Fact check verdict.",
    },
    variables: [
      { name: "statement", type: "text", required: true },
    ],
    outputFormat: "markdown",
    author: toolkitAuthor,
    provenance: toolkitProvenance,
  },
  {
    id: "focus_9_novelty",
    title: "Novelty Assessment",
    description: "Evaluate idea novelty relative to recent literature.",
    stages: ["design", "writing"],
    researchTypes: ["theoretical"],
    tags: ["Focus", "Novelty", "Positioning"],
    framework: "FOCUS",
    difficulty: "intermediate",
    content: {
      goal: "Evaluate novelty vs recent work.",
      context: "Idea: {{paste_idea}}.",
      constraints: "Related work + gap analysis.",
      instructions: `Context: Idea: {{paste_idea}}.
Objective: Evaluate novelty vs last {{n_years}} years.
Style: Gap analysis.
Tone: Constructive.
Audience: Researcher.
Response: 1. Prior work shortlist
2. Novelty matrix
3. Overlap assessment
4. Positioning recs
5. Risk flags
List only prior work you can verify exists (via search or provided context); do not invent paper titles or authors. Mark any item you are uncertain about.`,
      outputRequirements: "Novelty assessment report.",
    },
    variables: [
      { name: "paste_idea", type: "text", required: true },
      { name: "n_years", type: "text", required: false, defaultValue: "2" },
    ],
    outputFormat: "markdown",
    author: toolkitAuthor,
    provenance: toolkitProvenance,
  },
  {
    id: "focus_10_verification",
    title: "External Source Verification",
    description: "Find sources to support or contradict claims.",
    stages: ["writing", "review"],
    researchTypes: ["mixed_methods", "systematic_review"],
    tags: ["Focus", "Verification", "Citations"],
    framework: "FOCUS",
    difficulty: "intermediate",
    content: {
      goal: "Find sources for claims.",
      context: "Claims in {{paste_text}}.",
      constraints: "Fact-checker mindset.",
      instructions: `Context: Claims in {{paste_text}}.
Objective: Find support/contradiction sources.
Style: Fact-checker.
Tone: Neutral.
Audience: Researcher.
Response: - Claim extraction
- For each: supporting/contradicting sources
- Strength rating
- Verification steps
Only cite sources you actually located and can verify; never invent citations. If no verifiable source supports or contradicts a claim, state that explicitly and rate confidence accordingly.`,
      outputRequirements: "Verification report with only verifiable sources.",
    },
    variables: [
      { name: "paste_text", type: "text", required: true },
    ],
    outputFormat: "markdown",
    author: toolkitAuthor,
    provenance: toolkitProvenance,
  },

  // =======================================================================
  // Workflow 1: Operationalization Pipeline (6 steps)
  // =======================================================================
  {
    id: "w1_s1_construct",
    title: "Clarify Question and Analytic Target",
    description: "Turn a broad question into testable aims and specify unit of analysis.",
    stages: ["design"],
    researchTypes: ["quantitative", "mixed_methods"],
    tags: ["Operationalization", "Design", "Workflow"],
    framework: "COSTAR",
    difficulty: "intermediate",
    content: {
      goal: "Convert research question into measurable analytic plan.",
      context: "Psychometrics-aware social science methodology.",
      constraints: "Graduate-level rigor.",
      instructions: `Context: You are a psychometrics-aware social science methodologist.

Objective: Given:
- Research question: {{research_question}}
- Population: {{population}}
- Available data: {{available_data}}
- Constraints: {{constraints}}

1) Restate the question as 1-3 testable aims.
2) Specify unit of analysis, time frame, and key estimand(s).
3) Identify candidate outcomes, exposures, mediators, moderators, confounders.

Style: Structured, rigorous, minimal jargon.
Tone: Direct, methodologically cautious.
Audience: Graduate-level researcher.

Response: Markdown with sections:
1) Aims
2) Unit of analysis and estimand
3) Variable roles
4) Assumptions and constraints
5) Open questions`,
      outputRequirements: "Structured analytic plan.",
    },
    variables: [
      { name: "research_question", type: "multiline", required: true },
      { name: "population", type: "text", required: true },
      { name: "available_data", type: "multiline", required: false },
      { name: "constraints", type: "multiline", required: false },
    ],
    outputFormat: "markdown",
    author: toolkitAuthor,
    provenance: toolkitProvenance,
  },
  {
    id: "w1_s2_measurement",
    title: "Build a Construct Map",
    description: "Define constructs and align them to theory and observable indicators.",
    stages: ["measures"],
    researchTypes: ["quantitative", "mixed_methods"],
    tags: ["Operationalization", "Constructs", "Workflow"],
    framework: "COSTAR",
    difficulty: "intermediate",
    content: {
      goal: "Create construct map with definitions and indicators.",
      context: "Operationalizing constructs for quantitative study.",
      constraints: "Table-first, avoid filler.",
      instructions: `Context: You are operationalizing constructs for a quantitative study.

Objective: Using:
- Research question: {{research_question}}
- Candidate constructs: {{constructs}}
- Constraints: {{constraints}}

Create a construct map. For each construct:
- Definition (1-2 sentences)
- Theoretical rationale (1-2 bullets)
- 2-4 observable indicators
- Level (individual, household, neighborhood, system)
- Expected direction (if applicable)

Style: Table-first, crisp definitions.
Tone: Analytical and precise.
Audience: Dissertation committee level.

Response: Markdown table:
Construct | Definition | Rationale | Indicators | Level | Expected direction | Notes
Then list "construct risks" (overlap, ambiguity, gaps).`,
      outputRequirements: "Construct map table.",
    },
    variables: [
      { name: "research_question", type: "multiline", required: true },
      { name: "constructs", type: "multiline", required: true },
      { name: "constraints", type: "multiline", required: false },
    ],
    outputFormat: "markdown",
    author: toolkitAuthor,
    provenance: toolkitProvenance,
  },
  {
    id: "w1_s3_protocol",
    title: "Measurement Options and Coding Rules",
    description: "Translate indicators into measurable variables with explicit coding.",
    stages: ["measures"],
    researchTypes: ["quantitative", "mixed_methods"],
    tags: ["Operationalization", "Coding", "Workflow"],
    framework: "COSTAR",
    difficulty: "intermediate",
    content: {
      goal: "Select measures and define coding rules.",
      context: "Selecting measures from real-world data sources.",
      constraints: "Implementation-ready.",
      instructions: `Context: You are selecting measures from real-world data sources and defining coding rules.

Objective: Given:
- Available data: {{available_data}}
- Constructs: {{constructs}}
- Preferred scale types: {{preferred_scale_types}}
- Constraints: {{constraints}}

For each construct, propose 1-3 measurement options:
- Source fields
- Coding rules (value mappings)
- Valid range and invalid values
- Handling unknown/refused/don't know
- Pros/cons and threats (bias, ceiling effects, differential missingness)

Style: Concrete, implementation-ready.
Tone: Pragmatic and risk-aware.
Audience: Researcher preparing analysis code.

Response: 1) Markdown table: Construct | Option | Source fields | Coding rules | Missing handling | Pros | Cons
2) Recommended default option per construct with rationale.`,
      outputRequirements: "Measurement options table.",
    },
    variables: [
      { name: "available_data", type: "multiline", required: true },
      { name: "constructs", type: "multiline", required: true },
      { name: "preferred_scale_types", type: "text", required: false, defaultValue: "binary, ordinal, continuous" },
      { name: "constraints", type: "multiline", required: false },
    ],
    outputFormat: "markdown",
    author: toolkitAuthor,
    provenance: toolkitProvenance,
  },
  {
    id: "w1_s4_sanity",
    title: "Analysis-Ready Variable Dictionary",
    description: "Produce final variable spec with names, types, reference categories, transforms.",
    stages: ["measures"],
    researchTypes: ["quantitative", "mixed_methods"],
    tags: ["Operationalization", "Variables", "Workflow"],
    framework: "COSTAR",
    difficulty: "intermediate",
    content: {
      goal: "Create publication-grade variable dictionary.",
      context: "Producing analysis-ready variable specs.",
      constraints: "Strictly structured, no ambiguity.",
      instructions: `Context: You are producing a publication-grade variable dictionary.

Objective: Using available data: {{available_data}} and constraints: {{constraints}}, produce an analysis-ready variable dictionary:
- Variable name (follow {{naming_convention}} if provided)
- Label
- Role (outcome/exposure/confounder/etc.)
- Type (binary/ordinal/continuous/categorical)
- Allowed values and labels
- Reference category (if categorical)
- Transformations (log, standardize, bins)
- Derived variables (formulas)
- Missingness encoding and rationale

Style: Strictly structured, no ambiguity.
Tone: Professional and audit-friendly.
Audience: Analyst and future replicator.

Response: Markdown table:
Name | Label | Role | Type | Values/labels | Reference | Transform | Derived rule | Missing handling | Notes`,
      outputRequirements: "Variable dictionary table.",
    },
    variables: [
      { name: "available_data", type: "multiline", required: true },
      { name: "constraints", type: "multiline", required: false },
      { name: "naming_convention", type: "text", required: false, defaultValue: "snake_case" },
    ],
    outputFormat: "markdown",
    author: toolkitAuthor,
    provenance: toolkitProvenance,
  },
  {
    id: "w1_s5_ethics",
    title: "Inclusion/Exclusion and Missingness Plan",
    description: "Decide analytic sample rules and defensible missing data handling.",
    stages: ["design", "data_qc"],
    researchTypes: ["quantitative", "mixed_methods"],
    tags: ["Operationalization", "Missingness", "Workflow"],
    framework: "COSTAR",
    difficulty: "intermediate",
    content: {
      goal: "Draft defensible analytic sample plan.",
      context: "Finalizing sample selection and missingness handling.",
      constraints: "Conservative and transparent.",
      instructions: `Context: You are finalizing a defensible analytic sample plan.

Objective: Given population: {{population}} and constraints: {{constraints}}, draft:
1) Inclusion criteria
2) Exclusion criteria
3) Missingness diagnostics plan
4) Missing data strategy options (at least 2) and when to use each
5) Risk register of how decisions could bias results

Style: Checklist format with justifications.
Tone: Conservative and transparent.
Audience: Research team writing Methods and preregistration.

Response: Markdown sections:
- Inclusion criteria
- Exclusion criteria
- Missingness diagnostics
- Missing data strategies
- Bias and risk register
- Decisions to report in Methods`,
      outputRequirements: "Sample and missingness plan.",
    },
    variables: [
      { name: "population", type: "multiline", required: true },
      { name: "constraints", type: "multiline", required: false },
    ],
    outputFormat: "markdown",
    author: toolkitAuthor,
    provenance: toolkitProvenance,
  },
  {
    id: "w1_s6_prereg",
    title: "Pre-registration Draft",
    description: "Generate pre-registration document from operationalization outputs.",
    stages: ["design"],
    researchTypes: ["quantitative", "experimental"],
    tags: ["Operationalization", "Preregistration", "Workflow"],
    framework: "COSTAR",
    difficulty: "intermediate",
    content: {
      goal: "Draft pre-registration document.",
      context: "Compiling operationalization into pre-registration format.",
      constraints: "OSF or AsPredicted compatible.",
      instructions: `Context: You are drafting a pre-registration document.

Objective: Using the operationalization outputs:
- Research question: {{research_question}}
- Hypotheses: {{hypotheses}}
- Variables: {{variables}}
- Analysis plan: {{analysis_plan}}

Generate a pre-registration draft with:
1) Study Title
2) Research Questions/Hypotheses
3) Variables (DV, IV, controls)
4) Sampling Plan
5) Analysis Plan
6) Exclusion Criteria
7) Outlier Handling

Style: Template-compatible format.
Tone: Precise and complete.
Audience: Pre-registration platform requirements.

Response: Markdown pre-registration document.`,
      outputRequirements: "Pre-registration draft.",
    },
    variables: [
      { name: "research_question", type: "multiline", required: true },
      { name: "hypotheses", type: "multiline", required: true },
      { name: "variables", type: "multiline", required: true },
      { name: "analysis_plan", type: "multiline", required: true },
    ],
    outputFormat: "markdown",
    author: toolkitAuthor,
    provenance: toolkitProvenance,
  },

  // =======================================================================
  // Workflow 2: Compliance-Ready Data (6 steps)
  // =======================================================================
  {
    id: "w2_s1_checklist",
    title: "Data Source Inventory",
    description: "Create comprehensive data source inventory for compliance.",
    stages: ["design"],
    researchTypes: ["quantitative", "mixed_methods", "qualitative"],
    tags: ["Compliance", "Data", "Workflow"],
    framework: "COSTAR",
    difficulty: "intermediate",
    content: {
      goal: "Create data source inventory.",
      context: "Research data steward focused on compliant handling.",
      constraints: "Include all provenance details.",
      instructions: `Context: You are a research data steward focused on compliant, reproducible handling.

Objective: Create a data source inventory for:
- Data source: {{data_source}}
- Sharing plan: {{sharing_plan}}
- Constraints: {{constraints}}

Include: owner, provenance, collection method, licensing/terms, update frequency, linkage potential, intended use.

Style: Detailed inventory format.
Tone: Thorough and compliance-focused.
Audience: Research compliance officer.

Response: Markdown table and narrative summary.`,
      outputRequirements: "Data source inventory.",
    },
    variables: [
      { name: "data_source", type: "multiline", required: true },
      { name: "sharing_plan", type: "multiline", required: true },
      { name: "constraints", type: "multiline", required: false },
    ],
    outputFormat: "markdown",
    author: toolkitAuthor,
    provenance: toolkitProvenance,
  },
  {
    id: "w2_s2_data",
    title: "Privacy Risk Mapping",
    description: "Assess privacy risk and identifiability of data.",
    stages: ["design"],
    researchTypes: ["quantitative", "mixed_methods", "qualitative"],
    tags: ["Compliance", "Privacy", "Workflow"],
    framework: "COSTAR",
    difficulty: "intermediate",
    content: {
      goal: "Map privacy risks and identifiability.",
      context: "Assessing privacy risk and identifiability.",
      constraints: "Risk-focused approach.",
      instructions: `Context: You are assessing privacy risk and identifiability.

Objective: For {{data_source}} at sensitivity level {{sensitivity_level}}, identify:
- Direct identifiers
- Quasi-identifiers
- Sensitive attributes
- Linkage risks
Then propose mitigation actions.

Style: Risk mapping table.
Tone: Precise, risk-focused.
Audience: IRB-facing documentation audience.

Response: Markdown table:
Field type | Examples | Risk | Mitigation
Then "red flag" list requiring special handling.`,
      outputRequirements: "Privacy risk assessment.",
    },
    variables: [
      { name: "data_source", type: "multiline", required: true },
      { name: "sensitivity_level", type: "text", required: true },
    ],
    outputFormat: "markdown",
    author: toolkitAuthor,
    provenance: toolkitProvenance,
  },
  {
    id: "w2_s3_privacy",
    title: "IRB Alignment Checklist",
    description: "Align data handling with IRB and institutional policy.",
    stages: ["design"],
    researchTypes: ["quantitative", "mixed_methods", "qualitative"],
    tags: ["Compliance", "Irb", "Workflow"],
    framework: "COSTAR",
    difficulty: "intermediate",
    content: {
      goal: "Create IRB alignment checklist.",
      context: "Aligning data handling with IRB and institutional policy.",
      constraints: "Action-oriented and conservative.",
      instructions: `Context: You are aligning data handling with IRB and institutional policy.

Objective: Using sharing plan {{sharing_plan}} and constraints {{constraints}}, create a permissions and IRB alignment checklist:
- What approvals are required
- What documentation must exist
- Common failure points
- What can be done immediately vs blocked on approvals

Style: Checklist with clear status fields.
Tone: Action-oriented and conservative.
Audience: Researcher coordinating with compliance and IT.

Response: 1) Checklist table: Item | Owner | Status | Evidence to collect
2) Top 5 failure modes and how to prevent them.`,
      outputRequirements: "IRB checklist.",
    },
    variables: [
      { name: "sharing_plan", type: "multiline", required: true },
      { name: "constraints", type: "multiline", required: false },
    ],
    outputFormat: "markdown",
    author: toolkitAuthor,
    provenance: toolkitProvenance,
  },
  {
    id: "w2_s4_bias",
    title: "De-identification SOP",
    description: "Design de-identification plan consistent with risk level.",
    stages: ["design"],
    researchTypes: ["quantitative", "mixed_methods", "qualitative"],
    tags: ["Compliance", "De-Identification", "Workflow"],
    framework: "COSTAR",
    difficulty: "intermediate",
    content: {
      goal: "Draft de-identification and minimization SOP.",
      context: "Designing de-identification plan.",
      constraints: "Careful, audit-ready.",
      instructions: `Context: You are designing a de-identification plan consistent with risk level.

Objective: Draft a de-identification and minimization SOP for sensitivity level {{sensitivity_level}} under constraints {{constraints}}:
- Remove, mask, generalize rules
- Date handling
- Small cell suppression
- Re-identification risk notes
- Data minimization principle and justification

Style: Numbered SOP steps.
Tone: Careful, audit-ready.
Audience: Data managers and analysts.

Response: - SOP steps
- "Before vs after" field handling table
- Validation checklist to confirm de-ID is applied.`,
      outputRequirements: "De-identification SOP.",
    },
    variables: [
      { name: "sensitivity_level", type: "text", required: true },
      { name: "constraints", type: "multiline", required: false },
    ],
    outputFormat: "markdown",
    author: toolkitAuthor,
    provenance: toolkitProvenance,
  },
  {
    id: "w2_s5_statement",
    title: "Storage and Access Control",
    description: "Set up secure storage and controlled access for research data.",
    stages: ["design"],
    researchTypes: ["quantitative", "mixed_methods", "qualitative"],
    tags: ["Compliance", "Storage", "Workflow"],
    framework: "COSTAR",
    difficulty: "intermediate",
    content: {
      goal: "Define storage and access controls.",
      context: "Setting up secure storage and controlled access.",
      constraints: "Pragmatic and security-minded.",
      instructions: `Context: You are setting up secure storage and controlled access for research data.

Objective: Propose storage and access controls for {{storage_location}} given {{sharing_plan}} and constraints {{constraints}}:
- Role-based access
- Least privilege
- Audit logging
- Retention and deletion
- Backups and disaster recovery

Style: Policy outline and implementation checklist.
Tone: Pragmatic and security-minded.
Audience: Research PI and technical implementer.

Response: 1) Access roles table: Role | Access | Rationale
2) Retention policy bullets
3) Implementation checklist.`,
      outputRequirements: "Storage and access policy.",
    },
    variables: [
      { name: "storage_location", type: "text", required: true },
      { name: "sharing_plan", type: "multiline", required: true },
      { name: "constraints", type: "multiline", required: false },
    ],
    outputFormat: "markdown",
    author: toolkitAuthor,
    provenance: toolkitProvenance,
  },
  {
    id: "w2_s6_sop",
    title: "Final Data Handling SOP",
    description: "Package all compliance guidance into one SOP.",
    stages: ["design"],
    researchTypes: ["quantitative", "mixed_methods", "qualitative"],
    tags: ["Compliance", "Sop", "Workflow"],
    framework: "COSTAR",
    difficulty: "intermediate",
    content: {
      goal: "Compile single handling SOP.",
      context: "Packaging all compliance guidance.",
      constraints: "Clear and authoritative.",
      instructions: `Context: You are packaging all compliance guidance into one SOP.

Objective: Compile a single handling SOP for {{data_source}} stored in {{storage_location}} with sharing plan {{sharing_plan}}:
- Do and do not list
- Data movement rules
- Export rules (figures, tables, derivatives)
- Incident response basics
- Contact and escalation placeholders

Style: One-page SOP style, skimmable headings.
Tone: Clear and authoritative.
Audience: Entire research team.

Response: Markdown SOP with headings and final "sign-off checklist".`,
      outputRequirements: "Final data handling SOP.",
    },
    variables: [
      { name: "data_source", type: "text", required: true },
      { name: "storage_location", type: "text", required: true },
      { name: "sharing_plan", type: "multiline", required: true },
    ],
    outputFormat: "markdown",
    author: toolkitAuthor,
    provenance: toolkitProvenance,
  },

  // =======================================================================
  // Workflow 3: Stress Test Analysis (7 steps)
  // =======================================================================
  {
    id: "w3_s1_baseline",
    title: "Baseline Model Specification Card",
    description: "Document baseline model specifications before robustness checks.",
    stages: ["analysis"],
    researchTypes: ["quantitative", "computational"],
    tags: ["Stress-Test", "Baseline", "Workflow"],
    framework: "COSTAR",
    difficulty: "intermediate",
    content: {
      goal: "Document core model specification.",
      context: "Quantitative methods review before robustness checks.",
      constraints: "Neutral and precise.",
      instructions: `Context: You are a quantitative methods reviewer documenting baseline specifications.

Objective: Document the baseline model {{main_model}} with:
- Outcome, predictors, controls
- Estimation method and functional form
- Target estimand
- Key sample restrictions
- Standard error strategy
Use data summary if provided: {{data_summary}}.

Style: Structured spec card.
Tone: Neutral and precise.
Audience: Analyst and future reviewer.

Response: Markdown "Model Card" with fixed fields, no extra narrative.`,
      outputRequirements: "Model specification card.",
    },
    variables: [
      { name: "main_model", type: "multiline", required: true },
      { name: "data_summary", type: "multiline", required: false },
    ],
    outputFormat: "markdown",
    author: toolkitAuthor,
    provenance: toolkitProvenance,
  },
  {
    id: "w3_s2_assumptions",
    title: "Assumption Audit to Diagnostic Mapping",
    description: "Map assumptions to falsification and diagnostic tests.",
    stages: ["analysis"],
    researchTypes: ["quantitative", "computational"],
    tags: ["Stress-Test", "Assumptions", "Workflow"],
    framework: "COSTAR",
    difficulty: "intermediate",
    content: {
      goal: "Design falsification and diagnostic checks.",
      context: "Designing tests for model assumptions.",
      constraints: "Falsifiable and specific.",
      instructions: `Context: You are designing falsification and diagnostic checks.

Objective: For each assumption in {{key_assumptions}}, propose:
- Why it matters
- What would violate it
- Diagnostic test(s) to run
- Expected result if assumption holds

Address threats: {{threats_to_validity}}.

Style: Table format with test specifications.
Tone: Critical and constructive.
Audience: Methods reviewer.

Response: Markdown table:
Assumption | Why it matters | Violation indicator | Test | Expected result`,
      outputRequirements: "Assumption-to-test mapping.",
    },
    variables: [
      { name: "key_assumptions", type: "multiline", required: true },
      { name: "threats_to_validity", type: "multiline", required: true },
    ],
    outputFormat: "markdown",
    author: toolkitAuthor,
    provenance: toolkitProvenance,
  },
  {
    id: "w3_s3_alternatives",
    title: "Alternative Specification Generator",
    description: "Generate robustness variants of the baseline model.",
    stages: ["analysis"],
    researchTypes: ["quantitative", "computational"],
    tags: ["Stress-Test", "Robustness", "Workflow"],
    framework: "COSTAR",
    difficulty: "intermediate",
    content: {
      goal: "Generate alternative model specifications.",
      context: "Creating robustness variants.",
      constraints: "Systematic and justified.",
      instructions: `Context: You are generating robustness specifications.

Objective: Given baseline {{main_model}}, generate alternative specifications:
- Control variable additions/removals
- Functional form changes
- Sample restrictions
- Estimation method variants
- Outcome transformations

Style: Numbered list with justification.
Tone: Systematic.
Audience: Robustness-focused reviewer.

Response: Table:
Spec ID | Change from baseline | Rationale | What it tests`,
      outputRequirements: "Alternative specifications table.",
    },
    variables: [
      { name: "main_model", type: "multiline", required: true },
    ],
    outputFormat: "markdown",
    author: toolkitAuthor,
    provenance: toolkitProvenance,
  },
  {
    id: "w3_s4_heterogeneity",
    title: "Heterogeneity Analysis Plan",
    description: "Plan subgroup and interaction analyses.",
    stages: ["analysis"],
    researchTypes: ["quantitative", "computational"],
    tags: ["Stress-Test", "Heterogeneity", "Workflow"],
    framework: "COSTAR",
    difficulty: "intermediate",
    content: {
      goal: "Design heterogeneity analysis plan.",
      context: "Planning subgroup analyses.",
      constraints: "Pre-specified and justified.",
      instructions: `Context: You are planning heterogeneity analyses.

Objective: Given {{main_model}} and {{potential_moderators}}, propose:
- Which subgroups to examine
- Interaction terms to add
- Expected direction of moderation
- Multiple testing considerations

Style: Pre-analysis plan format.
Tone: Careful about p-hacking risks.
Audience: Pre-registration audience.

Response: Table:
Moderator | Subgroup or Interaction | Hypothesis | Correction method`,
      outputRequirements: "Heterogeneity analysis plan.",
    },
    variables: [
      { name: "main_model", type: "multiline", required: true },
      { name: "potential_moderators", type: "multiline", required: true },
    ],
    outputFormat: "markdown",
    author: toolkitAuthor,
    provenance: toolkitProvenance,
  },
  {
    id: "w3_s5_placebo",
    title: "Placebo and Falsification Tests",
    description: "Design tests where effect should be null.",
    stages: ["analysis"],
    researchTypes: ["quantitative", "computational"],
    tags: ["Stress-Test", "Placebo", "Workflow"],
    framework: "COSTAR",
    difficulty: "intermediate",
    content: {
      goal: "Design falsification tests.",
      context: "Creating placebo and null-effect tests.",
      constraints: "Genuine null expected.",
      instructions: `Context: You are designing falsification tests.

Objective: For {{main_model}}, propose placebo tests:
- Alternative outcomes where effect should be null
- Alternative exposures that should have no effect
- Pre-treatment periods (if applicable)
- Pseudo-samples

Style: Table format.
Tone: Skeptical.
Audience: Causal inference reviewer.

Response: Table:
Test type | Specification | Why null expected | Interpretation if non-null`,
      outputRequirements: "Placebo test design.",
    },
    variables: [
      { name: "main_model", type: "multiline", required: true },
    ],
    outputFormat: "markdown",
    author: toolkitAuthor,
    provenance: toolkitProvenance,
  },
  {
    id: "w3_s6_missingness",
    title: "Missing Data Sensitivity Analysis",
    description: "Evaluate how missingness impacts conclusions.",
    stages: ["analysis"],
    researchTypes: ["quantitative", "computational"],
    tags: ["Stress-Test", "Missing-Data", "Workflow"],
    framework: "COSTAR",
    difficulty: "intermediate",
    content: {
      goal: "Assess missing data impact.",
      context: "Evaluating missingness sensitivity.",
      constraints: "Conservative assumptions.",
      instructions: `Context: You are evaluating missing data sensitivity.

Objective: Given missingness patterns {{missingness_summary}} and model {{main_model}}:
- Describe missingness mechanism assumptions
- Propose sensitivity analyses (complete case, multiple imputation, bounds)
- Identify variables most affected
- Define "tipping point" analysis if applicable

Style: Structured analysis plan.
Tone: Conservative.
Audience: Methods reviewer.

Response: Markdown sections:
- Mechanism assumptions
- Sensitivity analysis menu
- Priority variables
- Interpretation guide`,
      outputRequirements: "Missing data sensitivity plan.",
    },
    variables: [
      { name: "missingness_summary", type: "multiline", required: true },
      { name: "main_model", type: "multiline", required: true },
    ],
    outputFormat: "markdown",
    author: toolkitAuthor,
    provenance: toolkitProvenance,
  },
  {
    id: "w3_s7_matrix",
    title: "Robustness Matrix Synthesis",
    description: "Compile all robustness checks into summary matrix.",
    stages: ["writing"],
    researchTypes: ["quantitative", "computational"],
    tags: ["Stress-Test", "Synthesis", "Workflow"],
    framework: "COSTAR",
    difficulty: "intermediate",
    content: {
      goal: "Synthesize robustness findings.",
      context: "Compiling robustness matrix.",
      constraints: "Publication-ready.",
      instructions: `Context: You are synthesizing robustness results.

Objective: Given {{robustness_results}}, create:
- Summary matrix of all specifications
- Stable vs fragile conclusions
- Recommended claims language (strong/weak)
- Limitations paragraph draft

Style: Table + narrative synthesis.
Tone: Balanced and honest.
Audience: Journal reviewer.

Response: 1) Robustness matrix table
2) "Which conclusions hold?" summary
3) Draft limitations text`,
      outputRequirements: "Robustness synthesis.",
    },
    variables: [
      { name: "robustness_results", type: "multiline", required: true },
    ],
    outputFormat: "markdown",
    author: toolkitAuthor,
    provenance: toolkitProvenance,
  },

  // =======================================================================
  // Workflow 4: Citation Hygiene (5 steps)
  // =======================================================================
  {
    id: "w4_s1_claims",
    title: "Extract Atomic Claims",
    description: "List all citeable claims in the manuscript.",
    stages: ["writing"],
    researchTypes: ["theoretical", "systematic_review", "mixed_methods"],
    tags: ["Citation", "Claims", "Workflow"],
    framework: "COSTAR",
    difficulty: "intermediate",
    content: {
      goal: "Extract citeable claims.",
      context: "Auditing claims in manuscript.",
      constraints: "Exhaustive and specific.",
      instructions: `Context: You are auditing claims in a manuscript.

Objective: From {{manuscript_section}}, extract all atomic claims that need citation:
- Empirical claims (facts, findings)
- Methodological claims
- Theoretical claims
- Framing claims

Style: Numbered list with claim type.
Tone: Exhaustive.
Audience: Citation reviewer.

Response: Table:
# | Claim text | Type | Current citation (if any) | Needs citation?`,
      outputRequirements: "Claim extraction table.",
    },
    variables: [
      { name: "manuscript_section", type: "multiline", required: true },
    ],
    outputFormat: "markdown",
    author: toolkitAuthor,
    provenance: toolkitProvenance,
  },
  {
    id: "w4_s2_policy",
    title: "Evidence Policy Definition",
    description: "Define acceptable evidence and citation standards.",
    stages: ["design"],
    researchTypes: ["theoretical", "systematic_review", "mixed_methods"],
    tags: ["Citation", "Standards", "Workflow"],
    framework: "COSTAR",
    difficulty: "intermediate",
    content: {
      goal: "Define evidence standards.",
      context: "Setting citation policy.",
      constraints: "Explicit and consistent.",
      instructions: `Context: You are setting citation policy.

Objective: For {{field_context}}, define:
- Acceptable source types (peer-reviewed, preprint, grey literature)
- Recency requirements
- Primary vs secondary source rules
- Self-citation limits
- N of sources for contested claims

Style: Policy document format.
Tone: Clear and defensible.
Audience: Co-authors and reviewers.

Response: Markdown policy with examples.`,
      outputRequirements: "Evidence policy document.",
    },
    variables: [
      { name: "field_context", type: "text", required: true },
    ],
    outputFormat: "markdown",
    author: toolkitAuthor,
    provenance: toolkitProvenance,
  },
  {
    id: "w4_s3_alignment",
    title: "Claim-Source Alignment Audit",
    description: "Check each claim against its cited source.",
    stages: ["review"],
    researchTypes: ["theoretical", "systematic_review", "mixed_methods"],
    tags: ["Citation", "Audit", "Workflow"],
    framework: "COSTAR",
    difficulty: "intermediate",
    content: {
      goal: "Audit claim-source alignment.",
      context: "Verifying citations support claims.",
      constraints: "Strict interpretation.",
      instructions: `Context: You are verifying citations support claims.

Objective: For each claim in {{claims_table}} with corresponding source {{sources}}:
- Does source actually support claim?
- Is claim accurately represented?
- Is source the best/most direct evidence?
- Any overclaiming or underclaiming?

Style: Audit table format.
Tone: Strict.
Audience: Peer reviewer.

Response: Table:
Claim | Source | Supports? | Accuracy | Issues | Recommendation`,
      outputRequirements: "Claim-source audit.",
    },
    variables: [
      { name: "claims_table", type: "multiline", required: true },
      { name: "sources", type: "multiline", required: true },
    ],
    outputFormat: "markdown",
    author: toolkitAuthor,
    provenance: toolkitProvenance,
  },
  {
    id: "w4_s4_bib",
    title: "Bibliography Formatting",
    description: "Format references according to style guide.",
    stages: ["writing"],
    researchTypes: ["theoretical", "systematic_review", "mixed_methods"],
    tags: ["Citation", "Bibliography", "Workflow"],
    framework: "COSTAR",
    difficulty: "beginner",
    content: {
      goal: "Format bibliography.",
      context: "Preparing publication-ready references.",
      constraints: "Exact style compliance.",
      instructions: `Context: You are formatting references.

Objective: Given {{raw_references}} and style {{citation_style}}:
- Format each reference correctly
- Check for missing fields
- Standardize author names
- Check DOI/URL format and flag any missing or malformed entries

Style: Reference list format.
Tone: Precise.
Audience: Copy editor.

Response: Formatted bibliography with any errors flagged.`,
      outputRequirements: "Formatted bibliography.",
    },
    variables: [
      { name: "raw_references", type: "multiline", required: true },
      { name: "citation_style", type: "text", required: true, defaultValue: "APA 7th" },
    ],
    outputFormat: "markdown",
    author: toolkitAuthor,
    provenance: toolkitProvenance,
  },
  {
    id: "w4_s5_audit",
    title: "Citation Audit Log",
    description: "Track citation gaps and changes.",
    stages: ["review"],
    researchTypes: ["theoretical", "systematic_review", "mixed_methods"],
    tags: ["Citation", "Tracking", "Workflow"],
    framework: "COSTAR",
    difficulty: "intermediate",
    content: {
      goal: "Maintain citation audit log.",
      context: "Tracking citation changes.",
      constraints: "Complete trail.",
      instructions: `Context: You are maintaining a citation audit log.

Objective: Create audit log for {{manuscript_title}} tracking:
- Claims needing sources
- Sources added/removed
- Justification for each change
- Outstanding gaps

Style: Log table format.
Tone: Thorough.
Audience: Future self and collaborators.

Response: Markdown table:
Date | Section | Change | Justification | Status`,
      outputRequirements: "Citation audit log.",
    },
    variables: [
      { name: "manuscript_title", type: "text", required: true },
    ],
    outputFormat: "markdown",
    author: toolkitAuthor,
    provenance: toolkitProvenance,
  },

  // =======================================================================
  // Workflow 5: Repro Pack (5 steps)
  // =======================================================================
  {
    id: "w5_s1_inventory",
    title: "Repository Inventory",
    description: "Map complete repository structure.",
    stages: ["data_qc"],
    researchTypes: ["quantitative", "computational"],
    tags: ["Reproducibility", "Inventory", "Workflow"],
    framework: "COSTAR",
    difficulty: "intermediate",
    content: {
      goal: "Document repository structure.",
      context: "Mapping reproduction package.",
      constraints: "Comprehensive.",
      instructions: `Context: You are documenting a reproduction package.

Objective: For {{repo_path}}, create inventory:
- Directory structure with purpose of each folder
- Key files and what they do
- Input/output relationships
- Dependencies on external resources

Style: Tree structure with annotations.
Tone: Clear and navigable.
Audience: Reproducer with no prior context.

Response: Annotated directory tree + file manifest table.`,
      outputRequirements: "Repository inventory.",
    },
    variables: [
      { name: "repo_path", type: "text", required: true },
    ],
    outputFormat: "markdown",
    author: toolkitAuthor,
    provenance: toolkitProvenance,
  },
  {
    id: "w5_s2_env",
    title: "Environment Specification",
    description: "Document all environment requirements.",
    stages: ["data_qc"],
    researchTypes: ["quantitative", "computational"],
    tags: ["Reproducibility", "Environment", "Workflow"],
    framework: "COSTAR",
    difficulty: "intermediate",
    content: {
      goal: "Specify environment requirements.",
      context: "Documenting computational environment.",
      constraints: "Reproducible on clean machine.",
      instructions: `Context: You are documenting the computational environment for the following codebase/analysis:

{{code_summary}}

Objective: Create environment specification:
- OS and version
- Language versions (Python, R, etc.)
- Package list with exact versions
- System dependencies
- Hardware requirements (if any)
- Container/environment file generation

Style: Specification file format.
Tone: Precise.
Audience: Someone setting up from scratch.

Response: Requirements.txt/environment.yml + setup instructions.`,
      outputRequirements: "Environment specification.",
    },
    variables: [
      { name: "code_summary", type: "multiline", required: true },
    ],
    outputFormat: "markdown",
    author: toolkitAuthor,
    provenance: toolkitProvenance,
  },
  {
    id: "w5_s3_provenance",
    title: "Data Provenance Documentation",
    description: "Document complete data lineage.",
    stages: ["data_qc"],
    researchTypes: ["quantitative", "computational"],
    tags: ["Reproducibility", "Provenance", "Workflow"],
    framework: "COSTAR",
    difficulty: "intermediate",
    content: {
      goal: "Document data lineage.",
      context: "Recording data provenance.",
      constraints: "Complete audit trail.",
      instructions: `Context: You are documenting data provenance.

Objective: For {{data_sources}}, document:
- Original source and access date
- Any transformations applied
- Intermediate files created
- Final analysis files
- Licensing and redistribution rights

Style: Lineage diagram + table.
Tone: Audit-ready.
Audience: Compliance officer and reproducer.

Response: Data flow diagram + provenance table.`,
      outputRequirements: "Provenance documentation.",
    },
    variables: [
      { name: "data_sources", type: "multiline", required: true },
    ],
    outputFormat: "markdown",
    author: toolkitAuthor,
    provenance: toolkitProvenance,
  },
  {
    id: "w5_s4_runbook",
    title: "Reproduction Runbook",
    description: "Write step-by-step reproduction guide.",
    stages: ["writing"],
    researchTypes: ["quantitative", "computational"],
    tags: ["Reproducibility", "Runbook", "Workflow"],
    framework: "COSTAR",
    difficulty: "intermediate",
    content: {
      goal: "Create reproduction runbook.",
      context: "Writing step-by-step guide.",
      constraints: "Executable by novice.",
      instructions: `Context: You are writing a reproduction guide.

Objective: Create runbook for {{analysis_name}}:
1. Setup steps (environment, data access)
2. Execution order (which scripts, what order)
3. Expected outputs at each stage
4. Verification checks (what to look for)
5. Troubleshooting common issues

Style: Numbered steps with code blocks.
Tone: Patient and detailed.
Audience: Graduate student reproducing for first time.

Response: Step-by-step runbook with checkpoints.`,
      outputRequirements: "Reproduction runbook.",
    },
    variables: [
      { name: "analysis_name", type: "text", required: true },
    ],
    outputFormat: "markdown",
    author: toolkitAuthor,
    provenance: toolkitProvenance,
  },
  {
    id: "w5_s5_manifest",
    title: "Acceptance Criteria Manifest",
    description: "Define what constitutes successful reproduction.",
    stages: ["data_qc"],
    researchTypes: ["quantitative", "computational"],
    tags: ["Reproducibility", "Validation", "Workflow"],
    framework: "COSTAR",
    difficulty: "intermediate",
    content: {
      goal: "Define reproduction success criteria.",
      context: "Specifying acceptance tests.",
      constraints: "Objectively verifiable.",
      instructions: `Context: You are specifying reproduction acceptance criteria.

Objective: Define manifest for {{analysis_name}}:
- Key outputs that must be reproduced
- Acceptable tolerance for numerical results
- Exact vs approximate matches expected
- Files to compare (tables, figures)
- Automated checks if possible

Style: Checklist with thresholds.
Tone: Precise.
Audience: Reproducer and verifier.

Response: Acceptance checklist + verification commands.`,
      outputRequirements: "Acceptance manifest.",
    },
    variables: [
      { name: "analysis_name", type: "text", required: true },
    ],
    outputFormat: "markdown",
    author: toolkitAuthor,
    provenance: toolkitProvenance,
  },

  // =======================================================================
  // Workflow 6: Revise and Rebut (5 steps)
  // =======================================================================
  {
    id: "w6_s1_triage",
    title: "Review Triage",
    description: "Classify reviewer comments by type and priority.",
    stages: ["review"],
    researchTypes: ["qualitative", "quantitative", "mixed_methods", "theoretical"],
    tags: ["Revision", "Triage", "Workflow"],
    framework: "COSTAR",
    difficulty: "intermediate",
    content: {
      goal: "Triage reviewer comments.",
      context: "Classifying review feedback.",
      constraints: "Complete and honest.",
      instructions: `Context: You are triaging reviewer comments.

Objective: For {{reviewer_comments}}, classify each:
- Type (major/minor, methodological/theoretical/presentation)
- Validity (valid/partially valid/misunderstanding)
- Effort required (quick fix/substantial/new analysis)
- Priority for response

Style: Table format.
Tone: Honest and strategic.
Audience: Revision team.

Response: Table:
# | Comment summary | Type | Validity | Effort | Priority | Initial response idea`,
      outputRequirements: "Triage table.",
    },
    variables: [
      { name: "reviewer_comments", type: "multiline", required: true },
    ],
    outputFormat: "markdown",
    author: toolkitAuthor,
    provenance: toolkitProvenance,
  },
  {
    id: "w6_s2_mapping",
    title: "Comment-Section Mapping",
    description: "Link reviewer comments to manuscript sections.",
    stages: ["review"],
    researchTypes: ["qualitative", "quantitative", "mixed_methods", "theoretical"],
    tags: ["Revision", "Mapping", "Workflow"],
    framework: "COSTAR",
    difficulty: "beginner",
    content: {
      goal: "Map comments to manuscript.",
      context: "Linking feedback to text.",
      constraints: "Complete coverage.",
      instructions: `Context: You are mapping reviewer comments to manuscript.

Objective: For each comment in {{triage_table}}, identify:
- Which manuscript section(s) affected
- Specific paragraphs/sentences if identifiable
- Related comments from other reviewers

Style: Mapping table.
Tone: Thorough.
Audience: Revision team.

Response: Table:
Comment # | Affected section(s) | Specific location | Related comments`,
      outputRequirements: "Comment-section map.",
    },
    variables: [
      { name: "triage_table", type: "multiline", required: true },
    ],
    outputFormat: "markdown",
    author: toolkitAuthor,
    provenance: toolkitProvenance,
  },
  {
    id: "w6_s3_plan",
    title: "Revision Plan",
    description: "Prioritize and plan revision tasks.",
    stages: ["review"],
    researchTypes: ["qualitative", "quantitative", "mixed_methods", "theoretical"],
    tags: ["Revision", "Planning", "Workflow"],
    framework: "COSTAR",
    difficulty: "intermediate",
    content: {
      goal: "Create revision plan.",
      context: "Prioritizing revision tasks.",
      constraints: "Realistic timeline.",
      instructions: `Context: You are creating a revision plan.

Objective: From {{triage_table}} and {{mapping}}, create:
- Ordered task list
- Dependencies (what blocks what)
- Owner assignment
- Time estimates
- Deadline alignment

Style: Project plan format.
Tone: Realistic.
Audience: PI and co-authors.

Response: Task list with timeline + dependency notes.`,
      outputRequirements: "Revision plan.",
    },
    variables: [
      { name: "triage_table", type: "multiline", required: true },
      { name: "mapping", type: "multiline", required: true },
    ],
    outputFormat: "markdown",
    author: toolkitAuthor,
    provenance: toolkitProvenance,
  },
  {
    id: "w6_s4_matrix",
    title: "Response Matrix",
    description: "Draft point-by-point response table.",
    stages: ["writing"],
    researchTypes: ["qualitative", "quantitative", "mixed_methods", "theoretical"],
    tags: ["Revision", "Response", "Workflow"],
    framework: "COSTAR",
    difficulty: "intermediate",
    content: {
      goal: "Draft response matrix.",
      context: "Creating point-by-point response.",
      constraints: "Professional and complete.",
      instructions: `Context: You are drafting a response matrix.

Objective: For each comment in {{triage_table}}:
- Quote original comment
- Draft response (acknowledgment, action taken, pushback if appropriate)
- Reference specific manuscript changes (with line/page numbers)
- Tone: grateful but confident

Style: Response table format.
Tone: Professional.
Audience: Editor and reviewers.

Response: Table:
Reviewer | Comment | Response | Manuscript change location`,
      outputRequirements: "Response matrix.",
    },
    variables: [
      { name: "triage_table", type: "multiline", required: true },
    ],
    outputFormat: "markdown",
    author: toolkitAuthor,
    provenance: toolkitProvenance,
  },
  {
    id: "w6_s5_rebuttal",
    title: "Rebuttal Cover Letter",
    description: "Draft cover letter for resubmission.",
    stages: ["writing"],
    researchTypes: ["qualitative", "quantitative", "mixed_methods", "theoretical"],
    tags: ["Revision", "Rebuttal", "Workflow"],
    framework: "COSTAR",
    difficulty: "intermediate",
    content: {
      goal: "Draft rebuttal letter.",
      context: "Writing resubmission cover letter.",
      constraints: "Concise and confident.",
      instructions: `Context: You are drafting a rebuttal letter.

Objective: Write cover letter for {{journal_name}} including:
- Thank editor and reviewers
- Summarize major changes
- Highlight how main concerns were addressed
- Note any remaining disagreements (diplomatically)
- Professional closing

Style: Letter format.
Tone: Grateful but confident.
Audience: Editor.

Response: Cover letter draft.`,
      outputRequirements: "Rebuttal cover letter.",
    },
    variables: [
      { name: "journal_name", type: "text", required: true },
    ],
    outputFormat: "markdown",
    author: toolkitAuthor,
    provenance: toolkitProvenance,
  },

  // ── NotebookLM Research Workflow Prompts ─────────────────────────────

  {
    id: "nlm_notebook_protocol_readme",
    title: "Notebook Protocol README Setup",
    description:
      "Create the reproducible README protocol note for a NotebookLM notebook with topic, time window, inclusion/exclusion rules, and naming conventions.",
    stages: ["design"],
    researchTypes: ["qualitative", "quantitative", "mixed_methods", "systematic_review", "theoretical"],
    tags: ["NotebookLM", "Workflow", "Setup", "Reproducibility"],
    framework: "COSTAR",
    difficulty: "beginner",
    content: {
      goal: "Produce a pinned README - Notebook Protocol note that defines all reproducibility conventions for a new notebook.",
      context: "Setting up a new NotebookLM notebook with reproducible research conventions before uploading any sources.",
      constraints: "All conventions must be filled in before uploading any sources. Follow naming patterns: notebook as [project] | [topic] | v[major.minor] | [YYYY-MM-DD], sources as A01_authority, E01_empirical, R01_review, C01_critique, notes as N01-N05.",
      instructions: `Create a pinned note called "README - Notebook Protocol" with the following sections:

Topic name: {{topic}}
Time window: {{time_window}}
Research goal: {{goal}}
Inclusion rules: {{include_rules}}
Exclusion rules: {{exclude_rules}}
Evidence grading: high, medium, low (define what qualifies for each)

Naming conventions:
- Notebook: [project] | {{topic}} | v1.0 | [YYYY-MM-DD]
- Sources: A01_authority_title_year.pdf, E01_empirical_title_year.pdf, R01_review_title_year.pdf, C01_critique_title_year.pdf
- Saved Notes: N01_source_inventory, N02_key_definitions, N03_conflicts_C1_to_Cn, N04_gap_audit, N05_synthesis_outline

Configuration defaults:
- Turn on Learning Guide mode for comprehension and Feynman Technique teach-back steps.
- Use Mind Map for theme structure and hidden connections.
- Use Audio Overview for repetition or commuting review.`,
      outputRequirements: "Formatted pinned note with all sections filled in, ready to paste into NotebookLM.",
    },
    variables: [
      { name: "topic", type: "text", required: true, description: "Research topic" },
      { name: "time_window", type: "text", required: false, description: "Time window (e.g., 2019-2026)", defaultValue: "2019-2026" },
      { name: "goal", type: "text", required: false, description: "Research goal (e.g., decision memo, literature review)" },
      { name: "include_rules", type: "multiline", required: false, description: "Inclusion criteria", defaultValue: "peer-reviewed, standards, official guidance, systematic reviews" },
      { name: "exclude_rules", type: "multiline", required: false, description: "Exclusion criteria", defaultValue: "marketing pages, anonymous blogs (unless used as counter-claims)" },
    ],
    outputFormat: "markdown",
    author: nlmAuthor,
    provenance: nlmProvenance,
  },
  {
    id: "nlm_a1_research_question",
    title: "Research Question Set + Evaluation Rubric",
    description:
      "Frame 3 candidate research questions in different styles and select the strongest with an evaluation rubric, using NotebookLM sources.",
    stages: ["design"],
    researchTypes: ["qualitative", "quantitative", "mixed_methods", "systematic_review", "theoretical"],
    tags: ["NotebookLM", "Workflow", "Scoping", "Research_Question"],
    framework: "COSTAR",
    difficulty: "beginner",
    content: {
      goal: "Produce 3 candidate research questions in different styles and a 5-8 criteria evaluation rubric.",
      context: "You are a research supervisor helping frame a rigorous research question using only uploaded NotebookLM sources.",
      constraints: "Use only uploaded sources and cite them. Each question must be framed differently: causal/explanatory, descriptive/measurement, applied/decision-oriented.",
      instructions: `Role: Research supervisor.
Task: Help me frame a rigorous research question for {{topic}} aligned with {{goal}}.

1) Propose 3 candidate main questions:
   - causal/explanatory
   - descriptive/measurement
   - applied/decision-oriented
2) For each, list:
   - constructs to define
   - what evidence counts as strong vs weak
   - confounders or validity threats
3) Recommend 1 question and provide a rubric (5-8 criteria).
Use only my sources and cite them.`,
      outputRequirements: "3 candidate questions with constructs, evidence criteria, confounders, plus 1 recommended question and evaluation rubric with 5-8 criteria.",
    },
    variables: [
      { name: "topic", type: "text", required: true, description: "Research topic" },
      { name: "goal", type: "text", required: false, description: "Research goal (e.g., decision memo, methods section)" },
    ],
    outputFormat: "markdown",
    author: nlmAuthor,
    provenance: nlmProvenance,
  },
  {
    id: "nlm_a2_essential_subquestions",
    title: "Essential Subquestions Map",
    description:
      "Generate the 10 most essential subquestions for a research topic from uploaded NotebookLM sources.",
    stages: ["design"],
    researchTypes: ["qualitative", "quantitative", "mixed_methods", "systematic_review", "theoretical"],
    tags: ["NotebookLM", "Workflow", "Scoping", "Subquestions"],
    framework: "COSTAR",
    difficulty: "beginner",
    content: {
      goal: "Identify the 10 most essential questions to ask about the topic.",
      context: "Mapping a new corpus of sources in NotebookLM to understand its coverage.",
      constraints: "Based only on uploaded sources. Cite sources for each question.",
      instructions: `Based only on my sources, list the 10 most essential subquestions for {{topic}}.
For each:
- why it matters
- which sources are most relevant
- what evidence would answer it
Cite sources.`,
      outputRequirements: "Numbered list of 10 questions, each with rationale, relevant sources, and evidence type needed.",
    },
    variables: [
      { name: "topic", type: "text", required: true, description: "Research topic" },
    ],
    outputFormat: "markdown",
    author: nlmAuthor,
    provenance: nlmProvenance,
  },
  {
    id: "nlm_b1_source_inventory",
    title: "Source Inventory Table",
    description:
      "Create a structured inventory table of all uploaded NotebookLM sources with type, topics, and relevance across authoritative materials, industry reviews, papers, and blog posts.",
    stages: ["design", "data_qc"],
    researchTypes: ["qualitative", "quantitative", "mixed_methods", "systematic_review", "theoretical"],
    tags: ["NotebookLM", "Workflow", "Corpus", "Inventory"],
    framework: "COSTAR",
    difficulty: "beginner",
    content: {
      goal: "Build a source inventory table from uploaded documents.",
      context: "Managing a NotebookLM notebook corpus for structured research on {{topic}}.",
      constraints: "Cite sources where needed. Classify each source by type and flag whether it is an authoritative source, industry review, empirical paper, or blog post.",
      instructions: `Create a source inventory for {{topic}} from my uploaded documents.
Make sure the inventory distinguishes authoritative materials, industry reviews, research papers, and blog posts with opposing viewpoints when present.
Return a table with columns:
- Source name
- Type: authoritative, industry_review, empirical_paper, review, critique, policy, blog_post, commentary
- Key topics covered
- Which subquestion(s) it supports
- Relevance: high/medium/low
Cite sources where needed.`,
      outputRequirements: "Table with columns: Source name, Type, Key topics, Subquestion support, Relevance rating.",
    },
    variables: [
      { name: "topic", type: "text", required: true, description: "Research topic for context" },
    ],
    outputFormat: "markdown",
    author: nlmAuthor,
    provenance: nlmProvenance,
  },
  {
    id: "nlm_b2_mega_pdf_index",
    title: "Mega PDF Internal Index",
    description:
      "Create an internal index for a merged multi-document PDF in NotebookLM to recover per-item granularity.",
    stages: ["data_qc"],
    researchTypes: ["qualitative", "quantitative", "mixed_methods", "systematic_review"],
    tags: ["NotebookLM", "Workflow", "Corpus", "PDF", "Indexing"],
    framework: "COSTAR",
    difficulty: "intermediate",
    content: {
      goal: "Recover per-document granularity inside a merged PDF.",
      context: "A merged document has been uploaded to NotebookLM to work around source caps.",
      constraints: "Cite the merged source. Detect boundaries via titles, headings, page breaks.",
      instructions: `This is a merged document for {{topic}}. Create an internal index:
- identify document boundaries (titles, headings, page breaks)
- assign IDs D01, D02, ...
- summarize each item in 3 bullets
- map each item to page ranges
Cite the merged source.`,
      outputRequirements: "Internal index with IDs (D01, D02...), 3-bullet summaries, and item-to-page mapping.",
    },
    variables: [
      { name: "topic", type: "text", required: false, description: "Research topic for context" },
    ],
    outputFormat: "markdown",
    author: nlmAuthor,
    provenance: nlmProvenance,
  },
  {
    id: "nlm_c1_feynman_teach_back",
    title: "Feynman Technique Teach-Back Loop",
    description:
      "Use the NotebookLM Learning Guide and the Feynman Technique to diagnose understanding gaps through a teach-back exercise.",
    stages: ["interpretation"],
    researchTypes: ["qualitative", "quantitative", "mixed_methods", "systematic_review", "theoretical"],
    tags: ["NotebookLM", "Workflow", "Learning", "Feynman", "Comprehension"],
    framework: "COSTAR",
    difficulty: "intermediate",
    content: {
      goal: "Diagnose gaps in understanding through a teach-back loop.",
      context: "Using NotebookLM Learning Guide mode for active reading and comprehension.",
      constraints: "Use ONLY uploaded sources. Cite sources for every correction.",
      instructions: `Turn on Learning Guide mode and apply the Feynman Technique.
Ask me to explain {{concept}} in 8-12 sentences.

Then:
1) Diagnose gaps and leaps using ONLY my sources.
2) Ask 5 targeted follow-up questions.
3) After I respond, produce:
   - a corrected explanation
   - a checklist of what I must be able to explain
Cite sources for each correction.`,
      outputRequirements: "Corrected explanation and checklist of must-explain items, all with citations.",
    },
    variables: [
      { name: "concept", type: "text", required: true, description: "Concept to teach back" },
    ],
    outputFormat: "markdown",
    author: nlmAuthor,
    provenance: nlmProvenance,
  },
  {
    id: "nlm_c2_deep_understanding_quiz",
    title: "Deep Understanding Quiz",
    description:
      "Generate a 12-question quiz with conceptual, application, and trick questions from NotebookLM sources.",
    stages: ["interpretation"],
    researchTypes: ["qualitative", "quantitative", "mixed_methods", "systematic_review", "theoretical"],
    tags: ["NotebookLM", "Workflow", "Learning", "Quiz", "Comprehension"],
    framework: "COSTAR",
    difficulty: "beginner",
    content: {
      goal: "Test deep understanding with a source-grounded quiz.",
      context: "Checking comprehension of materials uploaded to NotebookLM.",
      constraints: "Based only on uploaded sources. Provide answer key with citations.",
      instructions: `Create a quiz on {{topic}} based only on my sources:
- 6 conceptual questions
- 4 application questions
- 2 trick questions that expose common misunderstandings
Provide an answer key with citations.`,
      outputRequirements: "12 questions (6 conceptual, 4 application, 2 trick) plus answer key with citations.",
    },
    variables: [
      { name: "topic", type: "text", required: true, description: "Topic to quiz on" },
    ],
    outputFormat: "markdown",
    author: nlmAuthor,
    provenance: nlmProvenance,
  },
  {
    id: "nlm_d1_methods_extraction",
    title: "Methods-First Evidence Extraction",
    description:
      "Extract claims, evidence, limitations, and boundary conditions from NotebookLM sources using a senior methods reviewer persona.",
    stages: ["analysis", "interpretation"],
    researchTypes: ["qualitative", "quantitative", "mixed_methods", "systematic_review", "theoretical", "experimental"],
    tags: ["NotebookLM", "Workflow", "Extraction", "Methods", "Evidence"],
    framework: "COSTAR",
    difficulty: "advanced",
    content: {
      goal: "Extract decision-critical evidence using a methods reviewer persona.",
      context: "Acting as a senior methods reviewer extracting from NotebookLM sources.",
      constraints: "No general commentary. Every bullet must cite a source.",
      instructions: `Act as a senior methods reviewer.
From the most relevant sources on {{topic}}, extract only:

A) Claims (one sentence each)
B) Evidence (study type, sample, setting, measures, key results)
C) Limitations and validity threats
D) Boundary conditions (where findings may not apply)

Rules:
- no general commentary
- every bullet must cite a source`,
      outputRequirements: "Sections: A) Claims, B) Evidence (study type/sample/setting/measures/results), C) Limitations, D) Boundary conditions. Every bullet cited.",
    },
    variables: [
      { name: "topic", type: "text", required: true, description: "Research topic to extract evidence for" },
    ],
    outputFormat: "markdown",
    author: nlmAuthor,
    provenance: nlmProvenance,
  },
  {
    id: "nlm_d2_decision_memo_extraction",
    title: "Decision Memo Extraction",
    description:
      "Extract only decision-critical content from NotebookLM sources for a specific research goal using a ruthless PM persona.",
    stages: ["analysis", "interpretation"],
    researchTypes: ["qualitative", "quantitative", "mixed_methods", "systematic_review", "theoretical"],
    tags: ["NotebookLM", "Workflow", "Extraction", "Decision_Memo"],
    framework: "COSTAR",
    difficulty: "intermediate",
    content: {
      goal: "Extract decision-critical content aligned to a specific research goal.",
      context: "Acting as a ruthless research PM extracting actionable content from NotebookLM sources.",
      constraints: "Ignore fluff. Cite everything.",
      instructions: `Act as a ruthless research PM.
Extract only decision-critical content for {{goal}}.

Format:
- Decision points
- Supporting evidence (with citations)
- Risks and uncertainties
- Recommendations
Ignore fluff. Cite everything.`,
      outputRequirements: "Decision points, supporting evidence with citations, risks and uncertainties, recommendations.",
    },
    variables: [
      { name: "goal", type: "text", required: true, description: "Research goal (e.g., decision memo, research brief)" },
    ],
    outputFormat: "markdown",
    author: nlmAuthor,
    provenance: nlmProvenance,
  },
  {
    id: "nlm_e1_conflict_clusters",
    title: "Conflict Clusters and Resolution Tests",
    description:
      "Identify contradictions across NotebookLM sources, compare multi-faceted arguments and supporting evidence, and map them into conflict clusters with resolution tests.",
    stages: ["analysis", "interpretation"],
    researchTypes: ["qualitative", "quantitative", "mixed_methods", "systematic_review", "theoretical"],
    tags: ["NotebookLM", "Workflow", "Contradictions", "Conflict_Matrix"],
    framework: "COSTAR",
    difficulty: "advanced",
    content: {
      goal: "Create a conflict matrix mapping contradictions and their resolution tests.",
      context: "Analyzing cross-source contradictions in a NotebookLM notebook.",
      constraints: "Cite heavily. Include likely reason for disagreement.",
      instructions: `Identify contradictions across sources about {{topic}}, including differences in opinions, supporting evidence, and reasoning logic.

Return:
1) Conflict clusters C1, C2, C3...
2) For each:
   - Claim A (who says it, cite)
   - Claim B (who contradicts it, cite)
   - Evidence used by each side (cite)
   - Likely reason for disagreement (definitions, population, method, timeframe)
   - Tests that would resolve the conflict
Cite heavily.`,
      outputRequirements: "Conflict clusters (C1, C2, C3...) with Claim A, Claim B, evidence, reason for disagreement, and resolution tests.",
    },
    variables: [
      { name: "topic", type: "text", required: true, description: "Research topic" },
    ],
    outputFormat: "markdown",
    author: nlmAuthor,
    provenance: nlmProvenance,
  },
  {
    id: "nlm_f1_blind_spots_audit",
    title: "Blind Spots and Missing Evidence Audit",
    description:
      "Identify missing perspectives, variables, assumptions, and counterarguments in the NotebookLM source corpus.",
    stages: ["analysis", "interpretation"],
    researchTypes: ["qualitative", "quantitative", "mixed_methods", "systematic_review", "theoretical"],
    tags: ["NotebookLM", "Workflow", "Gap_Analysis", "Blind_Spots"],
    framework: "COSTAR",
    difficulty: "advanced",
    content: {
      goal: "Identify what is missing from the source corpus before writing.",
      context: "Acting as a critical auditor reviewing NotebookLM sources.",
      constraints: "Cite sources when referencing what is present or absent.",
      instructions: `Act as a critical auditor.

Review my sources on {{topic}} and identify:
- missing perspectives or populations
- missing variables or outcomes
- assumptions without explicit evidence
- counterarguments not addressed

Output:
1) Missing items with rationale
2) Consequences if ignored
3) Next-source plan (source types to collect)
Cite sources when referencing what is present or absent.`,
      outputRequirements: "Missing items with rationale, consequences if ignored, next-source plan (types of sources, not specific URLs).",
    },
    variables: [
      { name: "topic", type: "text", required: false, description: "Research topic for context" },
    ],
    outputFormat: "markdown",
    author: nlmAuthor,
    provenance: nlmProvenance,
  },
  {
    id: "nlm_g1_synthesis_outline",
    title: "Synthesis Outline with Citation Anchors",
    description:
      "Draft a deliverable outline for a NotebookLM research project with citation anchors for each claim.",
    stages: ["writing", "interpretation"],
    researchTypes: ["qualitative", "quantitative", "mixed_methods", "systematic_review", "theoretical"],
    tags: ["NotebookLM", "Workflow", "Synthesis", "Outline", "Writing"],
    framework: "COSTAR",
    difficulty: "intermediate",
    content: {
      goal: "Produce a structured outline with citation anchors for every claim.",
      context: "Synthesizing NotebookLM sources into a deliverable.",
      constraints: "Label any interpretation as interpretation, not fact. Use only sources.",
      instructions: `Draft a {{deliverable_type}} outline for {{topic}}.

For each bullet:
- 1 sentence claim
- citation anchors like: (CITE: Source Name)
Label any interpretation as interpretation, not fact.
Use only sources.`,
      outputRequirements: "Outline with sections, 1-sentence claims per bullet, and (CITE: Source Name) tags. Interpretations labeled.",
    },
    variables: [
      { name: "topic", type: "text", required: true, description: "Research topic" },
      { name: "deliverable_type", type: "text", required: false, description: "Type of deliverable (e.g., decision memo, research brief)", defaultValue: "research brief" },
    ],
    outputFormat: "markdown",
    author: nlmAuthor,
    provenance: nlmProvenance,
  },
  {
    id: "nlm_g2_hidden_connections",
    title: "Hidden Connections Finder",
    description:
      "Surface 8 non-obvious cross-source connections in NotebookLM with hypotheses they suggest.",
    stages: ["interpretation"],
    researchTypes: ["qualitative", "quantitative", "mixed_methods", "systematic_review", "theoretical"],
    tags: ["NotebookLM", "Workflow", "Synthesis", "Connections", "Discovery"],
    framework: "COSTAR",
    difficulty: "advanced",
    content: {
      goal: "Find non-obvious connections across sources.",
      context: "Deep synthesis of a NotebookLM notebook looking for cross-source relationships.",
      constraints: "Cite sources for both sides of each connection.",
      instructions: `Find 8 non-obvious connections across sources about {{topic}}.
For each:
- what the connection is
- why it matters
- what hypothesis or research question it suggests
Cite sources for both sides of each connection.`,
      outputRequirements: "8 hidden links with what the connection is, why it matters, and what hypothesis it suggests. Both sides cited.",
    },
    variables: [
      { name: "topic", type: "text", required: true, description: "Research topic" },
    ],
    outputFormat: "markdown",
    author: nlmAuthor,
    provenance: nlmProvenance,
  },
  {
    id: "nlm_h1_attribution_stress_test",
    title: "Attribution Stress Test",
    description:
      "Audit a NotebookLM answer for interpretive overreach, flagging unsupported interpretations.",
    stages: ["review", "writing"],
    researchTypes: ["qualitative", "quantitative", "mixed_methods", "systematic_review", "theoretical"],
    tags: ["NotebookLM", "Workflow", "Verification", "Attribution"],
    framework: "COSTAR",
    difficulty: "advanced",
    content: {
      goal: "Audit the last AI answer for interpretive overreach.",
      context: "Verifying NotebookLM outputs before export or reuse.",
      constraints: "Every flagged sentence must be rewritten to be source-faithful or labeled as hypothesis.",
      instructions: `Audit your last answer for overreach.

For each paragraph:
- list sentences directly supported by a cited passage
- flag any sentence that is interpretation or not explicitly supported
- rewrite flagged sentences to be strictly source-faithful or label as hypothesis
Return:
1) Audit
2) Corrected version with citations`,
      outputRequirements: "Audit table plus corrected version with citations.",
    },
    variables: [],
    outputFormat: "markdown",
    author: nlmAuthor,
    provenance: nlmProvenance,
  },
  {
    id: "nlm_h2_claim_citation_ledger",
    title: "Claim-to-Citation Ledger",
    description:
      "Create a structured ledger mapping every claim in a NotebookLM draft to its supporting citations and confidence level.",
    stages: ["review", "writing"],
    researchTypes: ["qualitative", "quantitative", "mixed_methods", "systematic_review", "theoretical"],
    tags: ["NotebookLM", "Workflow", "Verification", "Claims", "Ledger"],
    framework: "COSTAR",
    difficulty: "intermediate",
    content: {
      goal: "Create a claim ledger with confidence ratings from a draft.",
      context: "Auditing a draft produced in NotebookLM.",
      constraints: "Only use uploaded sources.",
      instructions: `Create a claim ledger from the draft.
Return a table:
- Claim ID
- Claim text
- Supporting citations
- Confidence: high/medium/low
- Notes on limitations or uncertainty
Only use my sources.`,
      outputRequirements: "Table: Claim ID, Claim text, Supporting citations, Confidence (high/medium/low), Notes on limitations.",
    },
    variables: [],
    outputFormat: "markdown",
    author: nlmAuthor,
    provenance: nlmProvenance,
  },
  {
    id: "nlm_i1_audio_overview_scripts",
    title: "Audio Overview Scripts (3 Modes)",
    description:
      "Generate three NotebookLM Audio Overview scripts: brief core ideas, critique and uncertainty, and debate format.",
    stages: ["writing"],
    researchTypes: ["qualitative", "quantitative", "mixed_methods", "systematic_review", "theoretical"],
    tags: ["NotebookLM", "Workflow", "Audio", "Communication", "Studio"],
    framework: "COSTAR",
    difficulty: "intermediate",
    content: {
      goal: "Create three Audio Overview scripts for different communication modes.",
      context: "Preparing NotebookLM Studio audio outputs.",
      constraints: "Only use sources. Explicitly label uncertainty.",
      instructions: `Create three Audio Overview scripts for {{topic}}:
A) Brief core ideas (5-7 minutes)
B) Critique and uncertainty
C) Debate format with two sides

Constraints:
- only my sources
- explicitly label uncertainty
- end with a list of citations to review after listening`,
      outputRequirements: "Three scripts (Brief, Critique, Debate) plus citations-to-review list.",
    },
    variables: [
      { name: "topic", type: "text", required: true, description: "Research topic" },
    ],
    outputFormat: "markdown",
    author: nlmAuthor,
    provenance: nlmProvenance,
  },
  {
    id: "nlm_i2_mind_map_seed",
    title: "Mind Map Seed Structure",
    description:
      "Propose a hierarchical mind map structure for a NotebookLM research topic with conflict and gap annotations.",
    stages: ["interpretation", "visualization"],
    researchTypes: ["qualitative", "quantitative", "mixed_methods", "systematic_review", "theoretical"],
    tags: ["NotebookLM", "Workflow", "Mind_Map", "Visualization", "Studio"],
    framework: "COSTAR",
    difficulty: "beginner",
    content: {
      goal: "Create a mind map seed structure for synthesis visualization.",
      context: "Preparing a NotebookLM Studio mind map.",
      constraints: "Cite key sources per branch.",
      instructions: `Propose a mind map structure for {{topic}}:
- top-level branches (5-7)
- second-level branches (3-6 each)
- where major conflicts and gaps sit in the map
Cite key sources per branch.`,
      outputRequirements: "5-7 top-level branches, 3-6 second-level each, conflict and gap annotations, sources per branch.",
    },
    variables: [
      { name: "topic", type: "text", required: true, description: "Research topic" },
    ],
    outputFormat: "markdown",
    author: nlmAuthor,
    provenance: nlmProvenance,
  },
  {
    id: "nlm_distill_technical_brief",
    title: "Distill to Technical Brief",
    description:
      "Distill a NotebookLM notebook into a citation-rich technical brief suitable for the Ouroboros note-to-source conversion loop.",
    stages: ["writing", "interpretation"],
    researchTypes: ["qualitative", "quantitative", "mixed_methods", "systematic_review", "theoretical"],
    tags: ["NotebookLM", "Workflow", "Distillation", "Brief", "Ouroboros"],
    framework: "COSTAR",
    difficulty: "intermediate",
    content: {
      goal: "Distill the current notebook into a comprehensive technical brief for reuse.",
      context: "Preparing a distilled source for the Ouroboros loop in NotebookLM.",
      constraints: "Every claim must have at least one citation. Separate strong evidence from tentative interpretation.",
      instructions: `Distill the current notebook into a comprehensive technical brief.

Constraints:
- Use headings and numbered claims
- Every claim must have at least one citation
- Separate "strong evidence" vs "tentative interpretation"
- Include a short glossary of key terms as defined in sources`,
      outputRequirements: "Technical brief with headings, numbered claims, citations, evidence grading (strong vs tentative), and glossary.",
    },
    variables: [],
    outputFormat: "markdown",
    author: nlmAuthor,
    provenance: nlmProvenance,
  },

  // External adaptations (2026-07-02) — see /INTEGRATIONS.md for the full matrix.
  {
    id: "audit_presubmission_ladder",
    title: "Pre-Submission Audit",
    description: "Run an ordered pre-submission audit of a manuscript, from claim alignment through a reviewer-side rejection pass.",
    stages: ["review", "polishing"],
    researchTypes: ["qualitative", "quantitative", "mixed_methods", "computational", "experimental", "systematic_review", "theoretical"],
    tags: ["Audit", "Submission", "Review"],
    difficulty: "advanced",
    content: {
      goal: "Audit a manuscript in a fixed order before submission and surface every issue that would slow down review.",
      context: "You are acting as a careful pre-submission reviewer, not the author. Target venue type: {{target_venue_type}}.",
      constraints: "Work through the stages strictly in order. Do not skip a stage even if it looks clean. Every finding must point to an exact location in the manuscript text; do not raise a finding you cannot locate.",
      instructions: `Act as a careful pre-submission reviewer auditing this manuscript for a {{target_venue_type}}. Do not rewrite the manuscript; only audit it.

Manuscript:
"""
{{manuscript_text}}
"""

Work through these stages in order, and do not skip ahead:
1. Claim / front-matter alignment — do the title, abstract, and stated contributions match what the body actually shows?
2. Figure and legend coverage — does every figure/table referenced in the text exist with a legend, and does every figure in the manuscript get discussed in the text?
3. Methods/supplement anchoring — does every method, dataset, or statistic named in the results trace back to a methods or supplement section?
4. Terminology consistency — are key terms used consistently, or do near-synonyms risk reading as different concepts?
5. Risk pass — flag anything that looks fabricated, overstated, or unsupported by the text as written.
6. Reviewer-side rejection pass — read once more as a skeptical reviewer looking for a reason to reject; list the top reasons a reviewer could use.

For every finding, use this exact format:
- Severity: High / Medium / Low
- Location: exact section, paragraph, or figure/table number
- What's wrong: one or two sentences
- Why it matters: the consequence if left unfixed
- Minimum safe fix: the smallest edit that resolves it

Only report findings you can point to in the text provided; if a stage has no issues, say so explicitly instead of inventing one.`,
      outputRequirements: "Six labeled stage sections in order, each containing a list of findings in the Severity/Location/What's wrong/Why it matters/Minimum safe fix format. State explicitly when a stage has no findings.",
    },
    variables: [
      { name: "manuscript_text", type: "multiline", required: true, description: "Full manuscript text (or the sections available) to audit" },
      { name: "target_venue_type", type: "text", required: false, description: "Venue type framing the audit, e.g. \"peer-reviewed journal in my field\"", defaultValue: "peer-reviewed journal in my field" },
    ],
    outputFormat: "markdown",
    author: { name: "Research Atlas" },
    provenance: {
      source: "Adapted from Nature-Paper-Skills (MIT) — submission-audit",
      sourceUrl: "https://github.com/Boom5426/Nature-Paper-Skills",
      owner: "research-atlas",
      status: "reviewed",
      addedAt: "2026-07-02",
      reviewedAt: "2026-07-02",
    },
  },
  {
    id: "audit_claim_evidence_map",
    title: "Claim–Evidence Map",
    description: "Extract every substantive claim from a draft into a table of claim, supporting evidence, status, and safer wording.",
    stages: ["writing", "review"],
    researchTypes: ["qualitative", "quantitative", "mixed_methods", "computational", "experimental", "systematic_review", "theoretical"],
    tags: ["Claims", "Evidence", "Review"],
    difficulty: "intermediate",
    content: {
      goal: "Build a claim-by-claim evidence map for a draft so unsupported or overstated claims are visible before submission.",
      context: "You are checking whether each claim in the draft below is actually backed by evidence in that same draft.",
      constraints: "Only use evidence present in the draft text; do not search for or assume outside evidence. Every claim needs a row, including ones with no supporting evidence.",
      instructions: `Read the draft below and extract every substantive claim (a statement asserting a result, effect, comparison, or conclusion — not routine background).

Draft:
"""
{{draft_text}}
"""

Build a table with these columns:
| Claim | Supporting evidence in the draft | Status | Safer wording if partial/unsupported |
|---|---|---|---|

Status must be one of: supported, partially supported, unsupported.

For any claim marked "partially supported," suggest safer wording that lowers the strength of the claim to match the evidence (for example, replacing causal phrasing with "consistent with" or "associated with"). For "unsupported" claims, state plainly that no evidence for it appears in the draft — do not invent evidence to fill the gap.

After the table, list any claims you were unsure how to classify and why.`,
      outputRequirements: "A single markdown table (Claim | Supporting evidence in the draft | Status | Safer wording) covering every substantive claim, followed by a short list of ambiguous cases.",
    },
    variables: [
      { name: "draft_text", type: "multiline", required: true, description: "Full draft text to extract claims from" },
    ],
    outputFormat: "markdown",
    author: { name: "Research Atlas" },
    provenance: {
      source: "Adapted from Nature-Paper-Skills (MIT) — claim-evidence map example",
      sourceUrl: "https://github.com/Boom5426/Nature-Paper-Skills",
      owner: "research-atlas",
      status: "reviewed",
      addedAt: "2026-07-02",
      reviewedAt: "2026-07-02",
    },
  },
  {
    id: "revise_altitude_ladder",
    title: "Revision Altitude Ladder",
    description: "Review a draft strictly from high-altitude framing down to language polish, forbidding prose polish on claims that are still unstable.",
    stages: ["writing", "polishing"],
    researchTypes: ["qualitative", "quantitative", "mixed_methods", "computational", "experimental", "systematic_review", "theoretical"],
    tags: ["Revision", "Structure", "Editing"],
    difficulty: "advanced",
    content: {
      goal: "Review a draft in strict altitude order so structural problems are fixed before sentence-level polish, never after.",
      context: "Revision goal: {{revision_goal}}.",
      constraints: "Review the five altitude levels in order, top to bottom. If a higher level has unresolved problems, do not comment on language/wording for the passages affected — flag them as blocked instead.",
      instructions: `Review this draft in altitude order. Do not jump ahead to a lower altitude level for any passage until the levels above it are resolved for that passage.

Revision goal (if given): {{revision_goal}}

Draft:
"""
{{draft_text}}
"""

Altitude levels, high to low:
1. Direction / framing — is the overall argument or contribution framed correctly and pointed at the right audience?
2. Logic chain — does each step of the argument follow from the one before it, with no missing links?
3. Evidence and figures — is each claim backed by the evidence or figure it relies on?
4. Terminology — are key terms used consistently throughout?
5. Language polish — grammar, word choice, sentence flow. Review this LAST, and only for passages that passed levels 1-4.

Rule: if a passage has an unresolved issue at level 1, 2, or 3, do not suggest language-level edits for that passage. Instead, list it under "Blocked from polish" with the reason. Only passages clear at levels 1-4 get language suggestions at level 5.

Structure your output as one section per altitude level, plus a final "Blocked from polish" section.`,
      outputRequirements: "Five sections (one per altitude level, in order) plus a closing 'Blocked from polish' section listing passages withheld from language edits and why.",
    },
    variables: [
      { name: "draft_text", type: "multiline", required: true, description: "Full draft text to review" },
      { name: "revision_goal", type: "text", required: false, description: "What this revision pass is trying to achieve, if known" },
    ],
    outputFormat: "markdown",
    author: { name: "Research Atlas" },
    provenance: {
      source: "Adapted from Nature-Paper-Skills (MIT) — manuscript-optimizer",
      sourceUrl: "https://github.com/Boom5426/Nature-Paper-Skills",
      owner: "research-atlas",
      status: "reviewed",
      addedAt: "2026-07-02",
      reviewedAt: "2026-07-02",
    },
  },
  {
    id: "cite_hygiene_scan",
    title: "Citation Hygiene Scan",
    description: "Scan a bibliography or manuscript for local hygiene defects such as placeholder keys, TODO markers, duplicates, and missing fields.",
    stages: ["review"],
    researchTypes: ["qualitative", "quantitative", "mixed_methods", "computational", "experimental", "systematic_review", "theoretical"],
    tags: ["Citations", "Bibliography", "Audit"],
    difficulty: "intermediate",
    content: {
      goal: "Find local hygiene defects in a bibliography or manuscript's citations without attempting to verify that the references actually exist.",
      context: "Treat any imported or exported bibliography metadata as draft data that may contain errors, not as verified truth.",
      constraints: "This is a local text scan only. Do not claim to have checked whether any reference actually exists, is correctly attributed, or supports the claim it's attached to — that requires external verification, which this scan does not perform.",
      instructions: `Scan the bibliography/manuscript text below for citation hygiene defects. This is a local scan of the text as written — you are not verifying that any reference actually exists or is accurate.

Text:
"""
{{bibliography_text}}
"""

Check for:
- Placeholder or fake citation keys (e.g. "Author2024", "XXX", "REF1" used as if final)
- "TODO", "citation needed", "[CITATION NEEDED]", or similar unresolved markers
- Duplicate entries (same work listed more than once, possibly with different keys or formatting)
- Mixed identifier schemes (some entries with DOIs, others with only URLs or none, inconsistently)
- Entries missing key fields (author, year, title, venue, or identifier)

Output a defect table:
| Defect type | Location / entry | What's wrong | Suggested fix |
|---|---|---|---|

Then a short fix list ordered by how many entries each fix touches.

Important: this scan does NOT verify that any reference actually exists, is correctly cited, or supports the claim it's attached to. For that, use the research-verification skill (see /skills) or another literature-verification process before submission.`,
      outputRequirements: "A defect table (Defect type | Location/entry | What's wrong | Suggested fix) plus an ordered fix list, plus an explicit closing note that existence/accuracy verification was not performed.",
    },
    variables: [
      { name: "bibliography_text", type: "multiline", required: true, description: "Bibliography and/or in-text citations to scan" },
    ],
    outputFormat: "markdown",
    author: { name: "Research Atlas" },
    provenance: {
      source: "Adapted from Nature-Paper-Skills (MIT) — citation-verifier",
      sourceUrl: "https://github.com/Boom5426/Nature-Paper-Skills",
      owner: "research-atlas",
      status: "reviewed",
      addedAt: "2026-07-02",
      reviewedAt: "2026-07-02",
    },
  },
  {
    id: "cite_support_scale",
    title: "Citation Support Labeling",
    description: "Label how strongly each citation actually supports the claim it's attached to, using a conservative support scale.",
    stages: ["review", "writing"],
    researchTypes: ["qualitative", "quantitative", "mixed_methods", "computational", "experimental", "systematic_review", "theoretical"],
    tags: ["Citations", "Evidence", "Review"],
    difficulty: "intermediate",
    content: {
      goal: "Rate how well each cited source actually supports the claim it is attached to, using a conservative labeling scale.",
      context: "You are given claim-citation pairs as text; you are not fetching or verifying the underlying sources, only judging support based on what is provided.",
      constraints: "Base every label only on the information given for that pair. Never invent bibliographic fields (author, year, venue, DOI) that are missing from the input; if a field is missing, say so instead of filling it in.",
      instructions: `For each claim-citation pair below, label how strongly the citation supports the claim.

Claim-citation pairs:
"""
{{claims_with_citations}}
"""

Use exactly one of these labels per pair:
- strong: the source directly demonstrates or states the claim
- partial: the source is related but doesn't fully cover the claim's scope, population, or strength
- background: the source supports general context but not the specific claim
- contradictory: the source appears to contradict the claim
- metadata-only: only title/abstract-level information is available and the full text was never actually read

Rule: any pair labeled "metadata-only" must be flagged with an explicit note that the source needs to be read in full before the citation is used in a submission — do not upgrade a metadata-only label just because the title looks relevant.

Never invent missing bibliographic fields (author, year, venue, DOI, etc.); if a field is absent from the input, note it as missing rather than filling it in.

Output one table:
| Claim | Citation | Support label | Notes / missing fields |
|---|---|---|---|`,
      outputRequirements: "A single table (Claim | Citation | Support label | Notes/missing fields) covering every pair, with metadata-only rows explicitly flagged for full-text reading before submission.",
    },
    variables: [
      { name: "claims_with_citations", type: "multiline", required: true, description: "List of claim-citation pairs, one per line or block" },
    ],
    outputFormat: "markdown",
    author: { name: "Research Atlas" },
    provenance: {
      source: "Adapted from nature-skills (Apache-2.0) — citation support workflow",
      sourceUrl: "https://github.com/Yuan1z0825/nature-skills",
      owner: "research-atlas",
      status: "reviewed",
      addedAt: "2026-07-02",
      reviewedAt: "2026-07-02",
    },
  },
  {
    id: "check_editor_first_pass",
    title: "Editor First-Pass Check",
    description: "Assess only the title, abstract, and first paragraph the way a desk editor would on a first pass.",
    stages: ["polishing", "review"],
    researchTypes: ["qualitative", "quantitative", "mixed_methods", "computational", "experimental", "systematic_review", "theoretical"],
    tags: ["Editing", "Abstract", "Review"],
    difficulty: "intermediate",
    content: {
      goal: "Judge only the title, abstract, and first paragraph the way a time-pressed desk editor reading a submission for the first time would.",
      context: "Act as a desk editor doing a fast first pass, not a specialist reviewer reading the full manuscript.",
      constraints: "Only assess the text provided (title, abstract, first paragraph). Do not comment on sections not shown. Do not claim this predicts an editorial decision — this is a first-impression check, not a verdict.",
      instructions: `Act as a desk editor giving this submission a fast first-pass read. You only see the title, abstract, and first paragraph — that's normal for a first pass, so assess only what's given.

Title, abstract, and first paragraph:
"""
{{title_abstract_intro}}
"""

Answer:
1. What is the one logic chain a reader can follow from this text alone (in one or two sentences)? If there isn't a single clear chain, say so.
2. Are these four reader questions answered, and where?
   - What problem is being addressed?
   - Why does it matter now?
   - What is actually new here?
   - Why should the reader trust the result?
3. Title discipline issues: is the title accurate to the abstract, free of unsupported strength words ("novel," "first," "breakthrough" used without backing), and clear to a non-specialist in the field?

End with a short first-impression summary: what would make an editor keep reading vs. hesitate. This is a first-impression check only, not a prediction of an editorial outcome.`,
      outputRequirements: "Three numbered sections (logic chain; four reader questions with answers/gaps; title discipline issues) plus a short first-impression summary. No verdict or acceptance prediction.",
    },
    variables: [
      { name: "title_abstract_intro", type: "multiline", required: true, description: "Title, abstract, and first paragraph of the manuscript" },
    ],
    outputFormat: "markdown",
    author: { name: "Research Atlas" },
    provenance: {
      source: "Adapted from Nature-Paper-Skills (MIT) — editor-first-impression",
      sourceUrl: "https://github.com/Boom5426/Nature-Paper-Skills",
      owner: "research-atlas",
      status: "reviewed",
      addedAt: "2026-07-02",
      reviewedAt: "2026-07-02",
    },
  },
  {
    id: "check_epistemic_upgrades",
    title: "Claim-Strength Audit",
    description: "Compare each draft claim against what its cited or source material actually supports, catching silent upgrades in claim strength.",
    stages: ["writing", "review"],
    researchTypes: ["qualitative", "quantitative", "mixed_methods", "computational", "experimental", "systematic_review", "theoretical"],
    tags: ["Claims", "Evidence", "Review"],
    difficulty: "advanced",
    content: {
      goal: "Detect places where a draft's phrasing claims more than its own source material supports.",
      context: "You are comparing draft phrasing against the source notes given, not researching new sources.",
      constraints: "Base every comparison only on the source notes provided; if no source notes are given for a claim, say the support cannot be checked rather than guessing.",
      instructions: `Compare the draft below against its source notes (if provided) and find places where the phrasing claims more than the source actually supports — a "silent upgrade" in claim strength.

Draft:
"""
{{draft_text}}
"""

Source notes (methods, results, or cited findings the draft is based on, if available):
"""
{{source_notes}}
"""

Look specifically for these upgrade types:
- Association presented as causation (e.g. "X causes Y" when the source only shows correlation)
- Observational findings presented as a recommendation or prescription
- Dropped hedges (source said "may," "suggests," "in this sample"; draft drops the qualifier)
- Population or scope widening (source covers a specific group/condition; draft implies it generalizes further)

Output a table:
| Draft phrasing | What the source supports | Upgrade type | Safer rewrite |
|---|---|---|---|

If source notes are not provided or don't cover a given claim, write "cannot check against source" in the "What the source supports" column instead of guessing.`,
      outputRequirements: "A single table (Draft phrasing | What the source supports | Upgrade type | Safer rewrite) covering every detected upgrade, with unchecked claims explicitly marked as such.",
    },
    variables: [
      { name: "draft_text", type: "multiline", required: true, description: "Draft text to audit for claim-strength upgrades" },
      { name: "source_notes", type: "multiline", required: false, description: "Methods, results, or source material the draft is based on" },
    ],
    outputFormat: "markdown",
    author: { name: "Research Atlas" },
    provenance: {
      source: "Research Atlas original, re-derived from the general concept of silent epistemic upgrades (association-to-causation, hedge-dropping, scope-widening) discussed around academic-research-skills (CC BY-NC); written independently, not copied from that repo's text",
      owner: "research-atlas",
      status: "reviewed",
      addedAt: "2026-07-02",
      reviewedAt: "2026-07-02",
    },
  },
  {
    id: "check_ai_failure_modes",
    title: "AI-Assistance Failure-Mode Self-Check",
    description: "Walk an AI-assisted research artifact through a set of failure-mode checks before trusting or submitting it.",
    stages: ["review", "data_qc"],
    researchTypes: ["qualitative", "quantitative", "mixed_methods", "computational", "experimental", "systematic_review", "theoretical"],
    tags: ["AI_Use", "Verification", "Data_QC"],
    difficulty: "advanced",
    content: {
      goal: "Check an AI-assisted research artifact (code, analysis, draft, or figure) for common ways AI assistance goes wrong before trusting the output.",
      context: "Lu et al. (2026, Nature, doi:10.1038/s41586-026-10265-5) documented recurring failure patterns in AI-assisted research work, including issues that passed the author's own review. This check applies that general lesson to the artifact described below.",
      constraints: "For each check, only mark 'clear' if you have a specific reason from the artifact description; otherwise use 'suspected' or 'insufficient evidence.' Do not fabricate evidence of a failure or of its absence.",
      instructions: `Walk the AI-assisted artifact described below through each failure check. For each check, give a verdict of clear / suspected / insufficient evidence, plus what to inspect next to resolve it.

Artifact description (what was produced, how AI was involved, and any relevant code/output/draft excerpts):
"""
{{artifact_description}}
"""

Checks:
1. Unverified citations — are any references used that were never actually confirmed to exist and say what they're cited for?
2. Results that were never actually produced — does any reported number, figure, or output lack a traceable run or computation behind it?
3. Convenient round numbers — are there suspiciously clean values (exact round percentages, perfectly even sample splits) that deserve a second look?
4. Shortcuts replacing the intended method — did the actual implementation quietly substitute an easier approach for the one described?
5. Surprising findings without a checked explanation — is there a result that stands out but has no investigation of why it occurred?
6. Method descriptions that don't match what was done — does the written methodology match the actual code/steps, or has it drifted?

For each of the six checks, output:
- Verdict: clear / suspected / insufficient evidence
- What to inspect next: the concrete next step to resolve uncertainty

End with an overall risk summary (not a pass/fail grade — a plain-language list of what still needs human verification).`,
      outputRequirements: "Six numbered check results (Verdict + What to inspect next for each), followed by an overall risk summary listing open items for human verification.",
    },
    variables: [
      { name: "artifact_description", type: "multiline", required: true, description: "Description of the AI-assisted artifact, including how AI was used and relevant excerpts" },
    ],
    outputFormat: "markdown",
    author: { name: "Research Atlas" },
    provenance: {
      source: "Research Atlas original, motivated by Lu et al. 2026, Nature 651:914, doi:10.1038/s41586-026-10265-5; failure checks re-derived independently from the general finding, not copied from any third-party checklist",
      sourceUrl: "https://doi.org/10.1038/s41586-026-10265-5",
      owner: "research-atlas",
      status: "reviewed",
      addedAt: "2026-07-02",
      reviewedAt: "2026-07-02",
    },
  },
  {
    id: "write_terminology_ledger",
    title: "Terminology Ledger",
    description: "Build a one-name-per-concept ledger from a draft, flagging near-synonyms that could read as different concepts.",
    stages: ["polishing", "writing"],
    researchTypes: ["qualitative", "quantitative", "mixed_methods", "computational", "experimental", "systematic_review", "theoretical"],
    tags: ["Terminology", "Editing", "Consistency"],
    difficulty: "beginner",
    content: {
      goal: "Build a terminology ledger that pins one chosen term per concept and flags inconsistent variants used in the draft.",
      context: "You are checking the draft for consistent naming, not correctness of the underlying ideas.",
      constraints: "Base every ledger row only on terms that actually appear in the draft text; do not introduce concepts that aren't discussed.",
      instructions: `Read the draft below and build a terminology ledger: one row per concept that is referred to by more than one term, or that risks being misread as a different concept because a near-synonym is used nearby.

Draft:
"""
{{draft_text}}
"""

For each concept, output a table row with:
| Concept | Chosen term | Variants found | Where they appear | Replacement instruction |
|---|---|---|---|---|

- "Chosen term" should be the clearest, most consistent option already used in the draft (prefer the term used most often or most precisely).
- "Variants found" lists every alternate wording used for the same concept.
- "Where they appear" gives enough of a locator (section, paragraph, or quoted snippet) to find each instance.
- "Replacement instruction" is a direct instruction, e.g. "replace 'result set' and 'output data' with 'output dataset' throughout."

After the table, separately flag any near-synonyms in the draft that are NOT the same concept but are close enough in wording that a reader could confuse them — list what distinguishes them.`,
      outputRequirements: "A terminology table (Concept | Chosen term | Variants found | Where they appear | Replacement instruction) plus a separate list of confusable near-synonyms with the distinction between them.",
    },
    variables: [
      { name: "draft_text", type: "multiline", required: true, description: "Draft text to extract terminology from" },
    ],
    outputFormat: "markdown",
    author: { name: "Research Atlas" },
    provenance: {
      source: "Adapted from nature-skills (Apache-2.0) — shared core terminology ledger",
      sourceUrl: "https://github.com/Yuan1z0825/nature-skills",
      owner: "research-atlas",
      status: "reviewed",
      addedAt: "2026-07-02",
      reviewedAt: "2026-07-02",
    },
  },
  {
    id: "disclose_ai_use",
    title: "AI-Use Disclosure Drafter",
    description: "Classify each described use of AI tools against common journal/publisher disclosure policy categories, then draft an honest disclosure statement.",
    stages: ["writing", "review"],
    researchTypes: ["qualitative", "quantitative", "mixed_methods", "computational", "experimental", "systematic_review", "theoretical"],
    tags: ["Ethics", "AI_Use", "Disclosure"],
    difficulty: "beginner",
    content: {
      goal: "Classify how AI tools were used against typical publisher disclosure categories and draft an honest, accurate disclosure statement.",
      context: "Policy categories below describe TYPICAL journal/publisher practice, not any specific venue's actual policy — the user must check their venue's real policy before relying on this classification.",
      constraints: "Do not claim to know any specific venue's actual policy. Label all categorization as typical/common practice only, and instruct the user to verify against their venue's real policy. Do not draft a disclosure statement that describes AI use more narrowly or more broadly than what was actually described.",
      instructions: `Classify each described use of AI tools below against typical (not venue-specific) publisher disclosure categories, then draft a disclosure statement.

Description of how AI tools were used:
"""
{{ai_usage_description}}
"""

Step 1 — Classify each distinct use against these TYPICAL categories (label them explicitly as typical practice, not any specific venue's rule):
- Acceptable with light disclosure (e.g. grammar/language polishing)
- Requires detailed disclosure (e.g. AI-assisted analysis, drafting, code generation, literature summarization)
- Typically prohibited or restricted (e.g. AI-generated data, AI as a listed author, undisclosed substantive writing)

For each use, state the category and a one-line rationale. Explicitly note: "These categories reflect common practice across journals, not this venue's specific policy — confirm against the venue's actual author guidelines before submission."

Step 2 — Draft a disclosure statement (2-5 sentences) that accurately and honestly describes what AI tools were used for, based only on the description given. Do not broaden or narrow the described use, and do not omit a use that falls in the "requires detailed disclosure" or "typically prohibited" categories.

Output both the classification table and the drafted statement.`,
      outputRequirements: "A classification table (Use | Typical category | Rationale) with the policy-is-typical-not-venue-specific caveat stated explicitly, followed by a drafted 2-5 sentence disclosure statement.",
    },
    variables: [
      { name: "ai_usage_description", type: "multiline", required: true, description: "Description of how AI tools were used in the research or writing process" },
    ],
    outputFormat: "markdown",
    author: { name: "Research Atlas" },
    provenance: {
      source: "Adapted concept from nature-skills (Apache-2.0) — AI-use ethics boundaries, generalized beyond any single venue's policy",
      sourceUrl: "https://github.com/Yuan1z0825/nature-skills",
      owner: "research-atlas",
      status: "reviewed",
      addedAt: "2026-07-02",
      reviewedAt: "2026-07-02",
    },
  },
]

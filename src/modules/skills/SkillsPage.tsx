export function SkillsPage() {
    return (
        <div className="container mx-auto py-8">
            <div className="flex flex-col gap-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Agent Skills</h1>
                    <p className="mt-1 text-muted-foreground">
                        Configuration profiles and system prompts for your AI research assistants.
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                        <h3 className="text-lg font-semibold mb-2">Cursor / VS Code Rules</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Optimize your AI coding assistant for research software development.
                        </p>
                        <pre className="bg-muted p-4 rounded-md text-xs overflow-x-auto">
                            {`{
  "role": "Senior Research Software Engineer",
  "tech_stack": ["Python", "PyTorch", "LaTeX"],
  "principles": [
    "Prioritize reproducibility",
    "Use type hints explicitly", 
    "Document assumptions in code"
  ]
}`}
                        </pre>
                    </div>

                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                        <h3 className="text-lg font-semibold mb-2">Paper Reviewer Persona</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            System prompt to make an AI act as a critical academic reviewer.
                        </p>
                        <div className="bg-muted p-4 rounded-md text-sm italic">
                            "You are an expert reviewer for top-tier journals (Nature, Science, NeurIPS). Your goal is to critically evaluate not just the writing, but the logical soundness of the arguments…"
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

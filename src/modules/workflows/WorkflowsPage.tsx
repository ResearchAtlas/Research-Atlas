import { useMemo, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { CheckCircle2, Layers, Search } from "lucide-react"
import { WORKFLOWS, Workflow } from "@/data/workflows"
import type { ResearchStage, ResearchType } from "@/data/taxonomy"
import { RESEARCH_TYPES, STAGES, STAGE_LABELS, RESEARCH_TYPE_LABELS } from "@/data/taxonomy"
import { PROMPTS } from "@/data/prompts"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const progressKey = "research-atlas-workflow-progress"
const PROMPT_MAP = new Map(PROMPTS.map((prompt) => [prompt.id, prompt]))

function readProgress(): Record<string, string[]> {
  try {
    const stored = localStorage.getItem(progressKey)
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

function writeProgress(progress: Record<string, string[]>) {
  localStorage.setItem(progressKey, JSON.stringify(progress))
}

export function WorkflowsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const queryParam = searchParams.get("q") || ""
  const stageParam = searchParams.get("stage") || "all"
  const typeParam = searchParams.get("type") || "all"

  const [search, setSearch] = useState(queryParam)
  const [selectedStage, setSelectedStage] = useState<ResearchStage | "all">(stageParam as ResearchStage | "all")
  const [selectedType, setSelectedType] = useState<ResearchType | "all">(typeParam as ResearchType | "all")
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null)
  const [progress, setProgress] = useState<Record<string, string[]>>(() =>
    typeof window === "undefined" ? {} : readProgress()
  )

  const updateParams = (next: { q?: string; stage?: string; type?: string }) => {
    const params = new URLSearchParams(searchParams)
    if (next.q !== undefined) {
      if (next.q) params.set("q", next.q)
      else params.delete("q")
    }
    if (next.stage !== undefined) {
      if (next.stage && next.stage !== "all") params.set("stage", next.stage)
      else params.delete("stage")
    }
    if (next.type !== undefined) {
      if (next.type && next.type !== "all") params.set("type", next.type)
      else params.delete("type")
    }
    setSearchParams(params, { replace: true })
  }

  const filteredWorkflows = useMemo(() => {
    return WORKFLOWS.filter((workflow) => {
      const matchesSearch =
        !search ||
        workflow.title.toLowerCase().includes(search.toLowerCase()) ||
        workflow.description.toLowerCase().includes(search.toLowerCase())

      const matchesStage =
        selectedStage === "all" || workflow.stages.includes(selectedStage)

      const matchesType =
        selectedType === "all" || workflow.researchTypes.includes(selectedType)

      return matchesSearch && matchesStage && matchesType
    })
  }, [search, selectedStage, selectedType])

  const toggleStep = (workflowId: string, stepId: string) => {
    setProgress((prev) => {
      const current = new Set(prev[workflowId] || [])
      if (current.has(stepId)) current.delete(stepId)
      else current.add(stepId)
      const next = { ...prev, [workflowId]: Array.from(current) }
      writeProgress(next)
      return next
    })
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-balance">Workflows</h1>
          <p className="mt-1 text-muted-foreground">
            Step-by-step workflows mapped to research stages and methods.
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <label className="sr-only" htmlFor="workflow-search">
            Search workflows
          </label>
          <Search
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            id="workflow-search"
            name="workflow_search"
            autoComplete="off"
            type="text"
            value={search}
            onChange={(e) => {
              const next = e.target.value
              setSearch(next)
              updateParams({ q: next })
            }}
            placeholder="Search workflows…"
            className="pl-10"
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          onClick={() => {
            setSelectedStage("all")
            updateParams({ stage: "all" })
          }}
          variant={selectedStage === "all" ? "default" : "secondary"}
          size="sm"
          className="rounded-full"
        >
          All Stages
        </Button>
        {STAGES.map((stage) => (
          <Button
            key={stage.id}
            onClick={() => {
              setSelectedStage(stage.id)
              updateParams({ stage: stage.id })
            }}
            variant={selectedStage === stage.id ? "default" : "secondary"}
            size="sm"
            className="rounded-full"
          >
            {stage.label}
          </Button>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <Button
          onClick={() => {
            setSelectedType("all")
            updateParams({ type: "all" })
          }}
          variant={selectedType === "all" ? "default" : "secondary"}
          size="sm"
          className="rounded-full"
        >
          All Research Types
        </Button>
        {RESEARCH_TYPES.map((type) => (
          <Button
            key={type.id}
            onClick={() => {
              setSelectedType(type.id)
              updateParams({ type: type.id })
            }}
            variant={selectedType === type.id ? "default" : "secondary"}
            size="sm"
            className="rounded-full"
          >
            {type.label}
          </Button>
        ))}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredWorkflows.map((workflow) => (
          <button
            key={workflow.id}
            type="button"
            className="group w-full text-left rounded-xl border bg-card text-card-foreground shadow transition-shadow transition-colors hover:shadow-md hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            onClick={() => setSelectedWorkflow(workflow)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex flex-wrap gap-2">
                  {workflow.stages.slice(0, 2).map((stage) => (
                    <Badge key={stage} variant="secondary" className="capitalize">
                      {STAGE_LABELS[stage]}
                    </Badge>
                  ))}
                  {workflow.stages.length > 2 && (
                    <Badge variant="outline">+{workflow.stages.length - 2}</Badge>
                  )}
                </div>
                <Layers className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </div>
              <CardTitle className="text-lg mt-2">{workflow.title}</CardTitle>
              <CardDescription className="line-clamp-2">
                {workflow.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{workflow.tags.slice(0, 2).join(", ")}</span>
              </div>
            </CardContent>
          </button>
        ))}
      </div>

      <WorkflowDetailDialog
        workflow={selectedWorkflow}
        onClose={() => setSelectedWorkflow(null)}
        progress={progress}
        onToggleStep={toggleStep}
      />
    </div>
  )
}

function WorkflowDetailDialog({
  workflow,
  onClose,
  progress,
  onToggleStep,
}: {
  workflow: Workflow | null
  onClose: () => void
  progress: Record<string, string[]>
  onToggleStep: (workflowId: string, stepId: string) => void
}) {
  if (!workflow) return null

  const completed = new Set(progress[workflow.id] || [])

  const renderStep = (step: { id: string; title: string; summary: string; promptIds?: string[] }) => {
    const stepPrompts = (step.promptIds || [])
      .map((promptId) => PROMPT_MAP.get(promptId))
      .filter((prompt): prompt is (typeof PROMPTS)[number] => Boolean(prompt))

    return (
      <div key={step.id} className="flex items-start gap-3 rounded-lg border p-3">
      <button
        type="button"
        className="mt-0.5"
        onClick={() => onToggleStep(workflow.id, step.id)}
        aria-label={`Mark ${step.title} as complete`}
        aria-pressed={completed.has(step.id)}
      >
        <CheckCircle2
          className={`h-5 w-5 ${completed.has(step.id) ? "text-primary" : "text-muted-foreground"}`}
          aria-hidden="true"
        />
      </button>
      <div>
        <p className="text-sm font-semibold">{step.title}</p>
        <p className="text-sm text-muted-foreground">{step.summary}</p>
        {stepPrompts.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {stepPrompts.map((prompt) => (
              <Button key={prompt.id} variant="secondary" size="sm" asChild>
                <Link
                  to={`/library?q=${encodeURIComponent(prompt.title)}`}
                  onClick={() => onClose()}
                >
                  {prompt.title}
                </Link>
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
  }

  return (
    <Dialog open={!!workflow} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{workflow.title}</DialogTitle>
          <DialogDescription>{workflow.description}</DialogDescription>
          <div className="mt-2 flex flex-wrap gap-2">
            {workflow.researchTypes.slice(0, 4).map((type) => (
              <Badge key={type} variant="outline">
                {RESEARCH_TYPE_LABELS[type]}
              </Badge>
            ))}
          </div>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          {workflow.phases
            ? workflow.phases.map((phase) => (
                <div key={phase.id} className="space-y-3">
                  <div>
                    <h3 className="text-base font-semibold">{phase.title}</h3>
                    <p className="text-sm text-muted-foreground">{phase.description}</p>
                  </div>
                  <div className="space-y-2">
                    {phase.steps.map((step) => renderStep(step))}
                  </div>
                </div>
              ))
            : workflow.steps?.map((step) => renderStep(step))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

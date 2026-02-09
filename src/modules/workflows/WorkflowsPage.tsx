import { useMemo, useState } from "react"
import { useSearchParams, Link } from "react-router-dom"
import { Layers, Search } from "lucide-react"
import { WORKFLOWS } from "@/data/workflows"
import type { ResearchStage, ResearchType } from "@/data/taxonomy"
import { RESEARCH_TYPES, STAGES, STAGE_LABELS } from "@/data/taxonomy"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const formatTag = (tag: string) =>
  tag
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())

import { Helmet } from 'react-helmet-async'

const WORKFLOW_DISPLAY_PRIORITY = ["focus", "nlm-research-workflow"] as const

const getWorkflowPriority = (workflowId: string) => {
  const priorityIndex = WORKFLOW_DISPLAY_PRIORITY.indexOf(
    workflowId as (typeof WORKFLOW_DISPLAY_PRIORITY)[number],
  )
  return priorityIndex === -1 ? Number.MAX_SAFE_INTEGER : priorityIndex
}

export function WorkflowsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const queryParam = searchParams.get("q") || ""
  const stageParam = searchParams.get("stage") || "all"
  const typeParam = searchParams.get("type") || "all"

  const [search, setSearch] = useState(queryParam)
  const [selectedStage, setSelectedStage] = useState<ResearchStage | "all">(stageParam as ResearchStage | "all")
  const [selectedType, setSelectedType] = useState<ResearchType | "all">(typeParam as ResearchType | "all")

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
    const filtered = WORKFLOWS.filter((workflow) => {
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

    // Keep a stable baseline order while pinning curated workflows to the top.
    return filtered.sort((a, b) => {
      const priorityDiff = getWorkflowPriority(a.id) - getWorkflowPriority(b.id)
      if (priorityDiff !== 0) return priorityDiff
      return WORKFLOWS.findIndex((workflow) => workflow.id === a.id) - WORKFLOWS.findIndex((workflow) => workflow.id === b.id)
    })
  }, [search, selectedStage, selectedType])

  const canonical = "https://researchatlas.info/workflows"
  const socialTitle = "Research Workflows | Research Atlas"
  const description = "Follow stage-based research workflows spanning qualitative, quantitative, and mixed methods studies."

  return (
    <div className="container mx-auto py-8">
      <Helmet>
        <title>{socialTitle}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonical} />
        <meta property="og:title" content={socialTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content="https://researchatlas.info/og/cover-1200x630.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={canonical} />
        <meta name="twitter:title" content={socialTitle} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content="https://researchatlas.info/og/cover-1200x630.png" />
      </Helmet>
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

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 [grid-auto-rows:1fr]">
        {filteredWorkflows.map((workflow) => (
          <Link
            key={workflow.id}
            to={`/workflows/${workflow.id}`}
            className="group flex h-full w-full flex-col rounded-xl border bg-card text-left text-card-foreground shadow transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary/50"
            aria-label={`${workflow.title} workflow details`}
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
              <CardTitle className="text-lg mt-2 group-hover:text-primary transition-colors">{workflow.title}</CardTitle>
              <CardDescription className="line-clamp-2">
                {workflow.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-auto pt-0">
              {workflow.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  {workflow.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-[11px]">
                      {formatTag(tag)}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Link>
        ))}
      </div>
    </div>
  )
}

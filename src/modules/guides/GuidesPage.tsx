import { useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { BookOpen, Search } from "lucide-react"
import { GUIDES, Guide } from "@/data/guides"
import type { ResearchStage, ResearchType } from "@/data/taxonomy"
import { RESEARCH_TYPES, STAGES, STAGE_LABELS, RESEARCH_TYPE_LABELS } from "@/data/taxonomy"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export function GuidesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const queryParam = searchParams.get("q") || ""
  const stageParam = searchParams.get("stage") || "all"
  const typeParam = searchParams.get("type") || "all"

  const [search, setSearch] = useState(queryParam)
  const [selectedStage, setSelectedStage] = useState<ResearchStage | "all">(stageParam as ResearchStage | "all")
  const [selectedType, setSelectedType] = useState<ResearchType | "all">(typeParam as ResearchType | "all")
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null)

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

  const filteredGuides = useMemo(() => {
    return GUIDES.filter((guide) => {
      const matchesSearch =
        !search ||
        guide.title.toLowerCase().includes(search.toLowerCase()) ||
        guide.summary.toLowerCase().includes(search.toLowerCase())

      const matchesStage =
        selectedStage === "all" || guide.stages.includes(selectedStage)

      const matchesType =
        selectedType === "all" || guide.researchTypes.includes(selectedType)

      return matchesSearch && matchesStage && matchesType
    })
  }, [search, selectedStage, selectedType])

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-balance">Guides</h1>
          <p className="mt-1 text-muted-foreground">
            Educational resources, protocols, and frameworks for research with AI.
          </p>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <label className="sr-only" htmlFor="guide-search">
            Search guides
          </label>
          <Search
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            id="guide-search"
            name="guide_search"
            autoComplete="off"
            type="text"
            value={search}
            onChange={(e) => {
              const next = e.target.value
              setSearch(next)
              updateParams({ q: next })
            }}
            placeholder="Search guides…"
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
        {filteredGuides.map((guide) => (
          <button
            key={guide.id}
            type="button"
            className="group w-full text-left rounded-xl border bg-card text-card-foreground shadow transition-shadow transition-colors hover:shadow-md hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            onClick={() => setSelectedGuide(guide)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex flex-wrap gap-2">
                  {guide.stages.slice(0, 2).map((stage) => (
                    <Badge key={stage} variant="secondary" className="capitalize">
                      {STAGE_LABELS[stage]}
                    </Badge>
                  ))}
                  {guide.stages.length > 2 && (
                    <Badge variant="outline">+{guide.stages.length - 2}</Badge>
                  )}
                </div>
                <BookOpen className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </div>
              <CardTitle className="text-lg mt-2">{guide.title}</CardTitle>
              <CardDescription className="line-clamp-2">
                {guide.summary}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{guide.tags.slice(0, 2).join(", ")}</span>
              </div>
            </CardContent>
          </button>
        ))}
      </div>

      <GuideDetailDialog guide={selectedGuide} onClose={() => setSelectedGuide(null)} />
    </div>
  )
}

function GuideDetailDialog({
  guide,
  onClose,
}: {
  guide: Guide | null
  onClose: () => void
}) {
  if (!guide) return null

  return (
    <Dialog open={!!guide} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{guide.title}</DialogTitle>
          <DialogDescription>{guide.summary}</DialogDescription>
          <div className="mt-2 flex flex-wrap gap-2">
            {guide.researchTypes.slice(0, 4).map((type) => (
              <Badge key={type} variant="outline">
                {RESEARCH_TYPE_LABELS[type]}
              </Badge>
            ))}
          </div>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          {guide.sections.map((section) => (
            <div key={section.id} className="space-y-2">
              <h3 className="text-base font-semibold">{section.title}</h3>
              {section.body && (
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {section.body}
                </p>
              )}
              {section.bullets && (
                <ul className="list-disc pl-5 text-sm text-muted-foreground">
                  {section.bullets.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

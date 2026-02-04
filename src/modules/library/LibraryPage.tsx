import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Search, Copy, Check, ExternalLink, MessageSquareText } from 'lucide-react'
import { fetchPublicPrompts, StaticPrompt } from '@/lib/prompts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import type { ResearchStage, ResearchType } from '@/data/taxonomy'
import { RESEARCH_TYPES, RESEARCH_TYPE_LABELS, STAGES, STAGE_LABELS } from '@/data/taxonomy'
import type { PromptVariable } from '@/store/workbench'

type StageFilter = ResearchStage | 'all'
type TypeFilter = ResearchType | 'all'

export function LibraryPage() {
    const [searchParams, setSearchParams] = useSearchParams()
    const queryParam = searchParams.get('q') || ''
    const stageParam = searchParams.get('stage') || 'all'
    const typeParam = searchParams.get('type') || 'all'

    const [search, setSearch] = useState(queryParam)
    const [selectedStage, setSelectedStage] = useState<StageFilter>(stageParam as StageFilter)
    const [selectedType, setSelectedType] = useState<TypeFilter>(typeParam as TypeFilter)
    const [selectedPrompt, setSelectedPrompt] = useState<StaticPrompt | null>(null)

    const { data: prompts, isLoading, error } = useQuery({
        queryKey: ['publicPrompts'],
        queryFn: fetchPublicPrompts,
    })

    const updateParams = (next: { q?: string; stage?: string; type?: string }) => {
        const params = new URLSearchParams(searchParams)
        if (next.q !== undefined) {
            if (next.q) params.set('q', next.q)
            else params.delete('q')
        }
        if (next.stage !== undefined) {
            if (next.stage && next.stage !== 'all') params.set('stage', next.stage)
            else params.delete('stage')
        }
        if (next.type !== undefined) {
            if (next.type && next.type !== 'all') params.set('type', next.type)
            else params.delete('type')
        }
        setSearchParams(params, { replace: true })
    }

    const filteredPrompts = useMemo(() => {
        return prompts?.filter((p) => {
            const matchesSearch = !search ||
                p.title.toLowerCase().includes(search.toLowerCase()) ||
                p.description?.toLowerCase().includes(search.toLowerCase())

            const matchesStage =
                selectedStage === 'all' || p.stages.includes(selectedStage)

            const matchesType =
                selectedType === 'all' || p.researchTypes.includes(selectedType)

            return matchesSearch && matchesStage && matchesType
        })
    }, [prompts, search, selectedStage, selectedType])

    return (
        <div className="container mx-auto py-8">
            <div>
                {/* Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-balance">Prompt Library</h1>
                        <p className="mt-1 text-muted-foreground">
                            Browse research-ready prompts by stage and research type.
                        </p>
                    </div>
                    <Button asChild>
                        <a
                            href="https://github.com/YourRepo/researcher-prompt-hub/issues/new?template=prompt_request.md"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <MessageSquareText className="mr-2 h-4 w-4" aria-hidden="true" />
                            Submit a Prompt
                        </a>
                    </Button>
                </div>

                {/* Search and Filters */}
                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                    <div className="relative flex-1">
                        <label className="sr-only" htmlFor="prompt-search">
                            Search prompts
                        </label>
                        <Search
                            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                            aria-hidden="true"
                        />
                        <Input
                            id="prompt-search"
                            name="prompt_search"
                            autoComplete="off"
                            type="text"
                            value={search}
                            onChange={(e) => {
                                const next = e.target.value
                                setSearch(next)
                                updateParams({ q: next })
                            }}
                            placeholder="Search prompts…"
                            className="pl-10"
                        />
                    </div>
                </div>

                {/* Filter Chips */}
                <div className="mt-4 flex flex-wrap gap-2">
                    <Button
                        onClick={() => {
                            setSelectedStage('all')
                            updateParams({ stage: 'all' })
                        }}
                        variant={selectedStage === 'all' ? 'default' : 'secondary'}
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
                            variant={stage.id === selectedStage ? 'default' : 'secondary'}
                            size="sm"
                            className="rounded-full"
                        >
                            {stage.label}
                        </Button>
                    ))}
                </div>

                {/* Research Type Filters */}
                <div className="mt-3 flex flex-wrap gap-2">
                    <Button
                        onClick={() => {
                            setSelectedType('all')
                            updateParams({ type: 'all' })
                        }}
                        variant={selectedType === 'all' ? 'default' : 'secondary'}
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
                            variant={selectedType === type.id ? 'default' : 'secondary'}
                            size="sm"
                            className="rounded-full"
                        >
                            {type.label}
                        </Button>
                    ))}
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <Card key={i}>
                                <CardHeader>
                                    <Skeleton className="h-5 w-20" />
                                    <Skeleton className="h-6 w-3/4 mt-2" />
                                </CardHeader>
                                <CardContent>
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-2/3 mt-2" />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="mt-16 text-center">
                        <p className="text-destructive">Failed to load prompts. Please try again.</p>
                    </div>
                )}

                {/* Prompt Grid */}
                {!isLoading && !error && (
                    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredPrompts?.map((prompt) => (
                            <PromptCard
                                key={prompt.id}
                                prompt={prompt}
                                onClick={() => setSelectedPrompt(prompt)}
                            />
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && !error && filteredPrompts?.length === 0 && (
                    <div className="mt-16 text-center">
                        <p className="text-muted-foreground">
                            {prompts?.length === 0
                                ? 'No public prompts yet. Be the first to share one!'
                                : 'No prompts found. Try adjusting your filters.'}
                        </p>
                    </div>
                )}

                {/* Prompt Detail Dialog */}
                <PromptDetailDialog
                    prompt={selectedPrompt}
                    onClose={() => setSelectedPrompt(null)}
                />
            </div>
        </div>
    )
}

function PromptCard({ prompt, onClick }: { prompt: StaticPrompt; onClick: () => void }) {
    return (
        <button
            type="button"
            className="group w-full text-left rounded-xl border bg-card text-card-foreground shadow transition-shadow transition-colors hover:shadow-md hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            onClick={onClick}
        >
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex flex-wrap gap-2">
                        {prompt.stages.slice(0, 2).map((stage) => (
                            <Badge key={stage} variant="secondary" className="capitalize">
                                {STAGE_LABELS[stage]}
                            </Badge>
                        ))}
                        {prompt.stages.length > 2 && (
                            <Badge variant="outline">+{prompt.stages.length - 2}</Badge>
                        )}
                    </div>
                </div>
                <CardTitle className="text-lg mt-2">{prompt.title}</CardTitle>
                {prompt.description && (
                    <CardDescription className="line-clamp-2">
                        {prompt.description}
                    </CardDescription>
                )}
            </CardHeader>
            <CardContent className="pt-0">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{new Date(prompt.createdAt).toLocaleDateString()}</span>
                    {prompt.tags && prompt.tags.length > 0 && (
                        <>
                            <span>•</span>
                            <span>{prompt.tags.slice(0, 2).join(', ')}</span>
                        </>
                    )}
                </div>
            </CardContent>
        </button>
    )
}

function PromptDetailDialog({ prompt, onClose }: { prompt: StaticPrompt | null; onClose: () => void }) {
    const [copied, setCopied] = useState(false)

    if (!prompt) return null

    const { content, variables } = prompt

    const handleCopy = async () => {
        const text = `**Goal:** ${content?.goal || ''}

**Context:** ${content?.context || ''}

**Instructions:**
${content?.instructions || ''}

**Constraints:**
${content?.constraints || ''}

**Output Requirements:**
${content?.outputRequirements || ''}
`
        await navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <Dialog open={!!prompt} onOpenChange={() => onClose()}>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        {prompt.stages.map((stage) => (
                            <Badge key={stage} variant="secondary" className="capitalize">
                                {STAGE_LABELS[stage]}
                            </Badge>
                        ))}
                        {prompt.researchTypes.slice(0, 2).map((type) => (
                            <Badge key={type} variant="outline">
                                {RESEARCH_TYPE_LABELS[type]}
                            </Badge>
                        ))}
                        {prompt.author?.name && (
                            <span className="text-xs text-muted-foreground">
                                by {prompt.author.name}
                            </span>
                        )}
                    </div>
                    <DialogTitle className="text-xl">{prompt.title}</DialogTitle>
                    {prompt.description && (
                        <DialogDescription>{prompt.description}</DialogDescription>
                    )}
                </DialogHeader>

                {content ? (
                    <div className="space-y-4 mt-4">
                        {content.goal && (
                            <div>
                                <h4 className="font-semibold text-sm">Goal</h4>
                                <p className="mt-1 text-sm text-muted-foreground">{content.goal}</p>
                            </div>
                        )}
                        {content.context && (
                            <div>
                                <h4 className="font-semibold text-sm">Context</h4>
                                <p className="mt-1 text-sm text-muted-foreground">{content.context}</p>
                            </div>
                        )}
                        {content.instructions && (
                            <div>
                                <h4 className="font-semibold text-sm">Instructions</h4>
                                <p className="mt-1 text-sm text-muted-foreground whitespace-pre-wrap">{content.instructions}</p>
                            </div>
                        )}
                        {content.constraints && (
                            <div>
                                <h4 className="font-semibold text-sm">Constraints</h4>
                                <p className="mt-1 text-sm text-muted-foreground whitespace-pre-wrap">{content.constraints}</p>
                            </div>
                        )}
                        {content.outputRequirements && (
                            <div>
                                <h4 className="font-semibold text-sm">Output Requirements</h4>
                                <p className="mt-1 text-sm text-muted-foreground whitespace-pre-wrap">{content.outputRequirements}</p>
                            </div>
                        )}
                        {variables && variables.length > 0 && (
                            <div>
                                <h4 className="font-semibold text-sm">Variables</h4>
                                <div className="mt-2 flex flex-wrap gap-2">
                            {variables.map((v: PromptVariable) => (
                                <Badge key={v.name} variant="outline" className="font-mono">
                                    {`{{${v.name}}}`}
                                </Badge>
                            ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="py-8 text-center text-muted-foreground">
                        <p>This prompt doesn't have published content yet.</p>
                    </div>
                )}

                <div className="flex gap-2 mt-6">
                    <Button onClick={handleCopy} className="flex-1">
                        {copied ? (
                            <>
                                <Check className="mr-2 h-4 w-4" aria-hidden="true" />
                                Copied!
                            </>
                        ) : (
                            <>
                                <Copy className="mr-2 h-4 w-4" aria-hidden="true" />
                                Copy Prompt
                            </>
                        )}
                    </Button>
                    <Button variant="outline" asChild>
                        <a href="https://chat.openai.com" target="_blank" rel="noopener noreferrer">
                            Open in ChatGPT
                            <ExternalLink className="ml-2 h-4 w-4" aria-hidden="true" />
                        </a>
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

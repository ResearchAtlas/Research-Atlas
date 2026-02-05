import { Checkbox } from "@/components/ui/checkbox"
import { RESEARCH_TYPES, STAGES, ResearchStage, ResearchType } from "@/data/taxonomy"
import {
    ChevronUp, ChevronDown, Star,
    PencilRuler, Ruler, CheckCircle2, BarChart3, Lightbulb, PieChart, PenTool, Sparkles, Users,
    MessageSquare, Calculator, GitMerge, Terminal, FlaskConical, FileSearch, BookOpen
} from "lucide-react"
import { useState } from "react"
import { StaticPrompt } from "@/lib/prompts"

interface LibrarySidebarProps {
    selectedStages: string[]
    selectedTypes: string[]
    onToggleStage: (stageId: string) => void
    onToggleType: (typeId: string) => void
    onClearAll: () => void
    counts?: {
        stages: Record<string, number>
        types: Record<string, number>
    }
    favoriteIds?: Set<string>
    prompts?: StaticPrompt[]
    onSelectPrompt?: (promptId: string) => void
}

const STAGE_ICONS: Record<ResearchStage, React.ElementType> = {
    design: PencilRuler,
    measures: Ruler,
    data_qc: CheckCircle2,
    analysis: BarChart3,
    interpretation: Lightbulb,
    visualization: PieChart,
    writing: PenTool,
    polishing: Sparkles,
    review: Users
}

const TYPE_ICONS: Record<ResearchType, React.ElementType> = {
    qualitative: MessageSquare,
    quantitative: Calculator,
    mixed_methods: GitMerge,
    computational: Terminal,
    experimental: FlaskConical,
    systematic_review: FileSearch,
    theoretical: BookOpen
}

function SidebarSection({
    title,
    children,
    defaultOpen = true
}: {
    title: string
    children: React.ReactNode
    defaultOpen?: boolean
}) {
    const [isOpen, setIsOpen] = useState(defaultOpen)

    return (
        <div className="mb-6">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-center justify-between mb-4 text-sm font-semibold tracking-wide text-foreground/80 uppercase hover:text-foreground transition-colors"
            >
                <span>{title}</span>
                {isOpen ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground transition-transform group-hover:text-foreground" />
                ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-hover:text-foreground" />
                )}
            </button>
            {isOpen && (
                <div className="space-y-1 animate-in slide-in-from-top-1 duration-200">
                    {children}
                </div>
            )}
        </div>
    )
}

export function LibrarySidebar({
    selectedStages,
    selectedTypes,
    onToggleStage,
    onToggleType,
    counts,
    favoriteIds,
    prompts,
    onSelectPrompt
}: LibrarySidebarProps) {
    // Transform favoriteIds Set to an array of prompt objects
    const favoritePrompts = prompts?.filter(p => favoriteIds?.has(p.id)) || []

    return (
        <aside className="w-72 border-r border-border flex flex-col overflow-y-auto shrink-0 bg-muted/30 ml-4">
            <div className="p-6">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-base font-bold text-foreground tracking-tight">Filters & Favorites</h3>
                </div>

                <SidebarSection title="Research Stages">
                    {STAGES.map((stage) => {
                        const Icon = STAGE_ICONS[stage.id]
                        return (
                            <label
                                key={stage.id}
                                className="flex items-center justify-between py-2 px-2 -mx-2 rounded-md hover:bg-muted cursor-pointer group transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="relative flex items-center justify-center">
                                        <Checkbox
                                            id={`stage-${stage.id}`}
                                            checked={selectedStages.includes(stage.id)}
                                            onCheckedChange={() => onToggleStage(stage.id)}
                                            className="border-muted-foreground/40 bg-background data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-primary-foreground h-5 w-5 rounded-full transition-all"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2.5 text-muted-foreground group-hover:text-foreground transition-colors">
                                        <Icon className="h-4 w-4 opacity-70 group-hover:opacity-100" />
                                        <span className="text-sm font-medium">{stage.label}</span>
                                    </div>
                                </div>
                                {counts?.stages[stage.id] !== undefined && (
                                    <span className="text-xs font-mono text-muted-foreground group-hover:text-foreground tabular-nums">
                                        {counts.stages[stage.id]}
                                    </span>
                                )}
                            </label>
                        )
                    })}
                </SidebarSection>

                <div className="my-6 border-t border-border" />

                <SidebarSection title="Research Types">
                    {RESEARCH_TYPES.map((type) => {
                        const Icon = TYPE_ICONS[type.id]
                        return (
                            <label
                                key={type.id}
                                className="flex items-center justify-between py-2 px-2 -mx-2 rounded-md hover:bg-muted cursor-pointer group transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="relative flex items-center justify-center">
                                        <Checkbox
                                            id={`type-${type.id}`}
                                            checked={selectedTypes.includes(type.id)}
                                            onCheckedChange={() => onToggleType(type.id)}
                                            className="border-muted-foreground/40 bg-background data-[state=checked]:bg-primary data-[state=checked]:border-primary data-[state=checked]:text-primary-foreground h-5 w-5 rounded-sm transition-all"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2.5 text-muted-foreground group-hover:text-foreground transition-colors">
                                        <Icon className="h-4 w-4 opacity-70 group-hover:opacity-100" />
                                        <span className="text-sm font-medium">{type.label}</span>
                                    </div>
                                </div>
                                {counts?.types[type.id] !== undefined && (
                                    <span className="text-xs font-mono text-muted-foreground group-hover:text-foreground tabular-nums">
                                        {counts.types[type.id]}
                                    </span>
                                )}
                            </label>
                        )
                    })}
                </SidebarSection>

                <div className="mt-auto pt-6 border-t border-border">
                    <SidebarSection title="Saved Favorites" defaultOpen={true}>
                        {favoritePrompts.length === 0 ? (
                            <div className="text-xs text-muted-foreground italic px-2 py-1">
                                No favorites saved yet.
                            </div>
                        ) : (
                            <div className="space-y-1">
                                {favoritePrompts.map(prompt => (
                                    <button
                                        key={prompt.id}
                                        onClick={() => onSelectPrompt?.(prompt.id)}
                                        className="w-full flex items-center gap-3 text-left text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md px-2 py-2 transition-colors group"
                                    >
                                        <Star className="h-3.5 w-3.5 text-muted-foreground group-hover:text-yellow-500 group-hover:fill-yellow-500 transition-all shrink-0" />
                                        <span className="truncate font-medium">{prompt.title}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </SidebarSection>
                </div>
            </div>
        </aside>
    )
}

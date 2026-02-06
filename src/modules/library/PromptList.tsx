import { useState } from 'react'
import { Search, Star, Menu } from 'lucide-react'
import { STAGE_LABELS, RESEARCH_TYPE_LABELS, TAG_COLORS } from '@/data/taxonomy'
import { StaticPrompt } from '@/lib/prompts'
import { cn } from '@/lib/utils'
import { useFavorites } from '@/lib/favorites'

interface PromptListProps {
    prompts: StaticPrompt[]
    selectedPromptId: string | null
    onSelectPrompt: (promptId: string) => void
    search: string
    onSearchChange: (value: string) => void
    loading?: boolean
    onMenuClick?: () => void
}

export function PromptList({
    prompts,
    selectedPromptId,
    onSelectPrompt,
    search,
    onSearchChange,
    loading,
    onMenuClick
}: PromptListProps) {
    const { isFavorite } = useFavorites()
    const [filterType, setFilterType] = useState<'all' | 'standalone' | 'workflow'>('all')

    // Filter prompts based on type
    const filteredPrompts = prompts.filter(p => {
        if (filterType === 'all') return true
        const isWorkflowStep = p.tags.map(t => t.toLowerCase()).includes('workflow')
        return filterType === 'workflow' ? isWorkflowStep : !isWorkflowStep
    })

    return (
        <section className="flex-1 flex flex-col bg-background overflow-hidden relative">
            <div className="px-8 pt-8 pb-4 shrink-0">
                <div className="flex items-center gap-4 mb-6">
                    {/* Hamburger Menu (Mobile/Tablet) */}
                    <button
                        onClick={onMenuClick}
                        aria-label="Open filters"
                        className="xl:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                    <h1 className="text-3xl font-bold text-foreground">Prompt Library Explorer</h1>
                </div>

                {/* Search Bar */}
                <div className="relative w-full mb-4">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <input
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="block w-full pl-10 pr-3 py-3 border border-input rounded-lg leading-5 bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm transition-all shadow-sm"
                        placeholder="Search prompts..."
                        type="text"
                    />
                </div>

                {/* Filters */}
                <div className="flex gap-2 mb-4">
                    <button
                        onClick={() => setFilterType('all')}
                        className={cn(
                            "px-3 py-1.5 rounded-md text-xs font-medium transition-colors border",
                            filterType === 'all'
                                ? "bg-primary/10 text-primary border-primary/20"
                                : "text-muted-foreground border-border hover:border-input hover:text-foreground"
                        )}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilterType('standalone')}
                        className={cn(
                            "px-3 py-1.5 rounded-md text-xs font-medium transition-colors border",
                            filterType === 'standalone'
                                ? "bg-primary/10 text-primary border-primary/20"
                                : "text-muted-foreground border-border hover:border-input hover:text-foreground"
                        )}
                    >
                        Standalone
                    </button>
                    <button
                        onClick={() => setFilterType('workflow')}
                        className={cn(
                            "px-3 py-1.5 rounded-md text-xs font-medium transition-colors border",
                            filterType === 'workflow'
                                ? "bg-primary/10 text-primary border-primary/20"
                                : "text-muted-foreground border-border hover:border-input hover:text-foreground"
                        )}
                    >
                        Workflow Steps
                    </button>
                </div>

                {/* Stats Bar */}
                <div className="flex justify-between items-center mb-2">
                    <h2 className="text-sm font-semibold text-foreground/80">
                        {filterType === 'all' ? 'All Prompts' : filterType === 'standalone' ? 'Standalone Tools' : 'Workflow Steps'}
                    </h2>
                    <span className="text-xs text-muted-foreground font-medium">
                        {filteredPrompts.length} Prompts
                    </span>
                </div>
            </div>

            {/* Scrollable List */}
            <div className="flex-1 overflow-y-auto px-8 pb-8">
                {loading ? (
                    <div className="flex flex-col gap-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-32 rounded-lg bg-muted/50 animate-pulse border border-border" />
                        ))}
                    </div>
                ) : filteredPrompts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                        <p className="text-lg font-medium">No prompts found</p>
                        <p className="text-sm">Try adjusting your filters or search terms</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {filteredPrompts.map(prompt => {
                            const isActive = selectedPromptId === prompt.id
                            const isSaved = isFavorite(prompt.id)
                            return (
                                <article
                                    key={prompt.id}
                                    onClick={() => onSelectPrompt(prompt.id)}
                                    className={cn(
                                        "rounded-lg p-5 border shadow-sm relative cursor-pointer group transition-all duration-200 text-left",
                                        isActive
                                            ? "bg-card border-primary shadow-md ring-1 ring-primary/20"
                                            : "bg-card border-border hover:border-primary/50 hover:bg-muted/50"
                                    )}
                                >
                                    {isSaved && (
                                        <Star className="absolute top-5 right-5 h-4 w-4 text-yellow-500 fill-yellow-500" />
                                    )}

                                    <h3 className="text-lg font-bold text-card-foreground mb-2 pr-8 leading-tight">
                                        {prompt.title}
                                    </h3>

                                    <p className="text-muted-foreground text-sm mb-4 leading-relaxed line-clamp-2">
                                        {prompt.description}
                                    </p>

                                    <div className="flex flex-wrap gap-2">
                                        {prompt.stages.map(s => {
                                            const colors = TAG_COLORS[s] || { bg: "bg-secondary", text: "text-secondary-foreground", border: "border-border" }
                                            return (
                                                <span key={s} className={cn(
                                                    "text-xs px-2.5 py-1 rounded-md font-medium border tracking-wide",
                                                    colors.bg, colors.text, colors.border
                                                )}>
                                                    {STAGE_LABELS[s]}
                                                </span>
                                            )
                                        })}
                                        {prompt.researchTypes.slice(0, 2).map(t => {
                                            const colors = TAG_COLORS[t] || { bg: "bg-secondary", text: "text-secondary-foreground", border: "border-border" }
                                            return (
                                                <span key={t} className={cn(
                                                    "text-xs px-2.5 py-1 rounded-md font-medium border",
                                                    colors.bg, colors.text, colors.border
                                                )}>
                                                    {RESEARCH_TYPE_LABELS[t]}
                                                </span>
                                            )
                                        })}
                                    </div>
                                </article>
                            )
                        })}
                    </div>
                )}
            </div>
        </section>
    )
}

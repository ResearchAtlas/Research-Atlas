import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { StaticPrompt } from '@/lib/prompts'
import { WORKFLOWS } from '@/data/workflows'

import { X, Check, Clipboard, FileDown, Info, Star, ArrowRight, ArrowLeft } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useFavorites } from '@/lib/favorites'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import type { ContentStatus } from '@/data/provenance'
import { prettifyVariableName, usePersistedVariables, useResolvedVariables } from '@/lib/promptVariables'
import { buildCopyText, buildPromptMarkdown } from '@/lib/promptMarkdown'

const STATUS_LABELS: Record<ContentStatus, string> = {
    verified: 'Verified',
    reviewed: 'Reviewed',
    unverified: 'Unverified',
    needs_refresh: 'Needs refresh',
}

const STATUS_STYLES: Record<ContentStatus, string> = {
    verified: 'border-green-500/40 text-green-600 dark:text-green-400',
    reviewed: 'border-emerald-500/40 text-emerald-600 dark:text-emerald-400',
    unverified: 'border-border text-muted-foreground',
    needs_refresh: 'border-amber-500/40 text-amber-600 dark:text-amber-400',
}

interface PromptDetailPaneProps {
    prompt: StaticPrompt | null
    onClose?: () => void
}

export function PromptDetailPane({ prompt, onClose }: PromptDetailPaneProps) {
    const { isFavorite, toggleFavorite } = useFavorites()

    // Compute related workflows for current prompt
    const relatedWorkflows = useMemo(() => {
        if (!prompt) return []
        return WORKFLOWS.filter(workflow => {
            // Check flat steps
            if (workflow.steps?.some(step => step.promptIds?.includes(prompt.id))) return true
            // Check phased steps
            if (workflow.phases?.some(phase =>
                phase.steps.some(step => step.promptIds?.includes(prompt.id))
            )) return true
            return false
        })
    }, [prompt])

    if (!prompt) {
        return (
            <aside className="hidden lg:flex lg:w-[50%] xl:w-[40%] 2xl:w-[800px] bg-background border-l border-border flex-col shrink-0 items-center justify-center text-muted-foreground">
                <p>Select a prompt to view details</p>
            </aside>
        )
    }

    return (
        <aside className={cn(
            "bg-background border-l border-border flex flex-col shrink-0 overflow-y-auto relative h-full",
            // Mobile full screen
            "fixed inset-0 z-50 w-full lg:static lg:w-[50%] xl:w-[40%] 2xl:w-[800px] lg:z-auto"
        )}>
            <div className="p-6 flex-1">
                {/* Close Button & Favorites Header */}
                <div className="flex items-center justify-between mb-6">
                    {/* Mobile Back Button */}
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="lg:hidden flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors -ml-2 px-2 py-1"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Library
                        </button>
                    )}

                    <button
                        onClick={() => toggleFavorite(prompt.id)}
                        className="group flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors ml-auto lg:ml-0"
                    >
                        <Star
                            className={cn(
                                "h-4 w-4 transition-all",
                                isFavorite(prompt.id) ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground group-hover:text-foreground"
                            )}
                        />
                        {isFavorite(prompt.id) ? "Saved" : "Save to Favorites"}
                    </button>

                    {/* Desktop Close Button */}
                    {onClose && (
                        <button
                            onClick={onClose}
                            aria-label="Close prompt details"
                            className="hidden lg:flex w-8 h-8 rounded-full bg-secondary hover:bg-secondary/80 text-muted-foreground items-center justify-center transition-colors ml-4"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                {/* Header */}
                <h2 className="text-2xl font-bold text-foreground mb-3 leading-tight">
                    {prompt.title}
                </h2>

                {/* Provenance / quality status */}
                <div className="flex flex-wrap items-center gap-2 mb-6 text-xs text-muted-foreground">
                    <Badge variant="outline" className={cn("font-medium", STATUS_STYLES[prompt.provenance.status])}>
                        {STATUS_LABELS[prompt.provenance.status]}
                    </Badge>
                    {prompt.provenance.reviewedAt && (
                        <span>Reviewed {prompt.provenance.reviewedAt}</span>
                    )}
                    <span aria-hidden="true">·</span>
                    <span>Source: {prompt.provenance.source}</span>
                </div>

                {/* Main Description */}
                <p className="text-muted-foreground text-sm leading-relaxed mb-8">
                    {prompt.description}
                </p>

                {/* Sandbox Logic Integrated Here */}
                <PromptSandbox prompt={prompt} />
            </div>

            {/* Footer */}
            <div className="p-6 mt-auto border-t border-border bg-background">
                <h4 className="text-sm font-semibold text-foreground mb-4">Related Workflows</h4>
                {relatedWorkflows.length > 0 ? (
                    <div className="space-y-2">
                        {relatedWorkflows.map(workflow => (
                            <Link
                                key={workflow.id}
                                to={`/workflows/${workflow.id}`}
                                className="group flex items-center justify-between p-3 rounded-lg bg-card border border-border hover:border-primary/50 hover:bg-muted/50 transition-all"
                            >
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium text-card-foreground truncate group-hover:text-primary transition-colors">
                                        {workflow.title}
                                    </div>
                                    <div className="text-xs text-muted-foreground truncate mt-0.5">
                                        {workflow.description}
                                    </div>
                                </div>
                                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0 ml-3" />
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="h-16 flex items-center justify-center text-xs text-muted-foreground border border-dashed border-border rounded">
                        No related workflows
                    </div>
                )}
            </div>
        </aside>
    )
}

function PromptSandbox({ prompt }: { prompt: StaticPrompt }) {
    const promptText = prompt.content?.instructions || ""

    const resolvedVariables = useResolvedVariables(promptText, prompt.variables)

    const defaultValues = useMemo(() => {
        const defaults: Record<string, string> = {}
        resolvedVariables.forEach(v => {
            if (v.defaultValue) defaults[v.name] = v.defaultValue
        })
        return defaults
    }, [resolvedVariables])

    const [variables, setVariables] = usePersistedVariables(`research-atlas-prompt-vars:${prompt.id}`, defaultValues)
    const [showCopied, setShowCopied] = useState(false)
    const [showMarkdownCopied, setShowMarkdownCopied] = useState(false)

    const handleVarChange = (key: string, value: string) => {
        setVariables(prev => ({ ...prev, [key]: value }))
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(buildCopyText(prompt.content, variables))
        setShowCopied(true)
        setTimeout(() => setShowCopied(false), 3000)
    }

    const copyAsMarkdown = () => {
        const markdown = buildPromptMarkdown({
            title: prompt.title,
            description: prompt.description,
            content: prompt.content,
            variables: resolvedVariables,
            values: variables,
        })
        navigator.clipboard.writeText(markdown)
        setShowMarkdownCopied(true)
        setTimeout(() => setShowMarkdownCopied(false), 3000)
    }

    return (
        <div className="space-y-8">
            {/* Goal Section (New) */}
            {(prompt.content?.goal || prompt.content?.context) && (
                <div className="space-y-4">
                    {prompt.content?.goal && (
                        <div className="rounded-lg bg-card border border-border p-4">
                            <label className="block text-sm font-semibold text-foreground mb-2">Goal</label>
                            <div className="text-sm text-muted-foreground leading-relaxed">
                                <span className="font-semibold text-primary">Objective: </span>
                                {prompt.content.goal}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Variables Section */}
            {resolvedVariables.length > 0 && (
                <div className="rounded-xl border border-border bg-secondary/20 p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <Info className="h-4 w-4 text-primary" />
                        <h3 className="text-foreground font-medium text-sm">Variables</h3>
                    </div>
                    <div className="space-y-4">
                        {resolvedVariables.map(v => (
                            <div key={v.name}>
                                <label className="block text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1">
                                    {prettifyVariableName(v.name)}
                                    {v.required && <span className="text-red-500 ml-0.5">*</span>}
                                </label>
                                {v.description && (
                                    <p className="text-xs text-muted-foreground mb-2">{v.description}</p>
                                )}
                                {v.type === 'multiline' ? (
                                    <Textarea
                                        value={variables[v.name] || ''}
                                        onChange={(e) => handleVarChange(v.name, e.target.value)}
                                        className="bg-background font-mono text-sm min-h-[100px]"
                                        placeholder={`Enter ${prettifyVariableName(v.name).toLowerCase()}...`}
                                    />
                                ) : (
                                    <input
                                        value={variables[v.name] || ''}
                                        onChange={(e) => handleVarChange(v.name, e.target.value)}
                                        className="w-full border border-input rounded-lg py-3 px-4 text-sm text-foreground placeholder-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary bg-background transition-all font-mono"
                                        placeholder={`Enter ${prettifyVariableName(v.name).toLowerCase()}...`}
                                        type="text"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Prompt Preview (New) */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-foreground">Prompt Preview</label>
                </div>
                <div className="relative rounded-xl border border-border bg-card p-5 text-sm font-mono leading-relaxed whitespace-pre-wrap text-card-foreground shadow-inner">
                    {promptText.split(/(\{\{[^}]+\}\})/).map((part, i) => {
                        if (part.startsWith('{{') && part.endsWith('}}')) {
                            const key = part.slice(2, -2)
                            const value = variables[key]
                            return value ? (
                                <span key={i} className="text-primary font-bold">
                                    {value}
                                </span>
                            ) : (
                                <span key={i} className="text-primary/70">{part}</span>
                            )
                        }
                        return <span key={i}>{part}</span>
                    })}
                    {(prompt.content?.constraints || prompt.content?.outputRequirements) && (
                        <div className="mt-4 border-t border-border pt-3 font-sans text-xs text-muted-foreground space-y-1">
                            {prompt.content.constraints && <div>Constraints: {prompt.content.constraints}</div>}
                            {prompt.content.outputRequirements && <div>Output requirements: {prompt.content.outputRequirements}</div>}
                        </div>
                    )}
                </div>
            </div>

            {/* Main Action Buttons */}
            <div className="flex flex-col items-center gap-4 mb-4">
                <div className="flex w-full gap-3">
                    <button
                        onClick={copyToClipboard}
                        className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20 active:scale-[0.98]"
                    >
                        <Clipboard className="h-4 w-4" />
                        Copy to Clipboard
                    </button>
                    <button
                        onClick={copyAsMarkdown}
                        className="flex-1 bg-secondary hover:bg-secondary/80 text-secondary-foreground font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                    >
                        <FileDown className="h-4 w-4" />
                        Copy as Markdown
                    </button>
                </div>

                {/* Success Badges */}
                <AnimatePresence>
                    {showCopied && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="bg-green-600 text-white px-3 py-1 rounded-full text-sm inline-flex items-center gap-1.5 font-medium shadow-md"
                        >
                            <Check className="h-3 w-3" />
                            <span>Copied!</span>
                        </motion.div>
                    )}
                    {showMarkdownCopied && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="bg-green-600 text-white px-3 py-1 rounded-full text-sm inline-flex items-center gap-1.5 font-medium shadow-md"
                        >
                            <Check className="h-3 w-3" />
                            <span>Markdown copied!</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}

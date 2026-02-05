import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { StaticPrompt } from '@/lib/prompts'
import { WORKFLOWS } from '@/data/workflows'

import { X, Check, Clipboard, Info, Star, ArrowRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useFavorites } from '@/lib/favorites'

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
            <aside className="hidden lg:flex w-[800px] bg-background border-l border-border flex-col shrink-0 items-center justify-center text-muted-foreground">
                <p>Select a prompt to view details</p>
            </aside>
        )
    }

    return (
        <aside className="w-full lg:w-[800px] bg-background border-l border-border flex flex-col shrink-0 overflow-y-auto relative h-full">
            <div className="p-6 flex-1">
                {/* Close Button & Favorites Header */}
                <div className="flex items-center justify-between mb-6">
                    <button
                        onClick={() => toggleFavorite(prompt.id)}
                        className="group flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <Star
                            className={cn(
                                "h-4 w-4 transition-all",
                                isFavorite(prompt.id) ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground group-hover:text-foreground"
                            )}
                        />
                        {isFavorite(prompt.id) ? "Saved" : "Save to Favorites"}
                    </button>

                    {onClose && (
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-full bg-secondary hover:bg-secondary/80 text-muted-foreground flex items-center justify-center transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>

                {/* Header */}
                <h2 className="text-2xl font-bold text-foreground mb-6 leading-tight">
                    {prompt.title}
                </h2>

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

    // Extract variables
    const variableMatches = useMemo(() => {
        const regex = /\{\{([^}]+)\}\}/g
        const matches = new Set<string>()
        let match
        while ((match = regex.exec(promptText)) !== null) {
            matches.add(match[1])
        }
        return Array.from(matches)
    }, [promptText])

    const [variables, setVariables] = useState<Record<string, string>>({})
    const [showCopied, setShowCopied] = useState(false)

    const handleVarChange = (key: string, value: string) => {
        setVariables(prev => ({ ...prev, [key]: value }))
    }

    const filledPrompt = useMemo(() => {
        let text = promptText
        Object.entries(variables).forEach(([key, value]) => {
            if (value) text = text.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value)
        })
        return text
    }, [promptText, variables])

    const copyToClipboard = () => {
        navigator.clipboard.writeText(filledPrompt)
        setShowCopied(true)
        setTimeout(() => setShowCopied(false), 3000)
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
            {variableMatches.length > 0 && (
                <div className="rounded-xl border border-border bg-secondary/20 p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <Info className="h-4 w-4 text-primary" />
                        <h3 className="text-foreground font-medium text-sm">Variables</h3>
                    </div>
                    <div className="space-y-4">
                        {variableMatches.map(v => (
                            <div key={v}>
                                <label className="block text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">
                                    {v.replace(/_/g, ' ')}
                                </label>
                                <input
                                    value={variables[v] || ''}
                                    onChange={(e) => handleVarChange(v, e.target.value)}
                                    className="w-full border border-input rounded-lg py-3 px-4 text-sm text-foreground placeholder-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary bg-background transition-all font-mono"
                                    placeholder={`Enter ${v}...`}
                                    type="text"
                                />
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
                </div>
            </div>

            {/* Main Action Button */}
            <div className="flex flex-col items-center gap-4 mb-4">
                <button
                    onClick={copyToClipboard}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20 active:scale-[0.98]"
                >
                    <Clipboard className="h-4 w-4" />
                    Copy to Clipboard
                </button>

                {/* Success Badge */}
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
                </AnimatePresence>
            </div>
        </div>
    )
}

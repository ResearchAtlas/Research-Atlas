import { useEffect, useMemo, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Copy, Check, Info, CheckCircle2 } from "lucide-react"
import { WORKFLOWS, Workflow, WorkflowStep } from "@/data/workflows"
import { PROMPTS } from "@/data/prompts"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const PROMPT_MAP = new Map(PROMPTS.map((p) => [p.id, p]))

function flattenSteps(workflow: Workflow): WorkflowStep[] {
    if (workflow.steps) return workflow.steps
    if (workflow.phases) return workflow.phases.flatMap(p => p.steps)
    return []
}

// Simple label component replacement
function Label({ children, className }: { children: React.ReactNode, className?: string }) {
    return <label className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)}>{children}</label>
}

// Simple ScrollArea replacement
function ScrollArea({ children, className }: { children: React.ReactNode, className?: string }) {
    return <div className={cn("overflow-auto", className)}>{children}</div>
}

export function WorkflowDetailPage() {
    const { workflowId } = useParams()
    const workflow = WORKFLOWS.find(w => w.id === workflowId)

    // State
    const [activeStepId, setActiveStepId] = useState<string>("")
    const [variables, setVariables] = useState<Record<string, string>>({})
    const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set())

    const flatSteps = useMemo(() => workflow ? flattenSteps(workflow) : [], [workflow])

    // Initialize active step
    useEffect(() => {
        if (flatSteps.length > 0 && !activeStepId) {
            setActiveStepId(flatSteps[0].id)
        }
    }, [flatSteps, activeStepId])

    if (!workflow) return <div className="container py-20">Workflow not found</div>

    const activeStep = flatSteps.find(s => s.id === activeStepId)
    const activeStepIndex = flatSteps.findIndex(s => s.id === activeStepId)

    const handleStepComplete = (stepId: string) => {
        const newCompleted = new Set(completedSteps)
        newCompleted.add(stepId)
        setCompletedSteps(newCompleted)

        // Auto-advance
        const currentIndex = flatSteps.findIndex(s => s.id === stepId)
        if (currentIndex < flatSteps.length - 1) {
            setActiveStepId(flatSteps[currentIndex + 1].id)
        }
    }

    return (
        <div className="flex h-[calc(100vh-4rem)] flex-col bg-background">
            {/* Header */}
            <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link to="/workflows">
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <h1 className="text-lg font-semibold">{workflow.title}</h1>
                            <Badge variant="secondary" className="text-xs">
                                {activeStepIndex + 1} / {flatSteps.length}
                            </Badge>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Visual Progress Bar (Optional context) */}

                {/* Split Pane */}
                <div className="container grid h-full grid-cols-1 gap-6 py-6 lg:grid-cols-12">
                    {/* Left Panel: Steps */}
                    <div className="lg:col-span-5 h-full overflow-hidden flex flex-col rounded-xl border bg-card/50">
                        <div className="p-4 border-b bg-muted/30">
                            <h2 className="font-semibold">Workflow Steps</h2>
                        </div>
                        <ScrollArea className="flex-1">
                            <div className="p-4 space-y-4">
                                {workflow.phases ? (
                                    workflow.phases.map(phase => (
                                        <div key={phase.id} className="space-y-2">
                                            <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground/70 px-2">
                                                {phase.title}
                                            </h3>
                                            <div className="space-y-2">
                                                {phase.steps.map(step => (
                                                    <StepCard
                                                        key={step.id}
                                                        step={step}
                                                        isActive={step.id === activeStepId}
                                                        isCompleted={completedSteps.has(step.id)}
                                                        onClick={() => setActiveStepId(step.id)}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="space-y-2">
                                        {workflow.steps?.map(step => (
                                            <StepCard
                                                key={step.id}
                                                step={step}
                                                isActive={step.id === activeStepId}
                                                isCompleted={completedSteps.has(step.id)}
                                                onClick={() => setActiveStepId(step.id)}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                    </div>

                    {/* Right Panel: Sandbox */}
                    <div className="lg:col-span-7 h-full overflow-hidden flex flex-col rounded-xl border bg-card/50">
                        {activeStep ? (
                            <PromptSandbox
                                key={activeStep.id} // Force reset on step change
                                step={activeStep}
                                onComplete={() => handleStepComplete(activeStep.id)}
                                isCompleted={completedSteps.has(activeStep.id)}
                                initialVariables={variables}
                                onVariablesChange={setVariables}
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-muted-foreground">
                                Select a step to view details
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

function StepCard({ step, isActive, isCompleted, onClick }: {
    step: WorkflowStep,
    isActive: boolean,
    isCompleted: boolean,
    onClick: () => void
}) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "w-full text-left relative flex items-start gap-3 rounded-lg border p-3 transition-all hover:bg-muted/50",
                isActive ? "bg-muted border-primary shadow-sm" : "bg-card",
                isCompleted && !isActive && "opacity-60"
            )}
        >
            <div className={cn(
                "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors",
                isActive ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/30",
                isCompleted ? "border-primary bg-primary text-primary-foreground" : ""
            )}>
                {isCompleted ? <Check className="h-3 w-3" /> : (isActive && <div className="h-1.5 w-1.5 rounded-full bg-current" />)}
            </div>
            <div>
                <div className="flex items-center gap-2">
                    <span className={cn("text-sm font-medium", isActive && "text-primary")}>
                        {step.title}
                    </span>
                    {isActive && <Badge variant="outline" className="text-[10px] h-5 px-1.5">Active</Badge>}
                    {isCompleted && !isActive && <span className="text-[10px] text-green-500 font-medium">(Completed)</span>}
                </div>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                    {step.summary}
                </p>
            </div>
        </button>
    )
}

function PromptSandbox({
    step,
    onComplete,
    isCompleted,
    initialVariables,
    onVariablesChange
}: {
    step: WorkflowStep
    onComplete: () => void
    isCompleted: boolean
    initialVariables: Record<string, string>
    onVariablesChange: (vars: Record<string, string>) => void
}) {
    const promptData = step.promptIds?.[0] ? PROMPT_MAP.get(step.promptIds[0]) : null

    // Extract variables from prompt content (assuming {{var}} format)
    const promptText = promptData?.content.instructions || ""
    const variableMatches = useMemo(() => {
        const regex = /\{\{([^}]+)\}\}/g
        const matches = new Set<string>()
        let match
        while ((match = regex.exec(promptText)) !== null) {
            matches.add(match[1])
        }
        return Array.from(matches)
    }, [promptText])

    const [localVars, setLocalVars] = useState<Record<string, string>>(initialVariables)

    const handleVarChange = (key: string, value: string) => {
        const newVars = { ...localVars, [key]: value }
        setLocalVars(newVars)
        onVariablesChange(newVars)
    }

    const filledPrompt = useMemo(() => {
        let text = promptText
        Object.entries(localVars).forEach(([key, value]) => {
            if (value) text = text.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value)
        })
        return text
    }, [promptText, localVars])

    const [showCopied, setShowCopied] = useState(false)

    const copyToClipboard = () => {
        navigator.clipboard.writeText(filledPrompt)
        setShowCopied(true)
        setTimeout(() => setShowCopied(false), 3000)
    }

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b bg-muted/30 flex items-center justify-between">
                <div>
                    <h2 className="font-semibold text-lg flex items-center gap-2">
                        {step.title}
                        {isCompleted && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                    </h2>
                    <p className="text-sm text-muted-foreground">Prompt Sandbox</p>
                </div>
                {!isCompleted && (
                    <Button onClick={onComplete} size="sm">
                        Mark Step Complete
                    </Button>
                )}
            </div>

            <ScrollArea className="flex-1">
                <div className="p-6 space-y-8">
                    {/* Goal Section */}
                    <div className="space-y-2">
                        <Label className="text-base">Goal</Label>
                        <p className="text-muted-foreground">{step.summary}</p>
                        {promptData && (
                            <div className="mt-2 rounded-md bg-muted/50 p-3 text-sm">
                                <span className="font-semibold">Objective: </span>
                                {promptData.content.goal}
                            </div>
                        )}
                    </div>

                    {/* Variables Section */}
                    {variableMatches.length > 0 && (
                        <div className="space-y-4 rounded-xl border bg-muted/10 p-4">
                            <div className="flex items-center gap-2">
                                <Info className="h-4 w-4 text-primary" />
                                <h3 className="font-medium">Variables</h3>
                            </div>
                            <div className="grid gap-4">
                                {variableMatches.map(v => (
                                    <div key={v} className="space-y-1.5">
                                        <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                                            {v.replace(/_/g, ' ')}
                                        </Label>
                                        <Textarea
                                            placeholder={`Enter ${v}...`}
                                            value={localVars[v] || ''}
                                            onChange={(e) => handleVarChange(v, e.target.value)}
                                            className="resize-none bg-background min-h-[80px]"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Prompt Preview */}
                    {promptData && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label className="text-base">Prompt</Label>
                                <div className="flex items-center gap-2">
                                    <AnimatePresence>
                                        {showCopied && (
                                            <motion.span
                                                initial={{ opacity: 0, x: 10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: 10 }}
                                                className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded"
                                            >
                                                Top-notch! Copied.
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                    <Button variant="outline" size="sm" onClick={copyToClipboard} className="gap-2">
                                        <Copy className="h-3.5 w-3.5" />
                                        Copy to Clipboard
                                    </Button>
                                </div>
                            </div>
                            <div className="relative rounded-xl border bg-muted/30 p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap">
                                {promptText.split(/(\{\{[^}]+\}\})/).map((part, i) => {
                                    if (part.startsWith('{{') && part.endsWith('}}')) {
                                        const key = part.slice(2, -2)
                                        const value = localVars[key]
                                        return value ? (
                                            <span key={i} className="bg-primary/20 text-primary px-1 rounded mx-0.5 font-bold">
                                                {value}
                                            </span>
                                        ) : (
                                            <span key={i} className="text-primary font-bold">
                                                {part}
                                            </span>
                                        )
                                    }
                                    return <span key={i}>{part}</span>
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
    )
}

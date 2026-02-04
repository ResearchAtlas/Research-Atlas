import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Copy, Download, ExternalLink, AlertTriangle, Check, Save, Plus, Trash2 } from 'lucide-react'
import { useWorkbenchStore, type PromptVariable, type ResearchStage } from '@/store/workbench'
import { LocalStore } from '@/lib/local-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export function WorkbenchPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { draft, setDraft, setContent, setVariable, addVariable, removeVariable, resetDraft } = useWorkbenchStore()
    const [copied, setCopied] = useState(false)
    const [saving, setSaving] = useState(false)
    const [saveError, setSaveError] = useState<string | null>(null)
    const [saveSuccess, setSaveSuccess] = useState(false)
    const [newVarName, setNewVarName] = useState('')

    // Load draft if ID is present
    useEffect(() => {
        if (id) {
            const loadedDraft = LocalStore.getById(id)
            if (loadedDraft) {
                setDraft(loadedDraft)
            } else {
                // If ID not found, maybe redirect or just show empty?
                // For now, let's just stay on empty draft but maybe warn?
                console.warn('Draft not found on load', id)
            }
        }
    }, [id, setDraft])

    // Render the prompt with variables filled
    const renderPrompt = () => {
        let text = `**Goal:** ${draft.content.goal || '[Define your goal]'}

**Context:** ${draft.content.context || '[Provide context]'}

**Instructions:**
${draft.content.instructions || '[Add instructions]'}

**Constraints:**
${draft.content.constraints || '[Add constraints]'}

**Output Requirements:**
${draft.content.outputRequirements || '[Define output format]'}

**Guardrails:**
${draft.guardrails.map(g => `- ${g}`).join('\n')}
`

        // Replace variables
        draft.variables.forEach((v) => {
            const value = draft.variableValues[v.name] || `[${v.name}]`
            text = text.replace(new RegExp(`{{${v.name}}}`, 'g'), value)
        })

        return text
    }

    const renderedPrompt = renderPrompt()

    const handleCopy = async () => {
        await navigator.clipboard.writeText(renderedPrompt)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleSave = async () => {
        setSaving(true)
        setSaveError(null)
        setSaveSuccess(false)

        try {
            const savedDraft = LocalStore.save(draft)
            setDraft(savedDraft) // Update store with populated ID/timestamp
            setSaveSuccess(true)

            // If it was a new draft, navigate to the specific URL so refreshing works
            if (!draft.id) {
                navigate(`/workbench/${savedDraft.id}`, { replace: true })
            }

            setTimeout(() => setSaveSuccess(false), 3000)
        } catch (err) {
            console.error('Save error:', err)
            setSaveError(err instanceof Error ? err.message : 'Failed to save')
        } finally {
            setSaving(false)
        }
    }

    const handleAddVariable = () => {
        if (!newVarName.trim()) return
        const variable: PromptVariable = {
            name: newVarName.trim().replace(/\s+/g, '_'),
            type: 'text',
            required: false,
        }
        addVariable(variable)
        setNewVarName('')
    }

    const handleNewPrompt = () => {
        resetDraft()
        setSaveSuccess(false)
        setSaveError(null)
        navigate('/workbench')
    }

    return (
        <div className="container mx-auto py-8">
            <div>
                <div className="flex flex-col gap-6 lg:flex-row">
                    {/* Editor Panel */}
                    <div className="flex-1 space-y-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight text-balance">Prompt Workbench</h1>
                                <p className="mt-1 text-muted-foreground">
                                    Build, edit, and preview your prompts before copying.
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={handleNewPrompt}>
                                    New
                                </Button>
                                <Button onClick={handleSave} disabled={saving}>
                                    <Save className="mr-2 h-4 w-4" aria-hidden="true" />
                                    {saving ? 'Saving…' : 'Save Draft'}
                                </Button>
                            </div>
                        </div>

                        {saveError && (
                            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                                {saveError}
                            </div>
                        )}

                        {saveSuccess && (
                            <div className="rounded-md bg-green-100 dark:bg-green-900/30 p-3 text-sm text-green-700 dark:text-green-400 flex items-center gap-2">
                                <Check className="h-4 w-4" aria-hidden="true" />
                                Local draft saved successfully!
                            </div>
                        )}

                        {/* Title */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Prompt Title</label>
                            <Input
                                type="text"
                                value={draft.title}
                                onChange={(e) => setDraft({ title: e.target.value })}
                                placeholder="e.g., Literature Review Assistant"
                            />
                        </div>

                        {/* Stage & Description */}
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Research Stage</label>
                                    <Select
                                        value={draft.stage || ''}
                                        onValueChange={(value) => setDraft({ stage: value ? (value as ResearchStage) : null })}
                                    >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select stage…" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="design">Design</SelectItem>
                                        <SelectItem value="measures">Measures</SelectItem>
                                        <SelectItem value="data_qc">Data QC</SelectItem>
                                        <SelectItem value="analysis">Analysis</SelectItem>
                                        <SelectItem value="interpretation">Interpretation</SelectItem>
                                        <SelectItem value="writing">Writing</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Description</label>
                                <Input
                                    type="text"
                                    value={draft.description}
                                    onChange={(e) => setDraft({ description: e.target.value })}
                                    placeholder="Brief description…"
                                />
                            </div>
                        </div>

                        {/* Content Sections */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Prompt Content</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Goal</label>
                                    <Textarea
                                        value={draft.content.goal}
                                        onChange={(e) => setContent({ goal: e.target.value })}
                                        placeholder="What should the AI accomplish?"
                                        rows={2}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Context</label>
                                    <Textarea
                                        value={draft.content.context}
                                        onChange={(e) => setContent({ context: e.target.value })}
                                        placeholder="Background information the AI needs…"
                                        rows={3}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Instructions</label>
                                    <Textarea
                                        value={draft.content.instructions}
                                        onChange={(e) => setContent({ instructions: e.target.value })}
                                        placeholder="Step-by-step instructions…"
                                        rows={4}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Constraints</label>
                                    <Textarea
                                        value={draft.content.constraints}
                                        onChange={(e) => setContent({ constraints: e.target.value })}
                                        placeholder="Limitations and boundaries…"
                                        rows={2}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Output Requirements</label>
                                    <Textarea
                                        value={draft.content.outputRequirements}
                                        onChange={(e) => setContent({ outputRequirements: e.target.value })}
                                        placeholder="How should the response be formatted?"
                                        rows={2}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Variables Section */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Variables</CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    Define placeholders using {'{{variable_name}}'} syntax.
                                </p>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {draft.variables.map((v) => (
                                    <div key={v.name} className="flex items-center gap-2">
                                        <Badge variant="secondary" className="font-mono">{`{{${v.name}}}`}</Badge>
                                        <Input
                                            type="text"
                                            value={draft.variableValues[v.name] || ''}
                                            onChange={(e) => setVariable(v.name, e.target.value)}
                                            placeholder={`Enter ${v.name}…`}
                                            className="flex-1"
                                        />
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            aria-label={`Remove ${v.name} variable`}
                                            onClick={() => removeVariable(v.name)}
                                        >
                                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                                        </Button>
                                    </div>
                                ))}
                                <div className="flex items-center gap-2">
                                    <Input
                                        type="text"
                                        value={newVarName}
                                        onChange={(e) => setNewVarName(e.target.value)}
                                        placeholder="New variable name…"
                                        className="flex-1"
                                        onKeyDown={(e) => e.key === 'Enter' && handleAddVariable()}
                                    />
                                    <Button variant="outline" onClick={handleAddVariable}>
                                        <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
                                        Add
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Safety Warning */}
                        <div className="flex items-start gap-3 rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900/50 dark:bg-yellow-900/20">
                            <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500" aria-hidden="true" />
                            <div className="text-sm">
                                <p className="font-medium text-yellow-800 dark:text-yellow-200">Privacy Reminder</p>
                                <p className="mt-1 text-yellow-700 dark:text-yellow-300">
                                    Do not paste sensitive or identifiable data directly into AI tools. De-identify first.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Preview Panel */}
                    <div className="w-full lg:w-[480px] space-y-4">
                        <div className="sticky top-20">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-base">Preview</CardTitle>
                                    <div className="flex gap-2">
                                        <Button onClick={handleCopy} size="sm">
                                            {copied ? (
                                                <>
                                                    <Check className="mr-2 h-4 w-4" aria-hidden="true" />
                                                    Copied!
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="mr-2 h-4 w-4" aria-hidden="true" />
                                                    Copy
                                                </>
                                            )}
                                        </Button>
                                        <Button variant="outline" size="sm" aria-label="Download prompt">
                                            <Download className="h-4 w-4" aria-hidden="true" />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="max-h-[500px] overflow-y-auto rounded-lg bg-muted/50 p-4">
                                        <pre className="whitespace-pre-wrap text-sm font-mono leading-relaxed">
                                            {renderedPrompt}
                                        </pre>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Open in AI Links */}
                            <Card className="mt-4">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm font-medium text-muted-foreground">Open in:</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex flex-wrap gap-2">
                                        {aiTools.map((tool) => (
                                            <Button key={tool.name} variant="outline" size="sm" asChild>
                                                <a href={tool.url} target="_blank" rel="noopener noreferrer">
                                                    {tool.name}
                                                    <ExternalLink className="ml-2 h-3 w-3" aria-hidden="true" />
                                                </a>
                                            </Button>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const aiTools = [
    { name: 'ChatGPT', url: 'https://chat.openai.com' },
    { name: 'Claude', url: 'https://claude.ai' },
    { name: 'Gemini', url: 'https://gemini.google.com' },
    { name: 'Perplexity', url: 'https://perplexity.ai' },
]

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ResearchStage = 'design' | 'measures' | 'data_qc' | 'analysis' | 'interpretation' | 'writing'

export interface PromptVariable {
    name: string
    type: 'text' | 'number' | 'select' | 'multiline'
    required: boolean
    description?: string
    defaultValue?: string
    options?: string[] // for 'select' type
}

export interface PromptContent {
    goal: string
    context: string
    constraints: string
    instructions: string
    outputRequirements: string
}

export interface WorkbenchDraft {
    id?: string // undefined = new prompt
    title: string
    description: string
    stage: ResearchStage | null
    tags: string[]
    content: PromptContent
    variables: PromptVariable[]
    outputFormat: 'narrative' | 'outline' | 'table' | 'json'
    guardrails: string[]
    variableValues: Record<string, string> // for rendering
}

interface WorkbenchState {
    draft: WorkbenchDraft
    isDirty: boolean

    // Actions
    setDraft: (draft: Partial<WorkbenchDraft>) => void
    setContent: (content: Partial<PromptContent>) => void
    setVariable: (name: string, value: string) => void
    addVariable: (variable: PromptVariable) => void
    removeVariable: (name: string) => void
    resetDraft: () => void
    loadFromPrompt: (prompt: WorkbenchDraft) => void
}

const defaultDraft: WorkbenchDraft = {
    title: '',
    description: '',
    stage: null,
    tags: [],
    content: {
        goal: '',
        context: '',
        constraints: '',
        instructions: '',
        outputRequirements: '',
    },
    variables: [],
    outputFormat: 'outline',
    guardrails: [
        'Do not fabricate sources or data',
        'Indicate uncertainty clearly',
        'Use academic language appropriate for publication',
    ],
    variableValues: {},
}

export const useWorkbenchStore = create<WorkbenchState>()(
    persist(
        (set) => ({
            draft: { ...defaultDraft },
            isDirty: false,

            setDraft: (partial) =>
                set((state) => ({
                    draft: { ...state.draft, ...partial },
                    isDirty: true,
                })),

            setContent: (partial) =>
                set((state) => ({
                    draft: {
                        ...state.draft,
                        content: { ...state.draft.content, ...partial },
                    },
                    isDirty: true,
                })),

            setVariable: (name, value) =>
                set((state) => ({
                    draft: {
                        ...state.draft,
                        variableValues: { ...state.draft.variableValues, [name]: value },
                    },
                    isDirty: true,
                })),

            addVariable: (variable) =>
                set((state) => ({
                    draft: {
                        ...state.draft,
                        variables: [...state.draft.variables, variable],
                    },
                    isDirty: true,
                })),

            removeVariable: (name) =>
                set((state) => ({
                    draft: {
                        ...state.draft,
                        variables: state.draft.variables.filter((v) => v.name !== name),
                        variableValues: Object.fromEntries(
                            Object.entries(state.draft.variableValues).filter(([k]) => k !== name)
                        ),
                    },
                    isDirty: true,
                })),

            resetDraft: () =>
                set({
                    draft: { ...defaultDraft },
                    isDirty: false,
                }),

            loadFromPrompt: (prompt) =>
                set({
                    draft: prompt,
                    isDirty: false,
                }),
        }),
        {
            name: 'workbench-draft',
            version: 1,
        }
    )
)

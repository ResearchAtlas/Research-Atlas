import { useEffect, useState } from 'react'

export interface WorkflowState {
    completedSteps: string[]
    variables: Record<string, string>
    activeStepId?: string
}

const EMPTY_STATE: WorkflowState = { completedSteps: [], variables: {} }

const storageKey = (workflowId: string) => `research-atlas-workflow:${workflowId}`

/**
 * localStorage-backed workflow progress (completed steps, variable values,
 * active step). Guards all storage access for SSR, following the
 * hydrate-then-persist pattern used by src/lib/favorites.tsx.
 */
export function usePersistedWorkflowState(workflowId: string) {
    const [state, setState] = useState<WorkflowState>(EMPTY_STATE)
    const [isHydrated, setIsHydrated] = useState(false)

    useEffect(() => {
        setIsHydrated(false)
        if (typeof window === 'undefined') return
        try {
            const stored = window.localStorage.getItem(storageKey(workflowId))
            setState(stored ? JSON.parse(stored) : EMPTY_STATE)
        } catch {
            setState(EMPTY_STATE)
        }
        setIsHydrated(true)
    }, [workflowId])

    useEffect(() => {
        if (!isHydrated || typeof window === 'undefined') return
        window.localStorage.setItem(storageKey(workflowId), JSON.stringify(state))
    }, [state, isHydrated, workflowId])

    const resetProgress = () => {
        setState(EMPTY_STATE)
        if (typeof window !== 'undefined') {
            window.localStorage.removeItem(storageKey(workflowId))
        }
    }

    return { state, setState, resetProgress }
}

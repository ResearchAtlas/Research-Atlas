import { useEffect, useMemo, useState } from 'react'
import type { PromptVariable } from '@/data/prompts'

const PLACEHOLDER_REGEX = /\{\{([^}]+)\}\}/g

/** Extract `{{placeholder}}` names from prompt text, in first-seen order, deduped. */
export function extractPlaceholders(text: string): string[] {
    const seen = new Set<string>()
    let match: RegExpExecArray | null
    const regex = new RegExp(PLACEHOLDER_REGEX)
    while ((match = regex.exec(text)) !== null) {
        seen.add(match[1])
    }
    return Array.from(seen)
}

/**
 * Merge declared prompt.variables (metadata, order preserved) with any
 * regex-extracted {{placeholders}} from the instructions text that aren't
 * already declared. Declared metadata always wins for a given name.
 */
export function useResolvedVariables(promptText: string, declared: PromptVariable[] | undefined): PromptVariable[] {
    return useMemo(() => {
        const declaredList = declared ?? []
        const declaredNames = new Set(declaredList.map(v => v.name))
        const extra = extractPlaceholders(promptText)
            .filter(name => !declaredNames.has(name))
            .map((name): PromptVariable => ({ name, type: 'text', required: false }))
        return [...declaredList, ...extra]
    }, [promptText, declared])
}

/** Prettify a variable name for display, e.g. "research_topic" -> "Research topic". */
export function prettifyVariableName(name: string): string {
    const spaced = name.replace(/_/g, ' ').trim()
    return spaced.charAt(0).toUpperCase() + spaced.slice(1)
}

/** Fill {{placeholders}} in text with the given variable values. */
export function fillTemplate(text: string, values: Record<string, string>): string {
    let result = text
    for (const [key, value] of Object.entries(values)) {
        if (value) result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value)
    }
    return result
}

/**
 * localStorage-backed variable values for a prompt sandbox, keyed per prompt.
 * Guards all storage access for SSR (matches src/lib/favorites.tsx pattern).
 */
export function usePersistedVariables(storageKey: string, initialValues: Record<string, string> = {}) {
    const [values, setValues] = useState<Record<string, string>>({})
    const [isHydrated, setIsHydrated] = useState(false)

    useEffect(() => {
        setIsHydrated(false)
        if (typeof window === 'undefined') return
        try {
            const stored = window.localStorage.getItem(storageKey)
            setValues(stored ? JSON.parse(stored) : initialValues)
        } catch {
            setValues(initialValues)
        }
        setIsHydrated(true)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [storageKey])

    useEffect(() => {
        if (!isHydrated || typeof window === 'undefined') return
        window.localStorage.setItem(storageKey, JSON.stringify(values))
    }, [values, isHydrated, storageKey])

    return [values, setValues] as const
}

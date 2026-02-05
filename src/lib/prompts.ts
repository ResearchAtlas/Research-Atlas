import { PROMPTS, StaticPrompt } from '@/data/prompts'


export type { StaticPrompt }

// Fetch public prompts for library (Static)
export async function fetchPublicPrompts(): Promise<StaticPrompt[]> {
    // Simulate network delay for better UX feel (optional)
    await new Promise((resolve) => setTimeout(resolve, 300))
    return PROMPTS
}

// Fetch single prompt
export async function fetchPromptById(promptId: string): Promise<StaticPrompt | undefined> {
    await new Promise((resolve) => setTimeout(resolve, 200))
    return PROMPTS.find((p) => p.id === promptId)
}

// Save draft to LocalStorage (Pseudo-backend for Workbench)
// In a real static app, 'saving' might just be keeping it in the store or exporting.
// But we can simulate a "My Drafts" features using localStorage beyond the zustand store if needed.
// For now, the Workbench store handles the current draft.
// We can add a helper to export to JSON/Markdown here.

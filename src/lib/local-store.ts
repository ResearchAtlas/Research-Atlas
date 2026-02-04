import { WorkbenchDraft } from '@/store/workbench'

const STORAGE_KEY = 'prompt-hub-local-drafts'

export interface LocalDraft extends WorkbenchDraft {
    id: string
    updatedAt: string
}

export const LocalStore = {
    getAll: (): LocalDraft[] => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY)
            return raw ? JSON.parse(raw) : []
        } catch (e) {
            console.error('Failed to load drafts', e)
            return []
        }
    },

    save: (draft: WorkbenchDraft): LocalDraft => {
        const drafts = LocalStore.getAll()
        const id = draft.id || crypto.randomUUID()
        const newDraft: LocalDraft = { ...draft, id, updatedAt: new Date().toISOString() }

        const existingIndex = drafts.findIndex((d) => d.id === id)
        if (existingIndex >= 0) {
            drafts[existingIndex] = newDraft
        } else {
            drafts.unshift(newDraft)
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts))
        return newDraft
    },

    delete: (id: string) => {
        const drafts = LocalStore.getAll().filter((d) => d.id !== id)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(drafts))
    },

    getById: (id: string): LocalDraft | undefined => {
        return LocalStore.getAll().find((d) => d.id === id)
    }
}

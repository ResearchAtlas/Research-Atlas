import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchPublicPrompts } from '@/lib/prompts'
import { useFavorites } from '@/lib/favorites'
import { LibrarySidebar } from './LibrarySidebar'
import { PromptList } from './PromptList'
import { PromptDetailPane } from './PromptDetailPane'

export function LibraryPage() {
    const [searchParams, setSearchParams] = useSearchParams()
    const { favorites } = useFavorites()

    // URL Params
    const promptId = searchParams.get('prompt')
    const searchQuery = searchParams.get('q') || ''
    const stages = searchParams.getAll('stage')
    const types = searchParams.getAll('type')

    // Data Fetching
    const { data: prompts = [], isLoading } = useQuery({
        queryKey: ['publicPrompts'],
        queryFn: fetchPublicPrompts,
    })

    // Local State
    const [search, setSearch] = useState(searchQuery)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    // Derived State: Counts
    const counts = useMemo(() => {
        const stageCounts: Record<string, number> = {}
        const typeCounts: Record<string, number> = {}

        prompts.forEach(p => {
            p.stages.forEach(s => {
                stageCounts[s] = (stageCounts[s] || 0) + 1
            })
            p.researchTypes.forEach(t => {
                typeCounts[t] = (typeCounts[t] || 0) + 1
            })
        })

        return { stages: stageCounts, types: typeCounts }
    }, [prompts])

    // Filtering
    const filteredPrompts = useMemo(() => {
        const queryLower = search.toLowerCase()
        return prompts.filter(p => {
            const matchesSearch = !search ||
                p.title.toLowerCase().includes(queryLower) ||
                p.description?.toLowerCase().includes(queryLower)

            const matchesStage = stages.length === 0 || stages.some(s => p.stages.includes(s as any))
            const matchesType = types.length === 0 || types.some(t => p.researchTypes.includes(t as any))

            return matchesSearch && matchesStage && matchesType
        })
    }, [prompts, search, stages, types])

    const selectedPrompt = useMemo(() =>
        prompts.find(p => p.id === promptId) || null
        , [prompts, promptId])

    // Handlers
    const updateParams = (updates: Record<string, string | string[] | null>) => {
        const newParams = new URLSearchParams(searchParams)

        Object.entries(updates).forEach(([key, value]) => {
            if (value === null) {
                newParams.delete(key)
            } else if (Array.isArray(value)) {
                newParams.delete(key)
                value.forEach(v => newParams.append(key, v))
            } else {
                newParams.set(key, value)
            }
        })

        setSearchParams(newParams, { replace: true })
    }

    const handleSelectPrompt = (id: string | null) => {
        updateParams({ prompt: id })
    }

    const handleToggleFilter = (key: 'stage' | 'type', value: string) => {
        const current = key === 'stage' ? stages : types
        const isSelected = current.includes(value)
        const next = isSelected
            ? current.filter(v => v !== value)
            : [...current, value]

        updateParams({ [key]: next })
    }

    const handleClearFilters = () => {
        const newParams = new URLSearchParams(searchParams)
        newParams.delete('stage')
        newParams.delete('type')
        setSearchParams(newParams)
    }

    return (
        <div className="flex h-[calc(100vh-4rem)] w-full overflow-hidden bg-background relative">
            <LibrarySidebar
                selectedStages={stages}
                selectedTypes={types}
                onToggleStage={(id) => handleToggleFilter('stage', id)}
                onToggleType={(id) => handleToggleFilter('type', id)}
                onClearAll={handleClearFilters}
                counts={counts}
                favoriteIds={favorites}
                prompts={prompts}
                onSelectPrompt={(id) => handleSelectPrompt(id)}
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <PromptList
                prompts={filteredPrompts}
                selectedPromptId={promptId}
                onSelectPrompt={(id) => handleSelectPrompt(id)}
                search={search}
                onSearchChange={(qs) => {
                    setSearch(qs)
                    updateParams({ q: qs || null })
                }}
                loading={isLoading}
                onMenuClick={() => setIsSidebarOpen(true)}
            />

            <PromptDetailPane
                prompt={selectedPrompt}
                onClose={() => handleSelectPrompt(null)}
            />
        </div>
    )
}

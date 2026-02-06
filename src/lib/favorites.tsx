import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

const FAVORITES_KEY = 'research-atlas-favorite-prompts'

interface FavoritesContextType {
    favorites: Set<string>
    toggleFavorite: (promptId: string) => void
    isFavorite: (promptId: string) => boolean
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export function FavoritesProvider({ children }: { children: ReactNode }) {
    const [favorites, setFavorites] = useState<Set<string>>(() => new Set()) // lazy init, always empty, matches SSR
    const [isHydrated, setIsHydrated] = useState(false)

    // Phase 1: read from storage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(FAVORITES_KEY)
            if (stored) {
                setFavorites(new Set(JSON.parse(stored)))
            }
        } catch { /* ignore corrupt data */ }
        setIsHydrated(true)
    }, [])

    // Phase 2: persist -- only after hydration read is complete
    useEffect(() => {
        if (!isHydrated) return
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(favorites)))
    }, [favorites, isHydrated])

    const toggleFavorite = (promptId: string) => {
        setFavorites(prev => {
            const next = new Set(prev)
            if (next.has(promptId)) {
                next.delete(promptId)
            } else {
                next.add(promptId)
            }
            return next
        })
    }

    const isFavorite = (promptId: string) => favorites.has(promptId)

    return (
        <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
            {children}
        </FavoritesContext.Provider>
    )
}

export function useFavorites() {
    const context = useContext(FavoritesContext)
    if (context === undefined) {
        throw new Error('useFavorites must be used within a FavoritesProvider')
    }
    return context
}

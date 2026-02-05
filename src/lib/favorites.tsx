import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

const FAVORITES_KEY = 'research-atlas-favorite-prompts'

interface FavoritesContextType {
    favorites: Set<string>
    toggleFavorite: (promptId: string) => void
    isFavorite: (promptId: string) => boolean
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export function FavoritesProvider({ children }: { children: ReactNode }) {
    const [favorites, setFavorites] = useState<Set<string>>(() => {
        if (typeof window === 'undefined') return new Set()
        try {
            const stored = localStorage.getItem(FAVORITES_KEY)
            return stored ? new Set(JSON.parse(stored)) : new Set()
        } catch {
            return new Set()
        }
    })

    useEffect(() => {
        const array = Array.from(favorites)
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(array))
    }, [favorites])

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

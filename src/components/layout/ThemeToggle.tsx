import { useEffect, useState } from "react"
import { Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

const storageKey = "research-atlas-theme"

type Theme = "dark" | "light"

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark") // always matches SSR
  const [isHydrated, setIsHydrated] = useState(false)

  // Phase 1: read stored preference after mount
  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey)
    if (stored === "light" || stored === "dark") {
      setTheme(stored)
    }
    setIsHydrated(true)
  }, [])

  // Phase 2: sync DOM + persist -- only after hydration
  useEffect(() => {
    if (!isHydrated) return
    const root = document.documentElement
    root.classList.toggle("dark", theme === "dark")
    window.localStorage.setItem(storageKey, theme)
  }, [theme, isHydrated])

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-secondary hover:text-foreground data-[state=open]:bg-secondary data-[state=open]:text-foreground"
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          type="button"
        >
          {theme === "dark" ? (
            <Moon className="h-4 w-4" aria-hidden="true" />
          ) : (
            <Sun className="h-4 w-4" aria-hidden="true" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuLabel>Theme</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className={cn(
            "focus:bg-secondary focus:text-foreground",
            theme === "dark" && "font-semibold"
          )}
        >
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className={cn(
            "focus:bg-secondary focus:text-foreground",
            theme === "light" && "font-semibold"
          )}
        >
          Light
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

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

const getInitialTheme = (): Theme => {
  if (typeof window === "undefined") return "dark"
  const stored = window.localStorage.getItem(storageKey)
  return stored === "light" ? "light" : "dark"
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle("dark", theme === "dark")
    window.localStorage.setItem(storageKey, theme)
  }, [theme])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
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
          className={cn(theme === "dark" && "font-semibold")}
        >
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className={cn(theme === "light" && "font-semibold")}
        >
          Light
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

import { Outlet, NavLink } from 'react-router-dom'
import { BookOpen, Ellipsis, FileText, GitBranch, Home, Library, Moon, Sun } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/layout/ThemeToggle'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/library', label: 'Library', icon: Library },
    { to: '/workflows', label: 'Workflows', icon: GitBranch },
    { to: '/guides', label: 'Guides', icon: BookOpen },
]

type Theme = 'dark' | 'light'

const THEME_STORAGE_KEY = 'research-atlas-theme'

function applyTheme(theme: Theme) {
    if (typeof document === 'undefined') return

    const root = document.documentElement
    root.classList.toggle('dark', theme === 'dark')
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
}

export function AppLayout() {
    return (
        <div className="min-h-screen flex flex-col pb-[calc(4.25rem+env(safe-area-inset-bottom))] md:pb-0">
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-background focus:px-3 focus:py-2 focus:text-sm"
            >
                Skip to main content
            </a>
            {/* Top Navigation */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="flex h-14 w-full items-center px-4 md:px-8">
                    {/* Left: Logo */}
                    <div className="flex min-w-0 flex-1 items-center justify-start md:w-[200px] md:flex-none">
                        <NavLink to="/" end className="flex items-center space-x-2" aria-label="Research Atlas home">
                            <BookOpen className="h-6 w-6 text-primary" aria-hidden="true" />
                            <span className="hidden font-bold sm:inline-block">
                                Research Atlas
                            </span>
                        </NavLink>
                    </div>

                    {/* Center: Navigation Links */}
                    <nav className="hidden md:flex flex-1 items-center justify-center space-x-2 text-sm font-medium sm:space-x-4 md:space-x-6">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                end={item.to === '/'}
                                className={({ isActive }) =>
                                    cn(
                                        'flex items-center justify-center rounded-md p-2 transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-secondary/50 data-[state=open]:bg-secondary/50',
                                        isActive ? 'bg-secondary text-foreground' : 'text-foreground/60'
                                    )
                                }
                                aria-label={item.label}
                            >
                                <item.icon className="h-5 w-5" aria-hidden="true" />
                                <span className="hidden lg:inline-block">{item.label}</span>
                            </NavLink>
                        ))}
                    </nav>

                    {/* Right: Mobile Utility Menu */}
                    <div className="flex min-w-0 flex-1 items-center justify-end md:hidden">
                        <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="rounded-full hover:bg-secondary hover:text-foreground data-[state=open]:bg-secondary data-[state=open]:text-foreground"
                                    aria-label="Open quick actions menu"
                                >
                                    <Ellipsis className="h-5 w-5" aria-hidden="true" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() => applyTheme('dark')}
                                    className="focus:bg-secondary focus:text-foreground"
                                >
                                    <Moon className="mr-2 h-4 w-4" aria-hidden="true" />
                                    Dark Theme
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => applyTheme('light')}
                                    className="focus:bg-secondary focus:text-foreground"
                                >
                                    <Sun className="mr-2 h-4 w-4" aria-hidden="true" />
                                    Light Theme
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    asChild
                                    className="focus:bg-secondary focus:text-foreground"
                                >
                                    <a
                                        href="https://docs.google.com/forms/d/e/1FAIpQLSenxH7AT7kKffyO3u2TSBpqJejdkYDQfMtRP6cCVC1Sbi1pzA/viewform?usp=publish-editor"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label="Contribute via Google Form"
                                    >
                                        <FileText className="mr-2 h-4 w-4" aria-hidden="true" />
                                        Contribute
                                    </a>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Right: Desktop Actions */}
                    <div className="hidden md:flex min-w-0 flex-1 items-center justify-end space-x-1 md:w-[200px] md:flex-none md:space-x-2">
                        <ThemeToggle />
                        <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="hover:bg-secondary hover:text-foreground"
                        >
                            <a
                                href="https://docs.google.com/forms/d/e/1FAIpQLSenxH7AT7kKffyO3u2TSBpqJejdkYDQfMtRP6cCVC1Sbi1pzA/viewform?usp=publish-editor"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Contribute via Google Form"
                            >
                                <FileText className="mr-2 h-4 w-4" aria-hidden="true" />
                                <span className="hidden sm:inline-block">Contribute</span>
                            </a>
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main id="main-content" className="flex-1">
                <Outlet />
            </main>

            {/* Mobile Primary Navigation */}
            <nav
                className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden"
                aria-label="Primary mobile navigation"
            >
                <div className="grid grid-cols-4 gap-1 px-2 pt-1 pb-[calc(env(safe-area-inset-bottom)+0.5rem)]">
                    {navItems.map((item) => (
                        <NavLink
                            key={`mobile-${item.to}`}
                            to={item.to}
                            end={item.to === '/'}
                            className={({ isActive }) =>
                                cn(
                                    'flex min-h-11 flex-col items-center justify-center gap-0.5 rounded-md px-1 py-1 text-[11px] font-medium leading-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                                    isActive
                                        ? 'bg-secondary text-foreground'
                                        : 'text-foreground/60 hover:bg-secondary hover:text-foreground'
                                )
                            }
                            aria-label={item.label}
                        >
                            <item.icon className="h-4 w-4" aria-hidden="true" />
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </div>
            </nav>

            {/* Footer */}
            <footer className="border-t py-6 md:py-0">
                <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:h-14 md:flex-row">
                    <p className="text-sm text-muted-foreground">
                        Built by{" "}
                        <a
                            className="underline underline-offset-4 hover:text-foreground"
                            href="https://haroldzhong.github.io/portfolio/"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Harold Zhong
                        </a>
                        . Open Source for Science.
                    </p>
                </div>
            </footer>
        </div>
    )
}

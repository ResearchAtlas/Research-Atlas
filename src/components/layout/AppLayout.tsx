import { Outlet, NavLink } from 'react-router-dom'
import { Home, Library, GitBranch, BookOpen, Github } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/layout/ThemeToggle'

const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/library', label: 'Library', icon: Library },
    { to: '/workflows', label: 'Workflows', icon: GitBranch },
    { to: '/guides', label: 'Guides', icon: BookOpen },
]

export function AppLayout() {
    return (
        <div className="min-h-screen flex flex-col">
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
                    <div className="flex w-[200px] shrink-0 items-center justify-start">
                        <NavLink to="/" className="flex items-center space-x-2" aria-label="Research Atlas home">
                            <BookOpen className="h-6 w-6 text-primary" aria-hidden="true" />
                            <span className="hidden font-bold sm:inline-block">
                                Research Atlas
                            </span>
                        </NavLink>
                    </div>

                    {/* Center: Navigation Links */}
                    <nav className="flex flex-1 items-center justify-center space-x-6 text-sm font-medium">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                className={({ isActive }) =>
                                    cn(
                                        'flex items-center gap-2 transition-colors hover:text-foreground/80',
                                        isActive ? 'text-foreground' : 'text-foreground/60'
                                    )
                                }
                                aria-label={item.label}
                            >
                                <item.icon className="h-4 w-4" aria-hidden="true" />
                                <span className="hidden lg:inline-block">{item.label}</span>
                            </NavLink>
                        ))}
                    </nav>

                    {/* Right: Actions */}
                    <div className="flex w-[200px] shrink-0 items-center justify-end space-x-2">
                        <ThemeToggle />
                        <Button variant="outline" size="sm" asChild>
                            <a
                                href="https://github.com/HaroldZhong/Research-Atlas"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Contribute on GitHub"
                            >
                                <Github className="mr-2 h-4 w-4" aria-hidden="true" />
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

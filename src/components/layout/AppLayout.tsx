import { Outlet, NavLink } from 'react-router-dom'
import { BookOpen, Home, Github, Compass, LayoutList, Info } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/library', label: 'Library', icon: BookOpen },
    { to: '/workflows', label: 'Workflows', icon: LayoutList },
    { to: '/guides', label: 'Guides', icon: Compass },
    { to: '/about', label: 'About', icon: Info },
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
                <div className="container mx-auto flex h-14 items-center">
                    <div className="mr-4 flex">
                        <NavLink to="/" className="mr-6 flex items-center space-x-2" aria-label="Research Atlas home">
                            <BookOpen className="h-6 w-6 text-primary" aria-hidden="true" />
                            <span className="hidden font-bold sm:inline-block">
                                Research Atlas
                            </span>
                        </NavLink>
                    </div>
                    <nav className="flex items-center space-x-6 text-sm font-medium">
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
                                <span className="hidden sm:inline-block">{item.label}</span>
                            </NavLink>
                        ))}
                    </nav>
                    <div className="flex flex-1 items-center justify-end space-x-2">
                        <Button variant="outline" size="sm" asChild>
                            <a
                                href="https://github.com/YourRepo/researcher-prompt-hub"
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
                        © 2024 Research Atlas. Open Source for Science.
                    </p>
                </div>
            </footer>
        </div>
    )
}

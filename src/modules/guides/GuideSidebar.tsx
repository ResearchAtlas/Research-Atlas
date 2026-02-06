import { ChevronDown, ChevronRight, Book, FileText, FlaskConical, Layout, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useState } from "react"
import { Link } from "react-router-dom"
import { STAGES } from "@/data/taxonomy"
import { guidePathFromId } from "@/lib/seoRoutes"

interface SidebarSectionProps {
    title: string
    // Icon prop removed as it was unused and causing lint errors
    children: React.ReactNode
    defaultOpen?: boolean
}

function SidebarSection({ title, children, defaultOpen = true }: SidebarSectionProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen)

    return (
        <div className="mb-4">
            <Button
                variant="ghost"
                className="w-full justify-between hover:bg-transparent px-2"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-2 text-muted-foreground">
                    {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                    <span className="font-semibold">{title}</span>
                </div>
            </Button>
            {isOpen && (
                <div className="mt-1 ml-4 border-l border-border/50 pl-4 space-y-1">
                    {children}
                </div>
            )}
        </div>
    )
}

interface SidebarItemProps {
    label: string
    icon?: React.ReactNode
    to?: string
    active?: boolean
}

function SidebarItem({ label, icon, to, active }: SidebarItemProps) {
    const className = cn(
        "w-full justify-start font-normal h-8",
        active ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground",
    )

    if (!to) {
        return (
            <Button
                variant="ghost"
                size="sm"
                className={className}
            >
                {icon && <span className="mr-2">{icon}</span>}
                {label}
            </Button>
        )
    }

    return (
        <Button
            asChild
            variant="ghost"
            size="sm"
            className={className}
        >
            <Link to={to}>
                {icon && <span className="mr-2">{icon}</span>}
                {label}
            </Link>
        </Button>
    )
}

interface GuideSidebarProps {
    currentGuideId: string | null
}

export function GuideSidebar({ currentGuideId }: GuideSidebarProps) {
    return (
        <div className="w-64 flex-shrink-0 border-r bg-card/30 hidden md:block h-[calc(100vh-4rem)] sticky top-16">
            <ScrollArea className="h-full py-6 pr-4">
                <SidebarSection title="Introduction">
                    <SidebarItem
                        label="Welcome"
                        icon={<Book className="h-4 w-4" />}
                        active={currentGuideId === 'welcome'}
                        to={guidePathFromId('welcome')}
                    />
                    <SidebarItem
                        label="About Research Atlas"
                        icon={<FileText className="h-4 w-4" />}
                        active={currentGuideId === 'about-research-atlas'}
                        to={guidePathFromId('about-research-atlas')}
                    />
                </SidebarSection>

                <SidebarSection title="Core Guides">
                    <SidebarItem
                        label="AI in Research"
                        icon={<FlaskConical className="h-4 w-4" />}
                        active={currentGuideId === 'ai-research-overview'}
                        to={guidePathFromId('ai-research-overview')}
                    />
                    <SidebarItem
                        label="Prompting Fundamentals"
                        icon={<Layout className="h-4 w-4" />}
                        active={currentGuideId === 'prompting-fundamentals'}
                        to={guidePathFromId('prompting-fundamentals')}
                    />
                    <SidebarItem
                        label="Verification & Integrity"
                        icon={<Settings className="h-4 w-4" />}
                        active={currentGuideId === 'verification-integrity'}
                        to={guidePathFromId('verification-integrity')}
                    />
                    <SidebarItem
                        label="Ethics & Privacy"
                        icon={<Settings className="h-4 w-4" />}
                        active={currentGuideId === 'ethics-policies'}
                        to={guidePathFromId('ethics-policies')}
                    />
                </SidebarSection>

                <SidebarSection title="Research Stages" defaultOpen={false}>
                    {STAGES.map(stage => (
                        <SidebarItem
                            key={stage.id}
                            label={stage.label}
                        />
                    ))}
                </SidebarSection>

                <SidebarSection title="Methodology" defaultOpen={false}>
                    <SidebarItem
                        label="FOCUS Workflow"
                        active={currentGuideId === 'focus-guide'}
                        to={guidePathFromId('focus-guide')}
                    />
                    <SidebarItem
                        label="Quickstart"
                        active={currentGuideId === 'quickstart'}
                        to={guidePathFromId('quickstart')}
                    />
                    <SidebarItem
                        label="Glossary"
                        active={currentGuideId === 'glossary'}
                        to={guidePathFromId('glossary')}
                    />
                </SidebarSection>
            </ScrollArea>
        </div>
    )
}

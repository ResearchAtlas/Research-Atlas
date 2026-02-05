import { ChevronDown, ChevronRight, Book, FileText, FlaskConical, Layout, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useState } from "react"
import { STAGES } from "@/data/taxonomy"

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
    active?: boolean
    onClick?: () => void
}

function SidebarItem({ label, icon, active, onClick }: SidebarItemProps) {
    return (
        <Button
            variant="ghost"
            size="sm"
            className={cn(
                "w-full justify-start font-normal h-8",
                active ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground"
            )}
            onClick={onClick}
        >
            {icon && <span className="mr-2">{icon}</span>}
            {label}
        </Button>
    )
}

interface GuideSidebarProps {
    currentGuideId: string | null
    onSelectGuide: (guideId: string) => void
}

export function GuideSidebar({ currentGuideId, onSelectGuide }: GuideSidebarProps) {
    return (
        <div className="w-64 flex-shrink-0 border-r bg-card/30 hidden md:block h-[calc(100vh-4rem)] sticky top-16">
            <ScrollArea className="h-full py-6 pr-4">
                <SidebarSection title="Introduction">
                    <SidebarItem
                        label="Welcome"
                        icon={<Book className="h-4 w-4" />}
                        active={currentGuideId === 'welcome'}
                        onClick={() => onSelectGuide('welcome')}
                    />
                    <SidebarItem
                        label="About Research Atlas"
                        icon={<FileText className="h-4 w-4" />}
                        active={currentGuideId === 'about-research-atlas'}
                        onClick={() => onSelectGuide('about-research-atlas')}
                    />
                </SidebarSection>

                <SidebarSection title="Core Guides">
                    <SidebarItem
                        label="AI in Research"
                        icon={<FlaskConical className="h-4 w-4" />}
                        active={currentGuideId === 'ai-research-overview'}
                        onClick={() => onSelectGuide('ai-research-overview')}
                    />
                    <SidebarItem
                        label="Prompting Fundamentals"
                        icon={<Layout className="h-4 w-4" />}
                        active={currentGuideId === 'prompting-fundamentals'}
                        onClick={() => onSelectGuide('prompting-fundamentals')}
                    />
                    <SidebarItem
                        label="Verification & Integrity"
                        icon={<Settings className="h-4 w-4" />}
                        active={currentGuideId === 'verification-integrity'}
                        onClick={() => onSelectGuide('verification-integrity')}
                    />
                    <SidebarItem
                        label="Ethics & Privacy"
                        icon={<Settings className="h-4 w-4" />}
                        active={currentGuideId === 'ethics-policies'}
                        onClick={() => onSelectGuide('ethics-policies')}
                    />
                    <SidebarItem
                        label="Computational Rigor"
                        icon={<Settings className="h-4 w-4" />}
                        active={currentGuideId === 'computational-rigor'} // Note: this ID doesn't explicitly exist in the provided guides list, mapping broadly or needs a specific guide ID. Using placeholder or mapping to relevant section if it existed as separate guide.
                        onClick={() => { }} // Placeholder logic
                    />
                </SidebarSection>

                <SidebarSection title="Research Stages" defaultOpen={false}>
                    {STAGES.map(stage => (
                        <SidebarItem key={stage.id} label={stage.label} />
                    ))}
                </SidebarSection>

                <SidebarSection title="Methodology" defaultOpen={false}>
                    <SidebarItem
                        label="FOCUS Workflow"
                        active={currentGuideId === 'focus-guide'}
                        onClick={() => onSelectGuide('focus-guide')}
                    />
                    <SidebarItem
                        label="Quickstart"
                        active={currentGuideId === 'quickstart'}
                        onClick={() => onSelectGuide('quickstart')}
                    />
                    <SidebarItem
                        label="Glossary"
                        active={currentGuideId === 'glossary'}
                        onClick={() => onSelectGuide('glossary')}
                    />
                </SidebarSection>
            </ScrollArea>
        </div>
    )
}

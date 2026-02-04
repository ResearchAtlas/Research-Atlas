import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, FileText, Trash2, Search, Pencil, Download } from 'lucide-react'
import { useWorkbenchStore } from '@/store/workbench'
import { LocalStore, LocalDraft } from '@/lib/local-store'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'

export function DashboardPage() {
    const navigate = useNavigate()
    const { setDraft } = useWorkbenchStore()
    const [drafts, setDrafts] = useState<LocalDraft[]>([])
    const [search, setSearch] = useState('')
    const [deleteTarget, setDeleteTarget] = useState<string | null>(null)

    const loadDrafts = () => {
        setDrafts(LocalStore.getAll())
    }

    useEffect(() => {
        loadDrafts()
    }, [])

    const handleDelete = () => {
        if (deleteTarget) {
            LocalStore.delete(deleteTarget)
            loadDrafts()
            setDeleteTarget(null)
        }
    }

    const handleEdit = (draft: LocalDraft) => {
        setDraft(draft)
        navigate('/workbench')
    }

    const filteredDrafts = drafts.filter((d) =>
        !search || d.title.toLowerCase().includes(search.toLowerCase())
    )

    const exportDraft = (draft: LocalDraft, e: React.MouseEvent) => {
        e.stopPropagation()
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(draft, null, 2))
        const downloadAnchorNode = document.createElement('a')
        downloadAnchorNode.setAttribute("href", dataStr)
        downloadAnchorNode.setAttribute("download", `${draft.title || 'draft'}.json`)
        document.body.appendChild(downloadAnchorNode)
        downloadAnchorNode.click()
        downloadAnchorNode.remove()
    }

    return (
        <div className="container mx-auto py-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-balance">Local Drafts</h1>
                    <p className="mt-1 text-muted-foreground">
                        Your private prompt workspace. Stored locally in your browser.
                    </p>
                </div>
                <Button onClick={() => navigate('/workbench')}>
                    <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
                    New Prompt
                </Button>
            </div>

            {/* Search */}
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <div className="relative flex-1">
                    <label className="sr-only" htmlFor="draft-search">
                        Search local drafts
                    </label>
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                    <Input
                        id="draft-search"
                        name="draft_search"
                        autoComplete="off"
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search local drafts…"
                        className="pl-10"
                    />
                </div>
            </div>

            {/* Drafts Grid */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {filteredDrafts.map((draft) => (
                    <Card
                        key={draft.id}
                        className="hover:border-primary/50 transition-colors group"
                    >
                        <CardHeader className="pb-3">
                            <CardTitle className="text-lg truncate">{draft.title || 'Untitled Prompt'}</CardTitle>
                            <CardDescription>
                                Updated {new Date(draft.updatedAt).toLocaleDateString()}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button size="sm" variant="secondary" className="h-8" onClick={(e) => { e.stopPropagation(); handleEdit(draft) }}>
                                    <Pencil className="h-3 w-3 mr-1" aria-hidden="true" /> Edit
                                </Button>
                                <Button size="sm" variant="ghost" className="h-8" aria-label="Download draft" onClick={(e) => exportDraft(draft, e)}>
                                    <Download className="h-3 w-3" aria-hidden="true" />
                                </Button>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 text-destructive hover:text-destructive"
                                    aria-label="Delete draft"
                                    onClick={(e) => { e.stopPropagation(); setDeleteTarget(draft.id) }}
                                >
                                    <Trash2 className="h-3 w-3" aria-hidden="true" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredDrafts.length === 0 && (
                <div className="mt-16 text-center border-2 border-dashed rounded-lg py-12">
                    <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" aria-hidden="true" />
                    <h3 className="mt-4 text-lg font-semibold">No local drafts</h3>
                    <p className="mt-2 text-muted-foreground">
                        Create a prompt in the Workbench to see it here.
                    </p>
                    <Button variant="outline" className="mt-4" onClick={() => navigate('/workbench')}>
                        Open Workbench
                    </Button>
                </div>
            )}

            <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Draft?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete this draft from your browser storage.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={handleDelete}
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}

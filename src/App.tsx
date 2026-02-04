import { Routes, Route } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { HomePage } from '@/modules/home/HomePage'
import { LibraryPage } from '@/modules/library/LibraryPage'
import { WorkflowsPage } from '@/modules/workflows/WorkflowsPage'
import { GuidesPage } from '@/modules/guides/GuidesPage'
import { AboutPage } from '@/modules/about/AboutPage'

function App() {
    return (
        <Routes>
            <Route path="/" element={<AppLayout />}>
                <Route index element={<HomePage />} />
                <Route path="library" element={<LibraryPage />} />
                <Route path="workflows" element={<WorkflowsPage />} />
                <Route path="guides" element={<GuidesPage />} />
                <Route path="about" element={<AboutPage />} />
            </Route>
        </Routes>
    )
}

export default App

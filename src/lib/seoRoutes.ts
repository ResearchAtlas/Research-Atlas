import { GUIDES } from '@/data/guides'
import { WORKFLOWS } from '@/data/workflows'

export const BASE_URL = 'https://researchatlas.info'

const ROOT_ROUTES = ['/', '/library', '/workflows', '/guides'] as const

export const workflowPathFromId = (workflowId: string) =>
    `/workflows/${encodeURIComponent(workflowId)}`

export const guidePathFromId = (guideId: string) =>
    guideId === 'welcome'
        ? '/guides'
        : `/guides/${encodeURIComponent(guideId)}`

export const topLevelRoutes = [...ROOT_ROUTES]
export const workflowRoutes = WORKFLOWS.map((workflow) => workflowPathFromId(workflow.id))
export const guideDetailRoutes = GUIDES
    .filter((guide) => guide.id !== 'welcome')
    .map((guide) => guidePathFromId(guide.id))

export const prerenderRoutes = Array.from(
    new Set([...topLevelRoutes, ...workflowRoutes, ...guideDetailRoutes]),
)

export const canonicalForRoute = (route: string) =>
    `${BASE_URL}${route === '/' ? '/' : route}`

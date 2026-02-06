import { readFile } from 'node:fs/promises'
import path from 'node:path'

const distDir = path.resolve('dist')
const manifestPath = path.join(distDir, 'prerender-manifest.json')
const sitemapPath = path.join(distDir, 'sitemap.xml')
const OG_IMAGE_URL = 'https://researchatlas.info/og/cover-1200x630.png'

const getTitle = (html) => html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim() ?? ''
const getDescription = (html) => html.match(/<meta[^>]+name="description"[^>]+content="([^"]+)"[^>]*>/i)?.[1]?.trim() ?? ''
const getCanonical = (html) => html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"[^>]*>/i)?.[1]?.trim() ?? ''
const getMetaByName = (html, name) =>
    html.match(new RegExp(`<meta[^>]+name="${name}"[^>]+content="([^"]+)"[^>]*>`, 'i'))?.[1]?.trim() ?? ''
const getMetaByProperty = (html, property) =>
    html.match(new RegExp(`<meta[^>]+property="${property}"[^>]+content="([^"]+)"[^>]*>`, 'i'))?.[1]?.trim() ?? ''

const main = async () => {
    const errors = []
    const manifestRaw = await readFile(manifestPath, 'utf-8')
    const routeChecks = JSON.parse(manifestRaw)
    const sitemapXml = await readFile(sitemapPath, 'utf-8')

    if (!Array.isArray(routeChecks) || routeChecks.length === 0) {
        throw new Error('prerender manifest is missing or empty')
    }

    for (const check of routeChecks) {
        const filePath = path.join(distDir, check.file)
        const html = await readFile(filePath, 'utf-8')

        const title = getTitle(html)
        if (!title) {
            errors.push(`${check.route}: missing or empty <title>`)
        }

        const description = getDescription(html)
        if (!description) {
            errors.push(`${check.route}: missing or empty meta description`)
        }

        const canonical = getCanonical(html)
        if (canonical !== check.canonical) {
            errors.push(`${check.route}: canonical mismatch (expected ${check.canonical}, got ${canonical || 'none'})`)
        }

        const ogUrl = getMetaByProperty(html, 'og:url')
        if (!ogUrl) {
            errors.push(`${check.route}: missing og:url`)
        } else if (ogUrl !== check.canonical) {
            errors.push(`${check.route}: og:url mismatch (expected ${check.canonical}, got ${ogUrl})`)
        }

        const ogTitle = getMetaByProperty(html, 'og:title')
        if (!ogTitle) {
            errors.push(`${check.route}: missing og:title`)
        }

        const ogDescription = getMetaByProperty(html, 'og:description')
        if (!ogDescription) {
            errors.push(`${check.route}: missing og:description`)
        }

        const ogImage = getMetaByProperty(html, 'og:image')
        if (ogImage !== OG_IMAGE_URL) {
            errors.push(`${check.route}: og:image mismatch (expected ${OG_IMAGE_URL}, got ${ogImage || 'none'})`)
        }

        const twitterCard = getMetaByName(html, 'twitter:card')
        if (twitterCard !== 'summary_large_image') {
            errors.push(`${check.route}: twitter:card mismatch (expected summary_large_image, got ${twitterCard || 'none'})`)
        }

        const twitterUrl = getMetaByName(html, 'twitter:url')
        if (!twitterUrl) {
            errors.push(`${check.route}: missing twitter:url`)
        } else if (twitterUrl !== check.canonical) {
            errors.push(`${check.route}: twitter:url mismatch (expected ${check.canonical}, got ${twitterUrl})`)
        }

        const twitterTitle = getMetaByName(html, 'twitter:title')
        if (!twitterTitle) {
            errors.push(`${check.route}: missing twitter:title`)
        }

        const twitterDescription = getMetaByName(html, 'twitter:description')
        if (!twitterDescription) {
            errors.push(`${check.route}: missing twitter:description`)
        }

        const twitterImage = getMetaByName(html, 'twitter:image')
        if (twitterImage !== OG_IMAGE_URL) {
            errors.push(`${check.route}: twitter:image mismatch (expected ${OG_IMAGE_URL}, got ${twitterImage || 'none'})`)
        }

        if (/noindex/i.test(html.match(/<meta[^>]+name="robots"[^>]*>/i)?.[0] ?? '')) {
            errors.push(`${check.route}: unexpected noindex robots meta`)
        }

        if (!/<h1[\s>]/i.test(html)) {
            errors.push(`${check.route}: missing <h1> in prerendered HTML`)
        }
    }

    const sitemapLocs = Array.from(
        sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/gi),
        (match) => match[1].trim(),
    )
    const sitemapSet = new Set(sitemapLocs)
    const expectedCanonicals = routeChecks.map((check) => check.canonical)

    if (sitemapLocs.length !== expectedCanonicals.length) {
        errors.push(
            `sitemap count mismatch (expected ${expectedCanonicals.length}, got ${sitemapLocs.length})`,
        )
    }

    for (const canonical of expectedCanonicals) {
        if (!sitemapSet.has(canonical)) {
            errors.push(`sitemap missing canonical URL ${canonical}`)
        }
    }

    if (errors.length > 0) {
        console.error('[seo-smoke] FAILED')
        for (const error of errors) {
            console.error(` - ${error}`)
        }
        process.exit(1)
    }

    console.log(`[seo-smoke] Passed for ${routeChecks.length} routes.`)
}

main().catch((error) => {
    console.error('[seo-smoke] Failed:', error)
    process.exit(1)
})

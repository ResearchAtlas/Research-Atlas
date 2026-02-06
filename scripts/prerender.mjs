import { readdir, readFile, writeFile, mkdir, rm } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const distDir = path.resolve('dist')
const templatePath = path.join(distDir, 'index.html')
const serverDir = path.join(distDir, 'server')
const manifestPath = path.join(distDir, 'prerender-manifest.json')
const sitemapPath = path.join(distDir, 'sitemap.xml')
const FALLBACK_ROUTES = ['/', '/library', '/workflows', '/guides']

const readServerEntryPath = async () => {
    const files = await readdir(serverDir)
    const entry = files.find((file) => file.startsWith('entry-server.'))
    if (!entry) {
        throw new Error(`Could not find SSR entry in ${serverDir}`)
    }
    return path.join(serverDir, entry)
}

const extractTag = (source, pattern) => {
    const match = source.match(pattern)
    return match ? match[0] : ''
}

const escapeForRegExp = (value) =>
    value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const extractMetaTag = (metaTags, attr, value) =>
    extractTag(
        metaTags,
        new RegExp(`<meta[^>]+${attr}="${escapeForRegExp(value)}"[^>]*>`, 'i'),
    )

const replaceOrAppend = (html, pattern, tag) => {
    if (!tag) return html
    if (pattern.test(html)) {
        return html.replace(pattern, tag)
    }
    return html.replace('</head>', `${tag}\n</head>`)
}

const applyHelmetTags = (html, helmet) => {
    const titleTag = helmet?.title?.toString() ?? ''
    const metaTags = helmet?.meta?.toString() ?? ''
    const linkTags = helmet?.link?.toString() ?? ''

    const descriptionTag = extractMetaTag(metaTags, 'name', 'description')
    const robotsTag = extractMetaTag(metaTags, 'name', 'robots')
    const ogTypeTag = extractMetaTag(metaTags, 'property', 'og:type')
    const ogUrlTag = extractMetaTag(metaTags, 'property', 'og:url')
    const ogTitleTag = extractMetaTag(metaTags, 'property', 'og:title')
    const ogDescriptionTag = extractMetaTag(metaTags, 'property', 'og:description')
    const ogImageTag = extractMetaTag(metaTags, 'property', 'og:image')
    const ogImageWidthTag = extractMetaTag(metaTags, 'property', 'og:image:width')
    const ogImageHeightTag = extractMetaTag(metaTags, 'property', 'og:image:height')
    const twitterCardTag = extractMetaTag(metaTags, 'name', 'twitter:card')
    const twitterUrlTag = extractMetaTag(metaTags, 'name', 'twitter:url')
    const twitterTitleTag = extractMetaTag(metaTags, 'name', 'twitter:title')
    const twitterDescriptionTag = extractMetaTag(metaTags, 'name', 'twitter:description')
    const twitterImageTag = extractMetaTag(metaTags, 'name', 'twitter:image')
    const canonicalTag = extractTag(linkTags, /<link[^>]+rel="canonical"[^>]*>/i)

    let output = html
    output = replaceOrAppend(output, /<title>[\s\S]*?<\/title>/i, titleTag)
    output = replaceOrAppend(output, /<meta[^>]+name="description"[^>]*>/i, descriptionTag)
    output = replaceOrAppend(output, /<meta[^>]+name="robots"[^>]*>/i, robotsTag)
    output = replaceOrAppend(output, /<meta[^>]+property="og:type"[^>]*>/i, ogTypeTag)
    output = replaceOrAppend(output, /<meta[^>]+property="og:url"[^>]*>/i, ogUrlTag)
    output = replaceOrAppend(output, /<meta[^>]+property="og:title"[^>]*>/i, ogTitleTag)
    output = replaceOrAppend(output, /<meta[^>]+property="og:description"[^>]*>/i, ogDescriptionTag)
    output = replaceOrAppend(output, /<meta[^>]+property="og:image"[^>]*>/i, ogImageTag)
    output = replaceOrAppend(output, /<meta[^>]+property="og:image:width"[^>]*>/i, ogImageWidthTag)
    output = replaceOrAppend(output, /<meta[^>]+property="og:image:height"[^>]*>/i, ogImageHeightTag)
    output = replaceOrAppend(output, /<meta[^>]+name="twitter:card"[^>]*>/i, twitterCardTag)
    output = replaceOrAppend(output, /<meta[^>]+name="twitter:url"[^>]*>/i, twitterUrlTag)
    output = replaceOrAppend(output, /<meta[^>]+name="twitter:title"[^>]*>/i, twitterTitleTag)
    output = replaceOrAppend(output, /<meta[^>]+name="twitter:description"[^>]*>/i, twitterDescriptionTag)
    output = replaceOrAppend(output, /<meta[^>]+name="twitter:image"[^>]*>/i, twitterImageTag)
    output = replaceOrAppend(output, /<link[^>]+rel="canonical"[^>]*>/i, canonicalTag)
    return output
}

const outputPathForRoute = (route) => {
    if (route === '/') {
        return templatePath
    }
    const normalized = route.replace(/^\/+/, '')
    return path.join(distDir, normalized, 'index.html')
}

const priorityForRoute = (route) => {
    if (route === '/') return '1.0'
    if (route.startsWith('/guides/') || route.startsWith('/workflows/')) return '0.7'
    return '0.8'
}

const changeFreqForRoute = (route) => {
    if (route.startsWith('/guides/') || route.startsWith('/workflows/')) return 'monthly'
    return 'weekly'
}

const buildSitemapXml = (entries) => {
    const lastmod = new Date().toISOString().slice(0, 10)
    const urls = entries.map((entry) => [
        '  <url>',
        `    <loc>${entry.canonical}</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        `    <changefreq>${changeFreqForRoute(entry.route)}</changefreq>`,
        `    <priority>${priorityForRoute(entry.route)}</priority>`,
        '  </url>',
    ].join('\n'))

    return [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ...urls,
        '</urlset>',
        '',
    ].join('\n')
}

const main = async () => {
    const template = await readFile(templatePath, 'utf-8')
    const serverEntryPath = await readServerEntryPath()
    const serverModule = await import(pathToFileURL(serverEntryPath).href)
    const render = serverModule.render

    if (typeof render !== 'function') {
        throw new Error('SSR entry does not export a render(url) function')
    }

    const routeSource = Array.isArray(serverModule.prerenderRoutes)
        ? serverModule.prerenderRoutes
        : FALLBACK_ROUTES
    const routes = Array.from(new Set(routeSource))

    const canonicalForRoute = typeof serverModule.canonicalForRoute === 'function'
        ? serverModule.canonicalForRoute
        : (route) => `https://researchatlas.info${route === '/' ? '/' : route}`

    const manifest = []

    for (const route of routes) {
        const { appHtml, helmet } = await render(route)

        let html = template.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`)
        html = html.replace('</head>', `<meta name="prerender-route" content="${route}">\n</head>`)
        html = applyHelmetTags(html, helmet)

        const outputPath = outputPathForRoute(route)
        await mkdir(path.dirname(outputPath), { recursive: true })
        await writeFile(outputPath, html, 'utf-8')

        manifest.push({
            route,
            file: path.relative(distDir, outputPath).replaceAll('\\', '/'),
            canonical: canonicalForRoute(route),
        })

        console.log(`[prerender] ${route} -> ${path.relative(process.cwd(), outputPath)}`)
    }

    await writeFile(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8')
    await writeFile(sitemapPath, buildSitemapXml(manifest), 'utf-8')

    await rm(serverDir, { recursive: true, force: true })
    console.log('[prerender] Done.')
}

main().catch((error) => {
    console.error('[prerender] Failed:', error)
    process.exit(1)
})

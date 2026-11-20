import { defineConfig, envField } from 'astro/config'
import starlight from '@astrojs/starlight'
import { loadEnv } from 'vite'

const DEFAULT_SITE_URL = 'https://docs.chunisupport.net'
const { SITE_URL = DEFAULT_SITE_URL } = loadEnv(process.env.NODE_ENV, process.cwd(), '')

export default defineConfig({
    site: SITE_URL,
    output: 'static',
    env: {
        schema: {
            PUBLIC_APP_URL: envField.string({
                context: 'server',
                access: 'public',
                url: true,
                default: 'https://chunisupport.net',
            }),
            PUBLIC_BOOKMARKLET_URL: envField.string({
                context: 'server',
                access: 'public',
                url: true,
                default: 'https://dist.chunisupport.net',
            }),
            PUBLIC_BOOKMARKLET_ENTRYPOINT: envField.string({
                context: 'server',
                access: 'public',
                default: 'main.js',
            }),
            PUBLIC_API_BASE_URL: envField.string({
                context: 'server',
                access: 'public',
                default: 'https://api.chunisupport.net',
            }),
            PUBLIC_STATIC_API_BASE_URL: envField.string({
                context: 'server',
                access: 'public',
                url: true,
                default: 'https://static.chunisupport.net',
            }),
        },
    },
    integrations: [
        starlight({
            title: 'ChuniSupport ガイド',
            description: 'ChuniSupportのヘルプとドキュメント',
            favicon: '/favicon.png',
            disable404Route: true,
            defaultLocale: 'root',
            locales: {
                root: {
                    label: '日本語',
                    lang: 'ja',
                },
            },
            head: [
                {
                    tag: 'link',
                    attrs: {
                        rel: 'preconnect',
                        href: 'https://fonts.googleapis.com',
                    },
                },
                {
                    tag: 'link',
                    attrs: {
                        rel: 'preconnect',
                        href: 'https://fonts.gstatic.com',
                        crossorigin: true,
                    },
                },
                {
                    tag: 'link',
                    attrs: {
                        rel: 'stylesheet',
                        href: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400..600&family=Jost:wght@500..700&family=Noto+Sans:wght@400..700&family=Noto+Sans+JP:wght@400..700&display=swap',
                    },
                },
            ],
            customCss: ['./src/styles/custom.css'],
            components: {
                Footer: './src/components/SiteFooter.astro',
                Header: './src/components/SiteHeader.astro',
                Hero: './src/components/SiteHero.astro',
                MobileMenuFooter: './src/components/MobileMenuFooter.astro',
                Sidebar: './src/components/SectionSidebar.astro',
                SiteTitle: './src/components/SiteTitle.astro',
                ThemeProvider: './src/components/ThemeProvider.astro',
                ThemeSelect: './src/components/ThemeSelect.astro',
            },
            sidebar: [
                {
                    label: 'ヘルプ',
                    items: [{ autogenerate: { directory: 'help' } }],
                },
                {
                    label: 'APIドキュメント',
                    items: [{ autogenerate: { directory: 'api' } }],
                },
            ],
        }),
    ],
})

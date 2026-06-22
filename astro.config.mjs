import { defineConfig, envField } from 'astro/config'
import starlight from '@astrojs/starlight'

export default defineConfig({
    site: 'https://help.chunisupport.net',
    output: 'static',
    env: {
        schema: {
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
        },
    },
    integrations: [
        starlight({
            title: 'ChuniSupport Docs',
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
            customCss: ['./src/styles/custom.css'],
            components: {
                Sidebar: './src/components/SectionSidebar.astro',
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

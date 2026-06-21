import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'

export default defineConfig({
  site: 'https://help.chunisupport.net',
  output: 'static',
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

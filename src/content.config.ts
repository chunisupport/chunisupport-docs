import { defineCollection, type SchemaContext } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'
import { docsLoader } from '@astrojs/starlight/loaders'
import { docsSchema } from '@astrojs/starlight/schema'
import { PUBLIC_APP_URL } from 'astro:env/server'

const APP_URL_REFERENCE = 'env:PUBLIC_APP_URL'

const appUrlAwareDocsSchema = (context: SchemaContext) =>
  docsSchema()(context).transform((data) => ({
    ...data,
    hero: data.hero
      ? {
          ...data.hero,
          actions: data.hero.actions.map((action) =>
            action.link === APP_URL_REFERENCE ? { ...action, link: PUBLIC_APP_URL } : action,
          ),
        }
      : undefined,
  }))

export const collections = {
  docs: defineCollection({ loader: docsLoader(), schema: appUrlAwareDocsSchema }),
  announcements: defineCollection({
    loader: glob({ base: './src/content/announcements', pattern: '**/*.{md,mdx}' }),
    schema: z.object({
      title: z.string(),
      summary: z.string(),
      publishedAt: z.coerce.date(),
      category: z.enum(['important', 'update', 'maintenance', 'other']),
    }),
  }),
}

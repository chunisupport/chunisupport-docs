import { defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'
import { z } from 'astro/zod'
import { docsLoader } from '@astrojs/starlight/loaders'
import { docsSchema } from '@astrojs/starlight/schema'

export const collections = {
  docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
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

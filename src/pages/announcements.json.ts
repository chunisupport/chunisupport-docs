import type { APIRoute } from 'astro'
import { announcementPath, getAnnouncements } from '../lib/announcements'

const ANNOUNCEMENT_FEED_VERSION = 1

export const GET: APIRoute = async ({ site }) => {
  if (!site) {
    throw new Error('Astroのsite設定が必要です')
  }

  const announcements = await getAnnouncements()
  const items = announcements.map((announcement) => ({
    id: announcement.id,
    title: announcement.data.title,
    summary: announcement.data.summary,
    publishedAt: announcement.data.publishedAt.toISOString().slice(0, 10),
    category: announcement.data.category,
    url: new URL(announcementPath(announcement.id), site).href,
  }))

  return Response.json(
    { version: ANNOUNCEMENT_FEED_VERSION, announcements: items },
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=300',
      },
    }
  )
}

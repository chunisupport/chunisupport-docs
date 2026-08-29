import { getCollection, type CollectionEntry } from 'astro:content'

export const ANNOUNCEMENT_CATEGORY_LABELS = {
  important: '重要',
  update: 'アップデート',
  maintenance: 'メンテナンス',
  other: 'その他',
} as const

export const getAnnouncements = async (): Promise<CollectionEntry<'announcements'>[]> => {
  const announcements = await getCollection('announcements')
  return announcements.toSorted((left, right) => {
    const publishedAtComparison =
      right.data.publishedAt.getTime() - left.data.publishedAt.getTime()

    return publishedAtComparison || right.id.localeCompare(left.id, 'en')
  })
}

export const formatAnnouncementDate = (date: Date): string => {
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date)
}

export const announcementPath = (id: string): string => `/announcements/${id}/`

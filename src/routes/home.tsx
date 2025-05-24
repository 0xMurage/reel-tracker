import { Hono } from "hono"
import { dbClient } from "../lib/db"
import { HomePage } from "../views/HomePage"
import { Layout } from "../views/Layout"

export const homeRoutes = new Hono()

homeRoutes.get("/", async (c) => {
  const mediaQuery = `
    SELECT 
      m.*,
      um.personal_rating,
      um.status,
      um.last_watched_season,
      um.last_watched_episode,
      um.rewatch_count,
      um.watched_at,
      um.notes
    FROM media m
    LEFT JOIN user_media um ON m.id = um.media_id
    ORDER BY um.updated_at DESC, m.created_at DESC
    LIMIT 10
  `

  const result = await dbClient.execute(mediaQuery)
  const recentMedia = result.rows

  return c.html(
    <Layout title="Media Tracker">
      <HomePage recentMedia={recentMedia} />
    </Layout>,
  )
})

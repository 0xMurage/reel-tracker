import { Hono } from "hono"
import { dbClient } from "../lib/db"
import { Layout } from "../views/Layout"
import { MediaDetail } from "../views/MediaDetail"
import { MediaForm } from "../views/MediaForm"
import { MediaList } from "../views/MediaList"

const routes = new Hono()

routes.get("/search", async (c) => {
  const query = c.req.query("q")
  const type = c.req.query("type") ?? "multi"

  if (!query) {
    return c.json({ results: [] })
  }

  try {
    const accessToken = process.env.TMDB_ACCESS_TOKEN
    if (!accessToken) {
      return c.json({ results: [] })
    }

    const searchType = type === "series" ? "tv" : type === "movie" ? "movie" : "multi"
    const response = await fetch(
      `https://api.themoviedb.org/3/search/${searchType}?query=${encodeURIComponent(query)}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )

    const data = await response.json()

    const results =
      data.results?.slice(0, 10).map((item: any) => ({
        id: item.id,
        title: item.title || item.name,
        year: item.release_date
          ? new Date(item.release_date).getFullYear()
          : item.first_air_date
            ? new Date(item.first_air_date).getFullYear()
            : null,
        type: item.media_type === "tv" || searchType === "tv" ? "series" : "movie",
        public_rating: item.vote_average ? Math.round(item.vote_average * 10) / 10 : null,
        cover_art: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : null,
        description: item.overview,
      })) || []

    return c.json({ results })
  } catch (error) {
    // tslint:disable-next-line:no-console
    console.error("TMDB search error:", error)
    return c.json({ results: [] })
  }
})

// List all media with filters
routes.get("/", async (c) => {
  const type = c.req.query("type")?.trim()
  const status = c.req.query("status")?.trim()
  const search = c.req.query("search")?.trim()

  let query = `
      SELECT m.*,
             um.personal_rating,
             um.status,
             um.last_watched_season,
             um.last_watched_episode,
             um.rewatch_count,
             um.watched_at
      FROM media m
               LEFT JOIN user_media um ON m.id = um.media_id
      WHERE 1 = 1
  `

  const params: any[] = []

  if (type) {
    query += " AND m.type = ?"
    params.push(type)
  }

  if (status) {
    query += " AND um.status = ?"
    params.push(status)
  }

  if (search) {
    query += " AND m.title LIKE ?"
    params.push(`%${search}%`)
  }

  query += " ORDER BY m.title"

  const result = await dbClient.execute({ sql: query, args: params })
  const media = result.rows

  return c.html(
    <Layout title="All Media">
      <MediaList media={media} currentType={type ?? ""} currentStatus={status ?? ""} currentSearch={search ?? ""} />
    </Layout>,
  )
})

// Add new media form
routes.get("/add", async (c) => {
  return c.html(
    <Layout title="Add Media">
      <MediaForm />
    </Layout>,
  )
})

// Create new media
routes.post("/", async (c) => {
  const body = await c.req.parseBody()

  // Insert media
  const mediaResult = await dbClient.execute({
    sql: "INSERT INTO media (title, type, year, public_rating, cover_art, description) VALUES (?, ?, ?, ?, ?, ?)",
    args: [
      body.title,
      body.type,
      body.year || null,
      body.public_rating || null,
      body.cover_art || null,
      body.description || null,
    ],
  })

  const mediaId = mediaResult.lastInsertRowid

  // Insert user_media if status is provided
  if (body.status) {
    await dbClient.execute({
      sql: "INSERT INTO user_media (media_id, status, personal_rating, last_watched_season, last_watched_episode, rewatch_count, notes) VALUES (?, ?, ?, ?, ?, ?, ?)",
      args: [
        mediaId,
        body.status,
        body.personal_rating || null,
        body.last_watched_season || null,
        body.last_watched_episode || null,
        body.rewatch_count || 0,
        body.notes || null,
      ],
    })
  }

  return c.redirect("/media")
})

// View media detail
routes.get("/:id", async (c) => {
  const id = c.req.param("id")

  const result = await dbClient.execute({
    sql: `
        SELECT m.*,
               um.personal_rating,
               um.status,
               um.last_watched_season,
               um.last_watched_episode,
               um.rewatch_count,
               um.watched_at,
               um.notes
        FROM media m
                 LEFT JOIN user_media um ON m.id = um.media_id
        WHERE m.id = ?
    `,
    args: [id],
  })

  if (result.rows.length === 0) {
    return c.notFound()
  }

  const media = result.rows[0]

  return c.html(
    <Layout title={media.title as string}>
      <MediaDetail media={media} />
    </Layout>,
  )
})

// Edit media form
routes.get("/:id/edit", async (c) => {
  const id = c.req.param("id")

  const result = await dbClient.execute({
    sql: `
        SELECT m.*,
               um.personal_rating,
               um.status,
               um.last_watched_season,
               um.last_watched_episode,
               um.rewatch_count,
               um.notes
        FROM media m
                 LEFT JOIN user_media um ON m.id = um.media_id
        WHERE m.id = ?
    `,
    args: [id],
  })

  if (result.rows.length === 0) {
    return c.notFound()
  }

  const media = result.rows[0]

  return c.html(
    <Layout title={`Edit ${media.title}`}>
      <MediaForm media={media} />
    </Layout>,
  )
})

// Update media
routes.post("/:id", async (c) => {
  const id = c.req.param("id")
  const body = await c.req.parseBody()

  // Update media
  await dbClient.execute({
    sql: "UPDATE media SET title = ?, type = ?, year = ?, public_rating = ?, cover_art = ?, description = ? WHERE id = ?",
    args: [
      body.title,
      body.type,
      body.year || null,
      body.public_rating || null,
      body.cover_art || null,
      body.description || null,
      id,
    ],
  })

  // Update or insert user_media
  const userMediaResult = await dbClient.execute({
    sql: "SELECT id FROM user_media WHERE media_id = ?",
    args: [id],
  })

  if (userMediaResult.rows.length > 0) {
    await dbClient.execute({
      sql: "UPDATE user_media SET status = ?, personal_rating = ?, last_watched_season = ?, last_watched_episode = ?, rewatch_count = ?, notes = ? WHERE media_id = ?",
      args: [
        body.status,
        body.personal_rating || null,
        body.last_watched_season || null,
        body.last_watched_episode || null,
        body.rewatch_count || 0,
        body.notes || null,
        id,
      ],
    })
  } else if (body.status) {
    await dbClient.execute({
      sql: "INSERT INTO user_media (media_id, status, personal_rating, last_watched_season, last_watched_episode, rewatch_count, notes) VALUES (?, ?, ?, ?, ?, ?, ?)",
      args: [
        id,
        body.status,
        body.personal_rating || null,
        body.last_watched_season || null,
        body.last_watched_episode || null,
        body.rewatch_count || 0,
        body.notes || null,
      ],
    })
  }

  return c.redirect(`/media/${id}`)
})

// Delete media
routes.delete("/:id", async (c) => {
  const id = c.req.param("id")

  await dbClient.execute({
    sql: "DELETE FROM media WHERE id = ?",
    args: [id],
  })

  return c.redirect("/media")
})

export { routes }

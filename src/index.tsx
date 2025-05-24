import { Hono } from "hono"
import { serveStatic } from "hono/bun"
import { etag } from "hono/etag"
import { logger } from "hono/logger"
import { homeRoutes } from "./routes/home"
import { routes } from "./routes/media"

const app = new Hono()

app.use(logger())
app.use(etag())

// Serve static files
app.use("/static/*", serveStatic({ root: "./src" }))

// Routes
app.route("/", homeRoutes)
app.route("/media", routes)

export default app

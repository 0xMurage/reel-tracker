import { html } from "hono/html"

interface LayoutProps {
  title: string
  children: any
}

export const Layout = ({ title, children }: LayoutProps) => {
  return html`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${title} - Media Tracker</title>
        <link rel="stylesheet" href="/static/styles.css" />
      </head>
      <body>
        <div class="container">
          <header class="header">
            <h1>🎬 Media Tracker</h1>
            <nav class="nav">
              <a href="/">Home</a>
              <a href="/media">All Media</a>
              <a href="/media/add">Add New</a>
            </nav>
          </header>
          <main class="content">${children}</main>
        </div>
      </body>
    </html>
  `
}

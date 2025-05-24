import { createClient } from "@libsql/client"

export const dbClient = createClient({
  url: `file:${process.env.SQLITE_FILEPATH}`,
})

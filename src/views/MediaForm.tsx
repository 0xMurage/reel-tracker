interface MediaFormProps {
  media?: any
}

export const MediaForm = ({ media }: MediaFormProps) => {
  const isEdit = !!media
  const title = isEdit ? `Edit ${media.title}` : "Add New Media"

  return (
    <div>
      <h2 style="margin-bottom: 30px; color: #4a5568; font-size: 2rem;">{title}</h2>

      <form method="post" action={isEdit ? `/media/${media.id}` : "/media"} id="media-form">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; max-width: 800px;">
          <div>
            <div class="form-row">
              <div class="form-group">
                <label for="type">Type *</label>
                <select id="type" name="type" required>
                  <option value="movie" selected={media?.type === "movie"}>
                    Movie
                  </option>
                  <option value="series" selected={media?.type === "series"}>
                    TV Series
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label for="title">Title *</label>
                <div style="position: relative;">
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={media?.title || ""}
                    required
                    autocomplete="off"
                    placeholder="Start typing to search..."
                  />
                  <div id="search-results" class="search-results"></div>
                </div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="year">Year</label>
                <input type="number" id="year" name="year" value={media?.year || ""} min="1900" max="2030" readonly />
              </div>

              <div class="form-group">
                <label for="public_rating">Public Rating</label>
                <input
                  type="number"
                  id="public_rating"
                  name="public_rating"
                  value={media?.public_rating || ""}
                  min="1"
                  max="10"
                  step="0.1"
                  readonly
                />
              </div>
            </div>

            <div class="form-group">
              <label for="status">Status</label>
              <select id="status" name="status">
                <option value="">Not set</option>
                <option value="to_watch" selected={media?.status === "to_watch"}>
                  To Watch
                </option>
                <option value="watching" selected={media?.status === "watching"}>
                  Watching
                </option>
                <option value="completed" selected={media?.status === "completed"}>
                  Completed
                </option>
                <option value="dropped" selected={media?.status === "dropped"}>
                  Dropped
                </option>
              </select>
            </div>

            <div class="form-group">
              <label for="description">Description</label>
              <textarea
                id="description"
                name="description"
                rows={6}
                placeholder="Brief description of the movie/series..."
                readonly
              >
                {media?.description || ""}
              </textarea>
            </div>

            <div class="form-group">
              <label for="cover_art">Cover Art URL</label>
              <input type="url" id="cover_art" name="cover_art" value={media?.cover_art || ""} readonly />
              <div id="cover-preview" style="margin-top: 10px;">
                {media?.cover_art && (
                  <div>
                    <img
                      src={media.cover_art || "/placeholder.svg"}
                      alt="Cover preview"
                      style="max-width: 150px; border-radius: 8px;"
                      onError="this.style.display='none'; this.nextElementSibling.style.display='block'"
                    />
                    <div class="image-placeholder" style="display: none; width: 150px; height: 225px;">
                      No Image
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <div
              class="form-group rating-dependent"
              style={`display: ${media?.status && media.status !== "to_watch" ? "block" : "none"}`}
            >
              <label for="personal_rating">My Rating (1-10)</label>
              <input
                type="number"
                id="personal_rating"
                name="personal_rating"
                value={media?.personal_rating || ""}
                min="1"
                max="10"
              />
            </div>

            <div
              class="form-group series-only rating-dependent"
              style={`display: ${media?.type === "series" && media?.status && media.status !== "to_watch" ? "block" : "none"}`}
            >
              <label>Last Watched Episode</label>
              <div style="display: flex; gap: 10px;">
                <input
                  type="number"
                  name="last_watched_season"
                  placeholder="Season"
                  value={media?.last_watched_season || ""}
                  min="1"
                  style="flex: 1;"
                />
                <input
                  type="number"
                  name="last_watched_episode"
                  placeholder="Episode"
                  value={media?.last_watched_episode || ""}
                  min="1"
                  style="flex: 1;"
                />
              </div>
            </div>

            <div
              class="form-group series-only rating-dependent"
              style={`display: ${media?.type === "series" && media?.status && media.status !== "to_watch" ? "block" : "none"}`}
            >
              <label for="rewatch_count">Rewatch Count</label>
              <input type="number" id="rewatch_count" name="rewatch_count" value={media?.rewatch_count || 0} min="0" />
            </div>

            <div class="form-group">
              <label for="notes">Notes</label>
              <textarea id="notes" name="notes" rows={6} placeholder="Personal notes, thoughts, etc...">
                {media?.notes || ""}
              </textarea>
            </div>
          </div>
        </div>

        <div style="display: flex;  gap: 10px; margin-top: 30px; max-width: 800px;justify-content: end;">
          <button type="submit" class="btn">
            {isEdit ? "Update Media" : "Add Media"}
          </button>
          <a href="/media" class="btn btn-secondary">
            Cancel
          </a>
        </div>
      </form>

      <script src="/static/media-form.js"></script>
    </div>
  )
}

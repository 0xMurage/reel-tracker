interface MediaListProps {
  media: any[]
  currentType: string
  currentStatus: string
  currentSearch: string
}

export const MediaList = ({ media, currentType, currentStatus, currentSearch }: MediaListProps) => {
  return (
    <div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
        <h2 style="color: #4a5568; font-size: 2rem; margin: 0;">All Media</h2>
        <a href="/media/add" class="btn">
          Add New Media
        </a>
      </div>

      <form method="get" class="filters">
        <select name="type">
          <option selected={currentType === ""}>
            All Types
          </option>
          <option value="movie" selected={currentType === "movie"}>
            Movies
          </option>
          <option value="series" selected={currentType === "series"}>
            TV Series
          </option>
        </select>

        <select name="status">
          <option selected={currentStatus === ""}>
            All Status
          </option>
          <option value="to_watch" selected={currentStatus === "to_watch"}>
            To Watch
          </option>
          <option value="watching" selected={currentStatus === "watching"}>
            Watching
          </option>
          <option value="completed" selected={currentStatus === "completed"}>
            Completed
          </option>
          <option value="dropped" selected={currentStatus === "dropped"}>
            Dropped
          </option>
        </select>

        <input
          type="text"
          name="search"
          placeholder="Search titles..."
          value={currentSearch}
          style="min-width: 200px;"
        />

        <button type="submit" class="btn">
          Filter
        </button>
      </form>

      <div class="grid grid-2">
        {media.map((item: any) => (
          <div class="card" key={item.id}>
            {item.cover_art && (
              <div class="card-background" style={`background-image: url('${item.cover_art}');`}></div>
            )}
            <div class="card-content">
              <div class="card-info">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 10px;">
                  <h3 style="color: #2d3748; font-size: 1.1rem; margin: 0; line-height: 1.3;">
                    <a href={`/media/${item.id}`} style="text-decoration: none; color: inherit;">
                      {item.title}
                    </a>
                  </h3>
                  <span class={`status-badge status-${item.status || "to_watch"}`}>{item.status || "to_watch"}</span>
                </div>

                <div style="margin-bottom: 12px;">
                  <span style="background: rgba(237, 242, 247, 0.9); padding: 3px 6px; border-radius: 4px; font-size: 11px; color: #4a5568; margin-right: 8px;">
                    {item.type}
                  </span>
                  {item.year && <span style="color: #718096; font-size: 13px;">({item.year})</span>}
                </div>

                <div style="display: flex; gap: 15px; margin-bottom: 12px; flex-wrap: wrap;">
                  {item.personal_rating && (
                    <div class="rating">
                      <span style="font-size: 13px;">My:</span>
                      <span class="rating-stars" style="font-size: 14px;">
                        {"★".repeat(Math.floor(item.personal_rating / 2))}
                        {"☆".repeat(5 - Math.floor(item.personal_rating / 2))}
                      </span>
                    </div>
                  )}

                  {item.public_rating && (
                    <div style={`font-size: 13px; color: ${item.cover_art ? "#484d55" : "#718096"};`}>
                      Public:{" "}
                      <span class="rating-stars" style="font-size: 14px;">
                        {"★".repeat(Math.floor(item.public_rating / 2))}
                        {"☆".repeat(5 - Math.floor(item.public_rating / 2))}
                      </span>
                    </div>
                  )}
                </div>

                {item.type === "series" && item.last_watched_season && (
                  <div style="margin-bottom: 12px; color: #718096; font-size: 13px;">
                    Last watched: S{item.last_watched_season}E{item.last_watched_episode}
                    {item.rewatch_count > 0 && ` (Rewatch #${item.rewatch_count})`}
                  </div>
                )}
              </div>
            </div>
            <div class="card-actions">
              <a href={`/media/${item.id}`} class="btn btn-secondary">
                View
              </a>
              <a href={`/media/${item.id}/edit`} class="btn">
                Edit
              </a>
            </div>
          </div>
        ))}
      </div>

      {media.length === 0 && (
        <div style="text-align: center; padding: 60px 20px; color: #718096;">
          <h3>No media found</h3>
          <p style="margin: 20px 0;">Try adjusting your filters or add some media!</p>
          <a href="/media/add" class="btn">
            Add Media
          </a>
        </div>
      )}
    </div>
  )
}

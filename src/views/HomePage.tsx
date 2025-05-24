interface HomePageProps {
  recentMedia: any[]
}

export const HomePage = ({ recentMedia }: HomePageProps) => {
  return (
    <div>
      <h2 style="margin-bottom: 30px; color: #4a5568; font-size: 2rem;">Recently Updated</h2>

      <div class="grid grid-3">
        {recentMedia.map((item: any) => (
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

                <div style="margin-bottom: 8px;">
                  <span style="background: rgba(237, 242, 247, 0.9); padding: 3px 6px; border-radius: 4px; font-size: 11px; color: #4a5568;">
                    {item.type} {item.year && `(${item.year})`}
                  </span>
                </div>

                {item.personal_rating && (
                  <div class="rating" style="margin-bottom: 8px;">
                    <span style="font-size: 13px;">My Rating:</span>
                    <span class="rating-stars" style="font-size: 14px;">
                      {"★".repeat(Math.floor(item.personal_rating / 2))}
                      {"☆".repeat(5 - Math.floor(item.personal_rating / 2))}
                    </span>
                    <span style="font-size: 13px;">{item.personal_rating}/10</span>
                  </div>
                )}

                {item.public_rating && (
                  <div style="margin-bottom: 8px; color: #718096; font-size: 13px;">
                    Public Rating: {item.public_rating}/10
                  </div>
                )}

                {item.type === "series" && item.last_watched_season && (
                  <div style="margin-bottom: 10px; color: #718096; font-size: 13px;">
                    Last watched: S{item.last_watched_season}E{item.last_watched_episode}
                    {item.rewatch_count > 0 && ` (Rewatch #${item.rewatch_count})`}
                  </div>
                )}
              </div>
            </div>
            <div class="card-actions">
              <a href={`/media/${item.id}/edit`} class="btn">
                Edit
              </a>
            </div>
          </div>
        ))}
      </div>

      {recentMedia.length === 0 && (
        <div style="text-align: center; padding: 60px 20px; color: #718096;">
          <h3>No media tracked yet</h3>
          <p style="margin: 20px 0;">Start by adding your first movie or TV series!</p>
          <a href="/media/add" class="btn">
            Add Media
          </a>
        </div>
      )}
    </div>
  )
}

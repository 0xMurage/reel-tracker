interface MediaDetailProps {
  media: any
}

export const MediaDetail = ({ media }: MediaDetailProps) => {
  return (
    <div>
      <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 30px;">
        <div>
          <h2 style="color: #4a5568; font-size: 2.5rem; margin-bottom: 10px;">{media.title}</h2>
          <div style="display: flex; gap: 15px; align-items: center;">
            <span style="background: #edf2f7; padding: 6px 12px; border-radius: 6px; font-size: 14px; color: #4a5568;">
              {media.type} {media.year && `(${media.year})`}
            </span>
            <span class={`status-badge status-${media.status || "to_watch"}`}>{media.status || "to_watch"}</span>
          </div>
        </div>
        <div style="display: flex; gap: 10px;">
          <a href={`/media/${media.id}/edit`} class="btn">
            Edit
          </a>
          <a href="/media" class="btn btn-secondary">
            Back to List
          </a>
        </div>
      </div>

      <div class="grid grid-2">
        <div>
          {media.cover_art && (
            <div style="margin-bottom: 30px;">
              <img
                src={media.cover_art || "/placeholder.svg"}
                alt={`${media.title} cover`}
                style="width: 100%; max-width: 300px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);"
                onerror="this.src='/placeholder.svg?height=400&width=300'"
              />
            </div>
          )}

          {media.description && (
            <div style="margin-bottom: 30px;">
              <h3 style="color: #4a5568; margin-bottom: 15px;">Description</h3>
              <p style="color: #718096; line-height: 1.6;">{media.description}</p>
            </div>
          )}
        </div>

        <div>
          <div class="card" style="margin-bottom: 20px;">
            <h3 style="color: #4a5568; margin-bottom: 20px;">Ratings</h3>

            {media.personal_rating && (
              <div class="rating" style="margin-bottom: 15px;">
                <span style="font-weight: 500;">My Rating:</span>
                <span class="rating-stars">
                  {"★".repeat(Math.floor(media.personal_rating / 2))}
                  {"☆".repeat(5 - Math.floor(media.personal_rating / 2))}
                </span>
                <span style="font-weight: 500;">{media.personal_rating}/10</span>
              </div>
            )}

            {media.public_rating && (
              <div style="color: #718096;">
                <span style="font-weight: 500;">Public Rating:</span> {media.public_rating}/10
              </div>
            )}

            {!media.personal_rating && !media.public_rating && (
              <p style="color: #a0aec0; font-style: italic;">No ratings available</p>
            )}
          </div>

          {media.type === "series" && (
            <div class="card" style="margin-bottom: 20px;">
              <h3 style="color: #4a5568; margin-bottom: 20px;">Series Progress</h3>

              {media.last_watched_season && media.last_watched_episode ? (
                <div>
                  <div style="margin-bottom: 10px;">
                    <span style="font-weight: 500;">Last Watched:</span>
                    Season {media.last_watched_season}, Episode {media.last_watched_episode}
                  </div>

                  {media.rewatch_count > 0 && (
                    <div style="margin-bottom: 10px; color: #718096;">
                      <span style="font-weight: 500;">Rewatches:</span> {media.rewatch_count}
                    </div>
                  )}
                </div>
              ) : (
                <p style="color: #a0aec0; font-style: italic;">No progress tracked</p>
              )}
            </div>
          )}

          {media.notes && (
            <div class="card">
              <h3 style="color: #4a5568; margin-bottom: 15px;">Notes</h3>
              <p style="color: #718096; line-height: 1.6; white-space: pre-wrap;">{media.notes}</p>
            </div>
          )}

          {media.watched_at && (
            <div style="margin-top: 20px; color: #a0aec0; font-size: 14px;">
              Last updated: {new Date(media.watched_at).toLocaleDateString()}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

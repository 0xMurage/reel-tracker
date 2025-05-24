class MediaForm {
  constructor() {
    this.searchTimeout = null
    this.titleInput = document.getElementById("title")
    this.searchResults = document.getElementById("search-results")
    this.typeSelect = document.getElementById("type")
    this.statusSelect = document.getElementById("status")
    this.seriesFields = document.querySelectorAll(".series-only")
    this.ratingDependentFields = document.querySelectorAll(".rating-dependent")

    this.init()
  }

  init() {
    this.setupEventListeners()
    this.toggleSeriesFields()
    this.toggleRatingDependentFields()
  }

  setupEventListeners() {
    // Handle type change to show/hide series fields
    this.typeSelect.addEventListener("change", () => {
      this.toggleSeriesFields()
      this.toggleRatingDependentFields()
    })

    // Handle status change to show/hide rating dependent fields
    this.statusSelect.addEventListener("change", () => {
      this.toggleRatingDependentFields()
    })

    // Handle title search
    this.titleInput.addEventListener("input", (e) => {
      this.handleTitleSearch(e.target.value)
    })

    // Hide search results when clicking outside
    document.addEventListener("click", (e) => {
      if (!this.titleInput.contains(e.target) && !this.searchResults.contains(e.target)) {
        this.hideSearchResults()
      }
    })

    // Handle keyboard navigation
    this.titleInput.addEventListener("keydown", (e) => {
      this.handleKeyboardNavigation(e)
    })
  }

  toggleSeriesFields() {
    const isSeriesSelected = this.typeSelect.value === "series"
    this.seriesFields.forEach((field) => {
      if (isSeriesSelected) {
        field.classList.add("visible")
        field.style.display = "block"
      } else {
        field.classList.remove("visible")
        field.style.display = "none"
      }
    })
  }

  toggleRatingDependentFields() {
    const status = this.statusSelect.value
    const type = this.typeSelect.value
    const shouldShow = status !== "" && status !== "to_watch"

    this.ratingDependentFields.forEach((field) => {
      // Check if this is a series-only field
      const isSeriesOnly = field.classList.contains("series-only")

      if (shouldShow && (!isSeriesOnly || type === "series")) {
        field.classList.add("visible")
        field.style.display = "block"
      } else {
        field.classList.remove("visible")
        field.style.display = "none"
      }
    })
  }

  handleTitleSearch(query) {
    const trimmedQuery = query.trim()

    if (trimmedQuery.length < 2) {
      this.hideSearchResults()
      return
    }

    clearTimeout(this.searchTimeout)
    this.searchTimeout = setTimeout(async () => {
      try {
        const response = await fetch(
          `/media/search?q=${encodeURIComponent(trimmedQuery)}&type=${this.typeSelect.value}`,
        )
        const data = await response.json()

        if (data.results && data.results.length > 0) {
          this.displaySearchResults(data.results)
        } else {
          this.hideSearchResults()
        }
      } catch (error) {
        // tslint:disable-next-line:no-console
        console.error("Search error:", error)
        this.hideSearchResults()
      }
    }, 300)
  }

  displaySearchResults(results) {
    this.searchResults.innerHTML = results
      .map(
        (result, index) => `
      <div class="search-result-item" data-index="${index}" onclick="mediaForm.selectResult(${JSON.stringify(result).replace(/"/g, "&quot;")})">
        ${
          result.cover_art
            ? `<img src="${result.cover_art}" alt="${result.title}" class="search-result-image" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">`
            : ""
        }
        <div class="image-placeholder search-result-image" style="${result.cover_art ? "display: none;" : ""}">
          No Image
        </div>
        <div class="search-result-info">
          <div class="search-result-title">${result.title}</div>
          <div class="search-result-meta">${result.type} ${result.year ? `(${result.year})` : ""}</div>
          ${result.public_rating ? `<div class="search-result-meta">Rating: ${result.public_rating}/10</div>` : ""}
        </div>
      </div>
    `,
      )
      .join("")
    this.searchResults.style.display = "block"
  }

  selectResult(result) {
    // Fill form fields
    document.getElementById("title").value = result.title
    document.getElementById("type").value = result.type
    document.getElementById("year").value = result.year || ""
    document.getElementById("public_rating").value = result.public_rating || ""
    document.getElementById("description").value = result.description || ""
    document.getElementById("cover_art").value = result.cover_art || ""

    // Update cover preview
    this.updateCoverPreview(result.cover_art)

    this.hideSearchResults()
    this.toggleSeriesFields()
    this.toggleRatingDependentFields()
  }

  updateCoverPreview(coverArt) {
    const coverPreview = document.getElementById("cover-preview")
    if (coverArt) {
      coverPreview.innerHTML = `<img src="${coverArt}" alt="Cover preview" style="max-width: 150px; border-radius: 8px;" onerror="this.style.display='none'; this.nextElementSibling.style.display='block'">
      <div class="image-placeholder" style="display: none; width: 150px; height: 225px;">No Image</div>`
    } else {
      coverPreview.innerHTML = ""
    }
  }

  hideSearchResults() {
    this.searchResults.style.display = "none"
  }

  handleKeyboardNavigation(e) {
    const items = this.searchResults.querySelectorAll(".search-result-item")
    if (items.length === 0) return

    let currentIndex = -1
    const currentSelected = this.searchResults.querySelector(".search-result-item.selected")
    if (currentSelected) {
      currentIndex = Number.parseInt(currentSelected.dataset.index)
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        currentIndex = Math.min(currentIndex + 1, items.length - 1)
        this.highlightResult(currentIndex)
        break
      case "ArrowUp":
        e.preventDefault()
        currentIndex = Math.max(currentIndex - 1, 0)
        this.highlightResult(currentIndex)
        break
      case "Enter":
        e.preventDefault()
        if (currentIndex >= 0) {
          items[currentIndex].click()
        }
        break
      case "Escape":
        this.hideSearchResults()
        break
    }
  }

  highlightResult(index) {
    const items = this.searchResults.querySelectorAll(".search-result-item")
    items.forEach((item, i) => {
      if (i === index) {
        item.classList.add("selected")
        item.style.backgroundColor = "#edf2f7"
      } else {
        item.classList.remove("selected")
        item.style.backgroundColor = ""
      }
    })
  }
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("media-form")) {
    window.mediaForm = new MediaForm()
  }
})

import { useState } from "react";
import { catalog, filterConfig, searches } from "./data";

const defaultFilters = {
  gender: "all",
  hairType: "all",
  hairColor: "all",
  porosity: "all",
  length: "all"
};

function matchesFilter(item, key, value) {
  return value === "all" || item[key] === value;
}

function StarRating({ rating, onRate }) {
  const rounded = Math.round(rating);

  return (
    <div className="stars" aria-label="Rate this style">
      {[1, 2, 3, 4, 5].map((value) => (
        <button
          key={value}
          type="button"
          className={`star ${value <= rounded ? "active" : ""}`}
          onClick={() => onRate(value)}
          aria-label={`Rate ${value} stars`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

function FeedCard({ item, isSaved, onSave, onRate }) {
  return (
    <article className={`feed-card ${isSaved ? "feed-card-saved" : ""}`}>
      <div className="card-visual" style={{ background: item.theme }}>
        <div className="glow-ring" />
        <div className="visual-label">{item.visual}</div>
      </div>

      <div className="card-body">
        <div className="card-topline">
          <span className="category-chip">{item.category}</span>
          <button className="save-button" type="button" onClick={() => onSave(item.id)}>
            {isSaved ? "Saved" : "Save"}
          </button>
        </div>

        <h3>{item.title}</h3>
        <p className="card-description">{item.description}</p>

        <div className="meta-tags">
          {[item.gender, item.hairType, item.hairColor, `${item.porosity} porosity`, item.length].map((tag) => (
            <span key={`${item.id}-${tag}`}>{tag}</span>
          ))}
        </div>

        <div className="card-footer">
          <div className="rating-block">
            <StarRating rating={item.rating} onRate={(value) => onRate(item.id, value)} />
            <span className="rating-text">{item.rating.toFixed(1)} community rating</span>
          </div>
          <span className="engagement">{item.engagement}</span>
        </div>
      </div>
    </article>
  );
}

function StackCard({ eyebrow, title, text }) {
  return (
    <article className="stack-card">
      <p className="eyebrow">{eyebrow}</p>
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}

export default function App() {
  const [filters, setFilters] = useState(defaultFilters);
  const [items, setItems] = useState(catalog);
  const [savedItems, setSavedItems] = useState([]);

  const filtered = items.filter(
    (item) =>
      matchesFilter(item, "gender", filters.gender) &&
      matchesFilter(item, "hairType", filters.hairType) &&
      matchesFilter(item, "hairColor", filters.hairColor) &&
      matchesFilter(item, "porosity", filters.porosity) &&
      matchesFilter(item, "length", filters.length)
  );

  const visibleItems = filtered.length ? filtered : items;
  const trending = [...visibleItems].sort((a, b) => b.rating - a.rating).slice(0, 4);
  const tutorials = visibleItems.filter((item) => item.category === "Tutorial").slice(0, 4);
  const suggestionSeed = visibleItems.slice(0, 2).map((item) => item.title);

  function handleFilterChange(key, value) {
    setFilters((current) => ({
      ...current,
      [key]: value
    }));
  }

  function handleReset() {
    setFilters(defaultFilters);
  }

  function handleSave(id) {
    setSavedItems((current) =>
      current.includes(id) ? current.filter((entry) => entry !== id) : [...current, id]
    );
  }

  function handleRate(id, value) {
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              rating: Number(((item.rating + value) / 2).toFixed(1))
            }
          : item
      )
    );
  }

  return (
    <div className="page-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">S</div>
          <div>
            <p className="eyebrow">Hair Discovery</p>
            <h1>Strand Social</h1>
          </div>
        </div>

        <nav className="nav-pills" aria-label="Primary">
          {["Discover", "Trending", "Tutorials", "Cuts + Color", "For You"].map((label, index) => (
            <button key={label} className={`nav-pill ${index === 0 ? "active" : ""}`} type="button">
              {label}
            </button>
          ))}
        </nav>

        <section className="filter-panel">
          <div className="section-heading">
            <p className="eyebrow">Refine the feed</p>
            <h2>Smart Filters</h2>
          </div>

          {filterConfig.map((filter) => (
            <div className="filter-group" key={filter.id}>
              <label htmlFor={filter.id}>{filter.label}</label>
              <select
                id={filter.id}
                value={filters[filter.id]}
                onChange={(event) => handleFilterChange(filter.id, event.target.value)}
              >
                {filter.options.map((option) => (
                  <option key={option} value={option}>
                    {option === "all" ? "All" : option}
                  </option>
                ))}
              </select>
            </div>
          ))}

          <button type="button" id="resetFilters" className="ghost-button" onClick={handleReset}>
            Reset filters
          </button>
        </section>

        <section className="search-insights">
          <div className="section-heading">
            <p className="eyebrow">Most searched</p>
            <h2>Right Now</h2>
          </div>
          <div className="tag-list">
            {searches.map((term) => (
              <span key={term}>{term}</span>
            ))}
          </div>
        </section>
      </aside>

      <main className="main-content">
        <section className="hero-card">
          <div className="hero-copy">
            <p className="eyebrow">Template App Concept</p>
            <h2>Hair inspiration with the energy of Pinterest and Instagram.</h2>
            <p>
              Explore cuts, styling tutorials, color transformations, and community ratings in one
              vivid social feed designed for discoverability.
            </p>
            <div className="hero-actions">
              <button className="primary-button" type="button">
                Launch community feed
              </button>
              <button className="ghost-button" type="button">
                Create moodboard
              </button>
            </div>
          </div>

          <div className="hero-stats">
            <div className="stat-tile">
              <span>24K</span>
              <p>Looks bookmarked this week</p>
            </div>
            <div className="stat-tile accent">
              <span>91%</span>
              <p>Users find styles via personalized suggestions</p>
            </div>
            <div className="stat-tile">
              <span>4.8</span>
              <p>Average tutorial rating from beauty creators</p>
            </div>
          </div>
        </section>

        <section className="top-strip">
          <article className="spotlight-card">
            <div>
              <p className="eyebrow">Trending board</p>
              <h3>Soft copper cuts and glossy silk presses are leading today.</h3>
            </div>
            <div className="spotlight-badges">
              <span>3.2K saves</span>
              <span>1.1K ratings</span>
              <span>970 shares</span>
            </div>
          </article>

          <article className="suggestion-card">
            <p className="eyebrow">For you</p>
            <h3>
              {suggestionSeed.length
                ? `Suggestions tuned to ${suggestionSeed.join(" and ")}.`
                : "Your feed will refresh as soon as filters match new looks."}
            </h3>
            <p>
              {suggestionSeed.length
                ? "Blend tutorial relevance, rating history, and repeated searches into a personalized “For You” feed."
                : "Try widening your filter mix to surface more cuts, color ideas, and styling videos."}
            </p>
          </article>
        </section>

        <section className="content-section">
          <div className="section-heading row">
            <div>
              <p className="eyebrow">Main feed</p>
              <h2>Hairstyles, haircuts, and color ideas</h2>
            </div>
            <span className="results-pill">{visibleItems.length} looks in feed</span>
          </div>

          <div className="feed-grid">
            {visibleItems.map((item) => (
              <FeedCard
                key={item.id}
                item={item}
                isSaved={savedItems.includes(item.id)}
                onSave={handleSave}
                onRate={handleRate}
              />
            ))}
          </div>
        </section>

        <section className="bottom-grid">
          <section className="content-section compact">
            <div className="section-heading row">
              <div>
                <p className="eyebrow">Trending now</p>
                <h2>Most loved looks</h2>
              </div>
            </div>

            <div className="stack-list">
              {trending.map((item, index) => (
                <StackCard
                  key={item.id}
                  eyebrow={`#${index + 1} trending`}
                  title={item.title}
                  text={`${item.category} • ${item.rating.toFixed(1)} stars • ${item.engagement}`}
                />
              ))}
            </div>
          </section>

          <section className="content-section compact">
            <div className="section-heading row">
              <div>
                <p className="eyebrow">Creator tutorials</p>
                <h2>Watch next</h2>
              </div>
            </div>

            <div className="stack-list">
              {tutorials.map((item) => (
                <StackCard
                  key={item.id}
                  eyebrow="Play next"
                  title={item.title}
                  text={item.description}
                />
              ))}
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}

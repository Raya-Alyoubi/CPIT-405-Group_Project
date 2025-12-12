import React, { useState } from "react";
import ArtworkCard from "../components/ArtworkCard";
import ArtworkModal from "../components/ArtworkModal";
import { searchPaintings, getArtworkById } from "../services/api";

const PAGE_SIZE = 20;

function mapArtwork(raw) {
  return {
    id: raw.objectID,
    title: raw.title,
    artist: raw.artistDisplayName || "Unknown Artist",
    image: raw.primaryImageSmall,
    dimensions: raw.dimensions,
    objectDate: raw.objectDate,
  };
}

function Search() {
  const [term, setTerm] = useState("");
  const [objectIds, setObjectIds] = useState([]);
  const [artworks, setArtworks] = useState([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedArtwork, setSelectedArtwork] = useState(null);

  const loadArtworks = async (ids, start, end) => {
    const slice = ids.slice(start, end);
    const loaded = [];

    for (const id of slice) {
      try {
        const raw = await getArtworkById(id);
        if (!raw.primaryImageSmall) continue;
        loaded.push(mapArtwork(raw));
      } catch {}
    }
    return loaded;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const q = term.trim();
    if (!q) return;

    try {
      setError("");
      setLoading(true);

      const ids = await searchPaintings(q);
      setObjectIds(ids);
      setVisibleCount(PAGE_SIZE);

      const firstBatch = await loadArtworks(ids, 0, PAGE_SIZE);
      setArtworks(firstBatch);

      if (ids.length === 0) setError("No results found.");
    } catch (err) {
      console.error(err);
      setError("Search failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = async () => {
    const nextEnd = visibleCount + PAGE_SIZE;
    const more = await loadArtworks(objectIds, visibleCount, nextEnd);
    setArtworks((prev) => [...prev, ...more]);
    setVisibleCount(nextEnd);
  };

  return (
    <div className="page search-page">
      <div className="search-header">
        <h1 className="section-title">Search</h1>

        <form className="search-bar" onSubmit={handleSubmit}>
          <input
            className="search-input"
            type="text"
            placeholder="Search artworks…"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
          />
          <button className="search-button" type="submit" disabled={loading}>
            {loading ? "Searching…" : "Search"}
          </button>
        </form>

        {error && <p className="error-message">{error}</p>}
      </div>

      <div className="search-results">
        <div className="cards-grid">
          {artworks.map((art) => (
            <ArtworkCard key={art.id} artwork={art} onReadMore={setSelectedArtwork} />
          ))}
        </div>

        {artworks.length > 0 && visibleCount < objectIds.length && (
          <button className="load-more-button" onClick={handleLoadMore}>
            Load more
          </button>
        )}
      </div>

      {selectedArtwork && (
        <ArtworkModal artwork={selectedArtwork} onClose={() => setSelectedArtwork(null)} />
      )}
    </div>
  );
}

export default Search;

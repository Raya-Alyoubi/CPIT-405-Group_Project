import React, { useEffect, useState } from "react";
import ArtworkCard from "../components/ArtworkCard";
import ArtworkModal from "../components/ArtworkModal";
import { getPaintingIds, getArtworkById } from "../services/api";

const PAGE_SIZE = 20;
const PREFETCH_AHEAD = 20;

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

function imageExists(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

function Home() {
  const [objectIds, setObjectIds] = useState([]);
  const [cachedArtworks, setCachedArtworks] = useState([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [selectedArtwork, setSelectedArtwork] = useState(null);

  const [initialLoading, setInitialLoading] = useState(true);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadInitial = async () => {
      try {
        setInitialLoading(true);
        setError("");

        const ids = await getPaintingIds();
        setObjectIds(ids);

        // Fill initial cache: PAGE_SIZE visible + PREFETCH_AHEAD ready
        await fillCacheRange(ids, 0, PAGE_SIZE + PREFETCH_AHEAD);
      } catch (err) {
        console.error(err);
        setError("Failed to load artworks from the museum API.");
      } finally {
        setInitialLoading(false);
      }
    };

    loadInitial();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fillCacheRange = async (ids, start, end) => {
    const slice = ids.slice(start, end);
    const newArtworks = [];

    for (const id of slice) {
      try {
        const raw = await getArtworkById(id);
        if (!raw?.primaryImageSmall) continue;

        // validate image URL (some Met items return broken image links)
        const ok = await imageExists(raw.primaryImageSmall);
        if (!ok) continue;

        newArtworks.push(mapArtwork(raw));
      } catch (e) {
        console.warn("Failed to load artwork", id, e);
      }
    }

    setCachedArtworks((prev) => [...prev, ...newArtworks]);
  };

  const handleLoadMore = async () => {
    const newVisible = visibleCount + PAGE_SIZE;
    setVisibleCount(newVisible);

    // prefetch when needed
    const requiredInCache = newVisible + PREFETCH_AHEAD;
    if (
      requiredInCache > cachedArtworks.length &&
      cachedArtworks.length < objectIds.length
    ) {
      try {
        setLoadMoreLoading(true);
        await fillCacheRange(
          objectIds,
          cachedArtworks.length,
          cachedArtworks.length + PAGE_SIZE + PREFETCH_AHEAD
        );
      } finally {
        setLoadMoreLoading(false);
      }
    }
  };

  const visibleArtworks = cachedArtworks.slice(0, visibleCount);

  return (
    <div className="page home-page">
      <div className="home-header">
        <div className="home-title-group">
          <h1 className="home-title-top">Metropolitan</h1>
          <h2 className="home-title-bottom">Museum Collections</h2>
          <p style={{ opacity: 0.8, marginTop: 6 }}>
            Open Search to find paintings, Departments to browse by department, and Likes to see items you liked.
          </p>
        </div>
      </div>

      {error && <p className="error-message">{error}</p>}

      {initialLoading ? (
        <p>Loading artworks…</p>
      ) : (
        <>
          <div className="cards-grid">
            {visibleArtworks.map((art) => (
              <ArtworkCard
                key={art.id}
                artwork={art}
                onReadMore={() => setSelectedArtwork(art)}
              />
            ))}
          </div>

          {visibleArtworks.length > 0 && visibleArtworks.length < cachedArtworks.length && (
            <button
              className="load-more-button"
              onClick={handleLoadMore}
              disabled={loadMoreLoading}
            >
              {loadMoreLoading ? "Loading…" : "Load more"}
            </button>
          )}
        </>
      )}

      {selectedArtwork && (
        <ArtworkModal
          artwork={selectedArtwork}
          onClose={() => setSelectedArtwork(null)}
        />
      )}
    </div>
  );
}

export default Home;

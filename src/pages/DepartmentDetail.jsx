import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { searchPaintingsByDepartment, getArtworkById } from "../services/api";
import ArtworkCard from "../components/ArtworkCard";
import ArtworkModal from "../components/ArtworkModal";

const PAGE_SIZE = 12;

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

function DepartmentDetail() {
  const { id } = useParams();
  const location = useLocation();
  const departmentName = location.state?.name || `Department ${id}`;

  const [objectIds, setObjectIds] = useState([]);
  const [artworks, setArtworks] = useState([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(true);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const ids = await searchPaintingsByDepartment(id);
        setObjectIds(ids);

        const slice = ids.slice(0, PAGE_SIZE);
        const loaded = [];

        for (const objId of slice) {
          try {
            const raw = await getArtworkById(objId);
            if (!raw.primaryImageSmall) continue;
            loaded.push(mapArtwork(raw));
          } catch {}
        }

        setArtworks(loaded);
      } catch (err) {
        console.error("Failed to load department paintings", err);
        setError("Failed to load department artworks");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const handleLoadMore = async () => {
    const nextSlice = objectIds.slice(visibleCount, visibleCount + PAGE_SIZE);
    const loaded = [];

    for (const objId of nextSlice) {
      try {
        const raw = await getArtworkById(objId);
        if (!raw.primaryImageSmall) continue;
        loaded.push(mapArtwork(raw));
      } catch {}
    }

    setArtworks((prev) => [...prev, ...loaded]);
    setVisibleCount((prev) => prev + PAGE_SIZE);
  };

  return (
    <div className="page department-detail-page">
      <h1 className="section-title">{departmentName}</h1>

      {error && <p className="error-message">{error}</p>}

      {loading ? (
        <p>Loading artworks…</p>
      ) : (
        <>
          <div className="cards-grid">
            {artworks.map((art) => (
              <ArtworkCard key={art.id} artwork={art} onReadMore={setSelectedArtwork} />
            ))}
          </div>

          {visibleCount < objectIds.length && (
            <button className="load-more-button" onClick={handleLoadMore}>
              Load more
            </button>
          )}
        </>
      )}

      {selectedArtwork && (
        <ArtworkModal artwork={selectedArtwork} onClose={() => setSelectedArtwork(null)} />
      )}
    </div>
  );
}

export default DepartmentDetail;

import React, { useState } from "react";
import { useLikes } from "../context/LikesContext";
import ArtworkCard from "../components/ArtworkCard";
import ArtworkModal from "../components/ArtworkModal";

function Likes() {
  const { likedArtworks } = useLikes();
  const [selectedArtwork, setSelectedArtwork] = useState(null);

  return (
    <div className="page likes-page">
      <h1 className="section-title">Likes</h1>

      {likedArtworks.length === 0 ? (
        <p className="muted-text">No liked artworks yet.</p>
      ) : (
        <div className="cards-grid">
          {likedArtworks.map((art) => (
            <ArtworkCard key={art.id} artwork={art} onReadMore={setSelectedArtwork} />
          ))}
        </div>
      )}

      {selectedArtwork && (
        <ArtworkModal artwork={selectedArtwork} onClose={() => setSelectedArtwork(null)} />
      )}
    </div>
  );
}

export default Likes;

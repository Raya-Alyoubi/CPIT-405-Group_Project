import React from "react";
import { useLikes } from "../context/LikesContext";

const CARD_COLORS = ["#e3d5ca", "#d5bdaf", "#b392ac", "#acb5aa", "#b08968"];

function getCardColor(id) {
  const index = id % CARD_COLORS.length;
  return CARD_COLORS[index];
}

function ArtworkCard({ artwork, onReadMore }) {
  const { toggleLike, isLiked } = useLikes();
  const liked = isLiked(artwork.id);

  const handleLike = (e) => {
    e.stopPropagation();
    toggleLike(artwork);
  };

  const handleReadMoreClick = (e) => {
    e.stopPropagation();
    onReadMore(artwork);
  };

  return (
    <div
      className="art-card"
      style={{ backgroundColor: getCardColor(artwork.id) }}
      onClick={handleReadMoreClick}
    >
      {artwork.image ? (
        <img src={artwork.image} alt={artwork.title} className="art-image" />
      ) : (
        <div className="art-image placeholder">No image</div>
      )}

      <div className="art-card-content">
        <h3 className="art-title">{artwork.title}</h3>
        <p className="art-artist">{artwork.artist || "Unknown Artist"}</p>

        <div className="art-card-footer">
          <button className="like-button" onClick={handleLike}>
            {liked ? "♥ Liked" : "♡ Like"}
          </button>
          <button className="readmore-button" onClick={handleReadMoreClick}>
            Read more
          </button>
        </div>
      </div>
    </div>
  );
}

export default ArtworkCard;

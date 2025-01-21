function SpotTile({ spot, onClick }) {
  return (
    <div className="spot-tile" onClick={onClick}>
      <div className="spot-tile-image-container">
        <img
          src={spot.previewImage}
          alt={spot.name}
          className="spot-tile-image"
        />
      </div>
      <div className="spot-tile-details">
        <div className="spot-tile-header">
          <span className="spot-location">
            {spot.city}, {spot.state}
          </span>
          {spot.avgRating !== undefined && (
            <span className="spot-rating">
              <i className="fa fa-star"></i>
              {Number(spot.avgRating).toFixed(1)}
            </span>
          )}
        </div>
        <div className="spot-tile-footer">
          <span className="spot-price">${spot.price} night</span>
        </div>
      </div>
    </div>
  );
}

export default SpotTile;

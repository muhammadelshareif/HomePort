import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchSpots } from "../../store/spots";
import "./SpotsList.css";

function SpotsList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const spots = useSelector((state) => Object.values(state.spots.allSpots));

  useEffect(() => {
    dispatch(fetchSpots());
  }, [dispatch]);

  const handleSpotClick = (spotId) => {
    navigate(`/spots/${spotId}`);
  };

  return (
    <div className="spots-container">
      <div className="spots-grid">
        {spots.map((spot) => (
          <div
            key={spot.id}
            className="spot-tile"
            onClick={() => handleSpotClick(spot.id)}
            title={spot.name} // This creates the tooltip
          >
            <div className="spot-image-container">
              <img
                src={spot.previewImage}
                alt={spot.name}
                className="spot-image"
              />
            </div>
            <div className="spot-info">
              <div className="spot-location-rating">
                <span className="spot-location">
                  {spot.city}, {spot.state}
                </span>
                <span className="spot-rating">
                  <i className="fas fa-star"></i>
                  {spot.avgRating ? Number(spot.avgRating).toFixed(1) : "New"}
                </span>
              </div>
              <div className="spot-price">
                <span className="price">${spot.price}</span>
                <span className="night">night</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SpotsList;

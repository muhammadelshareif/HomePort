import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchSpots } from "../../store/spots";
import "./SpotsList.css";

function SpotsList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const spots = useSelector((state) => Object.values(state.spots.allSpots));

  // Fetch spots data when the component mounts
  useEffect(() => {
    dispatch(fetchSpots());
  }, [dispatch]);

  // Log spots data to debug and ensure multiple spots are loaded
  console.log("Spots:", spots);

  const handleSpotClick = (spotId) => {
    navigate(`/spots/${spotId}`);
  };

  return (
    <div className="spots-container">
      <div className="spots-grid">
        {spots.length === 0 ? (
          <p>No spots available</p> // If no spots, display a message
        ) : (
          spots.map((spot) => (
            <div
              key={spot.id}
              className="spot-tile"
              onClick={() => handleSpotClick(spot.id)}
              title={spot.name} // Tooltip shows the spot name
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
                    {spot.avgRating
                      ? Number(spot.avgRating).toFixed(1)
                      : "New"}{" "}
                    {/* Display average rating or "New" */}
                  </span>
                </div>
                <div className="spot-price">
                  <span className="price">${spot.price}</span>
                  <span className="night">night</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default SpotsList;

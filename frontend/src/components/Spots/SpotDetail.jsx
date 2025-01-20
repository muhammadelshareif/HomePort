import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSpotDetails } from "../../../store/spots";
import "./SpotsList.css"; // Using existing CSS file

function SpotDetails() {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const spot = useSelector((state) => state.spots.currentSpot);

  useEffect(() => {
    dispatch(fetchSpotDetails(spotId));
  }, [dispatch, spotId]);

  // If spot is not loaded yet
  if (!spot) {
    return <div>Loading...</div>;
  }

  const handleReserveClick = () => {
    alert("Feature coming soon");
  };

  // Determine primary (large) image and secondary (small) images
  const primaryImage =
    spot.SpotImages?.find((img) => img.preview)?.url ||
    spot.SpotImages?.[0]?.url;
  const secondaryImages =
    spot.SpotImages?.filter((img) => !img.preview).slice(0, 4) || [];

  return (
    <div className="spot-details-container">
      <h1>{spot.name}</h1>
      <div className="spot-location">
        {spot.city}, {spot.state}, {spot.country}
      </div>

      <div className="spot-images-container">
        <div className="primary-image">
          <img src={primaryImage} alt={`${spot.name} primary view`} />
        </div>
        <div className="secondary-images">
          {secondaryImages.map((img, index) => (
            <img
              key={img.id}
              src={img.url}
              alt={`${spot.name} view ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="spot-info-container">
        <div className="spot-description">
          <div className="hosted-by">
            Hosted by {spot.Owner?.firstName} {spot.Owner?.lastName}
          </div>
          <p>{spot.description}</p>
        </div>

        <div className="spot-callout-box">
          <div className="spot-price-container">
            <span className="price">${spot.price}</span>
            <span className="night">night</span>
          </div>
          <button className="reserve-button" onClick={handleReserveClick}>
            Reserve
          </button>
        </div>
      </div>
    </div>
  );
}

export default SpotDetails;

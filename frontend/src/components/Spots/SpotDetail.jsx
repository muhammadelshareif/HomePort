import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSpotDetails } from "../../store/spots";
import "./SpotDetail.css"; // Assuming a separate file for the Spot Detail Page styles

function SpotDetails() {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const spot = useSelector((state) => state.spots.currentSpot);

  useEffect(() => {
    dispatch(fetchSpotDetails(spotId));
  }, [dispatch, spotId]);

  if (!spot) return <div>Loading...</div>;

  const primaryImage =
    spot.SpotImages?.find((img) => img.preview)?.url ||
    spot.SpotImages?.[0]?.url;

  const secondaryImages =
    spot.SpotImages?.filter((img) => !img.preview).slice(0, 4) || [];

  const { avgRating, numReviews, Reviews = [] } = spot;

  const reviewSummary =
    numReviews > 0
      ? `${avgRating.toFixed(1)} · ${numReviews} ${
          numReviews === 1 ? "Review" : "Reviews"
        }`
      : "New";

  const sortedReviews = [...Reviews].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="spot-details-container">
      <h1>{spot.name}</h1>
      <div className="spot-location">
        {spot.city}, {spot.state}, {spot.country}
      </div>

      <div className="review-summary">
        <i className="fa fa-star"></i> {reviewSummary}
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
          <div className="spot-price">
            <span className="price">${spot.price}</span>
            <span className="night">night</span>
          </div>
          <button
            className="reserve-button"
            onClick={() => alert("Feature coming soon")}
          >
            Reserve
          </button>
        </div>
      </div>

      <h2>Reviews</h2>
      {numReviews === 0 ? (
        <p className="no-reviews-message">Be the first to post a review!</p>
      ) : (
        <div className="review-list">
          {sortedReviews.map((review) => (
            <div key={review.id} className="review-item">
              <p className="review-author">{review.User.firstName}</p>
              <p className="review-date">
                {new Date(review.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <p className="review-text">{review.review}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SpotDetails;

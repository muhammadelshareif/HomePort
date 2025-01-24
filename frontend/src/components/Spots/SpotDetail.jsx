import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchSpotDetails } from "../../store/spots";
import { deleteReview } from "../../store/reviews";
import OpenModalButton from "../../components/OpenModalButton";
import CreateReviewModal from "../Reviews/CreateReviewModal";
import DeleteReviewModal from "../Reviews/DeleteReviewModal";
import "./SpotDetail.css";

const DEFAULT_IMAGE = "https://placehold.co/600x400";

function SpotDetails() {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const spot = useSelector((state) => state.spots.currentSpot);
  const sessionUser = useSelector((state) => state.session.user);

  useEffect(() => {
    dispatch(fetchSpotDetails(spotId));
  }, [dispatch, spotId]);

  const handleDeleteReview = (reviewId) => {
    dispatch(deleteReview(reviewId)).then(() =>
      dispatch(fetchSpotDetails(spotId))
    );
  };

  if (!spot) return <div>Loading...</div>;

  const primaryImage =
    spot.SpotImages[spot.SpotImages?.length - 1].url || DEFAULT_IMAGE;
  const secondaryImages =
    spot?.SpotImages?.filter((img) => !img.preview)?.slice(0, 4) || [];

  const avgRating = spot.avgStarRating;
  const numReviews = spot.numReviews;

  const reviewSummary =
    numReviews > 0
      ? `${avgRating.toFixed(1)} · ${numReviews} ${
          numReviews === 1 ? "Review" : "Reviews"
        }`
      : "New";

  const sortedReviews = [...(spot.Reviews || [])].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const canPostReview = () => {
    if (!sessionUser) return false;
    // if (spot.ownerId === sessionUser.id) return false;
    // return !!sortedReviews.some((review) => review.userId === sessionUser.id);
    return true;
  };

  console.log(sortedReviews);

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
        {primaryImage && (
          <div className="primary-image">
            <img
              src={primaryImage || DEFAULT_IMAGE}
              alt={`${spot.name} primary view`}
              onError={(e) => (e.target.src = DEFAULT_IMAGE)}
            />
          </div>
        )}
        {secondaryImages && (
          <div className="secondary-images">
            {secondaryImages.map((img) => (
              <img
                key={img.id}
                src={img.url || DEFAULT_IMAGE}
                alt={`${spot.name} view`}
                onError={(e) => (e.target.src = DEFAULT_IMAGE)}
              />
            ))}
          </div>
        )}
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

      <div className="reviews-section">
        <h2>Reviews</h2>
        {canPostReview() && (
          <OpenModalButton
            buttonText="Post Your Review"
            modalComponent={
              <CreateReviewModal
                spotId={spotId}
                onReviewSubmit={() => dispatch(fetchSpotDetails(spotId))}
              />
            }
          />
        )}
        {numReviews === 0 ? (
          <p className="no-reviews-message">Be the first to post a review!</p>
        ) : (
          <div className="review-list">
            {sortedReviews.map((review) => (
              <div key={review.id} className="review-item">
                {/* <p className="review-author">{review.User.firstName}</p> */}
                <p className="review-date">
                  {new Date(review.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </p>
                <p className="review-text">{review.review}</p>
                {sessionUser && sessionUser.id === review.userId && (
                  <div className="review-actions">
                    <OpenModalButton
                      buttonText="Delete"
                      modalComponent={
                        <DeleteReviewModal
                          onConfirm={() => handleDeleteReview(review.id)}
                        />
                      }
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SpotDetails;

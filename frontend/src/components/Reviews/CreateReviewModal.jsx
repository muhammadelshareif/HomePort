import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "@context/Modal";
import { createReview } from "@store/reviews";
import "./CreateReviewModal.css";

function CreateReviewModal({ spotId }) {
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();
  const dispatch = useDispatch();

  // Star Rating Component
  const StarRating = () => {
    const [activeRating, setActiveRating] = useState(rating);

    return (
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${activeRating >= star ? "filled" : ""}`}
            onMouseEnter={() => setActiveRating(star)}
            onMouseLeave={() => setActiveRating(rating)}
            onClick={() => setRating(star)}
          >
            ★
          </span>
        ))}
        <span className="stars-label">Stars</span>
      </div>
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    try {
      await dispatch(
        createReview({
          spotId,
          review,
          stars: rating,
        })
      );
      closeModal();
    } catch (res) {
      const data = await res.json();
      if (data && data.errors) {
        setErrors(data.errors);
      }
    }
  };

  const isSubmitDisabled = review.length < 10 || rating === 0;

  return (
    <div className="create-review-modal">
      <h2>How was your stay?</h2>

      {errors.message && <p className="error-message">{errors.message}</p>}

      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="Leave your review here..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
          className="review-textarea"
        />

        <StarRating />

        <button
          type="submit"
          disabled={isSubmitDisabled}
          className={`submit-review-btn ${isSubmitDisabled ? "disabled" : ""}`}
        >
          Submit Your Review
        </button>
      </form>
    </div>
  );
}

export default CreateReviewModal;

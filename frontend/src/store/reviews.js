// store/reviews.js
import { csrfFetch } from "./csrf";

// Action Types
const CREATE_REVIEW = "reviews/CREATE_REVIEW";
const DELETE_REVIEW = "reviews/DELETE_REVIEW";

// Action Creators
export const createReview =
  ({ spotId, review, stars }) =>
  async (dispatch) => {
    try {
      const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: "POST",
        body: JSON.stringify({ review, stars }),
      });

      if (response.ok) {
        const review = await response.json();
        dispatch({
          type: CREATE_REVIEW,
          review,
        });
        return review;
      } else {
        const errors = await response.json();
        return { errors };
      }
    } catch (error) {
      return {
        errors: { message: "An error occurred while creating the review" },
      };
    }
  };

export const deleteReview = (reviewId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      dispatch({
        type: DELETE_REVIEW,
        reviewId,
      });
      return true;
    }
  } catch (error) {
    return {
      errors: { message: "An error occurred while deleting the review" },
    };
  }
};

// Initial State
const initialState = {
  spot: {},
  user: {},
};

// Reducer
const reviewsReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case CREATE_REVIEW:
      newState = { ...state };
      if (!newState.spot[action.review.spotId]) {
        newState.spot[action.review.spotId] = [];
      }
      newState.spot[action.review.spotId] = [
        action.review,
        ...newState.spot[action.review.spotId],
      ];
      return newState;

    case DELETE_REVIEW:
      newState = { ...state };
      Object.keys(newState.spot).forEach((spotId) => {
        newState.spot[spotId] = newState.spot[spotId].filter(
          (review) => review.id !== action.reviewId
        );
      });
      return newState;

    default:
      return state;
  }
};

export default reviewsReducer;

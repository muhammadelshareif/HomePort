import { csrfFetch } from "./csrf";

// Action Types
const LOAD_SPOTS = "spots/LOAD_SPOTS";
const LOAD_SPOT_DETAILS = "spots/LOAD_SPOT_DETAILS";
const CREATE_SPOT = "spots/CREATE_SPOT";
const UPDATE_SPOT = "spots/UPDATE_SPOT";
const DELETE_SPOT = "spots/DELETE_SPOT";
const LOAD_USER_SPOTS = "spots/LOAD_USER_SPOTS";

// Action Creators
export const loadSpots = (spots) => ({
  type: LOAD_SPOTS,
  payload: spots,
});

export const loadSpotDetails = (spot) => ({
  type: LOAD_SPOT_DETAILS,
  payload: spot,
});

export const createSpot = (spot) => ({
  type: CREATE_SPOT,
  payload: spot,
});

export const updateSpot = (spot) => ({
  type: UPDATE_SPOT,
  payload: spot,
});

export const deleteSpot = (spotId) => ({
  type: DELETE_SPOT,
  payload: spotId,
});

// Thunks
export const fetchSpots = () => async (dispatch) => {
  try {
    const response = await csrfFetch("/api/spots");
    const data = await response.json();
    dispatch(loadSpots(data.Spots));
    return data;
  } catch (error) {
    console.error("Error fetching spots:", error);
    throw error;
  }
};

export const fetchSpotDetails = (spotId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/spots/${spotId}`);
    const data = await response.json();
    dispatch(loadSpotDetails(data));
    return data;
  } catch (error) {
    console.error("Error fetching spot details:", error);
    throw error;
  }
};

export const createNewSpot = (spotData) => async (dispatch) => {
  try {
    const response = await csrfFetch("/api/spots", {
      method: "POST",
      body: JSON.stringify(spotData),
    });
    const spot = await response.json();

    // Handle spot images
    if (spotData.images && spotData.images.length > 0) {
      for (let i = 0; i < spotData.images.length; i++) {
        await csrfFetch(`/api/spots/${spot.id}/images`, {
          method: "POST",
          body: JSON.stringify({
            url: spotData.images[i],
            preview: i === 0,
          }),
        });
      }
    }

    dispatch(createSpot(spot));
    return spot;
  } catch (error) {
    console.error("Error creating spot:", error);
    throw error;
  }
};

export const updateExistingSpot = (spotId, spotData) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
      method: "PUT",
      body: JSON.stringify(spotData),
    });
    const spot = await response.json();
    dispatch(updateSpot(spot));
    return spot;
  } catch (error) {
    console.error("Error updating spot:", error);
    throw error;
  }
};

export const deleteExistingSpot = (spotId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
      method: "DELETE",
    });
    if (response.ok) {
      dispatch(deleteSpot(spotId)); // Only dispatch if deletion is successful
    } else {
      throw new Error("Failed to delete spot");
    }
  } catch (error) {
    console.error("Error deleting spot:", error);
    throw error;
  }
};

export const fetchUserSpots = () => async (dispatch) => {
  try {
    const response = await csrfFetch("/api/spots/current");
    const data = await response.json();
    dispatch({ type: LOAD_USER_SPOTS, payload: data.Spots });
    return data;
  } catch (error) {
    console.error("Error fetching user spots:", error);
    throw error;
  }
};

// Initial State
const initialState = {
  allSpots: {},
  currentSpot: null,
  userSpots: {},
};

// Reducer
const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_SPOTS: {
      const normalizedSpots = {};
      action.payload.forEach((spot) => {
        normalizedSpots[spot.id] = spot;
      });
      return {
        ...state,
        allSpots: normalizedSpots,
      };
    }
    case LOAD_SPOT_DETAILS: {
      return {
        ...state,
        currentSpot: action.payload,
      };
    }
    case CREATE_SPOT: {
      return {
        ...state,
        allSpots: {
          ...state.allSpots,
          [action.payload.id]: action.payload,
        },
        currentSpot: action.payload,
      };
    }
    case UPDATE_SPOT: {
      return {
        ...state,
        allSpots: {
          ...state.allSpots,
          [action.payload.id]: action.payload,
        },
        currentSpot: action.payload,
      };
    }
    case DELETE_SPOT: {
      const newAllSpots = { ...state.allSpots };
      delete newAllSpots[action.payload];
      return {
        ...state,
        allSpots: newAllSpots,
        currentSpot: null,
      };
    }
    case LOAD_USER_SPOTS: {
      const normalizedUserSpots = {};
      action.payload.forEach((spot) => {
        normalizedUserSpots[spot.id] = spot;
      });
      return {
        ...state,
        userSpots: normalizedUserSpots,
      };
    }
    default:
      return state;
  }
};

export default spotsReducer;

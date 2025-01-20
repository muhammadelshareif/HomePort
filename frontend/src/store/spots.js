import { csrfFetch } from "./csrf";

// Define action types as constants
const LOAD_SPOTS = "spots/LOAD_SPOTS";
const LOAD_SPOT_DETAILS = "spots/LOAD_SPOT_DETAILS";

// Action Creator for loading spots
export const loadSpots = (spots) => ({
  type: LOAD_SPOTS,
  payload: spots,
});

// Action Creator for loading spot details
export const loadSpotDetails = (spot) => ({
  type: LOAD_SPOT_DETAILS,
  payload: spot,
});

// Thunk Action Creator for fetching spots
export const fetchSpots = () => async (dispatch) => {
  const response = await csrfFetch("/api/spots");
  const data = await response.json();
  dispatch(loadSpots(data.Spots));
  return data;
};

// Thunk for fetching spot details
export const fetchSpotDetails = (spotId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/spots/${spotId}`);
    const spotData = await response.json();

    // Fetch spot images
    const imagesResponse = await csrfFetch(`/api/spots/${spotId}/images`);
    const imagesData = await imagesResponse.json();

    // Combine spot data with images
    const completeSpotData = {
      ...spotData,
      SpotImages: imagesData.SpotImages,
    };

    dispatch(loadSpotDetails(completeSpotData));
    return completeSpotData;
  } catch (error) {
    console.error("Failed to fetch spot details:", error);
  }
};

// Initial State
const initialState = {
  allSpots: {},
  currentSpot: null,
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
    default:
      return state;
  }
};

export default spotsReducer;

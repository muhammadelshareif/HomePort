import { csrfFetch } from "./csrf";

const LOAD_SPOTS = "spots/LOAD_SPOTS";
const LOAD_SPOT_DETAILS = "spots/LOAD_SPOT_DETAILS";

// Action Creator for fetching all spots
export const fetchSpots = () => async (dispatch) => {
  try {
    const response = await csrfFetch("http://localhost:8000/api/spots");
    const data = await response.json();
    dispatch({
      type: LOAD_SPOTS,
      payload: data.Spots,
    });
    return data;
  } catch (error) {
    console.error("Error fetching spots:", error);
  }
};

// Action Creator for fetching spot details
export const fetchSpotDetails = (spotId) => async (dispatch) => {
  try {
    const response = await csrfFetch(`/api/spots/${spotId}`);
    const data = await response.json();
    dispatch({
      type: LOAD_SPOT_DETAILS,
      payload: data,
    });
    return data;
  } catch (error) {
    console.error("Error fetching spot details:", error);
  }
};

const initialState = {
  allSpots: {},
  currentSpot: null,
};

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

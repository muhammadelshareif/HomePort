import { csrfFetch } from "./csrf";

// Action Type
const LOAD_SPOTS = "spots/LOAD_SPOTS";

// Action Creator
const loadSpots = (spots) => ({
  type: LOAD_SPOTS,
  payload: spots,
});

// Thunk Action Creator
export const fetchSpots = () => async (dispatch) => {
  const response = await csrfFetch("/api/spots");
  const data = await response.json();
  dispatch(loadSpots(data.Spots));
  return data;
};

// Initial State
const initialState = {
  allSpots: {},
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
    default:
      return state;
  }
};

export default spotsReducer;

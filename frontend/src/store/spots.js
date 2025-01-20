import { csrfFetch } from "./csrf";

const LOAD_SPOTS = "spots/LOAD_SPOTS";
const LOAD_SPOT_DETAILS = "spots/LOAD_SPOT_DETAILS";

export const loadSpots = (spots) => ({
  type: LOAD_SPOTS,
  payload: spots,
});

export const fetchSpots = () => async (dispatch) => {
  try {
    const response = await csrfFetch("/api/spots");
    const data = await response.json();
    dispatch(loadSpots(data.Spots));
    return data;
  } catch (error) {
    console.error("Error fetching spots:", error);
  }
};

export const fetchSpotDetails = (spotId) => async (dispatch) => {
  try {
    const [spotResponse, imagesResponse] = await Promise.all([
      csrfFetch(`/api/spots/${spotId}`),
      csrfFetch(`/api/spots/${spotId}/images`),
    ]);

    const spotData = await spotResponse.json();
    const imagesData = await imagesResponse.json();

    const completeSpotData = {
      ...spotData,
      SpotImages: imagesData.SpotImages,
    };

    dispatch({
      type: LOAD_SPOT_DETAILS,
      payload: completeSpotData,
    });

    return completeSpotData;
  } catch (error) {
    console.error("Failed to fetch spot details:", error);
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

import { csrfFetch } from "./csrf";

const LOAD_SPOTS = "spots/LOAD_SPOTS";
const LOAD_SPOT_DETAILS = "spots/LOAD_SPOT_DETAILS";
const CREATE_SPOT = "spots/CREATE_SPOT";
const UPDATE_SPOT = "spots/UPDATE_SPOT";
const DELETE_SPOT = "spots/DELETE_SPOT";
const LOAD_USER_SPOTS = "spots/LOAD_USER_SPOTS";
const SET_LOADING = "spots/SET_LOADING";

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

export const setLoading = (isLoading) => ({
  type: SET_LOADING,
  payload: isLoading,
});

export const fetchSpots = () => async (dispatch) => {
  dispatch(setLoading(true));
  try {
    const response = await csrfFetch("/api/spots");
    const data = await response.json();
    dispatch(loadSpots(data.Spots));
    dispatch(setLoading(false));
    return data;
  } catch (error) {
    console.error("Error fetching spots:", error);
    dispatch(setLoading(false));
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
      body: JSON.stringify({
        country: spotData.country,
        address: spotData.address,
        city: spotData.city,
        state: spotData.state,
        name: spotData.name,
        description: spotData.description,
        price: Number(spotData.price),
      }),
    });

    if (!response.ok) throw response;

    const spot = await response.json();

    if (spotData.previewImage) {
      await csrfFetch(`/api/spots/${spot.id}/images`, {
        method: "POST",
        body: JSON.stringify({ url: spotData.previewImage, preview: true }),
      });
    }

    const additionalImages = [
      spotData.image1,
      spotData.image2,
      spotData.image3,
      spotData.image4,
    ].filter(Boolean);

    for (let imageUrl of additionalImages) {
      await csrfFetch(`/api/spots/${spot.id}/images`, {
        method: "POST",
        body: JSON.stringify({ url: imageUrl, preview: false }),
      });
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
      dispatch(deleteSpot(spotId));
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
  isLoading: true,
};

const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_SPOTS: {
      const normalizedSpots = {};
      action.payload.forEach((spot) => {
        normalizedSpots[spot.id] = {
          ...spot,
          id: spot.id,
          name: spot.name,
          city: spot.city,
          state: spot.state,
          price: spot.price,
          previewImage: spot.previewImage,
        };
      });
      return {
        ...state,
        allSpots: normalizedSpots,
        isLoading: false,
      };
    }
    case SET_LOADING: {
      return {
        ...state,
        isLoading: action.payload,
      };
    }
    case CREATE_SPOT: {
      return {
        ...state,
        allSpots: {
          ...state.allSpots,
          [action.payload.id]: action.payload,
        },
        isLoading: false,
      };
    }
    case LOAD_SPOT_DETAILS: {
      return {
        ...state,
        currentSpot: action.payload,
        isLoading: false,
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
        isLoading: false,
      };
    }
    case DELETE_SPOT: {
      const newState = { ...state };
      delete newState.userSpots[action.payload];
      delete newState.allSpots[action.payload];
      return newState;
    }
    default:
      return state;
  }
};

export default spotsReducer;

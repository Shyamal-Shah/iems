import axios from "axios";

// Importing action types
import { INSTITUTES_LOADED, INSTITUTES_ERROR } from "./types";

// Get instituteName and degrees from instituteDegree
// Object with degreeName field is present in degrees array.
export const getInstitutes = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/institute");
    dispatch({
      type: INSTITUTES_LOADED,
      payload: res.data,
    });
  } catch (e) {
    dispatch({
      type: INSTITUTES_ERROR,
      payload: e.errors,
    });
  }
};

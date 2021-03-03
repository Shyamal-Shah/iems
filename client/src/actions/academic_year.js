import axios from "axios";

// Importing action types
import { AY_LOADED, AY_ERROR } from "./types";

// Get everything from academic year
export const getAcademicYear = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/academic-year");
    dispatch({
      type: AY_LOADED,
      payload: res.data,
    });
  } catch (e) {
    dispatch({
      type: AY_ERROR,
      payload: { msg: e.response.statusText, status: e.response.status },
    });
  }
};

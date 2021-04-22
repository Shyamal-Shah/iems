import axios from "axios";
import { SUBJECTS_LOADED, SUBJECTS_ERROR } from "./types";

// Get the subject according to degreeId which is passes as
// parameter.
export const getSubjects = (degreeId) => async (dispatch) => {
  console.log(degreeId);
  try {
    const res = await axios.get(`/api/subject/`, {
      params: {
        degreeId,
      },
    });
    console.log("sub", res.data);
    dispatch({
      type: SUBJECTS_LOADED,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: SUBJECTS_ERROR,
      payload: error.errors,
    });
  }
};

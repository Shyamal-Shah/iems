import axios from "axios";
import { setAlert } from "./alert";
import { SUBJECTS_LOADED, SUBJECTS_ERROR } from "./types";

// Get the subject according to degreeId which is passes as
// parameter.
export const getSubjects = (degreeId) => async (dispatch) => {
  console.log(degreeId);
  try {
    const res = await axios.get(`/api/subject/`, {
      params: {
        degreeId: degreeId,
      },
    });
    console.log(res.data);
    dispatch({
      type: SUBJECTS_LOADED,
      payload: res.data,
    });
  } catch (error) {
    console.log(error);
    dispatch({
      type: SUBJECTS_ERROR,
      payload: error.errors,
    });
  }
};

// Get the subjectId as parameter
// Delete the subject
export const deleteSubject = (subjectId) => async (dispatch) => {
  // Set the header of the api
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const res = await axios.delete(
      `/api/subject/${subjectId}`,

      config
    );
    console.log(res.data);
    dispatch(setAlert(res.data.msg, "success"));
  } catch (error) {
    console.log(error);
    dispatch(setAlert(setAlert(error.response.data, "danger")));
  }
};

// Get the subjectName, subjectCode and degreeId as parameter
// Add the subject
export const addSuject = (formData) => async (dispatch) => {
  // Set the header of the api
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const { subjectName, subjectCode, degreeId } = formData;
  try {
    const res = await axios.post(
      "/api/subject/",
      {
        subjectName: subjectName,
        subjectCode: subjectCode,
        degreeId: degreeId,
      },
      config
    );
    dispatch(getSubjects(degreeId));
    dispatch(setAlert(res.data.msg, "success"));
  } catch (error) {
    console.log(error);
    dispatch(setAlert(error.response.data.errors, "danger"));
  }
};

import axios from "axios";
import { setAlert } from "./alert";
// Importing action types
import { AY_ERROR, AY_LOADED } from "./types";

// Get Id	Year	DegreeId	SemesterNo	SubjectId	CreatedAt	UpdatedAt	CreatedUserId	ModifiedUserId	RecStatus from academic year
export const getAcademicYear = ({ degreeId }) => async (dispatch) => {
  console.log(degreeId);
  try {
    const res = await axios.get("/api/academic-year/", {
      params: {
        degreeId,
      },
    });
    console.log("aay", res.data);
    dispatch({
      type: AY_LOADED,
      payload: res.data,
    });
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: AY_ERROR,
    });
  }
};

export const addAcademicYear = (year, degreeId) => async (dispatch) => {
  // Set the header of the api
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  // console.log("aa", year, degreeId);
  try {
    const res = await axios.post(
      "/api/academic-year/ay",
      { year: year, degreeId: degreeId },
      config
    );
    dispatch(getAcademicYear({ degreeId: degreeId }));
    dispatch(setAlert(res.data.msg, "success"));
  } catch (error) {
    console.log(error);
    dispatch(setAlert(setAlert(error.response.data, "danger")));
  }
};

export const addSemesters = (formData) => async (dispatch) => {
  // Set the header of the api
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const { year, degree, semesterNo, subjects } = formData;
  var obj = {
    year: year,
    degreeId: degree,
    semesters: [
      {
        semesterNo: semesterNo,
        subjects: subjects.map((sub) => ({
          subjectId: sub,
        })),
      },
    ],
  };
  console.log("final", obj);
  try {
    const res = await axios.post("/api/academic-year/", obj, config);
    dispatch(getAcademicYear({ degreeId: degree }));
    dispatch(setAlert(res.data.msg, "success"));
  } catch (error) {
    console.log(error);
    dispatch(setAlert(setAlert(error.response.data, "danger")));
  }
};

export const updateAcademicYear = (year, id) => async (dispatch) => {
  // Set the header of the api
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  // Edit the academicyear
  try {
    const res = await axios.put(
      `/api/academic-year/${id}`,
      { year: year },
      config
    );
    dispatch(setAlert("Academic Year edited", "success"));
  } catch (error) {
    console.log(error);
    dispatch(setAlert(setAlert(error.response.data, "danger")));
  }
};

export const deleteAY = (ayid) => async (dispatch) => {
  // Set the header of the api
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  // Delete the academic year via api
  try {
    const res = await axios.delete(`/api/academic-year/${ayid}`, config);
    dispatch(setAlert(res.data.msg, "success"));
  } catch (error) {
    console.log(error);
    dispatch(setAlert(setAlert(error.response.data, "danger")));
  }
};

import axios from "axios";
import { NOT_ELIGIBLE_ERROR, LOADED_ELIGIBLE_STUDENT } from "./types";
import { setAlert } from "./alert";

// Add the not eligible students
export const addNE = (formData) => async (dispatch) => {
  // Set the header of the api
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  // Get values from formData
  const {
    academicYear,
    nameOfComponents,
    semester,
    subjectName,
    studentId,
  } = formData;

  // set the student array
  var temp = [];
  if (studentId) {
    for (var i = 0; i < studentId.length; i++) {
      temp.push({ studentId: studentId[i] });
    }
  }
  var obj = {
    academicYear,
    semester,
    subject: subjectName,
    componentName: nameOfComponents,
    students: temp,
  };

  // Add the not eligible students via api
  try {
    const res = await axios.post(`/api/not-eligible`, obj, config);
    dispatch(setAlert(res.data.msg, "success"));
  } catch (e) {
    console.log(e);
  }
};

// Get the not eligible students
export const getNEStudents = ({
  academicYear,
  semester,
  subject,
  componentName,
}) => async (dispatch) => {
  console.log("aa", academicYear);
  try {
    const res = await axios.get(`/api/not-eligible/`, {
      params: {
        academicYear,
        semester,
        subject,
        componentName,
      },
    });
    console.log(res.data);
    dispatch({
      type: LOADED_ELIGIBLE_STUDENT,
      payload: res.data,
    });
    return res.data;
  } catch (e) {
    console.log(e);
    dispatch({
      type: NOT_ELIGIBLE_ERROR,
    });
  }
};

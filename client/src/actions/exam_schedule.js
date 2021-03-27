import axios from "axios";
import { EXAM_SCHEDULE_ADDED } from "./types";
import { setAlert } from "./alert";

export const addExamSchedule = (formData) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const { academicYear, semesterNo, noOfComponents } = formData;
  var components = [];
  for (var i = 0; i < noOfComponents; i++) {
    var subject = formData[i + "-subjectName"];
    var from = formData[i + "-from"];
    var to = formData[i + "-to"];
    var temp = subject.split("_");
    components.push({ subjectCode: temp[0], subjectName: temp[1], from, to });
  }
  var obj = {
    academicYear,
    semester: semesterNo,
    schedule: components,
  };
  console.log(obj);
  try {
    const res = await axios.post(`/api/exam-schedule`, obj, config);
    console.log(res);
    dispatch(setAlert(res.data.msg, "success"));
  } catch (err) {
    console.log(err);
  }
};

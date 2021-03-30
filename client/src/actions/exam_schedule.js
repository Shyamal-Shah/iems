import axios from 'axios';
import { EXAM_SCHEDULE_ERROR, EXAM_SCHEDULE_LOADED } from './types';
import { setAlert } from './alert';

export const addExamSchedule = (formData, academicYear, semesterNo) => async (
  dispatch
) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const { subjects, testName, examWeekFrom, examWeekTo } = formData;
  var schedule = [];
  for (var i = 0; i < subjects.length; i++) {
    var subjectId = subjects[i]._id;
    var from = formData[i + '-from'];
    var to = formData[i + '-to'];
    schedule.push({ subjectId, from, to });
  }
  var obj = {
    academicYear,
    semester: semesterNo,
    schedule,
    testName,
    examWeekFrom,
    examWeekTo,
  };
  try {
    const res = await axios.post(`/api/exam-schedule`, obj, config);
    dispatch(setAlert(res.data.msg, 'success'));
  } catch (err) {
    console.log(err);
    dispatch(setAlert(err.response.data, 'danger'));
  }
};

export const getExamScheduleSN = ({
  semesterNo,
  academicYear,
  testName,
}) => async (dispatch) => {
  semesterNo = semesterNo ? semesterNo : 0;
  try {
    const res = await axios.get('/api/exam-schedule/', {
      params: {
        semesterNo,
        academicYear,
        testName,
      },
    });
    dispatch({
      type: EXAM_SCHEDULE_LOADED,
      payload: res.data,
    });
    return res.data;
  } catch (err) {
    console.log(err);
    dispatch({
      type: EXAM_SCHEDULE_ERROR,
    });
  }
};

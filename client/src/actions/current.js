import {
  DELETE_CURRENT,
  UPDATE_ACADEMIC_YEAR,
  UPDATE_DEGREE,
  UPDATE_INSTITUTE,
  UPDATE_SEMESTER_GROUP,
  UPDATE_SEMESTER_NUMBER,
} from './types';

export const updateInstitute = (institute) => (dispatch) => {
  dispatch({
    type: UPDATE_INSTITUTE,
    payload: institute,
  });
};

export const updateDegree = (degree) => (dispatch) => {
  dispatch({
    type: UPDATE_DEGREE,
    payload: degree,
  });
};

export const updateAcademicYear = (academicYear) => (dispatch) => {
  dispatch({
    type: UPDATE_ACADEMIC_YEAR,
    payload: academicYear,
  });
};

export const updateSemesterGroup = (group) => (dispatch) => {
  dispatch({
    type: UPDATE_SEMESTER_GROUP,
    payload: group,
  });
};

export const updateSemesterNo = (semesterNumber) => (dispatch) => {
  dispatch({
    type: UPDATE_SEMESTER_NUMBER,
    payload: semesterNumber,
  });
};

export const deleteCurrent = () => (dispatch) => {
  dispatch({
    type: DELETE_CURRENT,
  });
};

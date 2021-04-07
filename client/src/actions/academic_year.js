import axios from 'axios';
import { setAlert } from './alert';
import { AY_ERROR, AY_LOADED } from './types';

// Importing action types

// Get Id	Year	DegreeId	SemesterNo	SubjectId	CreatedAt	UpdatedAt	CreatedUserId	ModifiedUserId	RecStatus from academic year
export const getAcademicYear = ({ degreeId }) => async (dispatch) => {
  try {
    const res = await axios.get('/api/academic-year', {
      params: {
        degreeId,
      },
    });
    dispatch({
      type: AY_LOADED,
      payload: res.data,
    });
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
    }
    dispatch({
      type: AY_ERROR,
    });
  }
};

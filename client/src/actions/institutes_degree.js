import axios from 'axios';

// Importing action types
import { INSTITUTES_LOADED, INSTITUTES_ERROR } from './types';

// Get everthing from institute and degree
export const getInstitutes = () => async (dispatch) => {
  try {
    const res = await axios.get('/api/institute');
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

import { RESOURCES_ERROR, RESOURCES_LOADED } from './types';
import axios from 'axios';
export const getResources = ({ degreeId }) => async (dispatch) => {
  try {
    const res = await axios.get('/api/resources/', {
      params: {
        degreeId,
      },
    });
    dispatch({
      type: RESOURCES_LOADED,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: RESOURCES_ERROR,
      payload: err.errors,
    });
  }
};

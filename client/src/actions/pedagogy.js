import axios from 'axios';
import { setAlert } from './alert';
import { PEDAGOGY_ERROR, PEDAGOGY_LOADED } from './types';

export const addPedagogy = (formData) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const { subjectName, noOfComponents } = formData;

  var components = [];
  for (var i = 0; i < noOfComponents; i++) {
    var name = formData['c' + i + '-Name'];
    var mode = formData['c' + i + '-Mode'];
    var weightAge = formData['c' + i + '-Weightage'];
    components.push({ name, mode, weightAge });
  }
  var obj = {
    subject: subjectName,
    components,
  };
  try {
    const res = await axios.post(`/api/pedagogy`, obj, config);
    dispatch(setAlert(res.data.msg, 'success'));
  } catch (err) {
    console.log(err);
  }
};

export const getPedagogy = ({ subjectId }) => async (dispatch) => {
  try {
    const res = await axios.get('/api/pedagogy/', {
      params: {
        subjectId,
      },
    });
    dispatch({
      type: PEDAGOGY_LOADED,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: PEDAGOGY_ERROR,
    });
  }
};

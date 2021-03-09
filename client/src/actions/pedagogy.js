import axios from "axios";
import { PEDAGOGY_ADDED, PEDAGOGY_ERROR } from "./types";
import { setAlert } from "./alert";

export const addPedagogy = (formData) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const { subjectName, noOfComponents } = formData;
  var components = [];
  for (var i = 0; i < noOfComponents; i++) {
    var name = formData["c" + i + "-Name"];
    var mode = formData["c" + i + "-Mode"];
    var weightAge = formData["c" + i + "-Weightage"];
    components.push({ name, mode, weightAge });
  }
  var obj = {
    subjectName,
    components,
  };
  try {
    const res = await axios.post(`/api/pedagogy`, obj, config);
    console.log(res);
    dispatch({
      type: PEDAGOGY_ADDED,
      payload: res.data,
    });

    dispatch(setAlert("Pedagogy created", "success"));
  } catch (e) {
    dispatch({
      type: PEDAGOGY_ERROR,
      payload: { msg: e.response.statusText, status: e.response.status },
    });
  }
};

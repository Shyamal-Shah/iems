import {
  PEDAGOGIES_LOADED,
  PEDAGOGY_ERROR,
  PEDAGOGY_LOADED,
} from "../actions/types";

const inistialState = {
  pedagogy: null,
};

const Pedagogy = (state = inistialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case PEDAGOGY_LOADED:
      return {
        ...state,
        pedagogy: payload,
      };
    case PEDAGOGIES_LOADED:
      return {
        ...state,
        pedagogies: payload,
      };
    case PEDAGOGY_ERROR:
      return {
        pedagogy: null,
      };
    default:
      return state;
  }
};

export default Pedagogy;

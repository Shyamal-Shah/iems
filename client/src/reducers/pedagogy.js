import {
  PEDAGOGIES_LOADED,
  PEDAGOGY_ERROR,
  PEDAGOGY_LOADED, 
} from '../actions/types';


const inistialState = {
  pedagogy: null,
  pedagogies: [],
};

const Pedagogy = (state = inistialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case PEDAGOGY_LOADED:
      return {
        pedagogy: payload,
        pedagogies: [],
      };
    case PEDAGOGIES_LOADED:
      return {
        pedagogy: null,
        pedagogies: payload,
      };
    case PEDAGOGY_ERROR:
      return {
        pedagogy: null,
        pedagogies: [],
      };
    default:
      return state;
  }
};

export default Pedagogy;

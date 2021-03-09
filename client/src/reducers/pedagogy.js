import { PEDAGOGY_ADDED, PEDAGOGY_ERROR } from "../actions/types";

const inistialState = {
  pedagogy: null,
  loading: true,
  error: {},
};

const Pedagogy = (state = inistialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case PEDAGOGY_ADDED:
      return {
        ...state,
        pedagogy: [payload, ...state.Pedagogy],
        loading: false,
      };
    case PEDAGOGY_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    default:
      return state;
  }
};

export default Pedagogy;

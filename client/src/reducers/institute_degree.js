import { INSTITUTES_LOADED, INSTITUTES_ERROR } from "../actions/types";

const initialState = {
  institutes: [],
  loading: true,
  error: {},
};
const InstituteDegree = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case INSTITUTES_LOADED:
      return {
        ...state,
        institutes: payload,
        loading: false,
      };
    case INSTITUTES_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    default:
      return state;
  }
};

export default InstituteDegree;

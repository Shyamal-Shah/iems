import { AY_LOADED, AY_ERROR } from "../actions/types";

const initialState = {
  academicYear: [],
  loading: true,
  error: {},
};

const AcademicYear = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case AY_LOADED:
      return {
        ...state,
        academicYear: payload,
        loading: false,
      };
    case AY_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    default:
      return state;
  }
};

export default AcademicYear;

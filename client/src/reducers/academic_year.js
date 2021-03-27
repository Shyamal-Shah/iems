import { AY_LOADED, AY_ERROR } from "../actions/types";

const initialState = {
  academicYears: [],
};

const AcademicYear = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case AY_LOADED:
      return {
        ...state,
        academicYears: payload,
      };
    case AY_ERROR:
      return {
        academicYears: [],
      };
    default:
      return state;
  }
};

export default AcademicYear;

import { LOADED_ELIGIBLE_STUDENT, NOT_ELIGIBLE_ERROR } from "../actions/types";

const initialState = {
  ne: [],
};

const NotEligible = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case LOADED_ELIGIBLE_STUDENT:
      return {
        ne: payload,
      };
    case NOT_ELIGIBLE_ERROR:
      return {
        ne: [],
      };
    default:
      return state;
  }
};

export default NotEligible;

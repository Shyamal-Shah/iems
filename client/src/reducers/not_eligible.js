import { LOADED_ELIGIBLE_STUDENT, NOT_ELIGIBLE_ERROR } from "../actions/types";

// Set the initalState
// Set the ne array as empty
const initialState = {
  ne: [],
};

// This method is to set the notEligible state.
const NotEligible = (state = initialState, action) => {
  // Destructuring the type and payload from action
  const { type, payload } = action;
  // Based on the action type returing the state
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

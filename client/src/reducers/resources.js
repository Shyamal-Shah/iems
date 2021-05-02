import { RESOURCES_ERROR, RESOURCES_LOADED } from '../actions/types';

// Set the initalState
const initialState = {
  resources: null,
};

// This method is to set the resources state.
const Resources = (state = initialState, action) => {
  // Destructuring the type and payload from action
  const { type, payload } = action;
  // Based on the action type returing the state
  switch (type) {
    case RESOURCES_LOADED:
      return {
        resources: payload,
      };
    case RESOURCES_ERROR:
      return {
        resources: null,
      };
    default:
      return state;
  }
};

export default Resources;

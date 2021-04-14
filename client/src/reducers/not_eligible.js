import {
  NOT_ELIGIBLITY_LISTS_LOADED,
  NOT_ELIGIBLITY_LIST_ERROR,
  NOT_ELIGIBLITY_LIST_LOADED,
} from '../actions/types';

const initialState = {
  neList: [],
  neLists: [],
};

const NotEligible = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case NOT_ELIGIBLITY_LIST_LOADED:
      return {
        neList: payload,
        neLists: [],
      };
    case NOT_ELIGIBLITY_LISTS_LOADED:
      return {
        neList: [],
        neLists: payload,
      };
    case NOT_ELIGIBLITY_LIST_ERROR:
      return {
        neList: [],
        neLists: [],
      };
    default:
      return state;
  }
};

export default NotEligible;

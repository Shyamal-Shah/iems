import {
  AUTH_ERROR,
  LOGIN_FAILED,
  LOGIN_SUCCESS,
  LOGOUT,
  USER_LOADED,
} from '../actions/types';

const initalState = {
  token: localStorage.getItem('token'),
  loading: true,
  isAuthenticated: null,
  user: null,
};

const Auth = (state = initalState, action) => {
  const { type, payload } = action;
  switch (type) {
    case LOGIN_SUCCESS:
      localStorage.setItem('token', payload.token);
      return {
        ...state,
        ...payload,
        loading: false,
        isAuthenticated: true,
      };
    case USER_LOADED:
      return {
        ...state,
        user: payload,
        loading: false,
        isAuthenticated: true,
      };
    case AUTH_ERROR:
    case LOGIN_FAILED:
    case LOGOUT:
      localStorage.removeItem('token');
      return {
        token: null,
        user: null,
        loading: false,
        isAuthenticated: false,
      };

    default:
      return state;
  }
};

export default Auth;

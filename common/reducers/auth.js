import {SET_USER, LOGIN_USER_REQUEST, LOGIN_USER_SUCCESS, LOGIN_USER_FAILURE, LOGOUT_USER} from '../actions/auth';
import { push } from 'react-router-redux';
// import jwtDecode from 'jwt-decode';

const initialState = {
  token: null,
  isAuthenticated: false,
  isAuthenticating: false,
  statusText: null,
  user: null
};

export default function auth(state = initialState, action) {

  switch (action.type) {

    case LOGIN_USER_REQUEST:
      return Object.assign({}, state, {
        'isAuthenticating': true,
        'statusText': null
      })

    case LOGIN_USER_SUCCESS:
      return Object.assign({}, state, {
        'isAuthenticating': false,
        'isAuthenticated': true,
        'token': action.payload.token,
        'statusText': 'You have been successfully logged in.'
      })
    case LOGIN_USER_FAILURE:
      return Object.assign({}, state, {
        'isAuthenticating': false,
        'isAuthenticated': false,
        'token': null,
        'user': null,
        'statusText': `Authentication Error: ${action.payload.status} ${action.payload.statusText}`
      })

    case LOGOUT_USER:
      return Object.assign({}, state, {
        'isAuthenticated': false,
        'token': null,
        'user': null,
        'statusText': 'You have been successfully logged out.'
      })

    case SET_USER:
      return Object.assign({}, state, {
        'isAuthenticating': false,
        'isAuthenticated': action.payload ? true : false,
        'user': action.payload
      })

    default:
      return state
  }
};

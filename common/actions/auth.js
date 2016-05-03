export const LOGIN_USER_REQUEST = 'LOGIN_USER_REQUEST';
export const LOGIN_USER_FAILURE = 'LOGIN_USER_FAILURE';
export const LOGIN_USER_SUCCESS = 'LOGIN_USER_SUCCESS';
export const LOGOUT_USER = 'LOGOUT_USER';
export const SHOW_LOADER = 'SHOW_LOADER';
export const SET_USER = 'SET_USER';
import cookie from 'react-cookie';

// export const FETCH_PROTECTED_DATA_REQUEST = 'FETCH_PROTECTED_DATA_REQUEST';
// export const RECEIVE_PROTECTED_DATA = 'RECEIVE_PROTECTED_DATA';

import { push } from 'react-router-redux';
// import jwtDecode from 'jwt-decode';
import request from 'superagent';

export function setUser(user) {
  return {
    type: SET_USER,
    payload: user
  };
}

export function loginUserSuccess(token) {
  cookie.save('token', token);
  return {
    type: LOGIN_USER_SUCCESS,
    payload: {
      token: token
    }
  };
}

export function loginUserFailure(error) {
  cookie.remove('token');
  return {
    type: LOGIN_USER_FAILURE,
    payload: {
      status: error.response.status,
      statusText: error.response.statusText
    }
  };
}

export function loginUserRequest() {
  return {
    type: LOGIN_USER_REQUEST
  }
}

export function logout() {
  cookie.remove('token');
  return {
    type: LOGOUT_USER
  }
}

export function logoutAndRedirect() {
  return (dispatch, state) => {
    dispatch(logout());
    dispatch(push('/login'));
  }
}

export function loginUser(user, redirect) {
  return function(dispatch) {
    dispatch(loginUserRequest());
    return request
      .post('/auth/local')
      .send(user)
      .set('Accept', 'application/json')
      .end(function(err, res){
        if(err) return  dispatch(loginUserFailure(err));
        dispatch(loginUserSuccess(res.body.token));
        dispatch(getUser(res.body.token , redirect));
      });
  }
}

export function createUser(user, redirect) {
  return function(dispatch) {
    dispatch(loginUserRequest());
    return request
      .post('/api/user/')
      .send(user)
      .set('Accept', 'application/json')
      .end(function(err, res){
        if(err) return  dispatch(loginUserFailure(err));
        dispatch(loginUserSuccess(res.body.token));
        dispatch(getUser(res.body.token));
      });
  }
}

export function getUser(token, redirect){
  if(!token) token = getToken();
  console.log("TOKEN ", token)
  return dispatch => {
    new Promise(function(resolve, reject) {
      return request
        .get('/api/user/me')
        .set({'Authorization': `Bearer ${token}`})
        .end(function(err, res) {
          console.log("ERROR ", err)
          if(err) {
            dispatch(loginUserFailure(err));
            return reject;
          }
          console.log("USER ", res.body)
          dispatch(setUser(res.body));
          if(redirect) dispatch(push(redirect));
          return resolve;
        })
    })
  }
}

function getToken(){
  var token = cookie.load('token');
  return token;
}

// function readCookie(k){
//   return(document.cookie.match('(^|; )'+k+'=([^;]*)')||0)[2]
// }
// function deleteCookie( name ) {
//   document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
// }

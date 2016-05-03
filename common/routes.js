import React from 'react';

import App from './components/app';
import Home from './components/main/main.container';
import Login from './components/auth/auth.container';
import Counters from './components/counter/counter.container';
import NotFound from './components/404';
import { UserAuthWrapper } from 'redux-auth-wrapper'
import { push } from 'react-router-redux';

// Redirects to /login by default
const UserIsAuthenticated = UserAuthWrapper({
  authSelector: state => state.auth.user, // how to get the user state
  redirectAction: push, // the redux action to dispatch for redirect
  wrapperDisplayName: 'UserIsAuthenticated' // a nice name for this auth check
})

// const connect = (fn) => (nextState, replaceState) => fn(store, nextState, replaceState);

var routes = function(store) {
  const connect = (fn) => (nextState, replaceState) => fn(store, nextState, replaceState);
  return {
    path: '/',
    component: App,
    indexRoute: { component: Home },
    childRoutes: [
      { path: 'login', component: Login },
      { path: 'signup', component: Login },
      { path: 'home', component: Home },
      { path: 'counter', component: UserIsAuthenticated(Counters), onEnter: connect(UserIsAuthenticated.onEnter)},
      { path: '*', component: NotFound }
    ]
  }
};

module.exports = routes;

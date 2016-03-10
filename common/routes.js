import React from 'react';

import App from './components/app';
import Home from './components/main/main.container';
import About from './components/about/about.container';
import Counters from './components/counter/counter.container';
import NotFound from './components/404';

var routes = {
  path: '/',
  component: App,
  indexRoute: { component: Home },
  childRoutes: [
    { path: 'about', component: About },
    { path: 'home', component: Home },
    { path: 'counter', component: Counters },
    { path: '*', component: NotFound }
  ]
};

module.exports = routes;
import { combineReducers } from 'redux'
import counter from './counter'
import auth from './auth'
import socket from './socket'

import { routerReducer } from 'react-router-redux';
import { reducer as formReducer} from 'redux-form';

const rootReducer = combineReducers({
  counter,
  auth,
  socket,
  routing: routerReducer,
  form: formReducer
})

export default rootReducer
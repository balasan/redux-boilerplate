import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionCreators from '../../actions/auth';
import * as socketActions from '../../actions/socket';
import LoginForm from "./login";
import SignupForm from "./signup";

export class Login extends Component {

  constructor(props) {
    super(props);
    const redirectRoute = this.props.location.query.redirect || '/login';
    this.state = {
      redirectTo: redirectRoute
    };
  }

  login(data) {
    var user = {
      email: data.email,
      password: data.password
    };
    this.state.redirectTo = this.props.location.query.redirect || '/login';
    this.props.actions.loginUser(user, this.state.redirectTo);
  }

  signup(data) {
    var user = {
      name: data.name,
      email: data.email,
      password: data.password
    };
    this.props.actions.createUser(user, this.state.redirectTo);
  }

  logout(){
    this.props.actions.logout();
  }

  sendMessage(){
    this.props.dispatch(this.props.actions.hello);
  }

  render () {

    const {isAuthenticated, user, route} = this.props;

    var auth;

    if(isAuthenticated){
      auth = (<button onClick={this.logout.bind(this)}>logout</button>)
    }
    else if( route.path == 'login') {
      auth = (
        <LoginForm onSubmit={this.login.bind(this)}/>
      )
    }
    else if( route.path == 'signup') {
      auth = (
        <SignupForm onSubmit={this.signup.bind(this)}/>
      )
    }

    return (
      <div className='authContainer'>
        {this.props.user ? <div className="userInfo"> Logged in as {this.props.user.name}</div> : ''}
        {auth}
        {this.props.statusText ? <div className='alert alert-info'>{this.props.statusText}</div> : ''}
        <br/>
        <a href="/auth/facebook">Log in with facebook</a>
        {' '}
        <a href="/auth/twitter">Log in with twitter</a>
        <button onClick={this.sendMessage.bind(this)}>Send Message</button>
        <div>{this.props.message}</div>
      </div>
    );
  }
}

// reactMixin(Login.prototype, LinkedStateMixin);

const mapStateToProps = (state) => ({
  isAuthenticating   : state.auth.isAuthenticating,
  isAuthenticated    : state.auth.isAuthenticated,
  statusText         : state.auth.statusText,
  user               : state.auth.user,
  message            : state.socket.message
});

const mapDispatchToProps = (dispatch) => ( Object.assign({}, { dispatch }, {
  actions: bindActionCreators(Object.assign({}, actionCreators, socketActions), dispatch)
}));

export default connect(mapStateToProps, mapDispatchToProps)(Login);

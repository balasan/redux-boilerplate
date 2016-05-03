import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router';
import { getUser } from '../actions/auth';
import { bindActionCreators } from 'redux';

if (process.env.BROWSER == true) {
  require("./index.css");
  require("./fonts.css");
}

export default class App extends Component {

  // static fetchDataClient(dispatch){
  //   console.log("FETCHING DATA")
  //   return Promise.all([
  //     dispatch(getUser())
  //   ])
  // }

  // componentDidMount(){
  //   if(!this.props.user)
  //     this.constructor.fetchDataClient(this.props.dispatch)
  // }

  render () {
    return (
      <div>
        <h1>Redux Universal App</h1>

        <section>
          <Link to="/home">Home</Link>
          { ' - ' }
          <Link to="/counter">Counter</Link>
          { ' - ' }
          <Link to="/login">Login</Link>
        </section>
        <br />
        <section>
          {this.props.children}
        </section>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user : state.auth.user
});

const mapDispatchToProps = (dispatch) => ({
  dispatch: dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
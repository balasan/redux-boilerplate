import React, { Component } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Counter from '../components/Counter';
import * as CounterActions from '../actions/counter'


export default class Counters extends Component {

  static fetchData (dispatch) {
    var { initCounter } = bindActionCreators(CounterActions, dispatch)
    return Promise.all([
      initCounter()
    ])
  }

  componentDidMount() {
    if(this.props.counter == 0)
      this.constructor.fetchData( this.props.dispatch);
  }

  render () {
    console.log("RENDERING COUNTER")
    return <Counter { ...this.props }/>;
  }
}

export default connect(
  state => {
    return {
      counter: state.counter
    }
  },
  dispatch => {
    return Object.assign({}, { dispatch },  bindActionCreators(CounterActions, dispatch))
})(Counters)


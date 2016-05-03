import React, {Component} from 'react';
import {reduxForm} from 'redux-form';
import { Link } from 'react-router';


class LoginForm extends Component {
  render() {
    const {fields: {email, password}, handleSubmit} = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input type="text" placeholder="Email" {...email}/>
        </div>
        <div>
          <label>Password</label>
          <input type="password" placeholder="Password" {...password}/>
        </div>
        <button type="submit">Log in</button>
        <br/>
        {' '}
        or
        {' '}
        <Link to="/signup">Sign up</Link>
      </form>
    );
  }
}

LoginForm = reduxForm({
  form: 'login',
  fields: ['email', 'password']
})(LoginForm);

export default LoginForm;
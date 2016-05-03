import React, {Component} from 'react';
import {reduxForm} from 'redux-form';
import { Link } from 'react-router';

const validate = values => {
  const errors = {};
  if (!values.name) {
    errors.name = 'Required';
  } else if (values.name.length > 15) {
    errors.name = 'Must be 15 characters or less';
  }
  if (!values.email) {
    errors.email = 'Required';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid email address';
  }
  if (!values.password) {
    errors.password = 'Required';
  }
  if(values.password != values.confirmPassword){
    errors.confirmPassword = "Confirm password doesn't match";
  }
  return errors;
};

class SignupForm extends Component {
  render() {
    const {fields: {email, name, password, confirmPassword}, handleSubmit} = this.props;
    return (
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input type="text" placeholder="Email" {...email}/>
          {email.touched && email.error && <div>{email.error}</div>}
        </div>
        <div>
          <label>Name</label>
          <input type="text" placeholder="Name" {...name}/>
          {name.touched && name.error && <div>{name.error}</div>}
        </div>
        <div>
          <label>Password</label>
          <input type="password" placeholder="Password" {...password}/>
          {password.touched && password.error && <div>{password.error}</div>}
        </div>
        <div>
          <label>Confirm Password</label>
          <input type="password" placeholder="Confirm Password" {...confirmPassword}/>
          {confirmPassword.touched && confirmPassword.error && <div>{confirmPassword.error}</div>}
        </div>
        <button type="submit">Sign up</button>
        {' '}
        or
        {' '}
        <Link to="/login">Log in</Link>
      </form>
    );
  }
}

SignupForm = reduxForm({
  form: 'login',
  fields: ['email', 'name', 'password', 'confirmPassword'],
  validate
})(SignupForm);

export default SignupForm;
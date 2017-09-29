import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

import FormErrors from './FormErrors'

class LoginForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      formData: {
        email: '',
        password: ''
      },
      formRules: [
        {
          id: 1,
          field: 'email',
          name: 'Email is required.',
          valid: false
        },
        {
          id: 2,
          field: 'password',
          name: 'Password is required.',
          valid: false
        }
      ],
      valid: false
    }
    this.handleLoginFormSubmit = this.handleLoginFormSubmit.bind(this);
  }
  componentDidMount() {
    this.clearForm();
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.formType !== nextProps.formType) {
      this.clearForm();
      this.initRules();
    }
  }
  clearForm() {
    this.setState({
      formData: {email: '', password: ''}
    });
  }
  initRules() {
    const rules = this.state.formRules;
    for (const rule of rules) {
      rule.valid = false;
    }
    this.setState({formRules: rules})
  }
  handleFormChange(event) {
    const obj = this.state.formData;
    obj[event.target.name] = event.target.value;
    this.setState(obj);
    this.validateForm()
  }
  allTrue() {
    for (const rule of this.state.formRules) {
      if (!rule.valid) return false;
    }
    return true;
  }
  validateForm() {
    const rules = this.state.formRules;
    const formData = this.state.formData;
    this.setState({valid: false});
    for (const rule of rules) {
      rule.valid = false;
    }
    if (formData.email.length > 0) rules[0].valid = true;
    if (formData.password.length > 0) rules[1].valid = true;
    this.setState({formRules: rules})
    if (this.allTrue()) this.setState({valid: true});
  }
  handleLoginFormSubmit(event) {
    event.preventDefault();
    const data = {
      username: this.state.formData.username,
      email: this.state.formData.email,
      password: this.state.formData.password
    }
    const url = `${process.env.REACT_APP_USERS_SERVICE_URL}/auth/login`
    axios.post(url, data)
    .then((res) => {
      this.clearForm();
      this.props.loginUser(res.data.auth_token);
    })
    .catch((err) => {
      this.props.createMessage('User does not exist.', 'danger')
    })
  }
  render() {
    if (this.props.isAuthenticated) {
      return <Redirect to='/' />;
    }
    return (
      <div>
        <h1>Login</h1>
        <hr/><br/>
        <FormErrors
          formRules={this.state.formRules}
        />
        <form onSubmit={(event) => this.handleLoginFormSubmit(event)}>
          <div className="form-group">
            <input
              name="email"
              className="form-control input-md"
              type="email"
              placeholder="Enter an email address"
              required
              value={this.state.formData.email}
              onChange={this.handleFormChange.bind(this)}
            />
          </div>
          <div className="form-group">
            <input
              name="password"
              className="form-control input-md"
              type="password"
              placeholder="Enter a password"
              required
              value={this.state.formData.password}
              onChange={this.handleFormChange.bind(this)}
            />
          </div>
          <input
            type="submit"
            className="btn btn-primary btn-md"
            value="Submit"
            disabled={!this.state.valid}
          />
        </form>
      </div>
    )
  }
}

export default LoginForm

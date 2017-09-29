import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';

import FormErrors from './FormErrors'

class RegisterForm extends Component {
  constructor (props) {
    super(props)
    this.state = {
      formData: {
        username: '',
        email: '',
        password: ''
      },
      formRules: [
        {
          id: 1,
          field: 'username',
          name: 'Username must be greater than 5 characters.',
          valid: false
        },
        {
          id: 2,
          field: 'email',
          name: 'Email must be greater than 5 characters.',
          valid: false
        },
        {
          id: 3,
          field: 'email',
          name: 'Email must be a valid email address.',
          valid: false
        },
        {
          id: 4,
          field: 'password',
          name: 'Password must be greater than 10 characters.',
          valid: false
        }
      ],
      valid: false
    }
    this.handleRegisterFormSubmit = this.handleRegisterFormSubmit.bind(this);
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
      formData: {username: '', email: '', password: ''}
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
    if (formData.username.length > 5) rules[0].valid = true;
    if (formData.email.length > 5) rules[1].valid = true;
    if (this.validateEmail(formData.email)) rules[2].valid = true;
    if (formData.password.length > 10) rules[3].valid = true;
    this.setState({formRules: rules})
    if (this.allTrue()) this.setState({valid: true});
  }
  validateEmail(email) {
    // eslint-disable-next-line
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }
  handleRegisterFormSubmit(event) {
    event.preventDefault();
    const data = {
      username: this.state.formData.username,
      email: this.state.formData.email,
      password: this.state.formData.password
    }
    const url = `${process.env.REACT_APP_USERS_SERVICE_URL}/auth/register`
    axios.post(url, data)
    .then((res) => {
      this.clearForm();
      this.props.loginUser(res.data.auth_token);
    })
    .catch((err) => {
      this.props.createMessage('That user already exists.', 'danger')
    })
  }
  render() {
    if (this.props.isAuthenticated) {
      return <Redirect to='/' />;
    }
    return (
      <div>
        <h1>Register</h1>
        <hr/><br/>
        <FormErrors
          formRules={this.state.formRules}
        />
        <form onSubmit={(event) => this.handleRegisterFormSubmit(event)}>
          <div className="form-group">
            <input
              name="username"
              className="form-control input-md"
              type="text"
              placeholder="Enter a username"
              required
              value={this.state.formData.username}
              onChange={this.handleFormChange.bind(this)}
            />
          </div>
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

export default RegisterForm

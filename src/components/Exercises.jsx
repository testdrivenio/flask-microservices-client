import React, { Component } from 'react';
import axios from 'axios';
import AceEditor from 'react-ace';
import 'brace/mode/python';
import 'brace/theme/solarized_dark';
import { Button } from 'react-bootstrap';

class Exercises extends Component {
  constructor (props) {
    super(props)
    this.state = {
      exercises: [],
      aceEditorValue: '# Enter your code here.'
    }
  }
  componentDidMount() {
    this.getExercises();
  }
  getExercises() {
    axios.get(`${process.env.REACT_APP_EVAL_SERVICE_URL}/exercises`)
    .then((res) => { this.setState({ exercises: res.data.data.exercises }); })
    .catch((err) => { console.log(err); })
  }
  onChange(value) {
    this.setState({ aceEditorValue: value });
  }
  submitExercise(event) {
    event.preventDefault();
    const data = {
      id: this.state.exercises[0].id,
      code: this.state.aceEditorValue
    }
    const url = `${process.env.REACT_APP_EVAL_SERVICE_URL}/tbd`
    axios.post(url, data)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    })
  }
  render() {
    return (
      <div>
        <h1>Exercises</h1>
        <hr/><br/>
          {!this.props.isAuthenticated &&
            <div>
              <div className="alert alert-warning">
                <span
                  className="glyphicon glyphicon-exclamation-sign"
                  aria-hidden="true">
                </span>
                <span>&nbsp;Please log in to submit an exercise.</span>
              </div>
              <br/>
            </div>
          }
          {this.state.exercises.length &&
            <div key={this.state.exercises[0].id}>
              <h4>{this.state.exercises[0].exercise_body}</h4>
                <AceEditor
                  mode="python"
                  theme="solarized_dark"
                  name={(this.state.exercises[0].id).toString()}
                  onLoad={this.onLoad}
                  onChange={this.onChange.bind(this)}
                  fontSize={14}
                  height={'175px'}
                  showPrintMargin={true}
                  showGutter={true}
                  highlightActiveLine={true}
                  value={this.state.aceEditorValue}
                  style={{
                    marginBottom: '10px'
                  }}
                />
                {this.props.isAuthenticated &&
                  <Button
                    bsStyle="primary"
                    bsSize="small"
                    onClick={this.submitExercise.bind(this)}
                  >Run Code</Button>
                }
              <br/><br/>
            </div>
          }
      </div>
    )
  }
}

export default Exercises

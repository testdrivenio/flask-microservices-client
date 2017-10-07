import React, { Component } from 'react';
import axios from 'axios';
import AceEditor from 'react-ace';
import 'brace/mode/python';
import 'brace/theme/solarized_dark';
import { Button, Glyphicon } from 'react-bootstrap';

import './Exercises.css';


class Exercises extends Component {
  constructor (props) {
    super(props)
    this.state = {
      exercises: [],
      aceEditorValue: '# Enter your code here.',
      isDisabled: false,
      showGrading: false,
      showCorrect: false,
      showIncorrect: false
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
  updateScore(correct) {
    const options = {
      url: `${process.env.REACT_APP_EVAL_SERVICE_URL}/scores`,
      method: 'patch',
      data: {
        exercise_id: this.state.exercises[0].id,
        correct: correct
      },
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${window.localStorage.authToken}`
      }
    };
    return axios(options)
  }
  submitExercise(event) {
    event.preventDefault();
    const stateObject = {
      showGrading: true,
      isDisabled: true,
      showCorrect: false,
      showIncorrect: false
    }
    this.setState(stateObject);
    const data = {
      answer: this.state.aceEditorValue
    }
    const url = 'https://c0rue3ifh4.execute-api.us-east-1.amazonaws.com/v1/execute'
    axios.post(url, data)
    .then((test) => {
      stateObject.showGrading = false
      stateObject.isDisabled = false
      if (test.data) {stateObject.showCorrect = true};
      if (!test.data) {stateObject.showIncorrect = true};
      this.setState(stateObject);
      return this.updateScore(test.data);
    })
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
      stateObject.showGrading = false
      stateObject.isDisabled = false
      this.setState(stateObject);
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
                  <div>
                    <Button
                      bsStyle="primary"
                      bsSize="small"
                      onClick={this.submitExercise.bind(this)}
                      disabled={this.state.isDisabled}
                    >Run Code</Button>
                  {this.state.showGrading &&
                    <h4>
                      &nbsp;
                      <Glyphicon glyph="repeat" className="glyphicon-spin"/>
                      &nbsp;
                      Grading...
                    </h4>
                  }
                  {this.state.showCorrect &&
                    <h4>
                      &nbsp;
                      <Glyphicon glyph="ok" className="glyphicon-correct"/>
                      &nbsp;
                      Correct!
                    </h4>
                  }
                  {this.state.showIncorrect &&
                    <h4>
                      &nbsp;
                      <Glyphicon glyph="remove" className="glyphicon-incorrect"/>
                      &nbsp;
                      Incorrect!
                    </h4>
                  }
                  </div>
                }
              <br/><br/>
            </div>
          }
      </div>
    )
  }
}

export default Exercises

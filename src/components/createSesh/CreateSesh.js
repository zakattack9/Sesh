import React from 'react';
import axios from 'axios';
import './CreateSesh.css';
import { Redirect } from 'react-router-dom';
import OverlayBtn from '../OverlayBtn';

class CreateSesh extends React.Component {
  state = {
    coords: this.props.location.state.coords,
    locationDetails: null,
    seshDetails: null,
    seshCourse: null,
    seshTime: null,
    errMsg: null,
    redirect: false
  };

  handleSubmit = event => {
    event.preventDefault();
    if (this.state.seshDetails === null || this.state.seshCourse === null || this.state.seshTime === null) {
      this.setState({ errMsg: 'Please fill in all fields' })
    } else {
      let formatCoords = `${this.state.coords[0]}:${this.state.coords[1]}`;

      axios({
        url: 'https://514apq0wme.execute-api.us-west-2.amazonaws.com/dev/createSesh',
        method: 'post',
        contentType: "application/json; charset=utf-8",
        dataType: 'JSON',
        data: JSON.stringify({
          "course": this.state.seshCourse,
          "time": this.state.seshTime,
          "location": formatCoords,
          "locationDetails": this.state.locationDetails,
          "seshDetails": this.state.seshDetails
        })
      })
        .then(res => {
          this.setState({ redirect: true });
        })
        .catch(err => {
          console.log(err);
        })
    }
  }

  render() {
    if (this.state.redirect) {
      this.props.history.push('/createSesh');
      return <Redirect to='/map' />
    }

    return (
      <div className="CreateSesh">
        <OverlayBtn></OverlayBtn>
        <svg id="bkgSvg" width="100%" height="100%" viewBox="0 0 360 545" version="1.1" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink">
          <defs>
            <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="linearGradient-1">
              <stop stopColor="#FFA852" offset="0%"></stop>
              <stop stopColor="#FD5C47" offset="100%"></stop>
            </linearGradient>
          </defs>
          <g id="App" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <g id="Login-Copy" transform="translate(0.000000, -47.000000)" fill="url(#linearGradient-1)">
              <path d="M-2.18847163e-12,631.506795 C37.882743,642.831068 77.3293441,642.831068 118.339803,631.506795 C209,604.736082 300.216765,614.322349 360,631.506795 L360,47 L-2.18847163e-12,47 L-2.18847163e-12,631.506795 Z" id="Path" transform="translate(180.000000, 343.500000) scale(-1, 1) rotate(-180.000000) translate(-180.000000, -343.500000) "></path>
            </g>
          </g>
        </svg>

        <div className="formWrapper">
          <div className="formTitle">Create a Sesh</div>
          <div className="formSubTitle">Open a Study Sesh once every 4 hours for each course</div>

          <form onSubmit={this.handleSubmit}>
            <div id="optionSelectorWrapper">
              <select className="courseSelector" name="course" defaultValue="" onChange={(e) => this.setState({ seshCourse: e.target.value })}>
                <option value="" disabled>Select Course</option>
                <option value="CSE240">CSE240</option>
                <option value="MAT267">MAT267</option>
                <option value="MAT243">MAT243</option>
                <option value="ENG102">ENG102</option>
                <option value="APA200">APA200</option>
              </select>

              <select className="timeSelector" name="time" defaultValue="" onChange={(e) => this.setState({ seshTime: e.target.value })}>
                <option value="" disabled>Select Time</option>
                <option value="12:00pm">12:00pm</option>
                <option value="1:00pm">1:00pm</option>
                <option value="2:00pm">2:00pm</option>
                <option value="3:00pm">3:00pm</option>
                <option value="4:00pm">4:00pm</option>
              </select>
            </div>

            <input className="selectLocation" type="text" placeholder="Select Location" value={this.state.coords} onChange={(e) => this.setState({ coords: this.state.coords })}></input>
            <textarea name="locationDetails" className="locationDetails" cols="30" rows="5" placeholder="Additional location directions" onChange={(e) => this.setState({ locationDetails: e.target.value })}></textarea>
            <textarea name="seshDetails" className="seshDetails" cols="30" rows="5" placeholder="Sesh objectives" onChange={(e) => this.setState({ seshDetails: e.target.value })}></textarea>
            <div className="errorMsg">{this.state.errMsg}</div>

            <input className="submitBtn" type="submit" value="Create Sesh"></input>
            <div className="cancelBtn">Cancel</div>
          </form>

        </div>
      </div>
    );
  }
}

export default CreateSesh;

import React from 'react';
import './OverlayBtn.css';
import { Link } from 'react-router-dom';
import Fade from 'react-reveal/Fade';

class OverlayBtn extends React.Component {

  showOverlay = () => {
    document.getElementById('overlayBtn').style.animationName = 'fadeOut';
    document.getElementById('overlayBtn').style.animationPlayState = 'running';
    document.getElementById('overlay').style.animationName = 'showOverlay';
    document.getElementById('overlay').style.animationPlayState = 'running';
  }

  closeOverlay = () => {
    document.getElementById('overlayBtn').style.animationName = 'fadeIn';
    document.getElementById('overlayBtn').style.animationPlayState = 'running';
    document.getElementById('overlay').style.animationName = 'closeOverlay';
    document.getElementById('overlay').style.animationPlayState = 'running';
  }

  render() {
    return (
      <div className="OverlayWrapper">
        <div id="overlay">
          <div className="closeOverlay" onClick={this.closeOverlay}>&times;</div>
          <Link to='/'>
            <Fade top distance={'5px'} delay={0}>
              <div className="overlayOpt">Home</div>
            </Fade>
          </Link>
          <Link to='/pickLocation'>
            <Fade top distance={'5px'} delay={150}>
              <div className="overlayOpt">Create a Sesh</div>
            </Fade>
          </Link>
          <Link to='/map'>
            <Fade top distance={'5px'} delay={300}>
              <div className="overlayOpt">Sesh Map</div>
            </Fade>
          </Link>
        </div>
        <div id="overlayBtn" onClick={this.showOverlay}>
          <svg width="23px" height="23px" viewBox="0 0 19 16" version="1.1" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink">
            <defs>
              <linearGradient x1="50%" y1="0%" x2="50%" y2="147.317647%" id="linearGradient-1">
                <stop stop-color="#FFA852" offset="0%"></stop>
                <stop stop-color="#FD5C47" offset="100%"></stop>
              </linearGradient>
            </defs>
            <g id="App" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
              <g id="Home-Copy-4" transform="translate(-319.000000, -22.000000)" fill="url(#linearGradient-1)">
                <path d="M336,34 C337.104569,34 338,34.8954305 338,36 C338,37.1045695 337.104569,38 336,38 L321,38 C319.895431,38 319,37.1045695 319,36 C319,34.8954305 319.895431,34 321,34 L336,34 Z M336,28 C337.104569,28 338,28.8954305 338,30 C338,31.1045695 337.104569,32 336,32 L321,32 C319.895431,32 319,31.1045695 319,30 C319,28.8954305 319.895431,28 321,28 L336,28 Z M336,22 C337.104569,22 338,22.8954305 338,24 C338,25.1045695 337.104569,26 336,26 L321,26 C319.895431,26 319,25.1045695 319,24 C319,22.8954305 319.895431,22 321,22 L336,22 Z" id="Combined-Shape"></path>
              </g>
            </g>
          </svg>
        </div >
      </div>
    );
  }
}

export default OverlayBtn;
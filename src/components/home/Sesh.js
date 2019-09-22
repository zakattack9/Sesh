import React from 'react';
import './Sesh.css';

const Sesh = (props) => {
  return (
    <div className={`Sesh ${props.class}`}>
      <div className={`seshCourse ${props.shadow}`}>{props.course}</div>
      <svg className="seshArrow" width="9px" height="15px" viewBox="0 0 9 15" version="1.3" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink">
        <defs>
          <path d="M89.7878159,35.5440677 L83.9210573,41.7746289 C83.6381099,42.0751237 83.1793807,42.0751237 82.8964635,41.7746289 L82.2122035,41.0479337 C81.9297391,40.7479519 81.9291957,40.2617679 82.210996,39.9610808 L86.8605042,34.999984 L82.210996,30.0389192 C81.9291957,29.7382321 81.9297391,29.2520481 82.2122035,28.9520663 L82.8964635,28.2253711 C83.1794109,27.9248763 83.63814,27.9248763 83.9210573,28.2253711 L89.7877857,34.4559323 C90.0707331,34.756395 90.0707331,35.2435729 89.7878159,35.5440677 Z" id="path-3"></path>
          <filter x="-6.2%" y="-3.6%" width="125.0%" height="114.3%" filterUnits="objectBoundingBox" id="filter-3">
            <feOffset dx="1" dy="1" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset>
            <feColorMatrix values="0 0 0 0 0.270588235   0 0 0 0 0.282352941   0 0 0 0 0.658823529  0 0 0 1 0" type="matrix" in="shadowOffsetOuter1"></feColorMatrix>
          </filter>
        </defs>
        <g id="App2" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
          <g id="Home-Copy-202" transform="translate(-102.000000, -134.000000)" fill-rule="nonzero">
            <g id="Group-2-Copy-22" transform="translate(20.000000, 106.000000)">
              <g id="Mask">
                <use fill="black" fill-opacity="1" filter="url(#filter-3)" href="#path-1"></use>
                <use fill="#FFFFFF" href="#path-3"></use>
              </g>
            </g>
          </g>
        </g>
      </svg>
      <div className="seshCount">{props.count}</div>
      <div className="seshTime">{props.time}</div>
    </div>
  );
}

export default Sesh;
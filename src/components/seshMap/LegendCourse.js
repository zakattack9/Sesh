import React from 'react';
import './LegendCourse.css'

const LegendCourse = (props) => {
  return (
    <div className="LegendCourse" onClick={props.filterSeshes} style={{'background-color': props.color}}>
      {props.course}
    </div>
  );
}

export default LegendCourse;
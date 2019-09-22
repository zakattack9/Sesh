import React from 'react';
import './PickLocation.css';
import { loadModules } from 'esri-loader';
import { Redirect } from 'react-router-dom';

class Map extends React.Component {
  state = { redirect: false, coords: null };

  componentDidMount() {
    this.generateMap();
  }


  generateMap = () => {
    let setRedirect = (coords) => {
      this.setState({ redirect: true, coords: coords });
    }

    loadModules(["esri/Map", "esri/views/MapView", "esri/widgets/Locate", "esri/views/draw/Draw", "esri/Graphic"])
      .then(([Map, MapView, Locate, Draw, Graphic]) => {
        var map = new Map({
          basemap: "streets"
        });

        var view = new MapView({
          container: "pickLocation", // Reference to the scene div created in step 5
          map: map, // Reference to the map object created before the scene
          zoom: 16, // Sets zoom level based on level of detail (LOD)
          center: [-111.9281, 33.4242] // Sets center point of view using longitude,latitude
        });

        var locate = new Locate({
          view: view,   // Attaches the Locate button to the view
          useHeadingEnabled: false,
          goToOverride: function (view, options) {
            options.target.scale = 1500;  // Override the default map scale
            return view.goTo(options.target);
          }
        });
        view.ui.add(locate, "top-left");

        var draw = new Draw({
          view: view
        });

        var action = draw.create("point");

        action.on("cursor-update", function (evt) {
          // console.log("DRAWING POINT", evt);
        });

        action.on("draw-complete", function (evt) {
          createPointGraphic(evt.coordinates);
          // console.log("FINAL POINT", evt.coordinates);
        });

        let coords;
        view.on("click", function (event) {
          coords = [event.mapPoint.latitude, event.mapPoint.longitude]
          console.log(coords)
        });

        function createPointGraphic(coordinates) {
          view.graphics.removeAll();
          var point = {
            type: "point", // autocasts as /Point
            x: coordinates[0],
            y: coordinates[1],
            spatialReference: view.spatialReference
          };

          var graphic = new Graphic({
            geometry: point,
            symbol: {
              type: "simple-marker", // autocasts as SimpleMarkerSymbol
              style: "circle",
              color: "#FFA852",
              size: "15px",  // pixels
              outline: {  // autocasts as new SimpleLineSymbol()
                color: "#FD5C47",
                width: 2  // points
              }
            }
          });
          view.graphics.add(graphic);
          setTimeout(() => {
            setRedirect(coords);
          }, 500)
        }
      })
      .catch(err => {
        console.error(err);
      });
  }

  render() {
    if (this.state.redirect) {
      this.props.history.push('/pickLocation');
      return <Redirect to={{
        pathname: '/createSesh',
        state: { coords: this.state.coords }
      }} />
    }

    return (
      <div className="PickLocation">
        <svg id="bkgSvgDir" width="100%" height="20%" viewBox="0 0 360 10" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink">
          <defs>
            <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="linearGradient-1">
              <stop stopColor="#FFA852" offset="0%"></stop>
              <stop stopColor="#FD5C47" offset="100%"></stop>
            </linearGradient>
          </defs>
          <g id="App" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
            <path d="M0,97.0067947 C37.882743,108.331068 77.3293441,108.331068 118.339803,97.0067947 C209,70.2360818 300.216765,79.8223492 360,97.0067947 L360,0 L0,0 L0,97.0067947 Z" id="Path" fill="url(#linearGradient-1)" transform="translate(180.000000, 52.750000) scale(-1, 1) rotate(-180.000000) translate(-180.000000, -52.750000) "></path>
          </g>
        </svg>

        <div className="directions">
          Click on a location on the map to create a Sesh
        </div>
        <div id="pickLocation"></div>
      </div >
    );
  }
}

export default Map;
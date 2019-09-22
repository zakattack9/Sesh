import React from 'react';
import axios from 'axios';
import './Map.css';
import LegendCourse from './LegendCourse';
import { loadModules } from 'esri-loader';
import OverlayBtn from '../OverlayBtn';

class Map extends React.Component {
  state = {
    seshes: [],
    courses: ['MAT267', 'CSE240', 'MAT243', 'ENG102', 'APA200'],
    colors: ['#FFA852', '#FB3D24', '#4676CA', '#6528F1', '#32E3B0'],
    showSeshInfo: false,
    selectedSesh: null
  }

  componentDidMount() {
    this.getSeshes();
  }

  getSeshes() {
    let courses = this.state.courses;
    let colors = this.state.colors;
    let url = 'https://514apq0wme.execute-api.us-west-2.amazonaws.com/dev/getSesh';
    let requests = [];

    courses.map((course, i) => {
      let config = { params: { course: course } }
      requests.push(
        axios.get(url, config)
          .then(res => {
            res.data.Items.map(sesh => {
              let obj = {};
              obj.course = sesh.course.S;
              obj.latitude = +sesh.location.S.split(':')[0];
              obj.longitude = +sesh.location.S.split(':')[1];
              obj.color = colors[i];
              obj.time = sesh.time.S;
              obj.locationDetails = sesh.locationDetails.S;
              obj.seshDetails = sesh.seshDetails.S;
              this.state.seshes.push(obj);
            })
          })
      )
    });

    Promise.all(requests).then(res => {
      this.generateMap();
    })
  }

  generateMap = (filter, navigate) => {
    let showSeshInfo = (lat, lon) => {
      let selectedSesh = this.state.seshes.find(sesh => {
        return Math.round(sesh.latitude * 1000) / 1000 === lat && Math.round(sesh.longitude * 1000) / 1000 === lon;
      });
      this.setState({ selectedSesh, showSeshInfo: true });
    }

    loadModules(["esri/Map", "esri/views/MapView", "esri/widgets/Locate", "esri/widgets/Track", "esri/Graphic", "esri/tasks/support/FeatureSet", "esri/tasks/RouteTask", "esri/tasks/support/RouteParameters"])
      .then(([Map, MapView, Locate, Track, Graphic, FeatureSet, RouteTask, RouteParameters]) => {
        var map = new Map({
          basemap: "streets"
        });
        var view = new MapView({
          container: "viewDiv", // Reference to the scene div created in step 5
          map: map, // Reference to the map object created before the scene
          zoom: 16, // Sets zoom level based on level of detail (LOD)
          center: [-111.93182821748704, 33.419468783811816] // Sets center point of view using longitude,latitude
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
        var track = new Track({
          view: view,
          // graphic: new Graphic({
          //   symbol: {
          //     type: "simple-marker",  // autocasts as new SimpleMarkerSymbol()
          //     style: "circle",
          //     color: "#FFA852",
          //     size: "25px",  // pixels
          //     outline: {  // autocasts as new SimpleLineSymbol()
          //       color: "#FD5C47",
          //       width: 2  // points
          //     }
          //   }
          // }),
          // useHeadingEnabled: false  // Don't change orientation of the map
        });
        view.ui.add(track, "top-left");
        if (navigate) {
          view.when(function() {
            track.start();
          });
        }

        // Add sesh points to map
        this.state.seshes.map(sesh => {
          let point = {
            type: "point",
            longitude: sesh.longitude,
            latitude: sesh.latitude
          };
          let simpleMarkerSymbol = {
            type: "simple-marker",
            color: sesh.color,  // orange
            outline: {
              color: "white", // white
              width: 1
            }
          };
          let pointGraphic = new Graphic({
            geometry: point,
            symbol: simpleMarkerSymbol
          });
          if (navigate) {
            if (sesh.course === navigate.course && sesh.latitude === navigate.latitude && sesh.longitude === navigate.longitude) {
              view.graphics.add(pointGraphic);

              let routeTask = new RouteTask({
                url: "https://route.arcgis.com/arcgis/rest/services/World/Route/NAServer/Route_World"
              });
              let routeParams = new RouteParameters({
                stops: new FeatureSet({
                  features: view.graphics.toArray() // Pass the array of graphics
                }),
                returnDirections: true
              });
              routeParams.stops.features.push(pointGraphic);

              track.on("track", function (trackEvent) {
                console.log(trackEvent);
                let point = {
                  type: "point",
                  longitude: trackEvent.position.coords.longitude,
                  latitude: trackEvent.position.coords.latitude
                };
                let simpleMarkerSymbol = {
                  type: "simple-marker",
                  color: sesh.color,  // orange
                  outline: {
                    color: "white", // white
                    width: 1
                  }
                };
                let curentPos = new Graphic({
                  geometry: point,
                  symbol: simpleMarkerSymbol
                });
                routeParams.stops.features.push(curentPos);

                routeTask.solve(routeParams).then(function(data) {
                  // Display the route
                  data.routeResults.forEach(function(result) {
                    result.route.symbol = {
                      type: "simple-line",
                      color: [5, 150, 255],
                      width: 3
                    };
                    view.graphics.add(result.route);
                  });
                });
              })
            }
          } else if (filter === undefined) {
            view.graphics.add(pointGraphic);
          } else {
            if (sesh.course === filter) {
              view.graphics.add(pointGraphic);
            }
          }
        })

        view.popup.autoOpenEnabled = false;
        view.on("click", function (event) {
          var lat = Math.round(event.mapPoint.latitude * 1000) / 1000;
          var lon = Math.round(event.mapPoint.longitude * 1000) / 1000;
          showSeshInfo(lat, lon);
        });
      })
      .catch(err => {
        // handle any errors
        console.error(err);
      });
  }

  startNavigation = () => {
    this.generateMap(undefined, this.state.selectedSesh);
    console.log(document.getElementsByClassName('seshInfo')[0]);
    document.getElementsByClassName('legend')[0].style.display = "none"
    document.getElementsByClassName('seshInfo')[0].style.animationPlayState = "running";
  }

  filterSeshes = (e) => {
    this.generateMap(e.target.innerText);
  }

  closeSeshInfo = () => {
    this.setState({ showSeshInfo: false });
  }

  showSeshInfo() {
    if (this.state.showSeshInfo) {
      return (
        <div className="seshInfo">
          <div id="seshCourse" style={{ "color": this.state.selectedSesh.color }}>{this.state.selectedSesh.course}</div>
          <div id="seshTime">{this.state.selectedSesh.time}</div>
          <div id="seshDetails">
            <span id="seshDetailsTitle">Sesh Objectives:</span>
            <br />
            {this.state.selectedSesh.seshDetails}
          </div>
          <div id="seshLocationDet">
            <span id="seshLocationTitle">Location Details:</span>
            <br />
            {this.state.selectedSesh.locationDetails}
          </div>

          <div className="attendSeshBtn" onClick={this.startNavigation}>Attend Sesh</div>
          <div className="closeBtn" onClick={this.closeSeshInfo}>Close</div>
        </div>
      )
    }
  }

  render() {
    return (
      <div className="Map">
        <OverlayBtn></OverlayBtn>
        {this.showSeshInfo()}
        <div className="legend">
          {this.state.courses.map((course, i) => {
            return <LegendCourse filterSeshes={this.filterSeshes} course={course} color={this.state.colors[i]}></LegendCourse>
          })}
        </div>
        <div id="viewDiv"></div>
      </div>
    );
  }
}

export default Map;
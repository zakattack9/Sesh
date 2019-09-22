import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import App from './components/seshMap/App';
import CreateSesh from './components/createSesh/CreateSesh';
import Home from './components/home/Home';
import PickLocation from './components/pickLocation/PickLocation';
import Main from './components/sesh/Main';

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/createSesh" component={CreateSesh} />
      <Route path="/map" component={App} />
      <Route path="/pickLocation" component={PickLocation} />
      <Route path="/sesh" component={Main} />
    </Switch>
  </BrowserRouter>,
  document.getElementById('root')
);

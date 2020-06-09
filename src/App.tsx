import React from 'react';

import { Router, Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import * as ROUTES from './constants/Routes';

import LandingPage from './pages/LandingPage';
import MyStoriesPage from './pages/MyStoriesPage';
import DMCreatorPage from './pages/DMCreatorPage';


const history = createBrowserHistory();

function App() {
  return (
    <Router history={ history }>
      <Switch>
        <Route exact path={ ROUTES.LANDING } component={ LandingPage }/>
        <Route exact path={ ROUTES.MY_STORIES } component={ MyStoriesPage }/>
        <Route exact path={ ROUTES.DM_CREATOR } component={ DMCreatorPage }/>
      </Switch>
    </Router>
  );
}

export default App;

import React, { useState, useEffect, useCallback, createContext } from 'react';

import { Router, Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import * as ROUTES from './constants/Routes';

import { loadMessengerSDK } from './lib/Messenger';

import LandingPage from './pages/LandingPage';
import LibraryPage from './pages/LibraryPage';
import MyStoriesPage from './pages/MyStoriesPage';
import DMCreatorPage from './pages/DMCreatorPage';


const history = createBrowserHistory();

export const MessengerContext = createContext(null);

function App() {
  const [messengerSDK, setMessengerSDK] = useState(null);

  const getMessengerSDK = useCallback(async () => {
    const messenger = await loadMessengerSDK();
    setMessengerSDK(messenger);
  }, [])

  useEffect(() => {
    getMessengerSDK();
  }, [])

  return (
    <MessengerContext.Provider value={ messengerSDK }>
      <Router history={ history }>
        <Switch>
            <Route exact path={ ROUTES.LIBRARY } component={ LibraryPage }/>
            <Route exact path={ ROUTES.MY_STORIES } component={ MyStoriesPage }/>
            <Route exact path={ ROUTES.DM_CREATOR } component={ DMCreatorPage }/>
          <Route path={ ROUTES.LANDING } component={ LandingPage }/>
        </Switch>
      </Router>
    </MessengerContext.Provider>
  );
}

export default App;

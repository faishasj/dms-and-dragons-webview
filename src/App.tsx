import React, { useState, useEffect, useCallback } from 'react';

import { Router, Route, Switch } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import * as ROUTES from './constants/Routes';

import { getMessengerSDK, ThreadContext } from './api/Messenger';

import LandingPage from './pages/LandingPage';
import MyStoriesPage from './pages/MyStoriesPage';
import DMCreatorPage from './pages/DMCreatorPage';


const history = createBrowserHistory();

function App() {
  const [messengerPSID, setMessengerPSID] = useState<string>("");

  const getMessengerContext = useCallback(async () => {
    const messengerSDK = await getMessengerSDK();
    if (messengerSDK) {
      messengerSDK.getContext('256197072270291',
        async ({ psid }: ThreadContext) => {
          setMessengerPSID(psid);
        },
        (error: any) => {}
      )
    }
  }, [])

  useEffect(() => {
    getMessengerContext();
  }, [])

  return (
    <Router history={ history }>
      <Switch>
        { messengerPSID && (
          <>
            <Route exact path={ ROUTES.MY_STORIES } component={ () => <MyStoriesPage authorID={messengerPSID}/> }/>
            <Route exact path={ ROUTES.DM_CREATOR } component={ () => <DMCreatorPage/> }/>
          </>
        )}
        <Route path={ ROUTES.LANDING } component={ LandingPage }/>
      </Switch>
    </Router>
  );
}

export default App;

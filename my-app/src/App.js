import React, { useState, useEffect, useRef } from 'react';
import { Router, Switch, Route } from "react-router-dom";
import { createBrowserHistory } from "history";
import {NotificationContainer, NotificationManager} from 'react-notifications';
import { useDispatch, useSelector } from 'react-redux';

import { fetchData } from './api';

import HomePage from './components/HomePage';
import About from './components/About'
import AdminPage from "./components/AdminPage"
import TypesEditor from './components/TypesEditor'
import Reports from "./components/Reports";
import Contactmessages from "./components/Contactmessages";
import Imgs from "./components/Imgs";
import CommentsAdmin from "./components/CommentsAdmin"
import Contact from "./components/Contact"
import NewBusiness from "./components/NewBusiness";
import BusinessPage from "./components/BusinessPage"
import BusinessPageEditor from "./components/BusinessPageEditor"

import Menu from "./Panels/Menu";
import 'react-notifications/lib/notifications.css';
import { fetchUser } from './store/slices/user-slice';
import { fetchPanelData } from './store/slices/panelData-slice';
import { useOnline } from './hooks/useOnline';

export default function App() {
  const user = useSelector (state => state.user)
  const panelData = useSelector (state => state.panelData);  
  const { isOnline, isAssumedStatus } = useOnline ();
  const dispatch = useDispatch ()
  const [data, setData]  = useState (null);
  //const [panelData, setPanelData] = useState ()
  const history = createBrowserHistory();   
  const count = useRef (0);

    console.log (`isOnline: ${isOnline && !isAssumedStatus}`);
    useEffect(() => {
      dispatch(fetchUser());
      dispatch (fetchPanelData());
  
      console.clear ();
      const notify = (type) => {
        isOnline && !isAssumedStatus ? 
        NotificationManager.success('Success', 'you are online')
        :
        NotificationManager.error('Error', 'you are offline')
      }
  
      window.addEventListener('offline', (e) => { notify ('offline') });
      window.addEventListener('online', (e) => { notify ('online') });
  
      console.log ("URL: "); 
      console.log (history.location)

      fetchData(history.location.pathname)
      .then (info =>  { 
        setData (info)
      }).catch (err => {
        console.log (err);
      });

      count.current++;
      console.log (`count: ${count.current}`);
    }, [count, dispatch])

    console.log ("URL: "); 
    if (panelData.status === '' || !data) return (<p>12</p>)
    return (
      <>
        <NotificationContainer/>
        <Menu user={user} panelData={panelData} count={count.current}/>

        <Router history={history}>
          <Switch>
            <Route exact path='/' render={() => <HomePage {...data} />} />
            <Route path='/about' render={() => <About {...data} />} />
            <Route path='/administrator' render={({ match }) => <AdminPage user={user} cnt={panelData.data} /> } />
            <Route path='/typeseditor' render={({ match }) => <TypesEditor {...data } />  } />
            <Route path='/reports' render={({ match }) => <Reports {...data } />  } />
            <Route path='/contactmessages' render={({ match }) => <Contactmessages {...data } />  } />
            <Route path='/imgs' render={({ match }) => <Imgs {...data } />  } />
            <Route path='/commentsAdmin' render={({ match }) => <CommentsAdmin {...data } />  } />
            <Route path='/contact' render={({ match }) => <Contact />  } />
            <Route path='/newbusiness' render={({ match }) => <NewBusiness {...data} user={user}/>  } />

            <Route path='/page/:id' render={({ match }) => <BusinessPage {...data} />  } />
            <Route path='/businesspageeditor/:id' render={({ match }) => <BusinessPageEditor {...data} />  } />
              
                         
            <Route exact path='*' component={()=>{return <h1 style={{marginTop: "51px"}}>Null</h1> }} status={404}/>
          </Switch>
        </Router>
      </>
    );
}


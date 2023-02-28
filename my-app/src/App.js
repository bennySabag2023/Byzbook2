import React, { useState } from 'react';
import { Router, Switch, Route } from "react-router-dom";
import { createBrowserHistory } from "history";
import HomePage from './components/HomePage';
import Password from "./components/Password"

export default function App () {
    const history = createBrowserHistory();
    const [data,setData]  = useState ('');
    
    /*async function fetchData (url) {
        const response = await fetch(`http://localhost:8080${url}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
        })
        var d = await response.json();
        console.log ("Fetch");
        console.log (d);
        return d;
    }*/
    
    const fetchData = () => {
        fetch(`http://localhost:8080${history.location}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
        })
        .then(response => response.json())
        .then(data => setData (data))
        .catch (err => setData(err));
    }

    fetchData ();

    return (
        <Router history={history}>
            <Route render = {({ location }) => (
            <Switch location = { location }>
            <Route exact path='/'>
                <HomePage {...data }/>
            </Route>
            { false && <Route path='/login' component={()=>{return <Password />}}/>}
            <Route exact path='*' component={()=>{return <p>Null</p> }} status={404}/>
            </Switch>
            )} />
        </Router>
    )
}

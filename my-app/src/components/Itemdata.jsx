import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, useParams, useRouteMatch} from "react-router-dom";
import { Document, Head, Main } from "@react-ssr/express";
import { isBrowser, isMobile } from "react-device-detect";
import Item from "../Panels/Item"
import ReportModal from './ReportModal';
import Menu from "../Panels/Menu";

import Comments from "./Comments";
import {Provider} from '../ContextAPI'
import "../styles/style.css";
import "../styles/comments.css";

export default function Itemdata(props) {
  const [user, setUser] = useState ({})

  return (
    <React.Fragment>
      <Head>
        <link rel="canonical" href="Byzbook.herokuapp.com" />
        <meta name="description" content={props.data.gsx$desc} />
        <meta name="author" content="https://www.facebook.com/RonenBr60/" />

        <meta property="og:description" content={props.data.gsx$desc} />
        <meta property="og:url" content="Byzbook.herokuapp.com" />
        <meta property="og:title" content={props.data.gsx$name} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="byzbook" />
        <meta property="og:image" content={props.data.gsx$logo} />
        
        <title>{props.data.gsx$name}</title>
      </Head>
      
      <Menu user={props.user} />

      <div className={isBrowser ? "container" : "container-fluid"} style={{ textAlign: 'right', direction: 'rtl' }}>
        <Provider value={setUser}> 
        <Item className1="typeEditor col-lg-4 col-md-4 col-lg-offset-4 col-md-offset-4" 
        data={ props.data } isLinkable={false} />
        </Provider>
        <Comments business={props.data._id} comments={props.comments} 
        className="commentPanel"/>
      </div>
    
      <ReportModal user={user}/>
    </React.Fragment>
  );
}

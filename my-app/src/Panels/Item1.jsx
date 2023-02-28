import React, { useState, useEffect } from 'react';
import {BrowserView, MobileView} from 'react-device-detect';
import {Consumer} from '../ContextAPI'

import '../../styles/App.css';
import '../../styles/style.css';
import '../../styles/bootstrap-social.css'

export default function Item(props) {

    const whatsappURL = () => 
        (BrowserView) ? 'https://web.whatsapp.com/' : 'whatsapp://' 
    
    const fullAddress = () => 
        (!props.data?.gsx$address) ? props.data.gsx$city :
        props.data.gsx$address + ", " + props.data.gsx$city;

    //------------------------------------------------------------------------        
    const setBg = () => {
        return "#" + Math.floor(Math.random()*16777215).toString(16);
    }

    const emptyVal = (val) => (val == undefined || val == null || val.trim() == '')

    return (
        <div className={ !props.className1 ? '' : props.className1 }
        style={props.style == '' ? '' : props.style}>
            <div className="panel panel-info">
                <div className="panel-heading">
                    {
                        (props.isLinkable) ? 
                        <a href={"/page/" + props.data.gsx$link} ><h3 className="caption panel-title title text-center">
                            {props.data.gsx$name}</h3>
                        </a>:
                        <h1 className="caption title panel-title text-center">{props.data.gsx$name}</h1>
                    }

                </div>
                <div className="panel-body">
                    <div className="has-success has-feedback img-thumbnail center-block" style={{ 
                    maxHeight: "500px", margin: "-4% 0 1.5% 0", padding: "0", width: "100%"}}>
                        <img className="center-block" src={props?.data.gsx$logo ? props?.data.gsx$logo : "https://res.cloudinary.com/byzbook/image/upload/v1673717520/X.jpg"} 
                        style={{height: props.data.gsx$logoheight + "px", 
                        margin: "0", padding: "0", width: "100%"}}/>
                    </div>
                    
                    <p className="text caption" style={{maxHeight: "100px", margin: "0", padding: "0"}}>{props.data.gsx$desc}</p>
                    <br/>
                    <div className="row" style={{ marginTop: "0", paddingTop: "0", height: '43px' }}>
                        <div className="buttonDiv col-lg-3 col-md-3 col-xs-3">
                            <a title="אתר" href={emptyVal(props.data.gsx$website) ? 'javascript:void(0)' : props.data.gsx$website} className="btn btn-social-icon btn-facebook">
                                <span className="fa fa-fw fa-globe"></span>
                            </a>
                        </div>
                        <div className="buttonDiv col-lg-3 col-md-3 col-xs-3">
                            <a title="דף פייסבוק" href={emptyVal(props.data.gsx$facebook) ? 'javascript:void(0)' : props.data.gsx$facebook} className="btn btn-social-icon btn-facebook">
                                <span className="fa fa-fw fa-facebook"></span>
                            </a>
                        </div>
                        <div className="buttonDiv col-lg-3 col-md-3 col-xs-3">
                            <a title="דף אינסטגרם" href={emptyVal(props.data.gsx$instagram) ? 'javascript:void(0)' : props.data.gsx$instagram} className="btn btn-social-icon btn-instagram">
                                <span className="fa fa-fw fa-instagram"></span>
                            </a>
                        </div>
                        <div className="buttonDiv col-lg-3 col-md-3 col-xs-3">
                            <a title="ווטסאפ" href={emptyVal(props.data.gsx$whatsapp) ? 'javascript:void(0)' : whatsappURL() + "send?phone=+972" + props.data.gsx$whatsapp} className="btn btn-social-icon btn-instagram" style={{ backgroundColor: "#06d755" }}>
                                <span className="fa fa-fw fa-whatsapp"></span>
                            </a>
                        </div>
                    </div>
                    <div className="properties" style={{ minHeight:'40px'}}>                     
                        { props.data.gsx$comment &&
                        <React.Fragment>
                        <hr />
                        <a title="הערות" className="linkWinthoutUnderline" href={'javascript:void(0)'}>
                        <span style={{direction: "ltr"}}>{ props.data['gsx$comment'] }</span><i className="fa fa-fw fa fa-comment"></i>
                        </a>
                        </React.Fragment>
                        }
                        {
                            [0, 1, 2].map((e,i)=>
                            (!props.data['gsx$phone'][e] ? '' :
                            <React.Fragment key={e}>
                            <hr />
                            <a title={"טלפון"+(e+1)} key={e} href={props.data['gsx$phone'][e] == null ? 'javascript:void(0)' : "tel:" + props.data['gsx$phone'][e].split(' ')[0]}>
                            <span>{(props.data['gsx$phone'][e] == undefined) ? '' : props.data['gsx$phone'][e]}</span><i className="fa fa-fw fa-phone"></i></a>
                            </React.Fragment>
                            ))
                        }
                        <hr />
                        <a title="כתובת" href={'http://maps.google.com/maps?q=' + encodeURIComponent(fullAddress().trim().replace(/\r?\n/, ',').replace(/\s+/g, ' ')) }><span>{ fullAddress() }</span><i className="fa fa-fw fa-map-marker"></i></a>
                        { (props.data.gsx$email) &&
                        <React.Fragment>
                        <hr />
                        <a title="אימייל" href={(!props.data.gsx$email)  ? 'javascript:void(0)' : "mailto:" + props.data.gsx$email}>
                        <span>{props.data.gsx$email == '' ? '' : props.data.gsx$email}</span><i className="fa fa-fw fa-envelope-o"></i>
                        </a>
                        </React.Fragment>
                        }
                        {
                            [0, 1, 2].map((e,i)=> 
                            (!props.data['gsx$worktime'][e] ? '' :
                            <React.Fragment key={e}>
                            <hr />
                            <a title="שעות עבודה" className="linkWinthoutUnderline" key={e} href='javascript:void(0)'>
                            <span>{props.data['gsx$worktime'][e]}</span><i className="fa fa-fw fa-clock-o"></i>
                            </a>
                            </React.Fragment>
                            ))
                        }
                        <hr/>
                        <Consumer>
                            { (value) =>
                            <button type="button" className="center-block btn btn-primary btn-md" data-toggle="modal" data-target="#myModal"
                            onClick={e => value(props.data)} style={{marginTop: "3%", marginBottom: "2%"}}>דיווח</button>   
                            }
                        </Consumer>
                    </div>
                </div>
            </div>
        </div>
    )
}

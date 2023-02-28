import React, { useState, useEffect } from 'react';
//import Item2 from "./Searchitem"
import Item from "../Panels/Item"
import "../styles/style.css";

export default function List(props) {

    /*const Item = (props1) => 
    (!props.search) ?
    <Item1 data={props1.data} isLinkable={props1.isLinkable} className1={props1.className} idx={props1.idx} /> 
    :
    <Item2 data={props1.data} isLinkable={props1.isLinkable} className={props1.className} idx={props1.idx}/> */
    
    const soryByName = (arr) =>
        arr.sort((a, b) => a.gsx$name.localeCompare(b.gsx$name))

    const searchText = () => {
        let text;
        if (props?.search || props?.city || props?.type) text = "תוצאות החיפוש "
        if (props?.search) text += " של " + props.search;
        if (props?.city) text += " ב" + props.city;
        if (props?.type)  text += " מטיפוס " + props.type;

        return text;
    }
        
    const UI = (attr) => 
    <div style={{ marginTop: "-2%"}}>
        { (props.filterFunc(attr, props.list).length != 0) ?
        <React.Fragment>
        <h2 className="pageTitle">{attr}</h2>
        <div className="row listRow2">
        {
            soryByName(props.filterFunc(attr, props.list)).map((item, i) => 
            <React.Fragment key={item.gsx$link} >
                <Item key={item.gsx$link} data={item} isLinkable={true}
                className1="col-sm-12 col-xs-12" idx={i}></Item>
            </React.Fragment>)
        }
        </div>
        </React.Fragment> : ''}
    </div>

    return (
        <React.Fragment>
        {
             (searchText()) && <h3 className="pageTitle searchText">{ searchText() }</h3>
        }
        {
            (props.list.length == 0) ? "" : 
            (props.filterBy == undefined) ?             
            <div className="row listRow2">
            {
                soryByName(props.list).map((item, i) => 
                <React.Fragment key={item.gsx$link} >
                    <Item data={item} isLinkable={true}
                    className1="col-sm-12 col-xs-12" idx={i}></Item> 
                </React.Fragment>)
            } 
            </div> : props.filterBy.map(attr => UI(attr))
        }
        </React.Fragment>
    )
}
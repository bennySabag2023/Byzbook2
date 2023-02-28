import React, { useState, useEffect } from 'react';
//import Item2 from "./Searchitem"
import Item from "../Panels/Item"
import { divideArray } from "../ContextAPI";
import "../styles/style.css";

export default function List1(props) {

    /*const Item = (props1) => 
    (!props.search) ?
    <Item1 data={props1.data} isLinkable={props1.isLinkable} className1={props1.className} idx={props1.idx}/> 
    :
    <Item2 data={props1.data} isLinkable={props1.isLinkable} className={props1.className} idx={props1.idx}/> */
    
    const soryByName = (arr) =>
        arr.sort((a, b) => a.gsx$name.localeCompare(b.gsx$name))

    const searchText = () => {
        let text = '';
        if (props?.search || props?.city || props?.type) text = "תוצאות החיפוש "
        if (props?.search) text += " של " + props.search;
        if (props?.city) text += " ב" + props.city;
        if (props?.type)  text += " מטיפוס " + props.type;

        return text;
    }

    return (
        <React.Fragment>
        {
            (searchText()) && <h3 className="pageTitle searchText">{ searchText() }</h3>
        }
        {
            (props.list.length == 0) ? "" : 
            (props.filterBy == undefined) ?             
            
            divideArray(3, soryByName(props.list)).map((items, i) => 
                <div key={"A" + i} className="row listRow1">
                {
                    items.map((item, j) =>
                    <Item key={"B" + (i*3+j)} data={item} isLinkable={true}
                    className1="col-lg-4 col-md-4 pull-right" idx={(i*3+j)}/>)
                }
                </div>)
            : 
            
            props.filterBy.map(attr => 
                (props.filterFunc(attr, props.list).length != 0) &&
                (<React.Fragment>
                 <h2 className="pageTitle">{attr}</h2>
                { divideArray(3, soryByName(props.filterFunc(attr, props.list))).map((items, i) => 
                <div key={"A" + i} className="row listRow1">
                {
                    items.map((item, j) =>
                    <Item key={"B" + (i*3+j)} data={item} isLinkable={true}
                        className1="col-lg-4 col-md-4 pull-right" idx={i*3+j}/>)
                }
                </div>)}                
                </React.Fragment>)
            )
        }
        </React.Fragment>
    )
}

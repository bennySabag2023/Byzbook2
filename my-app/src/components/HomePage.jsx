import React, { useState, useEffect } from "react";
import {Helmet} from "react-helmet";
import { isBrowser } from 'react-device-detect';
import List1 from './List1';
import List2 from './List2';
import ReportModal from './ReportModal';
import Menu from "../Panels/Menu";

import {Provider, getCities } from '../ContextAPI'
import "../styles/style.css";
export default function HomePage(props) {
    const [err, setErr] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [list, setList] = useState([]);
    const [types, setTypes] = useState([]);
    const [k, setK] = useState(0)
    const [searchText, setSearchText] = useState('')
    const [search, setSearch] = useState ('')
    const [cities, setCities] = useState()
    const [user, setUser] = useState ({})

    const [type, setType] = useState();
    const [city, setCity] = useState('נוף הגליל');
    
    const [check1, setCheck1] = useState (false);
    const [check2, setCheck2] = useState (false);

    const text = "ברוכים הבאים לאינדקס העסקים הגדול במדינה. כאן תוכלו למצוא מידע עדכני ומפורט ככל האפשר על העסקים השונים"

    const List = (props1) => 
        <React.Fragment> 
            { isBrowser ? List1 (props1) : List2 (props1) }
        </React.Fragment>
        

    const handleSubmit = (event) => {
        event.preventDefault();
        if (searchText.trim() === '' && check1 && check2) return;

        var info = { searchText: searchText, active: true }

        if (check1) info.type = type == null ? types[0]._id : type._id;
        if (check2) info.city = city == null ? cities[0] : city;

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: info})
        };
        fetch('./getBusinessesBySearch', requestOptions)
            .then(response => response.json())
            .then(data => {
                console.log (data);
                setList (data);
                setErr(null)
                setIsLoaded(true)
                setSearch (searchText);
            })
            .catch(currError => {
                setTypes(null)
                setErr(currError)
                setIsLoaded(false)
                setSearch ('');
            });
    }

    const refresh = (event) => {
        event.preventDefault();
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
        };
        fetch('/', requestOptions)
            .then(response => response.json())
            .then(data => {
                setList (data.businesses);
                setTypes(soryByAtrr(data.types, "gsx$type"))
                setIsLoaded(true)
                setErr(null)
                setSearch ('')
                setSearchText ('')
            },
                (currError) => {
                    setTypes(null)
                    setErr(currError)
                    setIsLoaded(false)
                    setSearch ('');
                });
    }

    const soryByAtrr = (arr, attr) => {
        arr = arr.sort((a, b) => {
            let res = a[attr].localeCompare(b[attr])
            return res;
        })
        return arr;
    }

    const findIndexOfTypeById = (ID) => {
        let type = types.find (e => e._id == ID);
        return type.gsx$type;
    }

    const filterAlphabeticaly = (l, arr) => { return arr.filter(item => item.gsx$name.charAt(0) === l) }
    const filterByType = (type, arr) => { return arr.filter(item => findIndexOfTypeById(item.gsx$type) === type) }

    const listData = () => {
        let data = { search: search };
        data.type = check1 ? type : undefined;
        data.city = check2 ? city : undefined;
        
        return data;
    }


    useEffect(() => {
        getCities(setCities);
        console.log ('props');
        console.log (props);

        if (props.err) {
            setIsLoaded (false);
            setErr (props.err);
        }

        else {
            setList(props.businesses);
            setTypes(soryByAtrr(props.types, "gsx$type"))
            setIsLoaded(true)
            console.log ("User: ", props.user?.username)
        }
    }, [props])


    if (err) return <h1>{err}</h1>
    else if (!isLoaded || cities === undefined) {
        return <div/>;
    } else {
        return (
        <div id='root'>
            <Helmet>
            <link rel="canonical" href="https://romanbr87.github.io/index/index.html" />
            <meta name="description" content="אינדקס עסקים של נוף הגליל לטובת פרסום עסקים" />
            <meta name="author" content="https://www.facebook.com/RonenBr60/" />

            <meta property="og:description" content="אינדקס עסקים של נוף הגליל לטובת פרסום עסקים" />
            <meta property="og:url" content="https://romanbr87.github.io/index/index.html" />
            <meta property="og:title" content="אינדקס עסקים" />
            <meta property="og:type" content="website" />
            <meta property="og:site_name" content="byzbook" />

            <title>"אינדקס עסקים"</title>
            </Helmet>
            <Menu user={props.user}>
            </Menu>
        
            <div className="container" style={{ marginTop: '0', paddingTop: '0', textAlign: 'right', direction: 'rtl' }}>
                <div className="jumbotron" style={{ padding: '0', borderRadius: '0' }}>
                    <h3 className="title" id="title" style={{ textAlign: 'center', textDecoration: 'underline' }}>אינדקס עסקים</h3>
                    <p>{text}</p>
                </div>
                
                <label>חיפוש עסקים</label>                
                <form className={isBrowser ? "row" : ""} style={{direction: "ltr"}} role="search" onSubmit={handleSubmit}>
                
                <div className={ isBrowser ? "col-lg-4 col-md-4" : '' }>
                <div className="form-group">
                <label forhtml="sel1">חיפוש לפי סוג עסק</label>
                <div className="form-group input-group form-group-sm"  style={{direction: "ltr"}}>
                    <select className="form-control" onChange={e => setType(types[e.target.value]) }
                    value={types.indexOf(type)}>
                    {
                        types.map((e, j) => {
                            return <option key={j} value={j}>{(j+1) + ". " + e.gsx$type}</option> 
                        })
                    }
                    </select>
                    
                    <span className="input-group-addon">
                    <input type = "checkbox" value={check1} onChange={e => setCheck1 (e.target.value) } />                   
                    </span>
                </div>
                </div>
                </div>

                <div className={ isBrowser ? "col-lg-4 col-md-4" : '' }>
                <label>חיפוש לפי יישוב</label>
                <div className="form-group input-group form-group-sm" style={{direction: "ltr"}}>
                    <select className="form-control" onChange={e => setCity(cities[e.target.value]) }
                    value={cities.indexOf(city)}>
                    {
                        cities.map((e, j) => {
                            return <option key={j} value={j}>{(j+1) + ". " + e}</option> 
                        })
                    }
                    </select>
                    <span className="input-group-addon">
                    <input type = "checkbox" value={check2} onChange={e => setCheck2 (e.target.value) } />                   
                    </span>
                </div>
                </div>

                <div className={ isBrowser ? "col-lg-4 col-md-4" : ''}>
                <label>טקסט חופשי</label>
                <div className="form-group input-group input-group-sm"  style={{direction: "ltr"}}>
                <input type="text" className="form-control input-sm" placeholder="חיפוש" name="חיפוש" 
                value={searchText} onChange={(e) => setSearchText(e.target.value)} />
                <div className="input-group-btn" style={{ direction: 'ltr'}}>
                    <button className="btn btn-default btn1" type="submit" title="לחפש עסקים">
                        <i className="glyphicon glyphicon-search"></i>
                    </button>
                </div>
                </div>
                </div>
                
                </form>

                {
                    (!(list.length == 0 && search != '')) &&
                    <div className={ isBrowser ? "col-lg-offset-8 col-md-offset-8" : ''} 
                    style={{marginBottom: "10px"}}>
                    <div className="form-group form-group-sm">
                    <label>הצג לפי </label>
                    <select className="form-control" onChange={(e) => setK(e.target.value)} style={{direction:"rtl"}}>
                        <option value="0">הצג את כל העסקים ביחד</option>
                        <option value="1">לפי סדר אלפבתי</option>
                        <option value="2">לפי קטגוריות</option>
                    </select>
                    </div>
                    </div>
                }


                { (list.length == 0) && 
                    <h2 className="pageTitle">לא נמצאו תוצאות החיפוש של "{ search  }" </h2>
                }
                {
                    (list.length == 0) ? '' :
                    <Provider value={setUser}> 
                    {
                        (k == 0) ? <List list={list} filterBy={undefined} {...listData()}></List>:
                        (k == 1) ? <List list={list} filterBy={("אבגדהוזחטיכלמנסעפצקרשת").split('')} filterFunc={filterAlphabeticaly} {...listData()}></List>:
                        (k == 2) && (<List list={list} filterBy={types.map(t => t.gsx$type)} filterFunc={filterByType} {...listData()}></List>)
                    }
                    </Provider>
                }
            </div>
            
            <ReportModal user={user}/>

        </div>
        )
    }
}

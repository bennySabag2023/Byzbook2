import React, { useState, useEffect } from "react";
import { Document, Head, Main } from "@react-ssr/express";
import Menu from "../Panels/Menu";
import "../styles/style.css";

export default function Password (props) {

    const [name, setName] = useState ("רומן");
    const [password, setPassword] = useState("123456");
    const iconStyle = { backgroundColor: '#ffde6c', color: '#d17d00' }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const requestOptions = {    
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            redirect: "follow",
            body: JSON.stringify({ 
                username: name, 
                password: password,
                web: true
            })
        };
       
        try {
            var res = await fetch('/login', requestOptions)
            var json = await res.json();
            json.success ? window.location.href = "/" : alert ("אחד מהנתונים שהכנסת שגוי");
        }

        catch (e) { 
            alert ("תקלה בשרת");
            console.log (e) }
    }//*/

    /*const handleSubmit = (e) => {
		//e.preventDefault();
        console.log (e);
        return true;
    }//*/


    const handleError = (e) => {
        console.log (e);
        alert ("!@");
        return true;
    }//*/

    /*useEffect(() => {       
        setName ("");
        setPassword("");
    }, [])*/
      
    return (
    <React.Fragment>
        <Head>       
        <link rel="canonical" href="https://romanbr87.github.io/index/index.html" />
        <meta name="description" content="אינדקס עסקים של נוף הגליל לטובת פרסום עסקים" />
        <meta name="author" content="https://www.facebook.com/RonenBr60/" />

        <meta property="og:description" content="אינדקס עסקים של נוף הגליל לטובת פרסום עסקים" />
        <meta property="og:url" content="https://romanbr87.github.io/index/index.html" />
        <meta property="og:title" content="אינדקס עסקים" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="byzbook" />

        <title>כניסה בתור מנהל</title>
        </Head>
        <Menu user={props.user}/>        
        
        <div className="container">
            <div className="col-md-4 col-md-offset-4">
                <form className="form-horizontal" role="form" method="post" action='/login'
                style={{marginTop: "50%",}} onSubmit={handleSubmit} onError={handleError} noValidate>

				<div className="panel panel-info">
					<div className="panel-heading">
						<h1 className="title panel-title text-center">כניסה</h1>
					</div>
                    <div className="panel-body" style={{ maxHeight: "200px", marginTop: "-3%", 
                    marginRight: "0%", width: "100%", backgroundColor: "transparent" }}>
							<label className="control-label">שם משתמש</label>
							<div className="input-group has-feedback" style={{ direction: 'ltr', marginBottom: "2%", }}>
								<input type="text" className="form-control" placeholder="משתמש" title="משתמש" 
                                value={name} onChange={e=>setName(e.target.value)} name='username' required />
                                <span className="input-group-addon" style={iconStyle}
                                title="משתמש"><i className="glyphicon glyphicon-user"></i></span>
							</div>

							<label className="control-label">סיסמה</label>
							<div className="input-group has-feedback" style={{ direction: 'ltr', }}>
								<input type="password" className="form-control" placeholder="סיסמה" title="סיסמה" 
                                value={password} onChange={e=>setPassword (e.target.value)} autoComplete={""} 
                                name='password' required/>
                                <span className="input-group-addon" style={iconStyle} 
                                title="סיסמה"><i className="glyphicon glyphicon-lock"></i></span>
							</div>
							<button type="submit" className="btn btn-primary btn-block" 
                            style={{marginBottom:"-2px", marginTop: "10px"}}>כניסה</button>
					    </div>
				    </div>
                </form>
			</div>
		</div>
    </React.Fragment>
    )
}
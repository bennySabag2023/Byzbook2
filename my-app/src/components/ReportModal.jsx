import React, { useState, useEffect, useRef } from "react";
import "../styles/style.css";
export default function ReportModal(props) {

    const [txt, setTxt] = useState("");
    const txtInput = useRef(null);
    
    useEffect(() => {
        if (txtInput.current) txtInput.current.focus();
    }, []);
    const submit = async (e) => {
        alert (txt);
        if (txt.trim() == '') {
            alert ("לא ניתן להגיש טקסט ריק");
            return;
        }
        
        let data = {
            gsx$refId: props.user._id,
            gsx$desc: txt
        }

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: data })
        };
        let res = await fetch('http://localhost:3001/addreport', requestOptions)
        let json = await res.json();

        alert (res.ok ? "הדיווח הוגש בהצלחה" : "הדיווח לא הוגש");
        if (res.ok) setTxt ('')
    }

    if (props?.user?.gsx$name == undefined) return '';
    else return (
        <React.Fragment>
            
            <div className="modal fade modal-info" tabIndex="-3" role="dialog" id="myModal" aria-labelledby="gridSystemModalLabel">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                <div className="modal-header">
                    <button type="button" className="close pull-left" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                    <h4 className="modal-title" id="gridSystemModalLabel">{"דיווח על העסק " + props.user.gsx$name}</h4>
                </div>
                <div className="modal-body" style={{padding :"1%"}}>
                    <textarea id="txtArea" className="form-control" rows="5" placeholder="דיווח" 
                    style={{resize: 'unset', width: "100%", borderRadius: "0"}} 
                    value={txt} onChange={e=>setTxt(e.target.value)} ref={txtInput}>
                    </textarea>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-default" data-dismiss="modal"
                    onClick={e=>setTxt("")}>לסגור</button>
                    <button type="button" className="btn btn-primary pull-left" data-dismiss="modal"
                    onClick={submit}>להגיש דיווח</button>
                </div>
                </div>
            </div>
            </div>

        </React.Fragment>
    )
}


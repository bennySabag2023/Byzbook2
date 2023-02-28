import React from "react";

const Error = (props) => {
  

  
  return (
     (props.message || props.error) ? <React.Fragment>
      { props?.message && <h1>{ props.message }</h1> }
      { props?.error?.status && <h2>{ props.error.status }</h2> }
      { props?.error?.stack && <pre>{ props.error.stack }</pre> }
    </React.Fragment> : props.children 
  );
};

export default Error;

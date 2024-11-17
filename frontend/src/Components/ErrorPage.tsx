import React from "react";
import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <>
      <div className="error-header">Uh oh! Could not find the page</div>
      <Link className="error-link" to="/"> Go Back</Link>
    </>
  );
};


export default ErrorPage;
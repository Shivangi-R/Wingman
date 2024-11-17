import React from "react";
import { Link } from "react-router-dom";

const VerifiedPage = () => {
  return (
    <>
      <div className="error-header">Email has been successfully verified.</div>
      <Link className="error-link" to="/">
        {" "}
        Go Back
      </Link>
    </>
  );
};

export default VerifiedPage;

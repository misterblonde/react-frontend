import React from "react";
import { StrictMode } from "react";
import MyMap from "../Components/MyMap";
import "./proposals.css";

import { Route, Routes } from "react-router";
import Vote from "./Vote";
import Profile from "./Profile";

export default function About({ match }) {
  return (
    <div>
      <StrictMode>
        <br></br>
        <div className="coolTxt">
          <p>
            This map shows the global impact of the <b>Infrastructure DAO</b>.
            Every <i>tap</i> represents a <b>Project DAO</b> launched by the
            Infrastructure DAO.{" "} 
          </p>
        </div>
        <MyMap />
        <Routes>
          <Route path={`/Vote`} component={<Vote />} />
          <Route path={`/Profile`} component={<Profile />} />
        </Routes>
      </StrictMode>
    </div>
  );
}

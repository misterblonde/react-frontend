import React from "react";
import ReactDOM from "react-dom/client";
// import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";

import Web3 from "web3";
import { Web3ReactProvider } from "@web3-react/core";
import { MetaMaskProvider } from "./Components/MetaMask";

import "bootstrap/dist/css/bootstrap.min.css";

function getLibrary(provider, connector) {
  return new Web3(
    provider.HttpProvider(
      "https://mainnet.infura.io/59688ffd8ec54a9288501b276812812c"
    )
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
/* <script
  src="https://maps.googleapis.com/maps/api/js?key=YOUR_KEY"
  type="text/javascript"
></script>; */
root.render(
  <React.StrictMode>
    {/* <Web3ReactProvider getLibrary={getLibrary}>
      <MetaMaskProvider> */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
    {/* </MetaMaskProvider>
    </Web3ReactProvider> */}
  </React.StrictMode>
);
//   document.getElementById("root")
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

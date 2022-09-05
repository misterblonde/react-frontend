import React from "react";
import "./Marker.css";
import { useState, useEffect } from "react";
// import { InfoWindow } from "google-maps-react";
export default function Marker(props) {
  const { color, name, id } = props;
  const onMarkerRightClick = () => {
    console.log("Hey jules.");
  };

  const handleClick = (e) => {
    if (e.type === "click") {
      console.log("Left click response");
    }
    // } else if (e.type === "contextmenu") {
    //   console.log("Right click");
    // }
  };

  //   const onMarkerClick = (props, marker, e) => {
  //     displayInfoWindow(true);
  //     setActiveMarker(marker);
  //     setSelectedPlace(props);
  //   };

  //   const onClose = (props) => {
  //     if (infoWindow) {
  //       displayInfoWindow(false);
  //       setActiveMarker(null);
  //     }
  //   };

  const handleChildClick = (event) => {
    console.log("child clicked");
  };

  return (
    <div
      className="marker"
      style={{ backgroundColor: color, cursor: "pointer" }}
      title={name}
      onClick={handleChildClick}
      //   onContextMenu={() => onMarkerRightClick()}
    ></div>
  );
}

import React, { useRef, useEffect, useState } from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";
import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";

const mapRender = (status) => {
  if (status === Status.LOADING) return <p>Loading...</p>;
  if (status === Status.FAILURE) return <p>Error...</p>;
  return null;
};

const MapDom = ({ id, children, ...props }) => {
  const ref = useRef();
  const [map, setMap] = useState(null);
  const [customControls, setCustomControls] = useState([]);
  const [currentCenter, setCurrentCenter] = useState(props.center);

  useEffect(() => {
    const customs = React.Children.map(children, (child) => {
      if (
        React.isValidElement(child) &&
        child.type.displayName === "CustomControl"
      ) {
        return child;
      }
    });
    setCustomControls(customs);
  }, [children]);

  useEffect(() => {
    if (map && customControls.length) {
      map.controls[window.google.maps.ControlPosition.TOP_CENTER] = [];
      customControls.map((control) => {
        const container = window.document.createElement("div");
        console.log(control);
        const root = createRoot(container);
        // const container = document.getElementById("app");
        // const root = createRoot(container); // createRoot(container!) if you
        // root.render(<App tab="home" />);
        // ReactDOM.render(control, container)
        root.render(control);
        map.controls[
          window.google.maps.ControlPosition[control.props.position]
        ].push(container);

        return null;
      });
    }
  }, [map, customControls]);

  useEffect(() => {
    if (ref.current && !map) {
      setMap(new window.google.maps.Map(ref.current, props));
    }
  }, [ref, map, props]);

  useEffect(() => {
    if (currentCenter != props.center) {
      console.log("updating map");
      setMap(new window.google.maps.Map(ref.current, props));
      setCurrentCenter(props.center);
    }
  }, [props.center]);

  return (
    <>
      <div ref={ref} id={id}></div>
      {React.Children.map(children, (child) => {
        if (
          React.isValidElement(child) &&
          child.type.displayName !== "CustomControl1"
        ) {
          return React.cloneElement(child, { map });
        }
      })}
    </>
  );
};
MapDom.displayName = "Map";

const Map = ({ apiKey, render = mapRender, children, ...props }) => {
  return (
    <Wrapper apiKey={apiKey} render={render}>
      <MapDom {...props}>{children}</MapDom>
    </Wrapper>
  );
};

export default Map;

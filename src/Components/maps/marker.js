import React, { useEffect, useState, useCallback } from "react";
const Marker = ({ animate, info, children, onClick, ...props }) => {
  const [marker, setMarker] = useState();
  const [openInfoWindow, setOpenInfoWindow] = useState(false);

  const clickHandler = useCallback(
    (e) => {
      if (onClick) onClick(e);
      setOpenInfoWindow(true);
    },
    [onClick]
  );
  useEffect(() => {
    if (!marker) {
      setMarker(new window.google.maps.Marker());
    }

    // remove marker from map on unmount
    return () => {
      if (marker) {
        marker.setMap(null);
      }
    };
  }, [marker]);

  useEffect(() => {
    if (marker) {
      marker.setOptions(props);
      if (animate) marker.setAnimation(window.google.maps.Animation[animate]);
      else marker.setAnimation(null);
      //Listen events

      ["click"].forEach((eventName) =>
        window.google.maps.event.clearListeners(marker, eventName)
      );
      marker.addListener("click", (e) => clickHandler(e));
    }
  }, [marker, animate, props, clickHandler]);

  return (
    <>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            anchor: marker,
            open: openInfoWindow,
            onClose: (e) => setOpenInfoWindow(false),
            map: props.map
          });
        }
      })}
    </>
  );
};
Marker.displayName = "Marker";
export default Marker;

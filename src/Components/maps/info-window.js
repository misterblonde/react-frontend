import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
const InfoWindow = ({ content, anchor, map, open, onClose, ...props }) => {
  const [infoWindow, setInfoWindow] = useState();

  useEffect(() => {
    if (open && infoWindow) {
      let id = `infowindow_${Math.random() * 1000000}`;
      infoWindow.setContent(`<div id=${id}></div>`);

      //Ugly hack to rander react element to infowindow
      setTimeout(() => {
        ReactDOM.render(content, window.document.getElementById(id));
      });

      infoWindow.open({
        anchor: anchor,
        map,
        shouldFocus: false
      });
    }
  }, [open, anchor, map, infoWindow, content]);

  useEffect(() => {
    if (!infoWindow) {
      setInfoWindow(new window.google.maps.InfoWindow());
    }

    // remove marker from map on unmount
    return () => {
      if (infoWindow) {
        infoWindow.setMap(null);
      }
    };
  }, [infoWindow]);

  useEffect(() => {
    if (infoWindow) {
      infoWindow.setOptions(props);

      ["closeclick"].forEach((eventName) =>
        window.google.maps.event.clearListeners(infoWindow, eventName)
      );
      if (onClose) infoWindow.addListener("closeclick", (e) => onClose(e));
    }
  }, [infoWindow, props, onClose]);
  return null;
};
InfoWindow.displayName = "InfoWindow";
export default InfoWindow;

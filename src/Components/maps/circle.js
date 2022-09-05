import { useEffect, useState, useCallback } from "react";
const Circle = ({ onRadiusChange, onCenterChange, ...props }) => {
  const [circle, setCircle] = useState();

  const radiusChangeHandler = useCallback(
    (e) => {
      if (onRadiusChange) onRadiusChange(circle.getRadius());
    },
    [onRadiusChange, circle]
  );
  const centerChangeHandler = useCallback(
    (e) => {
      if (onCenterChange) onCenterChange(circle.getCenter());
    },
    [onCenterChange, circle]
  );

  useEffect(() => {
    if (!circle) {
      setCircle(new window.google.maps.Circle({}));
    }

    return () => {
      if (circle) {
        circle.setMap(null);
      }
    };
  }, [circle]);

  useEffect(() => {
    if (circle) {
      circle.setOptions(props);

      ["radius_changed", "center_changed"].forEach((eventName) =>
        window.google.maps.event.clearListeners(circle, eventName)
      );
      circle.addListener("radius_changed", () => radiusChangeHandler());
      circle.addListener("center_changed", () => centerChangeHandler());
    }
  }, [circle, props, radiusChangeHandler, centerChangeHandler]);

  return null;
};
Circle.displayName = "Circle";
export default Circle;

import React from "react";
const CustomControl = ({ position, children, ...props }) => {
  return (
    <div style={{ boxShadow: "rgb(0 0 0 / 30%) 0px 1px 4px -1px" }}>
      {children}
    </div>
  );
};
CustomControl.displayName = "CustomControl";
export default CustomControl;

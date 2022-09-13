import React from "react";
import SimpleSnackbar from "../Components/SimpleSnackbar";

export default function Notify(props) {
  // default is execcute
  if (props.type == "queue") {
    return <SimpleSnackbar name={props.type} />;
  }

  return <SimpleSnackbar name={props.type} optionalArg={props.newAddress} />;
}

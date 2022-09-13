import React from "react";
import SimpleSnackbar from "../Components/SimpleSnackbar";

export default function Notify(type, newAddress) {
  // default is execcute
  if (param == "queue") {
    return <SimpleSnackbar name={props.type} />;
  }

  return <SimpleSnackbar name={props.type} optionalArg={props.newAddress} />;
}

import React from "react";
import SubmitVote from "./SubmitVote";
import SubmitVoteID from "./SubmitVoteID";
import { useState } from "react";
export default function Child(props) {
  const [value, setValue] = useState(props.proposalId);
  //   console.log("value is:", value);
  // can show results here
  return (
    <div>
      Vote is open:
      {/* {props.proposalId} */}
      {<SubmitVote />}
    </div>
  );
}

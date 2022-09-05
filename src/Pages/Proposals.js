import React from "react";
import ProposalTable from "../Components/ProposalTable";

function Proposals() {
  return (
    <div>
      <br></br>
      <br></br>
      <h2>Active DAO Projects</h2>
      <div>
        <ProposalTable />
      </div>
    </div>
  );
}
//     <MapChart setTooltipContent={setContent} />
// <ReactTooltip>{content}</ReactTooltip> */}
export default Proposals;

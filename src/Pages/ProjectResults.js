import * as React from "react";
import { PROJECT_GOV } from "../contracts-config";
import projectGovContract from "../Contracts/ProjectGovernor.json";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import MyBarChart from "../Components/MyBarChart";

export default function ProjectResults() {
  const location = useLocation();
  const id = location.pathname;
  const proposalId = id.substr(id.lastIndexOf("/") + 1);
  const { proposalQuestion } = location.state;
  const [votingResults, setVotingResults] = useState([]);

  const resultsHandler = async () => {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);

      const mygov = new ethers.Contract(
        PROJECT_GOV,
        projectGovContract.abi,
        provider
      );

      const proposalAsUint = ethers.BigNumber.from(proposalId);

      try {
        let votes = await mygov.proposalVotes(proposalAsUint);
        console.log("Voting results are ", votes);
        setVotingResults(votes);
        // mygov.methods.proposalVotes(proposalAsUint).call(function (err, res)
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("Ethereum object does not exist");
    }
  };

  useEffect(() => {
    resultsHandler();
  }, []);

  if (!votingResults) return <>Loading...</>;

  const results = [
    Number(votingResults[0]),
    Number(votingResults[1]),
    Number(votingResults[2]),
  ];
  const totalVotes =
    Number(votingResults[0]) +
    Number(votingResults[1]) +
    Number(votingResults[2]);
  return (
    <div>
      <br></br>
      <h1>Voting Results </h1>
      <br></br>
      <h3>
        <b>Proposal Question:</b> {proposalQuestion}
      </h3>
      {votingResults.length == 3 && (
        <div>
          <p>Total Votes: {totalVotes}</p>
          <MyBarChart votingResults={results} />
          <p>
            Against: {Number(votingResults[0])} <br></br> For:{" "}
            {Number(votingResults[1])} <br></br>Abstain:{" "}
            {Number(votingResults[2])}
          </p>
        </div>
      )}
    </div>
  );
}

// enter location long lat of where project needs to be set up  ?

// queue it .
import * as React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Button from "@mui/material/Button";
import { useState, useEffect } from "react";

import { utils } from "web3";
// DAO related Imports
import { GOV_CONTRACT } from "../contracts-config";
import { ethers } from "ethers";
import govContract from "../Contracts/MyGovernor.json";
import SimpleSnackbar from "../Components/SimpleSnackbar";
import { useParams, useLocation } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import "./Votes.css";
const governanceContractAddress = GOV_CONTRACT;
const governanceAbi = govContract.abi;

export default function Queue(props) {
  //   let { proposalId } = useParams(); // <-- access id match param here (functional copmonent only one var)
  //   const location = useLocation();
  //   const id = location.pathname;
  //   const proposalId = id.substr(id.lastIndexOf("/") + 1);
  //   const { proposalQuestion } = location.state;
  const proposalId = props.proposalId;
  const proposalQuestion = props.proposalQuestion;

  const [value, setValue] = useState(false);
  const [error, setError] = useState(false);
  const [helperText, setHelperText] = useState("Choose wisely");

  const [clicked, setClicked] = useState(false);
  const [rpcError, setRpcError] = useState(null);
  const [isQueued, setQueued] = useState(false);
  const [rejection, setRejection] = useState(false);

  const [values, setValues] = useState({
    proposalId: "",
    vote: "",
  });

  function resetSnackbarAlert() {
    setRejection(false);
    setRpcError(false);
  }

  const handleRadioChange = (prop) => (event) => {
    setValue(event.target.value);
    setValues({ ...values, [prop]: event.target.value });
    handleChange(prop);
    setHelperText(" ");
    setError(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Input was: ", values);
  };

  const handleChange = (prop) => (event) => {
    try {
      setValues({ ...values, [prop]: event.target.value });
    } catch (err) {
      console.log("Error modifying the properties.");
    }
  };

  const queueHandler = async () => {
    if (isQueued) return <div>proposal has been already queued.</div>;
    setClicked(true);
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();

      const governor = new ethers.Contract(
        governanceContractAddress,
        governanceAbi,
        signer
      );

      console.log("Initialize Payment for Vote Submission");
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      const functionToCall = "store"; // change this as required

      try {
        const proposalAsUint = ethers.BigNumber.from(proposalId);
        const functionToCall = "store";
        const args = [77];
        const encodedFunctionCall = this.box.interface.encodeFunctionData(
          functionToCall,
          args
        );
        const questionHash = ethers.utils.id(proposalQuestion);
        const queueTx = await governor.queue(
          [this.box.address],
          [0],
          [encodedFunctionCall],
          questionHash
          //   { gasLimit: 1 * 10 ** 6 }
          //   // { value: ethers.utils.parseUnits("0.03", "ether") }
        );
        const Receipt = await queueTx.wait(1);
        console.log("Queueing Receipt ", Receipt);

        setQueued(true);
      } catch (error) {
        if (error.code === 4001) {
          // EIP-1193 userRejectedRequest error
          console.log(error.reason);
          setRejection(true);
          setRpcError(error.message);
        }
        console.log(error);
      }
    } else {
      console.log("Ethereum object does not exist");
    }
  };

  if (!proposalQuestion) return <h2>Loading...</h2>;
  return (
    <div>
      <Button
        color={isQueued ? "grey" : "pink"}
        sx={{ mt: 1, mr: 1 }}
        onClick={queueHandler}
        type="queue proposal"
        variant="outlined"
      >
        Queue
      </Button>
      <div>
        {!isQueued && clicked && !rejection && (
          <div>
            <br></br>
            <CircularProgress />
          </div>
        )}
        {isQueued && (
          <div>
            {
              <SimpleSnackbar
                name="queueSuccess"
                resetSnackbarAlert={resetSnackbarAlert}
              />
            }
          </div>
        )}
      </div>
    </div>
  );
}

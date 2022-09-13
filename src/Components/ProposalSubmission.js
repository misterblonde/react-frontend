import React from "react";
import Box from "@mui/material/Box";
// import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import FilledInput from "@mui/material/FilledInput";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import { Link, Route, Routes } from "react-router-dom";
import Profile from "../Pages/Profile";
import Vote from "../Pages/Vote";

import TextField from "@mui/material/TextField";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Button from "@mui/material/Button";
import { useState, useEffect } from "react";
import { useInput } from "./input-hook";

import { GOV_CONTRACT, BOX_CONTRACT, BACKEND } from "../contracts-config";
import { ethers } from "ethers";
import govContract from "../Contracts/MyGovernor.json";
import boxContract from "../Contracts/Box.json";

import SendIcon from "@mui/icons-material/Send";
import Stack from "@mui/material/Stack";
import SimpleSnackbar from "./SimpleSnackbar";
import CircularProgress from "@mui/material/CircularProgress";
import "./styles.css";

const governanceContractAddress = GOV_CONTRACT;
const governanceAbi = govContract.abi;
const boxAbi = boxContract.abi;
const encodedFunctionCall =
  "5150850145748143607763488866957878176109844490819457971886442421734075647281";

let proposals = [];
var axios = require("axios");

export default function ProposalSubmission(props, { callback }) {
  const [proposalID, setProposalID] = useState(null);
  const [proposeHash, setProposeHash] = useState(null);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [rpcError, setRpcError] = useState(null);
  const [snackbarNotEnoughVotes, setSnackbarNotEnoughVotes] = useState(false);
  const [snackbarProposalExists, setSnackbarProposalExists] = useState(false);
  const [snackbarSuccess, setSnackbarSuccess] = useState(false);
  const [snackbarUnknownError, setSnackbarUnknownError] = useState(false);
  const [rejection, setRejection] = useState(false);
  const [proposalSubmitted, setProposalSubmitted] = useState(false);
  const {
    value: firstName,
    bind: bindFirstName,
    reset: resetFirstName,
  } = useInput("");

  const {
    value: lastName,
    bind: bindLastName,
    reset: resetLastName,
  } = useInput("");

  const [values, setValues] = useState({
    budgetAmount: "",
    firstName: "",
    lastName: "",
    proposalQuestion: "",
    proposalDescription: "",
    email: "",
  });

  const Emoji = (props) => (
    <span
      className="emoji"
      role="img"
      aria-label={props.label ? props.label : ""}
      aria-hidden={props.label ? "false" : "true"}
    >
      {props.symbol}
    </span>
  );

  const handleSubmit = (evt) => {
    setRpcError(null);
    setProposalID(null);
    evt.preventDefault();
    // /alert(`Submitting Name ${firstName} ${lastName}`);
    resetFirstName();
    resetLastName();
  };

  const proposeHandler = async () => {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();

      const proposeContract = new ethers.Contract(
        governanceContractAddress,
        governanceAbi,
        signer
      );

      console.log("Initialize Payment for Proposal Submission");
      const accounts = await ethereum
        .request({
          method: "eth_requestAccounts",
        })
        .catch((error) => {
          setRpcError(error.message);
          if (error.code === 4001) {
            // EIP-1193 userRejectedRequest error
            console.log("Permissions needed to continue.");
            //! add user rejected transacion error
          } else {
            console.error(error);
          }
        });

      const functionToCall = "store"; // change this as required
      const args = [7];
      //   const box = await ethers.getContract(BOX_CONTRACT);
      const box = new ethers.Contract(BOX_CONTRACT, boxAbi, signer);

      const encodedFunctionCall = box.interface.encodeFunctionData(
        functionToCall,
        args
      );

      console.log(`Proposing ${functionToCall} on ${box.address} with ${args}`);
      console.log(`Proposal Description:\n  ${values.proposalQuestion}`);

      let myQuestionIs = values.proposalQuestion;
      let myform = [
        { proposalQuestion: values.proposalQuestion },
        { proposalDescription: values.proposalDescription },
        { budget: values.budgetAmount },
        { firstName: values.firstName },
        { lastName: values.lastName },
        { email: values.email },
      ];
      // GPS LOCATION
      //   {
      //     gps: location;
      //   }
      //   ]      let proposalDescription = values.proposalQuestion;
      //   let mybudgetplease = values.budgetAmount;

      // GPS location
      //   });
      let proposeTxn;
      try {
        proposeTxn = await proposeContract.submitProposal(
          [BOX_CONTRACT],
          [0],
          [encodedFunctionCall],
          values.proposalQuestion,
          values.budgetAmount.toString()
        );

        console.log("Submitting proposal... please wait");
        const proposeReceipt = await proposeTxn.wait(1);
        setProposeHash(proposeTxn.hash);
        console.log("Proposal transaction: ", proposeTxn);

        console.log("Propose receipt instantiated.");
        const proposalId = proposeReceipt.events[0].args.proposalId;
        console.log("PROPOSAL ID (HEX): ", proposalId); // returns hex num of
        console.log("PROPOSAL ID (DEC): ", proposalId.toString()); //proposalID
        setProposalID(proposalId.toString());
        setSnackbarSuccess(true);
        setProposalSubmitted(true);
        //   fetch("/users")
        //     .then((res) => res.json())
        //     .then((users) => this.setState({ users }));

        // let jsonEntry = {
        //   txHash: proposeTxn.hash,
        //   proposalId: proposalId.toString(),
        //   proposalQuestion: values.proposalQuestion,
        //   budget: values.budgetAmount,
        // };
        //     state = { users: [] };

        //   fetch("/users")
        //     .then((res) => res.json())
        //     .then((users) => this.setState({ users }));

        let jsonEntry = {
          txHash: proposeTxn.hash.toString(),
          proposalId: proposalId.toString(),
          proposalQuestion: values.proposalQuestion,
          proposalDescription: values.proposalDescription,
          budget: values.budgetAmount,
          firstName: values.firstName,
          lastName: values.lastName,
          //   email: values.email.toString(),
        };
        // add GPS data

        // try {
        //   let result = await axios.post(
        //     // any call like get
        //     "http://localhost:3001/user", // your URL
        //     {
        //       // data if post, put
        //       some: "data",
        //     }
        //   );
        //   console.log(result.response.data);
        // } catch (error) {
        //   console.error(error.response.data); // NOTE - use "error.response.data` (not "error")
        // }
        try {
          axios
            .post(`${BACKEND}/users`, jsonEntry)
            .then(() => console.log("New Entry Created"))
            .catch((err) => {
              console.error(err);
              console.error(err.reason);
              console.error(err.message);
              console.error(err.response.data);
            });
        } catch (error) {
          console.log("backend post error");
          console.error(error.response.data);
        }
        console.log(
          `Proposal submitted, see transaction: https://rinkeby.etherscan.io/tx/${proposeTxn.hash}`
        );
        props.callback();
      } catch (error) {
        setRpcError(error.message);
        console.log(error.reason);
        props.callback();
        if (
          error.reason ==
          "execution reverted: Governor: proposer votes below proposal threshold"
        ) {
          console.log("Not enough tokens to propose.");
          setSnackbarNotEnoughVotes(true);
        } else if (
          error.reason ==
          "execution reverted: Governor: proposal already exists"
        ) {
          setSnackbarProposalExists(true);
        } else if (error.code === 4001) {
          // EIP-1193 userRejectedRequest error
          setRejection(true);

          console.log("Permissions needed to continue.");
        } else {
          setSnackbarUnknownError(true);
          console.error(error);
        }
      }
    }
  };

  const isEmpty = (data) => {
    if (data.length == 0) {
      return true;
    }
    return false;
  };

  const isFormValid = () => {
    return (
      //   values.firstName &&
      //   values.lastName &&
      //   values.email &&
      values.budgetAmount && values.proposalQuestion
    );
  };

  const printMessage = () => {
    console.log("state has been written to mem.");
    proposeHandler();
    setButtonClicked(true);
  };

  const handleChange = (prop) => (event) => {
    try {
      setValues({ ...values, [prop]: event.target.value });
    } catch (err) {
      console.log("Error modifying the properties.");
    }
  };

  function resetSnackbarAlert() {
    setRejection(false);
    setRpcError(false);
    setProposalSubmitted(false);
  }

  useEffect(() => {
    console.log(values);
  }, [values, rpcError, proposalID]);

  return (
    <div align="center" className="top-element-formatting">
      <br></br>
      <h2>Proposal Submission Form</h2>
      <br></br>
      <form onSubmit={handleSubmit}>
        <Box
          sx={{
            justifyContent: "space-around",
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          <div>
            <TextField
              //   error={values.proposalQuestion.length == 0}
              label="Infrastructure Proposal"
              id="outlined-start-adornment"
              defaultValue="Please summarise your infrastructure proposal as a yes-no question."
              sx={{ m: 1, width: "75ch" }}
              value={values.proposalQuestion}
              //   helperText={"This field is compulsory and cannot be left empty."}
              onChange={handleChange("proposalQuestion")}
              //   inputRef={register({
              //     required: "This is field required",
              //     validate: (values.proposalQuestion) => isEmpty(values.proposalQuestion),
              //   })}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start"></InputAdornment>
                ),
              }}
            />
            <br></br>
            <TextField
              id="outlined-multiline-static"
              label="Infrastructure Project Proposal Description"
              multiline
              rows={4}
              sx={{ m: 1, width: "75ch" }}
              value={values.proposalDescription}
              onChange={handleChange("proposalDescription")}
              // defaultValue="Provide a detailed project description here"
            />
            <br></br>
            <FormControl sx={{ m: 1, width: "75ch" }} variant="outlined">
              <OutlinedInput
                id="outlined-start-adornment"
                value={values.budgetAmount}
                onChange={handleChange("budgetAmount")}
                endAdornment={
                  <InputAdornment position="end">GWei</InputAdornment>
                }
                aria-describedby="outlined-weight-helper-text"
                inputProps={{
                  "aria-label": "weight",
                }}
              />
              <div>
                <a
                  style={{ display: "table-cell" }}
                  href="https://eth-converter.com"
                  target="_blank"
                >
                  Click here for an Ether to Wei converter
                </a>
              </div>
              <FormHelperText
                sx={{ m: 1, width: "75ch" }}
                id="outlined-weight-helper-text"
                defaultValue="Estimated Budget Required"
                helperText={
                  "This field is compulsory and cannot be left empty."
                }
              >
                {" "}
                Estimated Budget Required
              </FormHelperText>
            </FormControl>
            <br></br>
            <TextField
              label="Name"
              id="outlined-start-adornment"
              //   defaultValue="Alice"
              sx={{ m: 1, width: "21ch" }}
              value={values.firstName}
              onChange={handleChange("firstName")}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start"></InputAdornment>
                ),
              }}
            />
            <TextField
              label="Surname"
              id="outlined-start-adornment"
              //   defaultValue="Do"
              sx={{ m: 1, width: "21ch" }}
              value={values.lastName}
              onChange={handleChange("lastName")}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start"></InputAdornment>
                ),
              }}
            />
            <TextField
              label="E-mail"
              id="outlined-start-adornment"
              //   defaultValue="Do"
              sx={{ m: 1, width: "30ch" }}
              value={values.email}
              onChange={handleChange("email")}
              InputProps={{
                startAdornment: (
                  <InputLabel htmlFor="my-input">
                    <InputAdornment position="start"></InputAdornment>
                  </InputLabel>
                ),
              }}
            />
            <br></br>
            {/* <Stack direction="row" spacing={2}>
      <Button variant="outlined" startIcon={<DeleteIcon />}>
        Delete
      </Button>
      <Button variant="contained" endIcon={<SendIcon />}>
        Send
      </Button>
    </Stack> */}
            <Button
              sx={{ mt: 1, mr: 1 }}
              type="submit"
              onClick={printMessage}
              //   disabled={!isFormValid}
              error={!isFormValid}
              variant="contained"
              endIcon={<SendIcon />}
            >
              {" "}
              Submit
            </Button>
          </div>
        </Box>
      </form>
      <div>
        {!proposalID && buttonClicked && !rpcError && (
          <div>
            <br></br>
            {/* <b>Please approve the transaction.</b> */}
            <br></br>
            <CircularProgress />
          </div>
        )}
        {!proposalID && buttonClicked && rpcError && (
          <div>
            <SimpleSnackbar name="rpcError" errorType={rpcError} />
            {/* <SimpleSnackbar
              name="rpcError"
              resetSnackbarAlert={resetSnackbarAlert}
            /> */}
            {/* <br></br>
            <h2>Something went wrong!</h2>
            <p>
              <br></br>
              <span role="img" aria-label="warning"></span>❌ Error sending
              transaction:<br></br>
              {rpcError}
            </p> */}
          </div>
        )}
        {/* check to distinguish between not enough votes and proposal already exists? */}
        {!proposalID && buttonClicked && rpcError && rejection ? (
          <SimpleSnackbar name="userDeniedTx" />
        ) : null}
        {!proposalID && buttonClicked && rpcError && snackbarNotEnoughVotes ? (
          <SimpleSnackbar name="notEnoughVotes" />
        ) : null}
        {!proposalID && buttonClicked && rpcError && snackbarProposalExists ? (
          <SimpleSnackbar name="proposalExists" />
        ) : null}
        <h2>Thank you for your proposal submission!</h2>
        <p>
          ✅ Thank you for your proposal submission Your proposal ID is{" "}
          <b>{proposalID}</b>. You can check your transaction details under:{" "}
        </p>
        <a
          style={{ display: "table-cell" }}
          href={`https://rinkeby.etherscan.io/tx/${proposeHash}`}
          target="_blank"
        >
          https://rinkeby.etherscan.io/tx/{proposeHash}
        </a>
        <Routes>
          <Route path={`/Vote`} component={<Vote />} />
          <Route path={`/Profile`} component={<Profile />} />
        </Routes>
      </div>
      ;
    </div>
  );
}

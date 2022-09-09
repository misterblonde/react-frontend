import * as React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import Button from "@mui/material/Button";
import { useState, useEffect } from "react";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { utils } from "web3";
// DAO related Imports
import { GOV_CONTRACT } from "../contracts-config";
import { ethers } from "ethers";
import govContract from "../Contracts/MyGovernor.json";
import SimpleSnackbar from "../Components/SimpleSnackbar";
import { useParams, useLocation } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import "./Votes.css";
import { Link } from "react-router-dom";

const governanceContractAddress = GOV_CONTRACT;
const governanceAbi = govContract.abi;

function voteToInt(voteAsString) {
  if (voteAsString === "yes") {
    return 1;
  } else if (voteAsString === "no") {
    return 0;
  } else {
    return 2;
  }
}

export default function SubmitVote() {
  //   let { proposalId } = useParams(); // <-- access id match param here
  const location = useLocation();
  const id = location.pathname;
  const proposalId = id.substr(id.lastIndexOf("/") + 1);
  const { proposalQuestion } = location.state;
  //   const proposalId = this.props.match.params;
  //   const proposalQuestion = this.props.location.state.proposalQuestion;
  console.log(proposalId);
  console.log(proposalQuestion);
  // proposalQuestion
  //   const proposalQuestion = "";
  const [value, setValue] = useState(false);
  const [currentVote, setCurrentVote] = useState(null);
  const [error, setError] = useState(false);
  const [helperText, setHelperText] = useState("Choose wisely");
  const [voteSubmitted, setVoteSubmitted] = useState(false);
  const [votingError, setVotingError] = useState(false);
  const [voteHash, setVoteHash] = useState(null);
  const [clicked, setClicked] = useState(false);
  const [rpcError, setRpcError] = useState(null);
  const [inactiveTrue, setInactiveTrue] = useState(false);
  const [rejection, setRejection] = useState(false);
  //const [voted, setVoted] = useState(null);
  const [values, setValues] = useState({
    proposalId: "",
    vote: "",
  });

  function resetSnackbarAlert() {
    setRejection(false);
    setRpcError(false);
    setVotingError(false);
    setVoteSubmitted(false);
    setInactiveTrue(false);
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
    // setValues({ ...values, ["vote"]: currentVote });
    console.log("Input was: ", values);
  };

  const handleChange = (prop) => (event) => {
    try {
      setValues({ ...values, [prop]: event.target.value });
    } catch (err) {
      console.log("Error modifying the properties.");
    }
  };

  const voteHandler = async () => {
    setClicked(true);
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();

      const voteContract = new ethers.Contract(
        governanceContractAddress,
        governanceAbi,
        signer
      );

      console.log("Initialize Payment for Vote Submission");
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      const functionToCall = "store"; // change this as required
      //   const args = [7];
      const proposalAsUint = ethers.BigNumber.from(proposalId);
      //   const proposalAsUint = utils.toBN(proposalId);
      console.log("Proposal as Uint ", proposalAsUint);

      try {
        // let blockNum = await proposalSnapshot(proposalAsUint);
        // let nVotes = await voteContract.getVotes(currentAccount, blockNum);
        // let fee = 10000000000000000; //0.01 ether
        // let quadcost = nVotes ** 2 * fee;
        // let cost = ethers.utils.parseEther(quadcost); // equation from smart contract
        let voteTxn = await voteContract.castVote(
          proposalAsUint,
          voteToInt(values.vote)
        );

        console.log("Submitting vote... please wait");
        const voteReceipt = await voteTxn.wait(1);
        console.log("Voting Receipt ", voteReceipt);

        setVoteHash(voteTxn.hash.toString());
        setVoteSubmitted(true);
        console.log(
          `Vote submitted, see transaction: https://rinkeby.etherscan.io/tx/${voteTxn.hash}`
        );
      } catch (error) {
        if (error.code === 4001) {
          // EIP-1193 userRejectedRequest error
          console.log(error.reason);
          setRejection(true);
          setRpcError(error.message);
        } else if (
          error.reason ==
          "execution reverted: Governor: vote not currently active"
        ) {
          setInactiveTrue(true);
        } else if (
          error.reason ==
          "execution reverted: GovernorVotingSimple: vote already cast"
        ) {
          setVotingError(true);
        } else {
          console.log(error);
          setRpcError(error.message);
        }
      }
    } else {
      console.log("Ethereum object does not exist");
    }
  };

  if (!proposalQuestion) return <h2>Loading...</h2>;
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <FormControl sx={{ m: 3 }} error={error} variant="standard">
          <h1>Proposal: {proposalQuestion}</h1>
          <FormHelperText>{helperText}</FormHelperText>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue="abstain"
            name="radio-buttons-group"
            // aria-labelledby="demo-error-radios"
            // name="quiz"
            // value={value}
            // className="boldTxt"
            onChange={handleRadioChange("vote")}
          >
            <FormControlLabel
              value="yes"
              control={<Radio />}
              label="Yes"
              checked={values.vote === "yes"}
            />
            <FormControlLabel
              value="no"
              control={<Radio />}
              label="No"
              checked={values.vote === "no"}
            />
            <FormControlLabel
              value="abstain"
              control={<Radio />}
              label="Abstain"
              checked={values.vote === "abstain"}
            />
          </RadioGroup>
          {/* <TextField
            label="Proposal ID"
            id="outlined-start-adornment"
            //   defaultValue="Do"
            sx={{ m: 1, width: "30ch" }}
            value={values.proposalID}
            onChange={handleChange("proposalId")}
            InputProps={{
              startAdornment: (
                <InputLabel htmlFor="my-input">
                  <InputAdornment position="start"></InputAdornment>
                </InputLabel>
              ),
            }}
          /> */}
          <div>
            Selected option is : <b>{values.vote}</b>
          </div>
          <Button
            // /color={clicked ? "blue" : "red"}
            sx={{ mt: 1, mr: 1 }}
            onClick={voteHandler}
            type="submit vote now"
            variant="outlined"
          >
            Submit Vote
          </Button>
          <Link to={`../Vote`} style={{ textDecoration: "none" }}>
            <Button
              sx={{ mt: 1, mr: 1 }}
              type="goBack"
              variant="outlined"
              className="hiddenlinkbutton"
            >
              Back
            </Button>
          </Link>
        </FormControl>
      </form>
      <div>
        {!voteSubmitted &&
          clicked &&
          !votingError &&
          !inactiveTrue &&
          !rejection && (
            <div>
              <br></br>
              <CircularProgress />
            </div>
          )}
        {voteSubmitted && (
          <div>
            {
              <SimpleSnackbar
                name="voteCastSuccess"
                resetSnackbarAlert={resetSnackbarAlert}
              />
            }
          </div>
        )}
      </div>
      <div>
        {inactiveTrue && (
          <div>
            {
              <SimpleSnackbar
                name="voteCastFailureNotActive"
                resetSnackbarAlert={resetSnackbarAlert}
              />
            }
          </div>
        )}
        {votingError && (
          <div>
            {
              <SimpleSnackbar
                name="voteCastFailure"
                resetSnackbarAlert={resetSnackbarAlert}
              />
            }
            <div></div>
          </div>
        )}
      </div>
    </div>
  );
}

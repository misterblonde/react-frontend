import * as React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
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
import Slider from "@mui/material/Slider";
import "./Votes.css";
import web3 from "../web3";
import { bottomNavigationClasses } from "@mui/material";

import { Link } from "react-router-dom";
import Button from "@mui/material/Button";

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

export default function SubmitVoteQuadratic() {
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
  const [maxUserVotes, setMaxUserVotes] = useState(null);
  const [votesSelected, setVotesSelected] = useState(null);
  //const [voted, setVoted] = useState(null);
  const [values, setValues] = useState({
    proposalId: "",
    vote: "",
    nVotes: null,
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
      //   const nVotesAsUint = ethers.BigNumber.from(values.nVotes);
      //   const proposalAsUint = utils.toBN(proposalId);
      console.log("Proposal as Uint ", proposalAsUint);
      //   console.log("Nvotes:  ", nVotesAsUint);
      console.log("value votes selected: ", votesSelected);
      try {
        const proposalAsUint = ethers.BigNumber.from(proposalId);
        let blockNum = await voteContract.proposalSnapshot(proposalAsUint);
        let nVotes = await voteContract.getVotes(accounts[0], blockNum);

        setMaxUserVotes(nVotes);
        const myVotesAsUint = parseInt(votesSelected);
        // ethers.BigNumber.from(votesSelected);
        console.log("Votes selected is: ", myVotesAsUint);
        // require(myVotesAsUint <= nVotes, "You cannot use nfts you dont have.");
        let fee = 10000000000000000; //0.01 ether
        let quadCost = myVotesAsUint ** 2 * fee + 4;
        // let cost = ethers.utils.formatEther(quadCost.toString()); // equation from smart contract
        // // let mycost = ethers.utils.parseEther(cost);
        // let mycost = ethers.utils.parseUnits(cost.toString(), "ether");

        let cost = ethers.utils.formatEther(quadCost.toString()); // equation from smart contract
        let mycost = ethers.utils.parseEther(cost);

        console.log("Cost would be: ", cost);
        let voteTxn = await voteContract.castVoteQuadratic(
          proposalAsUint,
          voteToInt(values.vote),
          votesSelected,
          { value: mycost }

          // ethers.utils.parseEther(cost) }
          //   {
          //     value: mycost.toNumber(),
          //   }
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

  const changeValue = (event, value) => {
    setVotesSelected(value);
  };

  const getText = (value) => {
    setVotesSelected(`${value}`);
  };

  const getMaxBal = async () => {
    const { ethereum } = window;
    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const voteContract = new ethers.Contract(
      governanceContractAddress,
      governanceAbi,
      signer
    );
    let blockNum = await web3.eth.getBlockNumber();
    console.log("The blocknumber is: ", blockNum);
    // let blockNum = await voteContract.proposalSnapshot(proposalAsUint);
    let nVotes = await voteContract.getVotes(accounts[0], blockNum - 2);
    setMaxUserVotes(nVotes);
  };

  useEffect(() => {
    getMaxBal();
  }, []);

  if (!proposalQuestion) return <h2>Loading...</h2>;
  if (!maxUserVotes) return <h2>Loading...</h2>;
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
            label="Number of Votes to Use: "
            id="outlined-start-adornment"
            //   defaultValue="Do"
            sx={{ m: 1, width: "30ch" }}
            value={values.nVotes}
            onChange={handleChange("nVotes")}
            InputProps={{
              startAdornment: (
                <InputLabel htmlFor="my-input">
                  <InputAdornment position="start"></InputAdornment>
                </InputLabel>
              ),
            }}
          /> */}
          <Slider
            aria-label="Number of Votes to Use: "
            defaultValue={1}
            getAriaValueText={getText}
            valueLabelDisplay="auto"
            // value="nVotes"
            // onChange={handleChange("nVotes")}
            // value={values.nVotes}
            // value={value}
            // onChange={changeValue}
            step={1}
            marks
            min={1}
            max={maxUserVotes.toNumber()}
          />
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
            <div>
              <h2>⚠️ Something Went Wrong!</h2>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

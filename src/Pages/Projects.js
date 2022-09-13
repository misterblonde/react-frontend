import React from "react";
import { Route, Routes } from "react-router";
import Vote from "./Vote";
import Profile from "./Profile";
import "./proposals.css";

import { useState, setState, useEffect } from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
// import LocationOn from "@mui/material/LocationOn";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Switch from "@mui/material/Switch";
import Chip from "@mui/material/Chip";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import LocationOn from "@mui/icons-material/LocationOn";
import ProjectProposalSubmission from "../Components/ProjectProposalSubmission.js";
import defaultTap from "../img/tap.png";
import { PROJECT_GOV, PROJECT_TOKEN } from "../contracts-config";

import MyProjGovernor from "../Contracts/ProjectGovernor.json";
import projectToken from "../Contracts/ProjectNftToken.json";
import { makeStyles } from "@mui/styles";
import { createTheme, Theme, ThemeProvider } from "@mui/material/styles";
import { ethers } from "ethers";
import web3 from "../web3";
import SimpleSnackbar from "../Components/SimpleSnackbar";
import { Snackbar } from "@mui/material";
const INFURA_API_KEY = "59688ffd8ec54a9288501b276812812c";

export default function Projects() {
  const [isActive, setActive] = useState(false);
  const [isChecked, setChecked] = useState(false);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [isDelegate, setDelegate] = useState(false);
  const [isProposed, setProposal] = useState(false);
  const [snackbarNotification, setSnackbarNotification] = useState(false);
  const [hasDelegated, setIsDelHolder] = useState(null);
  const navigate = useNavigate();

  const navigateToProj = () => {
    // 👇️ navigate to /contacts
    navigate("/ProjectProposalSubmission");
  };

  const connectWalletHandler = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      alert("Please install Metamask!");
    }

    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Found an account! Address: ", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = () => {
    if (!isChecked) {
      setActive(true);
      setChecked(true);
    } else {
      setActive(false);
      setChecked(false);
    }
  };

  const checkWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have Metamask installed!");
      return;
    } else {
      console.log("Wallet exists! We're ready to go!");
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account: ", account);
      setCurrentAccount(account);
    } else {
      console.log("No authorized account found");
    }
  };

  const hasDelegatedVotes = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        // setSigner(signer);

        const projNftContract = new ethers.Contract(
          PROJECT_TOKEN,
          projectToken.abi,
          signer
        );

        const projGovContract = new ethers.Contract(
          PROJECT_GOV,
          MyProjGovernor.abi,
          signer
        );
        // append to list of projects?

        console.log("Initialize payment");
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        // const Web3 = require("Web3");
        // var web3 = new Web3(`https://rinkeby.infura.io/v3/${INFURA_API_KEY}`);
        let blockNum = await web3.eth.getBlockNumber();
        let lastblock = blockNum - 1;
        let nVotes = await projGovContract.getVotes(accounts[0], lastblock);
        //projNftContract.delegates(currentAccount);
        if (nVotes) {
          setActive(true);
          setChecked(true);
          setDelegate(true);
          setSnackbarNotification(true);
          console.log("Account has delegated Votes.");
        } else {
          console.log("No votes have been delegated.");
        }
      } else {
        console.log("Ethereum object does not exist");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const isPersonDelegate = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });

        const nftContract = new ethers.Contract(
          PROJECT_TOKEN,
          projectToken.abi,
          signer
        );

        const returnAddr = await nftContract.delegates(accounts[0]);
        console.log("is delegate?", returnAddr);
        if (returnAddr !== "0x0000000000000000000000000000000000000000") {
          console.log("Account has delegated Votes.");
          console.log(returnAddr);
          setIsDelHolder(true);
        } else {
          console.log("No votes have been delegated.");
          setIsDelHolder(false);
        }
      } else {
        console.log("Ethereum object does not exist");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const isDelegateHandler = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        // setSigner(signer);

        const projNftContract = new ethers.Contract(
          PROJECT_TOKEN,
          projectToken.abi,
          signer
        );
        // append to list of projects?

        console.log("Initialize payment");
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });

        const returnAddr = await projNftContract.delegate(currentAccount);
        if (returnAddr != null) {
          console.log("Account has delegated Votes.");
          setChecked(true);
        } else {
          console.log("No votes have been delegated.");
        }
      } else {
        console.log("Ethereum object does not exist");
      }
    } catch (err) {
      console.log(err);
    }
  };

  //   const isMember = () => {
  //     if (isActive) {
  //       return <Chip label="Active" color="success" />;
  //     }
  //     return <Chip color="Inactive" color="primary" />;
  //   };
  useEffect(() => {
    const fetchData = async () => {
      await checkWalletIsConnected();
      await isPersonDelegate();
      //   hasDelegatedVotes();
    };

    fetchData();
  }, []);

  return (
    <div className="coolTxt">
      <br></br>
      <h2>All Infrastructure Project DAOs </h2>

      {/* <h4>
        we call them{" "}
        <b>
          <q>miniDAOs</q>
        </b>
      </h4> */}
      <p>
        Any child DAO has been created from a successful infrastructure DAO
        proposal.
      </p>

      <Card>
        <Box sx={{ p: 4, display: "flex" }}>
          {/* <Avatar variant="rounded" src="../img/waterTap.jpg" /> */}
          <img src={defaultTap} alt="placeholder" key="tapNft" width="106" />
          <Stack spacing={0.5}>
            <Typography align="left" fontWeight={700}>
              Project No. 1
            </Typography>
            <Typography fontWeight={500}>
              Water network for rural Japineh
            </Typography>
            <Typography align="left" variant="body2" color="text.secondary">
              <LocationOn sx={{ color: "#002884" }} /> Japineh, The Gambia
            </Typography>
            <Typography align="left" variant="body2" color="text.secondary">
              {!hasDelegated && (
                <Button
                  visible="false"
                  onClick={isDelegateHandler}
                  variant="outlined"
                >
                  Delegate Vote
                </Button>
              )}
              {snackbarNotification && isDelegate ? (
                <SimpleSnackbar name="activateVotes" />
              ) : null}
              <Button
                visible="false"
                onClick={navigateToProj}
                variant="outlined"
              >
                Submit Proposal
              </Button>
            </Typography>
          </Stack>
        </Box>
        <Divider />
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ px: 2, py: 1, bgcolor: "background.default" }}
        >
          <Chip
            label={hasDelegated ? "Delegated" : "No Delegate"}
            color={hasDelegated ? "success" : "primary"}
          />
          {/* <Switch
            checked={isChecked}
            onChange={handleChange}
            inputProps={{ "aria-label": "controlled" }}
          /> */}
        </Stack>
      </Card>
      {/* grey[500] */}
      {/* <PieChart /> */}
      {/* <InteractiveMap /> */}
      {/* <Routes>
        <Route path={`/Vote`} component={<Vote />} />
        <Route path={`/Profile`} component={<Profile />} />
      </Routes> */}
      <Routes>
        <Route
          path={`/ProjectProposalSubmission`}
          component={<ProjectProposalSubmission />}
        />
      </Routes>
    </div>
  );
}

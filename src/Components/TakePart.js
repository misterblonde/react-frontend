import React, { Component } from "react";
import { ethers } from "ethers";
import { useState, useEffect } from "react";
import { TOKEN_CONTRACT } from "../contracts-config";
import contract from "../Contracts/MyNftToken.json";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import SimpleSnackbar from "./SimpleSnackbar";

const tokenAbi = contract.abi;

export default function TakePart({ callback }) {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [snackbar, setSnackbarAlert] = useState(false);
  const [rejection, setRejection] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [VPdelegated, setVPdelegated] = useState(false);

  async function checkWalletIsConnected() {
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
  }

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

  const delegateHandler = async () => {
    try {
      const { ethereum } = window;
      setIsDisabled(true);
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        const tokenContract = new ethers.Contract(
          TOKEN_CONTRACT,
          tokenAbi,
          signer
        );

        console.log("Initialize payment");
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        console.log("Submitting delegating transaction.");
        let delegateTxn = await tokenContract.delegate(accounts[0]);

        //1, {
        //  value: ethers.utils.parseEther("0.01"),
        //});

        console.log("Delegating votes... please wait");
        await delegateTxn.wait();

        console.log(
          `Delegated NFT votes see transaction: https://rinkeby.etherscan.io/tx/${delegateTxn.hash}`
        );
        setVPdelegated(true);
        setSnackbarAlert(true);
        setIsDisabled(false);
        callback();
      } else {
        console.log("Ethereum object does not exist");
      }
    } catch (err) {
      if (err.code === 4001) {
        //user rejected the transaction
        setRejection(true);
        setSnackbarAlert(true);
        setIsDisabled(false);
      }
      console.log(err);
    }
  };

  const connectWalletButton = () => {
    return (
      <button
        onClick={connectWalletHandler}
        type="button"
        className="btn btn-dark"
        style={{ width: 600, height: 100, fontSize: "22px" }}
        // className="cta-button connect-wallet-button"
      >
        Connect Wallet
      </button>
    );
  };

  const delegateButton = () => {
    return (
      <FormControl>
        <Button
          sx={{ mt: 1, mr: 1 }}
          disabled={isDisabled}
          onClick={delegateHandler}
          type="delegate votes"
          variant="outlined"
          style={{ width: 600, height: 100, fontSize: "22px" }}
        >
          Activate Vote
        </Button>
      </FormControl>
    );
  };

  useEffect(() => {
    checkWalletIsConnected();
    return () => {
      // cancel the subscription
      setSnackbarAlert(false);
      setRejection(false);
    };
  }, []);

  useEffect(() => {
    // reset for new snackbar;
  }, [rejection]);

  return (
    <div className="main-app">
      <div>{currentAccount ? delegateButton() : null}</div>
      {snackbar && rejection ? <SimpleSnackbar name="userDeniedTx" /> : null}
      {snackbar && VPdelegated ? <SimpleSnackbar name="delegated" /> : null}
    </div>
  );
}

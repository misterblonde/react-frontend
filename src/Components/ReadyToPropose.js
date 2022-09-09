import React from "react";
import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import "./styles.css";
// Subpages
import ProposalSubmission from "./ProposalSubmission";

export default function Delegated() {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [proposalAppears, setProposalAppears] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

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

  const proposeHandler = async () => {
    try {
      setIsDisabled(true);
      setProposalAppears(true);
    } catch (err) {
      console.log(err);
    }
  };

  const resetProposeHandler = async () => {
    try {
      setIsDisabled(false);
      setProposalAppears(false);
    } catch (err) {
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
      >
        Connect Wallet
      </button>
    );
  };

  const proposeButton = () => {
    return (
      <FormControl>
        <Button
          sx={{ mt: 1, mr: 1 }}
          disabled={isDisabled}
          onClick={proposeHandler}
          type="propose"
          variant="outlined"
          style={{ width: 600, height: 100, fontSize: "22px" }}
        >
          Submit Proposal
        </Button>
      </FormControl>
    );
  };

  useEffect(() => {
    checkWalletIsConnected();
  }, []);

  return (
    <div>
      <div className="action_btn">
        {currentAccount ? proposeButton() : null}
        {proposalAppears ? (
          <div className="centerMyForm">
            <ProposalSubmission
              submittingParty={currentAccount}
              callback={resetProposeHandler}
            />
          </div>
        ) : null}
      </div>
      <br></br>
    </div>
  );
}

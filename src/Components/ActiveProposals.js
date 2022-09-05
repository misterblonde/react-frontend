import React from "react";
import { EtherscanProvider } from "@ethersproject/providers";
import { ethers } from "ethers";
import { useState } from "react";
import { GOV_CONTRACT } from "../contracts-config";
const governanceContractAddress = GOV_CONTRACT;
const governanceAbi = governanceContractAddress.abi;

export default function ActiveProposals() {
  const [currentAccount, setCurrentAccount] = useState(null);
  // proposal log returns proposal ID . ID needs to be stored on website. So people can cast Votes on this proposal
  // equally store proposal description input on website
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

  const activeProposalsHandler = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        const govContract = new ethers.Contract(
          governanceContractAddress,
          governanceAbi,
          signer
        );

        let delegateTxn = await govContract.propose(currentAccount);

        console.log("Submitting proposal... please wait");
        await delegateTxn.wait();

        console.log(
          `Proposal submitted, see transaction: https://rinkeby.etherscan.io/tx/${delegateTxn.hash}`
        );
      } else {
        console.log("Ethereum object does not exist");
      }
    } catch (err) {
      console.log(err);
    }
  };
  return <div>ActiveProposals</div>;
}

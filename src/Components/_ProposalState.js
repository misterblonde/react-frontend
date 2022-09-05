// import React from "react";
// import { GOV_CONTRACT } from "../contracts-config";
// import { ethers } from "ethers";
// import govContract from "../Contracts/MyGovernor.json";

// import { useEffect } from "react";
// import { utils } from "web3";

/*

Implement the following categories: 

Proposal State() returns (uint)

0 Pending
__________
1 Active
__________
2 Canceled
3 Defeated
4 Succeeded
__________
5 Queued
6 Expired (???)
7 Executed
*/

import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import govContract from "../Contracts/MyGovernor.json";

// import govContract from "../Contracts/MyGovernor.json";
import TablePagination from "@mui/material/TablePagination";
import _uniqueId from "lodash/uniqueId";

import { ENDPOINT, TOKEN_CONTRACT, GOV_CONTRACT } from "../contracts-config";
import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
// import newId from "./newid";
import SubmitVoteID from "./SubmitVoteID";
import web3 from "../web3";
import { LensTwoTone } from "@mui/icons-material";
const timer = (ms) => new Promise((res) => setTimeout(res, ms));

let lastId = 0;

const States = {
  Pending: 0,
  Active: 1,
  Canceled: 2,
  Defeated: 3,
  Succeeded: 4,
  Queued: 5,
  Expired: 6,
  Executed: 7,
};

// ______________________ Govenor FUNCTIONALITY __________________
// Get proposal outcome by:
// const votingResults = await this.governor.proposalVotes(
//     this.proposalId.toString()
//   );

//get proposal state:
//   console.log(
//     "State (before blocks moved):",
//     await this.governor.state(proposalIdInput)
//   );

// governor get balance, voting period,
// castVotes, propose, queue, execute

// admin person: deploy new contract

// local governor functionality,
// freeze everything

// show auto-deployment of new contract: new box address appears with image

// ______________________ TOKEN FUNCTIONALITY __________________
// token functionality
// delegate votes
// get num votes
// mint

// get num votes
// console.log(
//     "Votes Delegated to Gov: ",
//     await this.token.getVotes(this.signers.admin.address) //, blockNum)
//   );
// await this.token.balanceOf(this.signers.admin.address)

// local tokens functionality
// admin person set whitelist,
// mint white list mint normal
var api = require("etherscan-api").init(
  // "QPTMSBIJA17A9XT2C9KH67YAGHRMWFEZFC",
  "QPTMSBIJA17A9XT2C9KH67YAGHRMWFEZFC",
  "rinkeby",
  "3000"
);

function newid(prefix = "id") {
  lastId++;
  return `${prefix}${lastId}`;
}

function createData(idx, propId, propState) {
  return { idx, propId, propState };
}

const columns = [
  {
    id: "idx",
    label: "idx",
    minWidth: 100,
    align: "left",
    format: (value) => value,
  },
  {
    id: "propId",
    label: "Proposal ID",
    minWidth: 100,
    align: "left",
    format: (value) => value,
  },
];

export default function ProposalState() {
  const [isTransactionData, setTransactionData] = useState([]);
  const [txDataPerUser, setTxDataPerUser] = useState([]);
  const [myHashList, setHashList] = useState([]);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentBlockNum, setTxBlockNum] = useState(null);
  //   const [theMagicalProposalId, setMagicalProposalId] = useState(null);
  const [id2] = useState(_uniqueId("prefix-"));
  //   let initialArray = [11229600];
  const [isBlockNum, setBlockNum] = useState([]);
  const [myCounter, setMyCounter] = useState(0);
  const [isPropIds, setPropIds] = useState([]);
  const [latestPropId, setLatestPropId] = useState(null);
  const [propStates, setPropStates] = useState([]);
  let id = newid();

  var api = require("etherscan-api").init(
    // "QPTMSBIJA17A9XT2C9KH67YAGHRMWFEZFC",
    "QPTMSBIJA17A9XT2C9KH67YAGHRMWFEZFC",
    "rinkeby",
    "3000"
  );

  // retrieve proposal ID/ make table
  async function readTransactions() {
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum, "rinkeby", {
      etherscan: "QPTMSBIJA17A9XT2C9KH67YAGHRMWFEZFC",
      infura: "59688ffd8ec54a9288501b276812812c",
    });
    const signer = provider.getSigner();
    // const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
    const ENDPOINT = "https://api-rinkeby.etherscan.io/";
    // apikey, network, timeout
    // var api = require("etherscan-api").init(
    //   "CTZ2UN53W16NDSQRZZSJX6V4HKRTA8WHKK",
    //   "rinkeby",
    //   "3000"
    // );

    var txList = api.account.txlist(GOV_CONTRACT, 0, "latest", 1, 100, "asc");

    // await timer(3000);
    var txResolved = txList.then(function (txList) {
      console.log("Tx list: ", txList);

      for (var i = 0; i < txList.result.length; i++) {
        console.log("Decoding individual transactions.");
        decodeTxInput(txList.result[i].hash, provider);
      }
    });
    txResolved
      .then(function (txResolved) {
        addRow(txDataPerUser);
      })
      .catch((error) => console.log(error.response));
  }

  // transactionHash undefined as it enters here
  async function decodeTxInput(transactionHash, provider) {
    const InputDataDecoder = require("ethereum-input-data-decoder");
    const __dirname = "../../contracts/";
    const decoder = new InputDataDecoder(govContract.abi);
    let decryptedMethod;
    let txHash, txTo, txFrom;
    let proposeEvent;
    try {
      const rawTransaction = await web3.eth.getTransaction(transactionHash); //
      txHash = rawTransaction.hash;
      txTo = rawTransaction.to == GOV_CONTRACT ? "DAO" : rawTransaction.to;
      txFrom =
        rawTransaction.from == GOV_CONTRACT ? "DAO" : rawTransaction.from;
      const txData = rawTransaction.input;

      const result = decoder.decodeData(txData);
      decryptedMethod = result.method; //type of transaction (propose, castVote)
      let latestThreshold = web3.eth.getBlockNumber();

      const p = await Promise.resolve(latestThreshold);
      const latestBlock = await p;
      const threshold = latestBlock - 2000;

      if (
        decryptedMethod == "propose"
        // &&
        // rawTransaction.blockNumber >= threshold
      ) {
        let proposalId = null;

        let blockNum = null;
        console.log("Getting Tx by hash: ", transactionHash);
        const txData = api.proxy.eth_getTransactionByHash(txHash);

        let response = await fetch(fetchMyAPI(txData));
        //   .then((response) => console.log("response ", response))
        //   .then((data) => {
        //     console.log(data);
        //   })
        //   .catch((err) => {
        //     console.error(err);
        //   });

        // if (response.ok) {
        //   console.log("latest proposalid", latestPropId);

        //   if (
        //     (!myHashList.includes(transactionHash) || !myHashList) &&
        //     decryptedMethod == "propose"
        //   ) {
        //     const idx = txDataPerUser.length;

        //     console.log(
        //       "idx",
        //       idx,
        //       "txHash",
        //       txHash,
        //       "latestPropId",
        //       latestPropId
        //     );
        //     addTxDataPerUser(
        //       createData(
        //         idx,
        //         txHash,
        //         txFrom,
        //         txTo,
        //         decryptedMethod,
        //         latestPropId
        //       )
        //     );
        //     addTransactionData(txDataPerUser);
        //     addHash(txHash);
        //   }
        // }
      }
    } catch (err) {
      console.log(err);
    }
  }

  //   function generateTableData(){

  //         for (let i=0; i < myHashList.length; i++)
  //         if (!myHashList.includes(transactionHash) || !myHashList) &&
  //           decryptedMethod == "propose"
  //         ) {
  //           const idx = txDataPerUser.length;

  //           console.log(
  //             "idx",
  //             idx,
  //             "txHash",
  //             txHash,
  //             "latestPropId",
  //             latestPropId
  //           );
  //           addTxDataPerUser(
  //             createData(
  //               idx,
  //               txHash,
  //               txFrom,
  //               txTo,
  //               decryptedMethod,
  //               latestPropId
  //             )
  //           );
  //           addTransactionData(txDataPerUser);
  //           addHash(txHash);
  //         }
  //       }
  //   }

  // my proposalid : 90832233643883094007203689940897447802245601690243783075653978491660731606300

  function addTxDataPerUser(objToAdd) {
    //get old data and add new row
    let newBioData = txDataPerUser.push(objToAdd);
    setHashList(newBioData);
  }

  function addTransactionData(objToAdd) {
    //get old data and add new row
    let newBioData = isTransactionData.push(objToAdd);
    setHashList(newBioData);
  }

  function addHash(objToAdd) {
    //get old data and add new row
    let newBioData = myHashList.push(objToAdd);
    setHashList(newBioData);
  }

  function addBlock(objToAdd) {
    //get old data and add new row
    let newBioData = isBlockNum.push(objToAdd.toString());
    setBlockNum(newBioData);
  }

  function addPropId(objToAdd) {
    //get old data and add new row
    let newBioData = isPropIds.push(objToAdd);
    setPropIds(newBioData);
    addTxDataPerUser(createData(isPropIds.length, objToAdd));
    addRow(txDataPerUser);
  }

  function addRow(objToAdd) {
    //get old data and add new row
    let newBioData = objToAdd;
    setRows(newBioData);
  }

  function addPropState(objToAdd) {
    //get old data and add new row
    let newBioData = objToAdd;
    setPropStates(newBioData);
    // addTxDataPerUser(
    //   createData(isPropIds.length, isPropIds[isPropIds.length], objToAdd)
    // );
    // addRow(txDataPerUser);
  }

  //!TODO hardcoded block number atm, get proposal ID from blocknumber
  async function getProposalIds() {
    console.log("Get PROPOSAL IDS");
    for (let idx = 0; idx < isBlockNum.length; idx++) {
      console.log("Getting proposal id for: ", isBlockNum[idx]);
      var proposalLogs = api.log.getLogs(
        "0x16cDd8e3D47DEB6064509A08B01d0b727a88Db76",
        isBlockNum[idx],
        isBlockNum[idx] //11227180
      );

      var getProposalId = proposalLogs.then(function (proposalLogs) {
        const typesArray = [
          { type: "uint256", name: "proposalId" },
          { type: "address", name: "proposer" },
          { type: "address[]", name: "targets" },
          { type: "uint256[]", name: "values" },
        ];
        const decodedParameters = web3.eth.abi.decodeParameters(
          typesArray,
          proposalLogs.result[0].data
        );
        if (!isPropIds.includes(decodedParameters[0])) {
          addPropId(decodedParameters[0]);
          setLatestPropId(decodedParameters[0]);
          getProposalState(decodedParameters[0]);

          console.log("ProposalIds: ", isPropIds);
        }

        // setMagicalProposalId(decodedParameters[0]);
        console.log("Proposal Id: ", decodedParameters[0]);
        return decodedParameters[0];
      });
    }
  }
  //   const incrementCounter = () => {
  //     setMyCounter(myCounter + 1);
  //   };

  async function fetchMyAPI(txData) {
    let blockNum;
    await timer(1000);
    let mycall = txData
      .then(function (txData) {
        console.log(
          "Block number",
          parseInt(txData.result.blockNumber, 16).toString()
        );
        blockNum = parseInt(txData.result.blockNumber, 16); // parseInt
        // if (
        //   (typeof blockNum.toString() == "string" &&
        //     isBlockNum.indexOf(blockNum.toString) > -1) ||
        //   !isBlockNum
        // ) {
        if (!isBlockNum.includes(blockNum.toString()) || !isBlockNum) {
          addBlock(blockNum.toString());
          //   setMyCounter(isBlockNum.length);
          //   //   incrementCounter();
          //   console.log("counter is:", myCounter);
          //   let newBlockArr = isBlockNum.push(blockNum.toString());
          //   setBlockNum(newBlockArr);
          //   getProposalIds();
        }
        // setBlockNum(...blockNumbers, blockNum);
        // return txData;
        return blockNum;
      })
      .then(function (blockNum) {
        console.log("block num still: ", isBlockNum);
        getProposalIds();
      });
  }

  async function getProposalState(proposalId) {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        const smartContract = new ethers.Contract(
          GOV_CONTRACT,
          govContract.abi,
          signer
        );
        let propState = await smartContract.state(proposalId);
        console.log("Proposal State is", propState);
        addPropState(propState);
      }
    } catch (err) {
      console.log(err);
    }
  }

  const isActive = async (proposalId) => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        const smartContract = new ethers.Contract(
          GOV_CONTRACT,
          govContract.abi,
          signer
        );
        let propState = await smartContract.state(proposalId);
        if (propState == 1) {
          return true;
        }
        return false;
      }
    } catch (err) {
      console.log(err);
    }
  };

  async function proposalIdFromHash(txHash) {
    let proposalId = null;

    let blockNum = null;
    const txData = api.proxy.eth_getTransactionByHash(txHash);
    let response = await fetch(fetchMyAPI(txData))
      .then((response) => console.log("response ", response))
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  //  ____________________________ utils for table ____________________________
  function isHyperRef(row) {
    // row.idx is row number
    return window.open(`https://rinkeby.etherscan.io/tx/${row.hash}`);
  }
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    readTransactions();
  }, []);

  //   if (isPropIds === undefined) {
  //     return <>Still loading...</>;
  //   }

  return (
    <div>
      <div>
        {isPropIds &&
          //   columns.map((item, index) => (
          //     <li key={index}>
          //       Proposal ID is: {item.proposalId}
          //       Vote on this:{" "}
          //       {/* <SubmitVoteID proposalId={item.proposalId} key={item.idx} /> */}
          //     </li>
          //   ))}{" "}
          rows.map((row, index) => {
            // if (row.propState === 1) {
            return (
              <li key={row.idx}>
                Proposal ID is: {row.propId}
                Vote on this:
                <SubmitVoteID proposalId={row.propId} />
              </li>
            );
            // }
          })}
      </div>
    </div>
  );
}

// 0 Pending
// __________
// 1 Active
// __________
// 2 Canceled
// 3 Defeated
// 4 Succeeded
// __________
// 5 Queued
// 6 Expired (???)
// 7 Executed

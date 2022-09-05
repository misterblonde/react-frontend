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

import axios from "axios";
import web3 from "../web3";
import { LensTwoTone } from "@mui/icons-material";
const timer = (ms) => new Promise((res) => setTimeout(res, ms));

let lastId = 0;

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

function newid(prefix = "id") {
  lastId++;
  return `${prefix}${lastId}`;
}

function createData(idx, hash, from, to, method, propId) {
  return { idx, hash, from, to, method, propId };
}

const columns = [
  {
    id: "idx",
    label: "Name",
    minWidth: 70,
    align: "left",
    format: (value) => value,
  },
  {
    id: "method",
    label: "Method",
    minWidth: 70,
    align: "left",
    format: (value) => value,
  },
  {
    id: "hash",
    label: "Transaction Hash",
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
  {
    id: "from",
    label: "From",
    minWidth: 100,
    align: "left",
    format: (value) => value, //.toFixed(2),
  },
  {
    id: "to",
    label: "To",
    minWidth: 70,
    align: "left",
    format: (value) => value, //.toFixed(2),
  },
];

export default function ProposalTableEtherscan() {
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
  let id = newid();

  var api = require("etherscan-api").init(
    "QPTMSBIJA17A9XT2C9KH67YAGHRMWFEZFC",
    "rinkeby",
    "3000"
  );
  // retrieve proposal ID/ make table
  async function readTransactions() {
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
    const ENDPOINT = "https://api-rinkeby.etherscan.io/";
    // apikey, network, timeout
    var api = require("etherscan-api").init(
      "QPTMSBIJA17A9XT2C9KH67YAGHRMWFEZFC",
      "rinkeby",
      "3000"
    );

    var txList = api.account.txlist(GOV_CONTRACT, 0, "latest", 1, 100, "asc");

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

      if (decryptedMethod == "propose") {
        let proposalId = null;

        let blockNum = null;
        console.log("Getting Tx by hash: ", transactionHash);
        const txData = api.proxy.eth_getTransactionByHash(txHash);

        let response = await fetch(fetchMyAPI(txData));

        console.log("latest proposalid", latestPropId);

        if (
          (!myHashList.includes(transactionHash) || !myHashList) &&
          decryptedMethod == "propose"
        ) {
          const idx = txDataPerUser.length;

          console.log(
            "idx",
            idx,
            "txHash",
            txHash,
            "latestPropId",
            latestPropId
          );
          addTxDataPerUser(
            createData(idx, txHash, txFrom, txTo, decryptedMethod, latestPropId)
          );
          addTransactionData(txDataPerUser);
          addHash(txHash);
        }
        // }
      }
    } catch (err) {
      console.log(err);
    }
  }

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
    let newBioData = isBlockNum.push(objToAdd);
    setBlockNum(newBioData);
  }

  function addPropId(objToAdd) {
    //get old data and add new row
    let newBioData = isPropIds.push(objToAdd);
    setPropIds(newBioData);
  }

  function addRow(objToAdd) {
    //get old data and add new row
    let newBioData = objToAdd;
    setRows(newBioData);
  }

  //!TODO hardcoded block number atm, get proposal ID from blocknumber
  async function getProposalIds() {
    console.log("Get PROPOSAL IDS");
    for (let idx = 0; idx < isBlockNum.length; idx++) {
      console.log("Getting proposal id for: ", isBlockNum[idx]);
      var proposalLogs = api.log.getLogs(
        GOV_CONTRACT,
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
          console.log("ProposalIds: ", isPropIds);
        }

        // setMagicalProposalId(decodedParameters[0]);
        console.log("Proposal Id: ", decodedParameters[0]);
        return decodedParameters[0];
      });
    }
  }

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
    //   .then(() => {
    //     setTxBlockNum(blockNum);
    //     console.log("Block num", blockNum);
    //     return getProposalId(blockNum);
    //   });
  }

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

  //   useEffect(
  //     function effectFunction() {
  //       generateTableData();
  //     },
  //     [isPropIds]
  //   );

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      {/* <div>
        Proposal ID:{" "}
        {isPropIds.map((row) => {
          {
            row;
          }
        })}
      </div> */}
      {/* <div>Proposal ID: {isPropIds}</div> */}
      <TableContainer component={Paper}>
        <Table
          id=".MuiTable-root"
          sx={{ minWidth: 650 }}
          aria-label="simple table"
        >
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    row={row}
                    key={row.hash}
                    onClick={() => {
                      isHyperRef(row);
                    }}
                  >
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell
                          row={row}
                          //   component="a"
                          key={newid()}
                          align={column.align}
                        >
                          {/* {column.format(value)} */}
                          {column.format && typeof value === "number"
                            ? column.format(value)
                            : value}
                        </TableCell> //&& typeof value === "number"
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}

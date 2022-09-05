import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import govContract from "../Contracts/MyGovernorType.json";
// import govContract from "../Contracts/MyGovernor.json";
import TablePagination from "@mui/material/TablePagination";
import _uniqueId from "lodash/uniqueId";

import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import { ENDPOINT, TOKEN_CONTRACT, GOV_CONTRACT } from "../contracts-config";
import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
// import newId from "./newid";

import web3 from "../web3";
import { LensTwoTone } from "@mui/icons-material";

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

function createData(idx, hash, from, to, method) {
  return { idx, hash, from, to, method };
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
    minWidth: 120,
    align: "left",
    format: (value) => value,
  },
  {
    id: "from",
    label: "From",
    minWidth: 170,
    align: "left",
    format: (value) => value.toFixed(2),
  },
  {
    id: "to",
    label: "To",
    minWidth: 70,
    align: "left",
    format: (value) => value.toFixed(2),
  },
];

export default function ProposalTable() {
  const [isTransactionData, setTransactionData] = useState([]);
  const [txDataPerUser, setTxDataPerUser] = useState([]);
  const [myHashList, setHashList] = useState([]);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentBlockNum, setTxBlockNum] = useState(null);
  const [isPropId, setPropId] = useState(null);
  const [id2] = useState(_uniqueId("prefix-"));
  let id = newid();

  var api = require("etherscan-api").init(
    "QPTMSBIJA17A9XT2C9KH67YAGHRMWFEZFC",
    "rinkeby",
    "3000"
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const checkWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have Metamask installed!");
      return;
    }
    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];

      setCurrentAccount(account);
    } else {
      console.log("No authorized account found");
    }
  };

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
      console.log(threshold);
      //     return threshold;
      //   });
      //   console.log("Tx: ", rawTransaction.blockNumber, await p);
      if (
        decryptedMethod == "propose" &&
        rawTransaction.blockNumber >= threshold
      ) {
        // const txHash =
        //   "0x92762af02df55ec46d22244413410d22ed3ce1c7af6db7733f45b775c539d7c2";
        let proposalId = null;

        let blockNum = null;

        const txData = api.proxy.eth_getTransactionByHash(txHash);
        let response = await fetch(fetchMyAPI(txData))
          .then((response) => console.log("response ", response))
          .then((data) => {
            console.log(data);
          })
          //   .then(proposalId(data))
          .catch((err) => {
            console.error(err);
          });
      }
      // TODO Attempt to get the Proposal ID from the Transaction Receipt
      //   if (decryptedMethod == "propose") {
      //     proposeEvent = await provider
      //       .getTransactionReceipt(transactionHash)
      //       .then(function (transactionReceipt) {});
      //     // proposeEvent = await provider.getTransactionReceipt(transactionHash);
      //     // decode log
      //     const decodedParameters = web3.eth.abi.decodeParameters(
      //       govContract,
      //       proposeEvent.logs.data
      //     );

      if (
        !myHashList.includes(transactionHash) &&
        decryptedMethod == "propose"
      ) {
        const idx = txDataPerUser.length;

        let functionalHash = getProposalIdButton(txHash);
        addTxDataPerUser(
          createData(idx, functionalHash, txFrom, txTo, decryptedMethod)
        );
        addTransactionData(txDataPerUser);
        addHash(txHash);
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

  function addRow(objToAdd) {
    //get old data and add new row
    let newBioData = objToAdd;
    setRows(newBioData);
  }

  // get proposal ID from blocknumber
  async function getProposalId(blockNumber) {
    var proposalLogs = api.log.getLogs(
      "0xdc4697b7cfde006be7a76fda0853880d561dea01",
      currentBlockNum,
      currentBlockNum
    );

    var getProposalIdSet = proposalLogs.then(function (proposalLogs) {
      console.log("Proposal lgos:", proposalLogs);
      const typesArray = [
        { type: "uint256", name: "proposalId" },
        { type: "address", name: "proposer" },
        // { type: "address[]", name: "targets" },
        // { type: "uint256[]", name: "values" },
        // { type: "bytes[]", name: "calldatas" },
        // { type: "uint256", name: "startBlock" },
        // { type: "uint256", name: "endBlock" },
        // { type: "string", name: "description" },
      ];

      //   const decodedParameters = web3.eth.abi.decodeLog(
      //     govContract.abi,
      //     proposalLogs.result[0].data
      //     // proposalLogs.result[0].topics.slice(1)
      //     // receipt.logs[4].topics.slice(1)
      //   );
      console.log("Logs to decode: ", proposalLogs.result[0].data);
      var decodedParameters = web3.eth.abi.decodeParameters(
        typesArray,
        proposalLogs.result[0].data
      );

      console.log("Proposal Id: ", decodedParameters[0]);
      setPropId(decodedParameters[0]);
    });
    //   })
    //   .then(function (decodedParameters) {
    //     console.log("Proposal Id: ", decodedParameters[0]);
    //     // setPropId(decodedParameters[0]);
    //     //   return decodedParameters[0];
    //   });

    // return getProposalState(decodedParameters[0]);
  }

  async function fetchMyAPI(txData) {
    let blockNum;
    let mycall = txData
      .then(function (txData) {
        console.log(
          "Block number",
          parseInt(txData.result.blockNumber, 16).toString()
        );
        blockNum = parseInt(txData.result.blockNumber, 16); // parseInt
        return txData;
      })
      .then(() => {
        setTxBlockNum(blockNum);
        console.log("Block num", blockNum);
        setTxBlockNum(blockNum.toString());
        return getProposalId(blockNum);
      });
  }

  const proposalIdFromHash = async (txHash) => {
    let proposalId = null;

    let blockNum = null;
    const txData = api.proxy.eth_getTransactionByHash(txHash);
    let response = await fetch(fetchMyAPI(txData))
      .then((response) => console.log("response ", response))
      .then((data) => {
        console.log(data);
      })
      //   .then(proposalId(data))
      .catch((err) => {
        console.error(err);
      });
  };

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
      console.log("Transaction List: ", txList);
      for (var i = 0; i < txList.result.length; i++) {
        decodeTxInput(txList.result[i].hash, provider);
      }
    });
    txResolved
      .then(function (txResolved) {
        addRow(txDataPerUser);
      })
      .catch((error) => console.log(error.response));
  }

  async function getProposalState(proposalId) {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const governanceContractAddress = GOV_CONTRACT;
      const governanceAbi = govContract.abi;

      // mismatch between ABI and address?
      const governor = new ethers.Contract(
        governanceContractAddress,
        governanceAbi,
        signer
      );

      let govTxn = await governor.state(proposalId);
      console.log("State is: ", govTxn);
      const txReceipt = await govTxn.wait(1);
    }
  }
  // proposal ID #1: 11012267358724471503894509194310656158298813779417333659065747210552963118396
  function isHyperRef(row) {
    // row.idx is row number
    return window.open(`https://rinkeby.etherscan.io/tx/${row.hash}`);
  }

  const getProposalIdButton = (props) => {
    setPropId(props);
    return (
      <FormControl>
        <Button
          sx={{ mt: 1, mr: 1 }}
          onClick={proposalTxHandler}
          type="recenter"
          variant="outlined"
          hash={props}
        >
          {props}
        </Button>
      </FormControl>
    );
  };

  const proposalTxHandler = async (props) => {
    let propId;
    console.log("Txhash: ", props);
    try {
      propId = await proposalIdFromHash(props);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    checkWalletIsConnected();
    readTransactions();
  }, []);

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <div>{isPropId}</div>
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
                    // onClick={() => {
                    //   isHyperRef(row);
                    // }}
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

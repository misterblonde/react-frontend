import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import {
  ENDPOINT,
  //   ETHERSCAN_API_KEY,
  TOKEN_CONTRACT,
  GOV_CONTRACT,
} from "../contracts-config";
import { useState, useEffect } from "react";
import nftoken from "../Contracts/MyNftToken.json";

import axios from "axios";
import web3 from "../web3";

// import load_dotenv from dotenv;

// load_dotenv();
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
console.log(ETHERSCAN_API_KEY);
// const ETHERSCAN_API_KEY = os.getenv('ETHERSCAN_API_KEY');

function createData(idx, hash, from, to, method) {
  return { idx, hash, from, to, method };
}

export default function NftTable() {
  const [isTransactionData, setTransactionData] = useState([]);
  let txDataPerUser = [];
  let myHashList = [];
  const [currentAccount, setCurrentAccount] = useState(null);
  const [content, setContent] = useState("");
  const [rows, setRows] = useState([]);
  const [govData, setGovData] = useState(null);
  const [nftData, setNftData] = useState(null);

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
        params: [currentAccount, "latest"],
      });
      console.log("Found an account! Address: ", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (err) {
      console.log(err);
    }
  };

  async function decodeTxInput(transactionHash) {
    const InputDataDecoder = require("ethereum-input-data-decoder");
    const __dirname = "../../contracts/";
    const decoder = new InputDataDecoder(nftoken);
    let decryptedMethod;
    let txHash, txTo, txFrom;
    try {
      const rawTransaction = await web3.eth.getTransaction(transactionHash); // transactions[i].hash

      if (
        (rawTransaction.from.toLowerCase() ||
          rawTransaction.to.toLowerCase()) == currentAccount
      ) {
        txHash = rawTransaction.hash;
        //   txTo = rawTransaction.to;
        //   txFrom = rawTransaction.from;
        txTo = rawTransaction.to == TOKEN_CONTRACT ? "DAO" : rawTransaction.to;

        txFrom =
          rawTransaction.from == TOKEN_CONTRACT ? "DAO" : rawTransaction.from;

        const txData = rawTransaction.input;

        const result = decoder.decodeData(txData);
        decryptedMethod = result.method;
        console.log("web3: ", result.method);
      }
    } catch (err) {
      console.log(err);
    }

    if (myHashList.indexOf(txHash) == -1) {
      //   txDataPerUser.push({ txHash, txFrom, txTo, decryptedMethod });
      const idx = txDataPerUser.length;
      txDataPerUser.push(
        createData(idx, txHash, txFrom, txTo, decryptedMethod)
      );
      myHashList.push(txHash);
    }
  }

  // search API for transaction data on currentAccount
  async function readTransactions() {
    // GOV contract interactions
    const govNumRequest = await axios
      .get(
        ENDPOINT +
          `api?module=proxy&action=eth_getTransactionCount&address=${GOV_CONTRACT}&tag=latest&apikey=${ETHERSCAN_API_KEY}`
      )
      .then(async (data) => {
        setGovData(data.data.result);
        console.log(parseInt(govData));
      });

    // if (govNumRequest.data.result != undefined) {
    //   console.log("Gov transactions", parseInt(govNumRequest.data.result));
    // }
    // NFT contract interactions
    await axios
      .get(
        ENDPOINT +
          `api?module=account&action=txlist&address=${TOKEN_CONTRACT}&startblock=0&endblock=99999999&sort=asc&apikey=${ETHERSCAN_API_KEY}`
      )
      .then(async (data) => {
        console.log("Data found is: ", data.data.result.length);
        setNftData(data.data.result);
        const transactions = data.data.result;
        for (var i = 0; i < transactions.length; i++) {
          //     transacton was successful (1) failed (0)
          // difference between transaction ID and hash
          console.log(
            "Token Transfer: ",
            transactions[i].id,
            " ",
            transactions[i].hash
          );

          const txRequest = await axios.get(
            ENDPOINT +
              `api?module=proxy&action=eth_getTransactionByHash&txhash=${transactions[i].hash}&apikey=${ETHERSCAN_API_KEY}`
          );

          const fetchedData = txRequest.result;
          const legibleTx = await fetch(decodeTxInput(transactions[i].hash));
        }

        console.log(txDataPerUser);
        setRows([...txDataPerUser]);
        setTransactionData([...txDataPerUser]);
        console.log("Transaction Data: ", isTransactionData);
      });
  }
  // if (parseInt(govNumRequest.data.result) > 0)
  // console.log("Nft contract transactions: ", nftNumRequest.data);
  //   }
  // loop through the nft transactions
  // const transactions = nftNumRequest.data.result; // array of 5 transactions

  // let tempArray=[...isTransactionData];
  // tempArray[index] = {...tempArray[index], rpe: e.target.value}
  //     setTablesSets(tempArray);
  // console.log("State is: ", isTransactionData);

  useEffect(() => {
    checkWalletIsConnected();
    readTransactions();
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>DAO Transaction</TableCell>
            <TableCell align="right">Method</TableCell>
            <TableCell align="right">TxHash</TableCell>
            <TableCell align="right">From&nbsp;(Addr)</TableCell>
            <TableCell align="right">To&nbsp;(Addr)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow
              key={index}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {" "}
                {row.idx}
              </TableCell>
              {/* <TableCell align="right">{row.idx}</TableCell> */}
              <TableCell align="right">{row.method}</TableCell>
              <TableCell align="right">{row.hash}</TableCell>
              <TableCell align="right">{row.from}</TableCell>
              <TableCell align="right">{row.to}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

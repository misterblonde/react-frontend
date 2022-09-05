// import * as React from "react";
// import Table from "@mui/material/Table";
// import TableBody from "@mui/material/TableBody";
// import TableCell from "@mui/material/TableCell";
// import TableContainer from "@mui/material/TableContainer";
// import TableHead from "@mui/material/TableHead";
// import TableRow from "@mui/material/TableRow";
// import Paper from "@mui/material/Paper";
// import TablePagination from "@mui/material/TablePagination";
// import _uniqueId from "lodash/uniqueId";
// import govContract from "../Contracts/MyGovernor.json";
// // import govContract from "../Contracts/MyGovernorDownload.json";
// import { GOV_CONTRACT } from "../contracts-config";
// import { useState, useEffect } from "react";
// import { ethers } from "ethers";

// // const etherescan_url = `http://api.etherscan.io/api?module=contract&action=getabi&address=${GOV_CONTRACT}&apikey=${ETHERSCAN_API_KEY}`;

// import web3 from "../web3";
// const Web3 = require("web3");
// const client = require("node-rest-client-promise").Client();
// const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
// // https://rinkeby.etherscan.io/apidoc
// // const etherscan_url = `http://rinkeby.etherscan.io/api?module=contract&action=getabi&address=${GOV_CONTRACT}&apikey=${ETHERSCAN_API_KEY}`;
// const etherscan_url = `https://api-rinkeby.etherscan.io/api?module=contract&action=getabi&address=${GOV_CONTRACT}&apikey=${ETHERSCAN_API_KEY}`;
// let lastId = 0;

// function newid(prefix = "id") {
//   lastId++;
//   return `${prefix}${lastId}`;
// }

// const columns = [
//   {
//     id: "idx",
//     label: "Name",
//     minWidth: 70,
//     align: "left",
//     format: (value) => value,
//   },
//   {
//     id: "method",
//     label: "Method",
//     minWidth: 70,
//     align: "left",
//     format: (value) => value,
//   },
//   {
//     id: "hash",
//     label: "Transaction Hash",
//     minWidth: 100,
//     align: "left",
//     format: (value) => value,
//   },
//   {
//     id: "propId",
//     label: "Proposal ID",
//     minWidth: 100,
//     align: "left",
//     format: (value) => value,
//   },
//   {
//     id: "from",
//     label: "From",
//     minWidth: 100,
//     align: "left",
//     format: (value) => value, //.toFixed(2),
//   },
//   {
//     id: "to",
//     label: "To",
//     minWidth: 70,
//     align: "left",
//     format: (value) => value, //.toFixed(2),
//   },
// ];

// export default function ProposalTable() {
//   const [rows, setRows] = useState([]);
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   //   const [theMagicalProposalId, setMagicalProposalId] = useState(null);
//   const [id2] = useState(_uniqueId("prefix-"));
//   const ethNetwork =
//     "https://rinkeby.infura.io/v3/59688ffd8ec54a9288501b276812812c";

//   //   var api = require("etherscan-api").init(
//   //     "QPTMSBIJA17A9XT2C9KH67YAGHRMWFEZFC",
//   //     "rinkeby",
//   //     "3000"
//   //   );

//   async function getContractAbi() {
//     const etherscan_response = await client.getPromise(etherscan_url);
//     const CONTRACT_ABI = JSON.parse(etherscan_response.data.result); //.data.result);
//     console.log(CONTRACT_ABI);
//     return CONTRACT_ABI;
//   }

//   //   async function eventQuery() {
//   //     // const CONTRACT_ABI = getContractAbi();
//   //     const myGovContract = new web3.eth.Contract(govContract.abi, GOV_CONTRACT);
//   //     /*    Code to query events here       */
//   //     getPastEvents();
//   //   }
//   async function getProposalId(proposalLog) {
//     var api = require("etherscan-api").init(
//       "QPTMSBIJA17A9XT2C9KH67YAGHRMWFEZFC",
//       "rinkeby",
//       "3000"
//     );
//     // for (let idx = 0; idx < isBlockNum.length; idx++) {
//     //   console.log("Getting proposal id for: ", isBlockNum[idx]);
//     //   var proposalLogs = api.log.getLogs(
//GOV_CONTRACT
//     //     isBlockNum[idx],
//     //     isBlockNum[idx] //11227180
//     //   );

//     const typesArray = [
//       { type: "uint256", name: "proposalId" },
//       { type: "address", name: "proposer" },
//       { type: "address[]", name: "targets" },
//       { type: "uint256[]", name: "values" },
//     ];
//     const decodedParameters = web3.eth.abi.decodeParameters(
//       typesArray,
//       proposalLog //proposalLogs.result[0].data
//     );
//     // if (!isPropIds.includes(decodedParameters[0])) {
//     //   addPropId(decodedParameters[0]);
//     //   setLatestPropId(decodedParameters[0]);
//     //   console.log("ProposalIds: ", isPropIds);
//     // }

//     // setMagicalProposalId(decodedParameters[0]);
//     console.log("Proposal Id: ", decodedParameters[0]);
//     return decodedParameters[0];
//   }
//   //     }
//   //   }

//   async function getPastEvents() {
//     const { ethereum } = window;
//     const provider = new ethers.providers.Web3Provider(
//       new Web3.providers.HttpProvider(ethNetwork)
//     );
//     const signer = provider.getSigner();
//     const START_BLOCK = 7700000;
//     const END_BLOCK = "latest";

//     // const myContractAbi = getContractAbi();
//     // const myabi = JSON.parse(govContract.abi); // .interface before

//     const myGovContract = new web3.eth.Contract(govContract.abi, GOV_CONTRACT);

//     // const = new web3.eth.Contract(
//     //   myContractAbi.interface,
//     //   GOV_CONTRACT
//     // );
//     // const myGovContract = new ethers.Contract(
//     //   GOV_CONTRACT,
//     //   govContract.abi,
//     //   signer
//     // );
//     const abiDecoder = require("abi-decoder");
//     myGovContract //contract.getPastEvents("Transfer",
//       .getPastEvents("allEvents", {
//         fromBlock: START_BLOCK,
//         toBlock: END_BLOCK, // You can also specify 'latest'
//       })
//       .then((events) => {
//         console.log(events);
//         let method, eventLog, myData;
//         for (let i = 0; i < events.length; i++) {
//           if (events[i].event == "ProposalCreated") {
//             eventLog = web3.eth
//               .getTransactionReceipt(events[i].transactionHash)
//               .then((eventLog) => {
//                 myData = eventLog.logs[0].data;
//                 console.log("You still got data: ", eventLog.logs[0].data);
//                 // const decodedLogs = abiDecoder.decodeLogs(eventLog);
//                 // console.log("Decoded logs: ", decodedLogs);
//               })
//               .then((myData) => {
//                 getProposalId(myData);
//                 // const typesArray = [
//                 //   { type: "uint256", name: "proposalId" },
//                 //   { type: "address", name: "proposer" },
//                 //   { type: "address[]", name: "targets" },
//                 //   { type: "uint256[]", name: "values" },
//                 // ];
//                 // const decodedParameters = web3.eth.abi.decodeParameters(
//                 //   typesArray,
//                 //   myData
//                 // );
//                 // console.log("Proposal Id: ", decodedParameters[0]);
//               });
//             //   .then(function (eventLog) {
//             //     console.log("Proposal Log is: ", eventLog);
//             //     console.log("Tpics is: ", eventLog.logs[0].topics);
//             //   });

//             // const typesArray = [
//             //   { type: "uint256", name: "proposalId" },
//             //   { type: "address", name: "proposer" },
//             //   { type: "address[]", name: "targets" },
//             //   { type: "uint256[]", name: "values" },
//             // ];

//             // // const ethABI = require("web3-eth-abi");

//             // // const data = "0x";
//             // const topics = eventLog.logs[0];

//             //               // console.log(JSON.stringify(decodedParameters, null, 4));
//             // console.log(
//             //   "TADA:::",
//             //   ethABI.decodeLog(govContract.abi, data, topics)
//             // );

//             // attempt #1
//             // const decodedParameters = web3.eth.abi.decodeParameters(
//             //   typesArray,
//             //   topics
//             // );
//             // console.log(JSON.stringify(decodedParameters, null, 4));

//             // attempt #2 (wrong version of web3)
//             // const data = "0x";
//             // const ethABI = require("web3-eth-abi");
//             // console.log(ethABI.decodeLog(typesArray, data, topics));

//             // attempt #3
//             // const abiDecoder = require("abi-decoder"); // NodeJS
//             // abiDecoder.addABI(govContract);
//             // const decodedData = abiDecoder.decodeMethod(topics);
//             // console.log("Final proposal ID: ", decodedData);

//             // web3.eth.getTransactionReceipt(
//             //
//             //   function (e, receipt) {
//             //     const decodedLogs = abiDecoder.decodeLogs(receipt.logs);
//             //     console.log("Decoded logs: ", decodedLogs);
//             //   }
//             // );

//             // let decoded = web3.eth.abi
//             //   .decodeParameter(GOV_CONTRACT, eventLog.logs[0].topics)
//             //   .then(function (decoded) {
//             //     console.log(decoded);
//             //   });
//             // let value = parseInt(eventLog.logs[0].topics, 16);
//             // const bytes = bytes.replace(/^0x/i, "");
//             // const decodedParameters = web3.eth.abi
//             //   .decodeParameters(
//             //     govContract.abi, //typesArray,
//             //     eventLog.logs[0].topics // proposalLogs.result[0].data
//             //   )
//             //   .then(console.log("ProposalId: ", decodedParameters));
//             // if (!isPropIds.includes(decodedParameters[0])) {
//             //   addPropId(decodedParameters[0]);
//             //   setLatestPropId(decodedParameters[0]);

//             // }
//             //   });
//           }
//         }
//       })
//       .catch((err) => console.error(err));
//   }

//   async function readTransactions() {
//     getPastEvents();
//   }

//   useEffect(() => {
//     readTransactions();
//   }, []);

//   function isHyperRef(row) {
//     // row.idx is row number
//     return window.open(`https://rinkeby.etherscan.io/tx/${row.hash}`);
//   }

//   const handleChangePage = (event, newPage) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event) => {
//     setRowsPerPage(+event.target.value);
//     setPage(0);
//   };

//   return (
//     <Paper sx={{ width: "100%", overflow: "hidden" }}>
//       <TableContainer component={Paper}>
//         <Table
//           id=".MuiTable-root"
//           sx={{ minWidth: 650 }}
//           aria-label="simple table"
//         >
//           <TableHead>
//             <TableRow>
//               {columns.map((column) => (
//                 <TableCell
//                   key={column.id}
//                   align={column.align}
//                   style={{ minWidth: column.minWidth }}
//                 >
//                   {column.label}
//                 </TableCell>
//               ))}
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {rows
//               .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
//               .map((row) => {
//                 return (
//                   <TableRow
//                     hover
//                     role="checkbox"
//                     tabIndex={-1}
//                     row={row}
//                     key={row.hash}
//                     onClick={() => {
//                       isHyperRef(row);
//                     }}
//                   >
//                     {columns.map((column) => {
//                       const value = row[column.id];
//                       return (
//                         <TableCell row={row} key={newid()} align={column.align}>
//                           {column.format && typeof value === "number"
//                             ? column.format(value)
//                             : value}
//                         </TableCell>
//                       );
//                     })}
//                   </TableRow>
//                 );
//               })}
//           </TableBody>
//         </Table>
//       </TableContainer>
//       <TablePagination
//         rowsPerPageOptions={[10, 25, 100]}
//         component="div"
//         count={rows.length}
//         rowsPerPage={rowsPerPage}
//         page={page}
//         onPageChange={handleChangePage}
//         onRowsPerPageChange={handleChangeRowsPerPage}
//       />
//     </Paper>
//   );
// }

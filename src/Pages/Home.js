import { useEffect, useState } from "react";
import "../App.css";
import "../index.css";
import { ethers } from "ethers";
import "bootstrap/dist/css/bootstrap.min.css";

import TakePart from "../Components/TakePart";
import Delegated from "../Components/Delegated";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";

import MyNftTokenAbi from "../Contracts/MyNftToken.json";
import MyGovernorAbi from "../Contracts/MyGovernor.json";
import { GOV_CONTRACT, TOKEN_CONTRACT } from "../contracts-config.js";
import SimpleSnackbar from "../Components/SimpleSnackbar";
import "./proposals.css";

function Home() {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [isGovHolder, setIsGovHolder] = useState(false);
  const [isDelegate, setIsDelHolder] = useState(true);
  const [amountRaised, setAmountRaised] = useState(null);
  const [snackbar, setSnackbarAlert] = useState(false);
  const [rejection, setRejection] = useState(false);
  const [minted, setMinted] = useState(false);
  const [txLink, setTxLink] = useState(null);
  const [waitForMint, setWaitForMint] = useState(false);

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

  //   const readNfts = async () => {
  //     try {
  //       const { ethereum } = window;

  //       if (ethereum) {
  //         const provider = new ethers.providers.Web3Provider(ethereum);
  //         const signer = provider.getSigner();

  //         const nftContract = new ethers.Contract(
  //           TOKEN_CONTRACT,
  //           MyNftTokenAbi.abi,
  //           signer
  //         );

  //         console.log("Initialize reading wallet");
  //         const accounts = await ethereum.request({
  //           method: "eth_requestAccounts",
  //         });

  //         console.log(nftContract.getVotes(accounts[0]));
  //         let govNftVotes = await fetch(nftContract.getVotes(accounts[0]));
  //         setGovNftCount(parseInt(govNftVotes));

  //         const balance = await nftContract.balanceOf(accounts[0]);
  //         console.log("NFT count: ", parseInt(balance));

  //         if (parseInt(balance) > 0) {
  //           setIsGovHolder(true);
  //         }

  //         if (parseInt(balance) == 0) {
  //           console.log("Please by some Governance Tokens!");
  //           //   alert("Please buy some Governance Tokens!");
  //           //   setNoNftsBalance(true);
  //           setIsGovHolder(false);
  //           setSnackbarAlert(true);
  //         }
  //       }
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };

  const readNfts = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        const nftContract = new ethers.Contract(
          TOKEN_CONTRACT,
          MyNftTokenAbi.abi,
          signer
        );

        console.log("Initialize reading wallet");
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });

        // console.log(nftContract.getVotes(accounts[0]));
        // let govNftVotes = await fetch(nftContract.getVotes(accounts[0]));
        // setGovNftCount(parseInt(govNftVotes));

        const balance = await nftContract.balanceOf(accounts[0]);
        console.log("NFT count: ", parseInt(balance));

        if (parseInt(balance) > 0) {
          setIsGovHolder(true);
        }

        if (parseInt(balance) == 0) {
          console.log("Please by some Governance Tokens!");
          //   alert("Please buy some Governance Tokens!");
          //   setNoNftsBalance(true);
          setIsGovHolder(false);
          setSnackbarAlert(true);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  const mintNftHandler = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        const nftContract = new ethers.Contract(
          TOKEN_CONTRACT,
          MyNftTokenAbi.abi,
          signer
        );

        console.log("Initialize payment");
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });

        const mint = 1;
        const balance = ethers.BigNumber.from("20000000000000000"); // price in Wei
        // const balance = nftContract.PRICE;

        const estimate = ethers.utils.formatEther(balance);
        const number_estimate = ethers.utils.parseEther(estimate);
        console.log("Estimated gas price is: ", estimate);

        let nftTxn = await nftContract.safeMint(accounts[0], {
          value: number_estimate,
        });
        // });
        // 0.021 ether should be enough to mint the NFT (0.020 NFT price)
        setWaitForMint(true);
        console.log("Minting... please wait");
        await nftTxn.wait();

        console.log(
          `Minted, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`
        );
        setTxLink(nftTxn.hash);
        setSnackbarAlert(true);
        setMinted(true);
      } else {
        console.log("Ethereum object does not exist");
      }
    } catch (err) {
      if (err.code === 4001) {
        //user rejected the transaction
        setRejection(true);
        setSnackbarAlert(true);
      }
      console.log(err);
    }
  };

  const govNftRaised = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);

        let nftRaised = await provider.getBalance(TOKEN_CONTRACT);
        console.log(nftRaised);
        // 0.021 ether should be enough to mint the NFT (0.020 NFT price)const
        setAmountRaised(ethers.utils.formatEther(nftRaised));

        console.log("Reading $$$ inside NFT contract s");

        console.log(`Raised: https://rinkeby.etherscan.io/tx/${amountRaised}`);
      } else {
        console.log("Ethereum object does not exist");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const numProposals = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);

        // const provider = new ethers.providers.JsonRpcProvider(
        //   "https://rinkeby.infura.io/v3/59688ffd8ec54a9288501b276812812c" // It cam be different network
        // );
        // // abi = ["event Transfer(address indexed src, address indexed dst, uint val)"];
        const abi = [
          //   "event ProposalCreated (uint256 proposalId, address proposer, address[] targets, uint256[] values, string[] signatures, bytes[] calldatas, uint256 startBlock, uint256 endBlock, string description)"
          "event ProposalCreated (uint256 proposalId, address proposer, address[] targets, uint256[] values, string[] signatures, bytes[] calldatas, uint256 startBlock, uint256 endBlock, string description)",
        ];

        // const abi2 = ["propose (address[],uint256[],bytes[],string)"];

        let contract = new ethers.Contract(
          GOV_CONTRACT,
          MyGovernorAbi.abi,
          provider
        );

        // let topic = ethers.utils.id(
        //   "ProposalCreated (uint256, address, address[], uint256[], string[], bytes[], uint256, uint256, strings)"
        //   //   "ProposalCreated(uint256, address, address[],uint256[], string[], bytes[], uint256, uint256, string)"
        // );

        // let filter = {
        //   address: governanceContractAddress,
        //   topics: [topic],
        // };
        // _++++++++++++++++++++++
        const iface = new ethers.utils.Interface(abi);
        const filter = {
          address: GOV_CONTRACT,
          // Filtering by the event topic directly saves bandwidth and only
          // returns matching logs
          //   topics: [ethers.utils.id("Transfer(address,address,uint256)")],
          topics: [iface.getEventTopic("ProposalCreated")],
          //   fromBlock: 11244882,
        };

        this.provider.on(filter, (result) => {
          // do something here
          console.log(result);
        });
        // (async function () {
        //   const logs = await provider.getLogs(filter);
        //   let events = logs.map((log) => iface.parseLog(log));
        //   console.log(events);
        // })();
        // // ++++++++++++++++++++++++++
        // INFRURA RINKEBY KEY https://rinkeby.infura.io/v3/59688ffd8ec54a9288501b276812812c
        // ++++++++++++++++++++++++++s
        // provider.on(filter, (result) => {
        //   console.log("proposal created result: ");
        //   console.log(result);
        // });

        // contract.on("ProposalCreated", (from, to, value, event) => {
        //   console.log("proposal created events: ");
        //   console.log(from, to, value);

        //   console.log(event.blockNumber);
        // });
        // List all token transfers *from* myAddress
        // contract.filters.ProposalCreated(governanceContractAddress);

        // console.log(nftRaised);
        // // 0.021 ether should be enough to mint the NFT (0.020 NFT price)const
        // setAmountRaised(ethers.utils.formatEther(nftRaised));

        // console.log("Reading $$$ inside NFT contract s");
        // await nftRaised.wait();

        // console.log(`Raised: https://rinkeby.etherscan.io/tx/${amountRaised}`);
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

        const nftContract = new ethers.Contract(
          TOKEN_CONTRACT,
          MyNftTokenAbi.abi,
          signer
        );

        const returnAddr = await nftContract.delegates(currentAccount);
        if (returnAddr != null) {
          console.log("Account has delegated Votes.");
          setIsDelHolder(true);
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
  //   const mintNftHandler = () => {};

  const connectWalletButton = () => {
    return (
      //   <button
      //     onClick={connectWalletHandler}
      //     type="button"
      //     className="btn btn-dark"
      //     //"cta-button connect-wallet-button"
      //   >
      //     Connect Wallet
      //   </button>
      <FormControl>
        <Button
          sx={{ mt: 1, mr: 1 }}
          onClick={connectWalletHandler}
          type="wallet connect"
          variant="outlined"
          style={{ width: 600, height: 100, fontSize: "22px" }}
        >
          Connect Wallet
        </Button>
      </FormControl>
    );
    // );
  };

  const mintNftButton = () => {
    return (
      <div>
        <div className="coolTxt">
          <p>
            Spring DAO Genesis NFT sale raised <b>{amountRaised} ETH</b> so far.
            How would you like to take part in the DAO today?
          </p>
        </div>
        {/* <button onClick={mintNftHandler} type="button" className="btn btn-dark">
          Mint NFT
        </button> */}
        <FormControl>
          <Button
            sx={{ mt: 1, mr: 1 }}
            onClick={mintNftHandler}
            type="mint button"
            variant="outlined"
            style={{ width: 600, height: 100, fontSize: "22px" }}
          >
            Mint Genesis NFT
          </Button>
          {/* ! not showing up after rejected transaction */}
          {snackbar && waitForMint ? (
            <SimpleSnackbar name="mintingWait" />
          ) : null}
          {snackbar && minted ? <SimpleSnackbar name="successfulMint" /> : null}
        </FormControl>
      </div>
    );
  };

  const resetSnackbar = async () => {
    setSnackbarAlert(false);
    setRejection(false);
  };

  //   setRerender(!rerender);

  useEffect(() => {
    // resetSnackbar();
    checkWalletIsConnected();
    govNftRaised();
    readNfts();
    isDelegateHandler();
    // //numProposals()
    // return () => {
    //   // cancel the subscription
    //   setSnackbarAlert(false);
    //   setRejection(false);
    // };
  }, []);

  useEffect(() => {
    console.log("rerender");
  }, [currentAccount]);

  return (
    <div className="main-app">
      {/* <Navbar /> */}
      <div> </div>
      {/* <nav id="navbar">
        <div className="nav-wrapper">
          <Link
            to={this.props.auth ? "/dashboard" : "/"}
            className="left brand-logo"
          >
            <img src={Logo} alt="logo" href="droplet3.png" />
            <div id="logo">WATER DAO</div>
          </Link>
          <ul className="right">{this.renderContent()}</ul>
        </div>
      </nav> */}
      <br></br>
      <div className="coolTxt">
        <h1>Welcome</h1>
      </div>
      <br></br>
      {/* <div>
        Toggle:
        <button onClick={() => setIsToggled(!isToggled)}>Toggle</button>
        {isToggled ? <Test /> : null}
      </div> */}
      <div>{currentAccount ? mintNftButton() : connectWalletButton()}</div>
      <div>
        {snackbar && !isGovHolder ? <SimpleSnackbar name="minting" /> : null}
        {snackbar && rejection ? <SimpleSnackbar name="userDeniedTx" /> : null}
      </div>
      <br></br>
      <div>
        {" "}
        {!isGovHolder || true ? (
          <div>
            <TakePart />
            {snackbar && isDelegate ? (
              <SimpleSnackbar name="isDelegate" />
            ) : null}
            {snackbar && rejection ? (
              <SimpleSnackbar name="userDeniedTx" />
            ) : null}
          </div>
        ) : currentAccount ? (
          <div className="coolTxt">
            {/* <p>
              You do not have any NFTs to take part in the DAO.🥺 <br></br>
              Please mint some NFTs first.
            </p> */}
          </div>
        ) : null}
      </div>
      {/* <div>
        <button onClick={() => setIsGovHolder(!isGovHolder)}>Toggle</button>
        {isToggled ? <Test /> : null}
      </div> */}
      {/* <div>{currentAccount ? delegateButton() : connectWalletButton()}</div> */}
      <br></br>
      <div>
        {/* <br></br> */}
        {isGovHolder ? (
          <div>
            {isDelegate ? (
              <Delegated />
            ) : (
              <div>
                {<SimpleSnackbar name="activateVotes" />}
                <p>
                  You need to delegate your votes first before taking part in
                  the DAO.
                </p>
              </div>
            )}
          </div>
        ) : null}
      </div>
      <br></br>
      {/* <div>
        👇️ colored horizontal line
        <hr
          style={{
            background: "lightgrey",
            color: "lightgrey",
            borderColor: "lightgrey",
            height: "3px",
          }}
        />
      </div> */}
      <br></br>
      {/* <h2>Active DAO Projects</h2> */}
      {/* <div> */}
      {/* <MapChart setTooltipContent={setContent} /> */}
      {/* <ReactTooltip>{content}</ReactTooltip> */}
      {/* </div> */}
      {/* <MapChart /> */}
      {/* </div> */}
      <br></br>
      {/* <BasicTable /> */}
      <br></br>
      <br></br>
    </div>
  );
}

export default Home;

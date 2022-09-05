import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Link } from "react-router-dom";
import {
  TOKEN_CONTRACT,
  PROJECT_TOKEN,
  PROJECT_GOV,
} from "../contracts-config";
import MyNftTokenAbi from "../Contracts/MyNftToken.json";
import web3 from "../web3";
import "./Profile.css";
import droplet from "../img/droplet.png";
import "../App.css";
import "../index.css";
import Divider from "@mui/material/Divider";
import ProjectNftToken from "../Contracts/ProjectNftToken.json";
import projectGovContract from "../Contracts/ProjectGovernor.json";
import tap from "../img/tap.png";
import runningTap from "../img/runningTap.png";

export default function Profile() {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [count, setCount] = useState(null);
  const [projCount, setProjCount] = useState(null);
  const [displayTransactions, setDisplayTransactions] = useState(false);
  const [tokenIds, addTokenId] = useState([]);
  const [projectTokenIds, addProjectTokenId] = useState([]);
  const [tokenId, setTokenId] = useState(0);
  const [projectTokenId, setProjectTokenId] = useState(0);
  const [myIds, setId] = useState([]);
  const [myProjIds, setProjId] = useState([]);
  const [myProjBaseUri, setProjBaseUri] = useState([]);
  const [baseUri, setBaseUri] = useState(null);
  const [nftDisplayal, displayNft] = useState(false);
  const [isLoyalOwner, setLoyalOwner] = useState(false);
  var api = require("etherscan-api").init(
    "QPTMSBIJA17A9XT2C9KH67YAGHRMWFEZFC",
    "rinkeby",
    "3000"
  );
  //   uncomment for opnesea
  //   useScript("https://unpkg.com/embeddable-nfts/dist/nft-card.min.js");

  let nftNum = 0;

  function appendTokenId(objToAdd) {
    //get old data and add new row
    let updatedArr = tokenIds.push(objToAdd);
    setTokenId(updatedArr);
  }

  function appendProjectTokenId(objToAdd) {
    //get old data and add new row
    let updatedArr = projectTokenIds.push(objToAdd);
    setProjectTokenId(updatedArr);
  }

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
      //   readNfts();
    } catch (err) {
      console.log(err);
    }
  };

  async function isOwner(tokenId) {
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

        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });

        let tokenOwner = await nftContract.ownerOf(tokenId);
        console.log(tokenOwner, accounts[0]);
        if (tokenOwner.toLowerCase() == accounts[0].toLowerCase()) {
          displayNft(true);
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
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

        try {
          const accounts = await ethereum.request({
            method: "eth_requestAccounts",
          });
          console.log("Found an account! Address: ", accounts[0]);
          console.log(
            "Nft balance: ",
            await nftContract.balanceOf(accounts[0])
          );
          let mycount = await nftContract.balanceOf(accounts[0]);
          setCount(Number(mycount));
          setCurrentAccount(accounts[0]);

          let nftTxList = await api.account.txlist(
            TOKEN_CONTRACT,
            1,
            "latest",
            "asc"
          );

          for (var i = 0; i < nftTxList.result.length; i++) {
            console.log(nftTxList.result[i]);
            if (
              nftTxList.result[i].from == currentAccount &&
              nftTxList.result[i].functionName == "safeMint(address to)" &&
              nftTxList.result[i].isError == "0"
            ) {
              // display minting tx to wallet
              //! step that retrieves the actual token id 0 still missing
              let logs, currentTokenId, tokenUri;
              var txReceipt = await web3.eth.getTransactionReceipt(
                nftTxList.result[i].hash
              );

              let transaction = txReceipt;
              logs = await transaction.logs;
              //   console.log("logs: ", logs);
              currentTokenId = await web3.utils.hexToNumber(logs[0].topics[3]);
              if (currentTokenId != undefined) {
                tokenUri = await nftContract.tokenURI(currentTokenId);
              }
              let tmp = await nftContract.baseTokenURI();
              setBaseUri(tmp);

              const newItem = {
                title: currentTokenId,
                img: tokenUri,
                // owner: currentAccount,
              };

              if (!tokenIds.includes(newItem)) {
                appendTokenId(newItem);
              }

              let myNewId = web3.utils.hexToNumber(logs[0].topics[3]);
              console.log(
                "Token ID: ",
                web3.utils.hexToNumber(logs[0].topics[3])
              );

              myIds.indexOf(myNewId) === -1
                ? myIds.push(myNewId)
                : console.log("This item already exists");
            }
          }

          console.log(tokenIds.length);
          setDisplayTransactions(true);
        } catch (err) {
          console.log(err);
        }
        //   //   console.log(nftTxList.result);
        //   isOwner(0);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const readProjNfts = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        const nftContract = new ethers.Contract(
          PROJECT_TOKEN,
          ProjectNftToken.abi,
          signer
        );

        try {
          const accounts = await ethereum.request({
            method: "eth_requestAccounts",
          });
          console.log("Found an account! Address: ", accounts[0]);
          console.log(
            "Nft balance: ",
            await nftContract.balanceOf(accounts[0])
          );
          let mycount = await nftContract.balanceOf(accounts[0]);
          setProjCount(Number(mycount));
          setCurrentAccount(accounts[0]);

          let nftTxList = await api.account.txlist(
            PROJECT_TOKEN,
            1,
            "latest",
            "asc"
          );

          const localGov = new ethers.Contract(
            PROJECT_GOV,
            projectGovContract.abi,
            signer
          );

          let isLoyal = await localGov.isLoyal(currentAccount);
          setLoyalOwner(isLoyal);
          console.log("is he/she loyal?", isLoyal);

          //   setDisplayTransactions(true);
        } catch (err) {
          console.log(err);
        }
        //   //   console.log(nftTxList.result);
        //   isOwner(0);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const imageHandler = () => {
    if (isLoyalOwner) {
      console.log("loyal owner detected");
      return (
        <div>
          This owner is a <b>loyal</b> Project DAO member.
          <img src={runningTap} alt="runningTap" width="106" />
        </div>
      ); // gif
    }
    console.log("loyal owner detected");
    return (
      <div text="coolTxt">
        Why don't you check out our{" "}
        <Link to="/ProjectProposals1" className="btn btn-primary">
          current votes?
        </Link>
        <img src={tap} alt="staticTap" width="106" />
      </div>
    ); // default image
  };

  useEffect(() => {
    checkWalletIsConnected();
    readNfts();
    readProjNfts();
  }, []);

  useEffect(() => {
    checkWalletIsConnected();
    readNfts();
    readProjNfts();
  }, [currentAccount, tokenIds]);

  function imgLink(image) {
    return `${baseUri}${image}.png`;
    // const name = prompt('What is your name?');
    // alert(`Hello ${name}, nice to see you!`);
  }

  if (!tokenIds) return null;

  return (
    <div className="profileTxt">
      <br></br>
      <br></br>
      <h1>Your Spring DAO NFT Portfolio</h1>
      {/* <br></br> */}
      <div>
        {/* <div>{currentAccount ? displayNfts() : readNfts()}</div> */}
        <br></br>
        <br></br>
        <p className="code">Account: {currentAccount}</p>
        <br></br>
        <h3>DAO Governance Genesis NFTs</h3>
        <div>
          {/* <script src="https://unpkg.com/embeddable-nfts/dist/nft-card.min.js"></script> */}
          {myIds && (
            <div>
              <img src={droplet} alt="nftgenesis" key="genesisNft" width="96" />
            </div>
          )}
          <p> Number of Genesis NFTs in your wallet:</p>{" "}
          <h2 className="profileTxt">{count}</h2>{" "}
          {/* if owns more than one - otherwise say you don't have any */}
          <div></div>
          <p>You own the following Token IDs</p>
          <ul className="nobull">
            {myIds.map((item, idx) => (
              <li key={idx}>
                <img src={droplet} alt={idx} key="genesisNft" width="26" />
                <b>{item}</b>
                {/* <nft-card
                contractAddress={TOKEN_CONTRACT}
                tokenId={item}
                network="rinkeby"
              ></nft-card>
              <script src="https://unpkg.com/embeddable-nfts/dist/nft-card.min.js"></script> */}
                {/* <img src={imgLink(item)} alt="nftimage" key={item} />
              {console.log(imgLink(item))} */}
              </li>
            ))}
          </ul>
        </div>

        {/* <button onClick={readNfts} className="cta-button mint-nft-button">
          Get the number of Genesis NFTs
        </button> */}
        {/* <br></br>
        <br></br> */}
        {/* <OpenSeaNfts /> */}
        <Divider />
        <br></br>
      </div>
      {/* {displayTransactions == true && ( */}
      <h3>Project NFT Portfolio</h3>

      <div>
        <div></div>
        <p> Number of Project NFTs in your wallet:</p>
        <h2 className="profileTxt">{projCount}</h2> <div></div>
        <br></br>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {projCount ? imageHandler() : null}
        </div>
        <br></br>
        <br></br>
      </div>
    </div>
  );
}

/* <nft-card
                    contractAddress={TOKEN_CONTRACT}
                    tokenId={item}
                    network="rinkeby"
                  ></nft-card> */

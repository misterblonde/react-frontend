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
import ProjectNftToken from "../Contracts/ProjectNftToken.json";
import projectGovContract from "../Contracts/ProjectGovernor.json";
import tap from "../img/tap.png";
import runningTap from "../img/runningTap.png";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";

import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
// import LocationOn from "@mui/material/LocationOn";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Switch from "@mui/material/Switch";
import Chip from "@mui/material/Chip";
import { useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import LocationOn from "@mui/icons-material/LocationOn";

import loyalGif from "../img/loyalOwner.gif";
const style = {
  width: "100%",
  maxWidth: 360,
  bgcolor: "background.paper",
};

function useForceUpdate() {
  const [value, setValue] = useState(0); // integer state
  return () => setValue((value) => value + 1); // update state to force render
  // An function that increment 👆🏻 the previous state like here
  // is better than directly setting `value + 1`
}

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
  const [isLoyalOwner, setLoyalOwner] = useState(null);
  const [showIds, setShowIds] = useState(false);
  const [projectNft, setProjectNft] = useState(null);
  const [currentLoyalty, setLoyalty] = useState(
    "You are currently not a loyal member."
  );
  const forceUpdate = useForceUpdate();

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

          //   let nftTxList = await api.account.txlist(
          //     PROJECT_TOKEN,
          //     1,
          //     "latest",
          //     "asc"
          //   );

          const localGov = new ethers.Contract(
            PROJECT_GOV,
            projectGovContract.abi,
            signer
          );

          let isLoyal = await localGov.isLoyal(accounts[0]);
          if (isLoyal) {
            setProjectNft(loyalGif);
          } else {
            setProjectNft(tap);
          }
          setLoyalOwner(isLoyal);
          console.log("HUHUUU is he/she loyal?", isLoyal);

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
      //   setProjectNft(loyalGif);
      setLoyalty("This owner is an active loyal Project DAO member.");

      return (
        <div text="coolTxt">
          This owner is a <b>loyal</b> Project DAO member.
        </div>
      ); // gif
    }
    setLoyalty("This owner is a passive Project DAO member.");
    return (
      <div text="coolTxt">
        {/* You are currently not a loyal Project DAO member.  */}
        This owner is currently <b>inactive</b>. Why don't you check out our{" "}
        <Link to="/ProjectProposals1" className="Button">
          current votes?
        </Link>
        {/* <img src={tap} alt="staticTap" width="106" /> */}
      </div>
    ); // default image
  };

  const showTokenIds = () => {
    readNfts();
    setShowIds(true);
    if (!myIds) return <div>You don't seem to have any NFTs yet.</div>;
    return (
      <ul className="nobull">
        {myIds.map((item, idx) => (
          <li key={idx}>
            <img src={droplet} alt={idx} key="genesisNft" width="26" />
            <b>{item}</b>
          </li>
        ))}
      </ul>
    );
  };

  //   useEffect(() => {
  //     const fetchData = async () => {
  //       await checkWalletIsConnected();
  //       await readNfts();
  //       const data = await readProjNfts();
  //     };

  //     fetchData();
  //   }, []);
  useEffect(() => {
    imageHandler();
  }, [projectNft]);

  useEffect(() => {
    const fetchData = async () => {
      await checkWalletIsConnected();
      await readNfts();
      const data = await readProjNfts();
      if (isLoyalOwner) {
        imageHandler();
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    checkWalletIsConnected();
    readNfts();
  }, [currentAccount, tokenIds]);

  function imgLink(image) {
    return `${baseUri}${image}.png`;
    // const name = prompt('What is your name?');
    // alert(`Hello ${name}, nice to see you!`);
  }

  if (!tokenIds) return null;

  if (projectNft == null) return;

  return (
    <div className="profileTxt">
      <br></br>
      <h1>Your Infrastructure DAO NFT Portfolio</h1>
      <br></br>
      <br></br>
      <Typography fontWeight={900}>Account: {currentAccount} </Typography>
      <br></br>
      <div>
        {/* <div>{currentAccount ? displayNfts() : readNfts()}</div> */}
        <Card>
          <Divider sx={{ borderBottomWidth: 5 }} />
          <Box sx={{ p: 4, display: "flex" }}>
            <Divider sx={{ borderBottomWidth: 5 }} />
            {/* <Avatar variant="rounded" src="../img/waterTap.jpg" /> */}
            <img src={droplet} alt="placeholder" key="tapNft" width="210" />
            <Stack spacing={0.5}>
              <Typography align="left" fontWeight={800}>
                Infrastructure DAO NFT Portfolio
              </Typography>
              <Typography fontWeight={500} align="left">
                Enables Owner to take part in general DAO Governance
              </Typography>
              <Typography align="left" variant="body2" color="text.secondary">
                <LocationOn sx={{ color: "#002884" }} /> Parent DAO level
              </Typography>
              <Typography align="left" variant="body1" color="text.secondary">
                VP: {count} <br></br>
                <Button
                  visible="false"
                  onClick={showTokenIds}
                  variant="outlined"
                >
                  Show Token IDs
                </Button>
                {showIds && (
                  <ul className="nobull">
                    {myIds.map((item, idx) => (
                      <li key={idx}>
                        <img
                          src={droplet}
                          alt={idx}
                          key="genesisNft"
                          width="26"
                        />
                        <b>{item}</b>
                      </li>
                    ))}
                  </ul>
                )}
              </Typography>
            </Stack>
          </Box>
          <Divider />
          {/* <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ px: 2, py: 1, bgcolor: "background.default" }}
          ></Stack> */}
        </Card>
        <Divider sx={{ borderBottomWidth: 5 }} />
        <Card>
          {projCount ? (
            <Box sx={{ p: 4, display: "flex" }}>
              {/* <Avatar variant="rounded" src="../img/waterTap.jpg" /> */}
              <img
                src={projectNft}
                align="left"
                alt="placeholder"
                key="tapNft"
                width="210"
              />
              <Stack spacing={0.5}>
                <Typography align="left" fontWeight={800}>
                  Project DAO NFT Portfolio
                </Typography>
                <Typography fontWeight={500} align="left">
                  Enables Owner to take part in the project-level DAO Governance
                </Typography>
                <Typography align="left" variant="body2" color="text.secondary">
                  <LocationOn sx={{ color: "#002884" }} /> Japineh, the Gambia
                </Typography>
                <Typography align="left" variant="body1" color="text.secondary">
                  VP: {projCount}
                </Typography>
                <Typography align="left" variant="body2" color="text.secondary">
                  {currentLoyalty}
                </Typography>
              </Stack>
            </Box>
          ) : (
            <div className="coolTxt">
              {" "}
              <p>You are not a member of a Project DAO.</p>
            </div>
          )}
          <Divider sx={{ borderBottomWidth: 5 }} />
        </Card>
        <Divider sx={{ borderBottomWidth: 5 }} />
        <br></br>
        <img src={projectNft} alt="runningTap" width="106" />
      </div>
    </div>
  );
}

{
  /* <h3>Project NFT Portfolio</h3>
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
    </div> */
}

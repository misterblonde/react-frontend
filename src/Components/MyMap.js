import React, { useRef, useState, useMemo, useEffect } from "react";
import { Link, Route, Routes } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import SimpleSnackbar from "../Components/SimpleSnackbar";
import { ethers } from "ethers";
import { Map, Marker, InfoWindow, Circle, CustomControl } from "./maps";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";

import Profile from "../Pages/Profile";
import About from "../Pages/About";
import Projects from "../Pages/Projects";
import ProjectProposals1 from "../Pages/ProjectProposals1";

// contract stuff
import { PROJECT_GOV, PROJECT_TOKEN } from "../contracts-config";
import MyProjectToken from "../Contracts/ProjectNftToken.json";
import ProjectGovernor from "../Contracts/ProjectGovernor.json";

// visuals
import "./styles.css";
import tapIcon from "../img/tapIcon.png";
import tapIconSecondSmallest from "../img/tapIconSecondSmallest.png";
import runningTap from "../img/runningTap.png";
import redTapIcon from "../img/redTapIcon.png";
import blueTapIcon from "../img/blueTapIcon.png";

const apiKey = "AIzaSyD6AUPIR0eIiGldIIo0b06uqLxlZDyQh-I";
const subDAOs = [
  {
    id: "1",
    projAddress: PROJECT_TOKEN,
    projAbi: MyProjectToken,
  },
];

export default function MyMap() {
  const center = useMemo(() => ({ lat: 13.47, lng: -15.49 }), []);
  const center2 = useMemo(() => ({ lat: 13.47, lng: -14.49 }), []);
  const imperial = useMemo(
    () => ({ lat: 51.498247854463976, lng: -0.1773782244885182 }),
    []
  );
  const markerPos = useMemo(() => ({ lat: 51.498, lng: -0.175 }), []);
  const centerZoom = useMemo(() => 9, []);
  const imperialZoom = useMemo(() => 16, []);
  const [currentCenter, setCenter] = useState(center);
  const [currentZoom, setZoom] = useState(centerZoom);
  const [infoWindow, displayInfoWindow] = useState(false);
  const [activeMarker, setActiveMarker] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const ref = useRef(null);
  const zoom = 4;
  const [animation, setAnimation] = useState("DROP");
  const [radius, setRadius] = useState(3000);
  const [snackbar, setSnackbarAlert] = useState(false);
  const [rejection, setRejection] = useState(false);
  const [minted, setMinted] = useState(false);
  const [txLink, setTxLink] = useState(null);
  const [currentAccount, setCurrentAccount] = useState(null);
  const [isSigner, setSigner] = useState(null);
  const [isBalance, setBalance] = useState(null);
  const [isBalance2, setBalance2] = useState(null);
  const navigate = useNavigate();
  //   const myMarkers = [
  //     <Marker
  //       id="0"
  //       position={center}
  //       icon={isMemberOfDAO("1")}
  //       animate={animation}
  //     >
  //       <InfoWindow content={projContent()}></InfoWindow>
  //     </Marker>,
  //     <Marker
  //       id="1"
  //       position={imperial}
  //       icon={redTapIcon}
  //       animate={animation}
  //     ></Marker>,
  //     <Marker
  //       id="2"
  //       position={center2}
  //       icon={redTapIcon}
  //       animate={animation}
  //       //   lat: -27.397,
  //       //   lng: 150.644,
  //     >
  //       <InfoWindow content={infoContent()}></InfoWindow>
  //     </Marker>,
  //   ];

  const changeCenterButton = () => {
    return (
      <FormControl>
        <Button
          sx={{ mt: 1, mr: 1 }}
          onClick={changeCenterHandler}
          type="recenter"
          variant="outlined"
        >
          Switch Center
        </Button>
        <br></br>
      </FormControl>
    );
  };

  //   const isMemberOfDAO = () => {};
  //   const isMemberOfDAOproj1 = async () => {
  //     // for (let idx = 0; idx < subDAOs.length; idx++) {
  //     //   if (idx == id) {
  //         const idx = 0;
  //         const projNftContract = new ethers.Contract(
  //           subDAOs[idx].projAddress,
  //           subDAOs[idx].projAbi.abi
  //         );
  //         let balance = await projNftContract.balanceOf(currentAccount);
  //         if (balance) {
  //            // var mymarker = document.getElementsByClassName("marker1");
  //           //   var mymarker = google.maps.Marker.getElementById(id);
  //           mymarker.setIcon(redTapIcon);
  //           return;
  //         }
  //       }
  //         // var mymarker = document.getElementsByClassName("marker1");
  //       //   var mymarker = google.maps.Marker.getElementById(id);
  //       mymarker.setIcon(redTapIcon);
  //       // Marker.setIcon(redTapIcon);
  //     }
  //   };

  const changeCenterHandler = () => {
    if (currentCenter.lat == center.lat) {
      console.log("setting the center");
      setCenter(imperial);
      setZoom(imperialZoom);
    } else {
      setCenter(center);
      setZoom(centerZoom);
    }
  };

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

  // gets called after component is re-rendered
  //   useEffect(() => {
  //     const getBalanceProj = async () => {
  //       let balance;
  //       const { ethereum } = window;

  //       if (ethereum) {
  //         const provider = new ethers.providers.Web3Provider(ethereum);
  //         const signer = provider.getSigner();

  //         const projNftContract = new ethers.Contract(
  //           PROJECT_TOKEN,
  //           MyProjectToken.abi,
  //           signer
  //         );

  //         if (!currentAccount) {
  //           checkWalletIsConnected();
  //         }
  //         balance = await projNftContract.balanceOf(currentAccount);
  //         console.log("Balance is: ", balance);
  //         setBalance(balance);
  //       }
  //       return parseInt(balance);
  //     };

  //     // callback to parent that set props
  //     getBalanceProj().catch(console.error);
  //   }, []);

  useEffect(() => {
    console.log("rerender");
  }, [currentCenter]);

  const infoContent = () => {
    return (
      <div>
        Water network for rural Alimaka
        <br />
        {/* Link to the Proposals Page of this SubDAO now.  */}
        <Button
          onClick={(e) => {
            animation ? setAnimation(null) : setAnimation("BOUNCE");
          }}
        >
          {" "}
          Bounce It
        </Button>
      </div>
    );
  };

  const mintHandler = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        setSigner(signer);

        const projNftContract = new ethers.Contract(
          PROJECT_TOKEN,
          MyProjectToken.abi,
          signer
        );
        // append to list of projects?

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

        let nftTxn = await projNftContract.safeMint(accounts[0], {
          value: number_estimate,
        });
        // });
        // 0.021 ether should be enough to mint the NFT (0.020 NFT price)

        console.log("Minting... please wait");
        await nftTxn.wait();
        console.log(nftTxn);
        // if (nftTxn.result.isError == "0") {
        setTxLink(nftTxn.hash);
        setSnackbarAlert(true);
        setMinted(true);
        // }
        console.log(
          `Minted, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`
        );
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

  const resetSnackbar = async () => {
    setSnackbarAlert(false);
    setRejection(false);
  };

  const navigateToProj = () => {
    // 👇️ navigate to /contacts
    navigate("/ProjectProposals1");
  };

  const projContent = (number) => {
    return (
      // ether show description or project question here, or proj ID?
      <div>
        <div className="infoTxt">
          {/* <Link to={"Projects"} style={{ textDecoration: "none" }}> */}
          {/* <b>Project No. 1</b> */}
          <Button visible="false" onClick={navigateToProj}>
            Project DAO No. 1
          </Button>
          {/* </Link> */}
        </div>
        Water network for rural Japineh
        {/* {number} */}
        {/* {item.projectQuestion} */}
        <br />
        {/* Link to the Proposals Page of this SubDAO now.  */}
        {
          <Button
            onClick={(e) => {
              mintHandler();
              // animation ? setAnimation(null) : setAnimation("BOUNCE");
            }}
          >
            Mint Project NFT
          </Button>
        }
        {/* {isBalance ? (
          <Button
            onClick={(e) => {
              voteHandler();
              // animation ? setAnimation(null) : setAnimation("BOUNCE");
            }}
          >
            Vote on Proposals
          </Button>
        ) : (
          <Button
            onClick={(e) => {
              mintHandler();
              // animation ? setAnimation(null) : setAnimation("BOUNCE");
            }}
          >
            Mint Project NFT
          </Button>
        )} */}
      </div>
    );
  };

  //   const boxContent = (number) => {
  //     return (
  //       // ether show description or project question here, or proj ID?
  //       <div>
  //         <div className="infoTxt">
  //           {/* <Link to={"Projects"} style={{ textDecoration: "none" }}> */}
  //           {/* <b>Project No. 1</b> */}
  //           <Button visible="false" onClick={navigateToProj}>
  //             Funds allocated to New Project DAO No. 2
  //           </Button>
  //           {/* </Link> */}
  //         </div>
  //         Water fountain on queens lawn
  //         {/* {number} */}
  //         {/* {item.projectQuestion} */}
  //         <br />
  //         {/* Link to the Proposals Page of this SubDAO now.  */}
  //         {
  //           <Button
  //             onClick={(e) => {
  //               mintHandler();
  //               // animation ? setAnimation(null) : setAnimation("BOUNCE");
  //             }}
  //           >
  //             Mint Project NFT
  //           </Button>
  //         }
  //         {/* {isBalance ? (
  //           <Button
  //             onClick={(e) => {
  //               voteHandler();
  //               // animation ? setAnimation(null) : setAnimation("BOUNCE");
  //             }}
  //           >
  //             Vote on Proposals
  //           </Button>
  //         ) : (
  //           <Button
  //             onClick={(e) => {
  //               mintHandler();
  //               // animation ? setAnimation(null) : setAnimation("BOUNCE");
  //             }}
  //           >
  //             Mint Project NFT
  //           </Button>
  //         )} */}
  //       </div>
  //     );
  //   };

  const projContent2 = (number) => {
    return (
      // ether show description or project question here, or proj ID?
      <div>
        <div className="infoTxt">
          <b>Project No. 2</b>
        </div>
        Water network for rural Alimaka
        {/* {number} */}
        {/* {item.projectQuestion} */}
        <br />
        {/* Link to the Proposals Page of this SubDAO now.  */}
        {1 == 0 ? (
          <Button
            onClick={(e) => {
              voteHandler();
              // animation ? setAnimation(null) : setAnimation("BOUNCE");
            }}
          >
            Vote on Proposals
          </Button>
        ) : (
          <Button
            onClick={(e) => {
              mintHandler();
              // animation ? setAnimation(null) : setAnimation("BOUNCE");
            }}
          >
            Mint Project NFT
          </Button>
        )}
      </div>
    );
  };

  const voteHandler = () => {};
  const newFountain = () => {
    console.log("want more water?");
  };

  return (
    <>
      <div>
        {changeCenterButton()}
        <br></br>
        <Divider />
        <Map
          id="map"
          apiKey={apiKey}
          center={currentCenter}
          zoom={currentZoom}
          mapContainerClassName="map-container"
          onClick={newFountain}
        >
          {/* {myMarkers.map((item, idx) => ({ item }))} */}
          <Marker
            id="1"
            position={imperial}
            icon={redTapIcon}
            animate={animation}
          >
            {/* <InfoWindow content={boxContent()}></InfoWindow> */}
          </Marker>
          {/* <Marker
            id="2"
            position={center2}
            icon={redTapIcon}
            animate={animation}
            //   lat: -27.397,
            //   lng: 150.644,
          >
            <InfoWindow content={infoContent()}></InfoWindow>
          </Marker> */}
          <Marker
            id="0"
            position={center}
            icon={blueTapIcon}
            //{isMemberOfDAO("this.id")}
            // "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png"
            animate={animation}
          >
            <InfoWindow content={projContent()}></InfoWindow>
          </Marker>
          <Circle
            strokeColor="#FF0000"
            strokeOpacity={0.8}
            strokeWeight={1}
            fillColor="#FFFF00"
            fillOpacity={0.35}
            editable={true}
            draggable={false}
            center={{
              lat: -32.397,
              lng: 140.644,
            }}
            radius={radius}
            onRadiusChange={(e) => setRadius(e)}
            onCenterChange={(e) => console.log(e)}
          ></Circle>
          {/* <CustomControl position="TOP_CENTER">{infoContent()}</CustomControl> */}
          {snackbar && minted ? <SimpleSnackbar name="successfulMint" /> : null}
        </Map>
        <Routes>
          <Route path={`/Projects`} component={<Projects />} />
          <Route path={`/About`} component={<About />} />
          <Route path={`/Profile`} component={<Profile />} />
        </Routes>
      </div>
    </>
  );
}

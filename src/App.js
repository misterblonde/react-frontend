import logo from "./logo.svg";
import "./App.css";

import { Route, Routes } from "react-router";
import { Link, Router } from "react-router-dom";
import { Component } from "react";

import ResponsiveAppBar from "./Navigation/ResponsiveAppBar";
import Home from "./Pages/Home";
import About from "./Pages/About";
import HowTo from "./Pages/HowTo";
import Projects from "./Pages/Projects";
import Profile from "./Pages/Profile";
// import Projects from "./Pages/Projects";
import Logout from "./Pages/Logout";
import Vote from "./Pages/Vote";

import SubmitVoteSimple from "./Pages/SubmitVoteSimple";
import SubmitVoteAllIn from "./Pages/SubmitVoteAllIn";
import SubmitVote from "./Pages/SubmitVote";
import Results from "./Pages/Results";
import SubmitVoteQuadratic from "./Pages/SubmitVoteQuadratic";

import ProjectProposals1 from "./Pages/ProjectProposals1";
import ProjectResults from "./Pages/ProjectResults";
import ProjectProposalSubmission from "./Components/ProjectProposalSubmission";
import ProjectSimpleVote from "./Pages/ProjectSimpleVote";
import ProjectQuadraticVote from "./Pages/ProjectQuadraticVote";
class AppClassComponent extends Component {
  //   state = { users: [] };
  //   componentDidMount() {
  //     fetch("/users")
  //       .then((res) => res.json())
  //       .then((users) => this.setState({ users }));
  //   }
  //     const checkWalletIsConnected = async () => {
  //     const { ethereum } = window;

  //     if (!ethereum) {
  //       console.log("Make sure you have Metamask installed!");
  //       return;
  //     } else {
  //       console.log("Wallet exists! We're ready to go!");
  //     }

  //     const accounts = await ethereum.request({ method: "eth_accounts" });

  //     if (accounts.length !== 0) {
  //       const account = accounts[0];
  //       console.log("Found an authorized account: ", account);
  //       setCurrentAccount(account);
  //     } else {
  //       console.log("No authorized account found");
  //     }
  //   };

  render() {
    return (
      <div className="App">
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        <script src="https://unpkg.com/embeddable-nfts/dist/nft-card.min.js"></script>
        <script src="bower_components/abi-decoder/dist/abi-decoder.js"></script>
        <ResponsiveAppBar />
        <Routes>
          {/* <Link to="/users">Users</Link> */}
          <Route path="/" element={<Home />} />
          <Route path="About" element={<About />} />
          <Route path="Projects" element={<Projects />} />
          {/* <Route path="Projects" element={<Projects />} /> */}
          <Route path="HowTo" element={<HowTo />} />
          <Route path="Profile" element={<Profile />} />
          <Route path="Vote" element={<Vote />} />;
          <Route path="Logout" element={<Logout />} />
          <Route path="ProjectProposals1" element={<ProjectProposals1 />} />
          {/* <Route exact path="SubmitVoteID" element={<SubmitVoteID />} /> */}
          <Route path="SubmitVote/:proposalId" element={<SubmitVote />} />
          <Route
            path="ProjectQuadraticVote/:proposalId"
            element={<ProjectQuadraticVote />}
          />
          <Route
            path="SubmitVoteQuadratic/:proposalId"
            element={<SubmitVoteQuadratic />}
          />
          {/* <Route
            path="ProjectSimpleVote/:proposalId"
            element={<ProjectSimpleVote />}
          /> */}
          <Route
            path="SubmitVoteSimple/:proposalId"
            element={<SubmitVoteSimple />}
          />
          <Route
            path="ProjectSimpleVote/:proposalId"
            element={<ProjectSimpleVote />}
          />
          <Route
            path="SubmitVoteAllIn/:proposalId"
            element={<SubmitVoteAllIn />}
          />
          <Route
            path="ProjectResults/:proposalId"
            element={<ProjectResults />}
          />
          <Route path="Results/:proposalId" element={<Results />} />
          {/* <Route exact path="/users" component={<Upcoming />} /> */}
          {/* <Route path="SubmitVoteID" element={<SubmitVoteID />} /> */}
          <Route
            path="ProjectProposalSubmission"
            element={<ProjectProposalSubmission />}
          />
        </Routes>

        {/* <Router>
          <Route exact path="SubmitVoteID" component={<SubmitVoteID />} />
        </Router> */}
      </div>
    );
  }
}

export default AppClassComponent;

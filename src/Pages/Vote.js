import React, { Component } from "react";
import { ethers } from "ethers";
import { Link } from "react-router-dom";

import "./proposals.css";
import govContract from "../Contracts/MyGovernor.json";
import boxContract from "../Contracts/Box.json";
import {
  BOX_CONTRACT,
  GOV_CONTRACT,
  HELPER_CONTRACT,
  BACKEND,
} from "../contracts-config";

import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import ListItem from "@mui/material/ListItem";
import { Route, Routes } from "react-router";
import About from "./About";
import Profile from "./Profile";
import Queue from "./Queue";
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

// ______________________ Govenor FUNCTIONALITY __________________

// - gets proposal votes (voting results)
// - gets proposal states

//TODO Nice to have
//  governor get balance, voting period,

//! Todo
//  queue, execute
//  admin person: deploy new contract
// local governor functionality,
// freeze everything
//  show auto-deployment of new contract: new box address appears with image

// // ______________________ TOKEN FUNCTIONALITY __________________
// // token functionality
// // delegate votes
// // get num votes
// // mint

// // get num votes
// // console.log(
// //     "Votes Delegated to Gov: ",
// //     await this.token.getVotes(this.signers.admin.address) //, blockNum)
// //   );
// // await this.token.balanceOf(this.signers.admin.address)

// // local tokens functionality
// // admin person set whitelist,
// // mint white list mint normal

function renderDifferently(value, idx, proposalId, proposalQuestion) {
  if (value === 0) {
    return <li key={idx}>Voting starts very soon.</li>;
  }
  if (value === 1) {
    return (
      <div>
        <Link
          to={`../SubmitVote/${proposalId}`}
          state={{ proposalQuestion: proposalQuestion }}
          style={{ textDecoration: "none" }}
        >
          <Button
            sx={{ mt: 1, mr: 1 }}
            type="submit vote now"
            variant="outlined"
            className="hiddenlinkbutton"
          >
            Vote <br></br>
            (1 Token = 1 Vote)
          </Button>
        </Link>
        <Link
          to={`../SubmitVoteQuadratic/${proposalId}`}
          state={{ proposalQuestion: proposalQuestion }}
          style={{ textDecoration: "none" }}
        >
          <Button
            sx={{ mt: 1, mr: 1 }}
            type="submit vote now"
            variant="outlined"
            className="hiddenlinkbutton"
          >
            Vote <br></br>(1 Token = 1 Vote, quadratic cost)
          </Button>
        </Link>
        <Link
          to={`../SubmitVoteSimple/${proposalId}`}
          state={{ proposalQuestion: proposalQuestion }}
          style={{ textDecoration: "none" }}
        >
          <Button
            sx={{ mt: 1, mr: 1 }}
            type="submit vote now"
            variant="outlined"
            className="hiddenlinkbutton"
          >
            Vote <br></br>(1 address = 1 Vote)
          </Button>
        </Link>
      </div>
    );
  }
  return (
    <div>
      <Link
        to={`../Results/${proposalId}`}
        state={{ proposalQuestion: proposalQuestion }}
        style={{ textDecoration: "none" }}
        // to={{
        //   pathname: `../SubmitVote/${proposalId}`,
        //   state: { proposalQuestion: ${proposalQuestion} ,
        // }}
      >
        <Button
          sx={{ mt: 1, mr: 1 }}
          type="results"
          className="hiddenlinkbutton"
          variant="outlined"
        >
          See Results
        </Button>
      </Link>
    </div>
  );
}

function showOutcome(status) {
  if (status === 0) {
    return (
      <div className="proposal__content__description__details__tag__wide proposal__content__description__details__tag--pending">
        Upcoming
      </div>
    );
  }
  if (status === 1) {
    return (
      <div className="proposal__content__description__details__tag proposal__content__description__details__tag--active">
        Active
      </div>
    );
  }
  if (status === 2) {
    return (
      <div className="proposal__content__description__details__tag proposal__content__description__details__tag--active">
        Canceled
      </div>
    );
  }
  if (status === 3) {
    return (
      <div className="proposal__content__description__details__tag proposal__content__description__details__tag--not-passed failedStyle">
        Failed
      </div>
    );
  }

  if (status === 4) {
    return (
      <div className="proposal__content__description__details__tag proposal__content__description__details__tag--passed mystyle">
        Passed
      </div>
    );
  }
  if (status === 5) {
    return (
      <div className="proposal__content__description__details__tag proposal__content__description__details__tag--active">
        Queued
      </div>
    );
  }
  if (status === 6) {
    return (
      <div className="proposal__content__description__details__tag proposal__content__description__details__tag--active">
        Expired
      </div>
    );
  }
  if (status === 7) {
    return (
      <div className="proposal__content__description__details__tag proposal__content__description__details__tag--active">
        Executed
      </div>
    );
  }
}

class Vote extends Component {
  constructor() {
    super();
    this.state = {
      users: [],
      isLoaded: false,
      states: [],
      selectedIndex: null,
      expand: false,
    };
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }
  componentDidMount() {
    try {
      fetch(`${BACKEND}/users`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
        .then((res) => res.json())
        .then((users) => {
          console.log("Users inside promise", users);
          let event = this.setState(
            {
              users: users,
              isLoaded: true,
              states: [],
            },
            this.displayActiveProposals
            // (event) => this.displayActiveProposals(event)
          );
        });
      // .then((event) => {
      //   this.displayActiveProposals(event);
      //   console.log("states after diplay proposals: ", this.state.states);
      //   this.interval = setInterval(
      //     () => this.setState({ time: Date.now() }),
      //     1000
      //   );
      //   return;
      // });
      console.log("refreshing page");
      //   this.getGovernorBalance();
    } catch (err) {
      console.log(err);
    }
  }

  displayActiveProposals = async (event, value) => {
    try {
      // executes before props.users have loaded
      let mystates = [];
      let currentEntry;
      let obj;
      for (var i = this.state.users.length - 1; i >= 0; i--) {
        currentEntry = this.state.users[i].proposalId;
        obj = this.getProposalState.bind(this, currentEntry);
        mystates[i] = await obj();
      }
      this.setState({ states: mystates });
    } catch (err) {
      console.log(err);
    }
  };

  async getProposalState(currentEntry) {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const smartContract = new ethers.Contract(
          GOV_CONTRACT,
          govContract.abi,
          provider
        );
        try {
          console.log("Proposal ID:", this.props.currentEntry);
          const proposalAsUint = ethers.BigNumber.from(currentEntry);
          let propState = await smartContract.state(proposalAsUint);
          console.log("Proposal State is", propState, "item: ", currentEntry);

          return propState;
        } catch (err) {
          console.log(err);
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  returnString = (idx, proposalQ, budget) => {
    return `Proposal ${idx + 1}: ${proposalQ} (${budget} WEI)`;
  };
  // class="proposal__content__description__details__text proposal__content__description__details__text"><span>114</span><span>•</span><span>Canceled July 29th, 2022</span></div></div>)
  moreDetails = () => {
    if (this.state.expand) {
      return <div>More detalles aqui</div>;
    }
  };

  handleListItemClick = (event, index) => {
    this.setState({ selectedIndex: index, expand: true });
  };

  executeGetBox = async (idx) => {
    if (this.state.states[idx] < 7) return <div></div>;
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();

      const smartContract = new ethers.Contract(
        GOV_CONTRACT,
        govContract.abi,
        signer
      );
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      const boxAddress = await smartContract.getChildBoxAddress(
        this.state.users[idx].proposalId
      );
      console.log(boxAddress);
      return <div>The new project DAO was deployed to: {boxAddress}</div>;
    }
  };

  executeHandler = async (idx) => {
    // if (this.state.states[idx] >= 5)
    //   return <div>Proposal has already been queued</div>;

    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();

      const smartContract = new ethers.Contract(
        GOV_CONTRACT,
        govContract.abi,
        signer
      );
      const thebox = new ethers.Contract(BOX_CONTRACT, boxContract.abi, signer);
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      try {
        const functionToCall = "store";
        const args = [7];

        const encodedFunctionCall = thebox.interface.encodeFunctionData(
          functionToCall,
          args
        );
        const questionHash = ethers.utils.id(
          this.state.users[idx].proposalQuestion
        );

        require("../Contracts/BoxLocal.sol");
        const proposalHash = ethers.utils.id(this.state.users[idx].proposalId);
        const exeTx = await smartContract.execute(
          [BOX_CONTRACT],
          [0],
          [encodedFunctionCall],
          questionHash
        );
        const Receipt = await exeTx.wait(1);
        console.log("Execution Receipt ", Receipt);

        // generate helper contract object
        // const helperContract = new ethers.Contract(
        //     HELPER_CONTRACT,
        //     helperContract.abi,
        //     signer
        //   );

        // // now retrieve the new box address:
        // let newboxaddress = helperContract.getTokenAddress(proposalAsUint);

        // // store box address in backend

        // console.log("New box deployed at: ", newboxaddress);

        this.getGovernorBalance();
        await this.executeGetBox(idx);
      } catch (error) {
        if (error.code === 4001) {
          // EIP-1193 userRejectedRequest error
          console.log(error.reason);
        }
        console.log(error);
      }
    } else {
      console.log("Ethereum object does not exist");
    }
  };

  cancelHandler = async (idx) => {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();

      const smartContract = new ethers.Contract(
        GOV_CONTRACT,
        govContract.abi,
        signer
      );
      const thebox = new ethers.Contract(BOX_CONTRACT, boxContract.abi, signer);
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      try {
        const functionToCall = "store";
        const args = [7];

        const encodedFunctionCall = thebox.interface.encodeFunctionData(
          functionToCall,
          args
        );
        const questionHash = ethers.utils.id(
          this.state.users[idx].proposalQuestion
        );

        require("../Contracts/BoxLocal.sol");
        const proposalHash = ethers.utils.id(this.state.users[idx].proposalId);
        const exeTx = await smartContract.cancel(
          [BOX_CONTRACT],
          [0],
          [encodedFunctionCall],
          questionHash
        );
        const Receipt = await exeTx.wait(1);
        console.log("Cancel Receipt ", Receipt);
      } catch (error) {
        if (error.code === 4001) {
          // EIP-1193 userRejectedRequest error
          console.log(error.reason);
        }
        console.log(error);
      }
    } else {
      console.log("Ethereum object does not exist");
    }
  };

  getGovernorBalance = async () => {
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const balanceOld = await provider.getBalance(GOV_CONTRACT);
    console.log("Governor balance: ", ethers.utils.formatEther(balanceOld));

    const helperBalanceOld = await provider.getBalance(HELPER_CONTRACT);
    console.log(
      "Governor Helper balance: ",
      ethers.utils.formatEther(helperBalanceOld)
    );
  };

  queueHandler = async (idx) => {
    if (this.state.states[idx] >= 5)
      return <div>Proposal has already been queued</div>;

    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();

      const smartContract = new ethers.Contract(
        GOV_CONTRACT,
        govContract.abi,
        signer
      );
      const thebox = new ethers.Contract(BOX_CONTRACT, boxContract.abi, signer);
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      try {
        const functionToCall = "store";
        const args = [7];

        const encodedFunctionCall = thebox.interface.encodeFunctionData(
          functionToCall,
          args
        );
        const questionHash = ethers.utils.id(
          this.state.users[idx].proposalQuestion
        );

        const proposalHash = ethers.utils.id(this.state.users[idx].proposalId);
        const queueTx = await smartContract.queue(
          [BOX_CONTRACT],
          [0],
          [encodedFunctionCall],
          questionHash
        );
        const Receipt = await queueTx.wait(1);
        console.log("Queueing Receipt ", Receipt);
      } catch (error) {
        if (error.code === 4001) {
          // EIP-1193 userRejectedRequest error
          console.log(error.reason);
        }
        console.log(error);
      }
    } else {
      console.log("Ethereum object does not exist");
    }
  };

  copyToClipboard = (e) => {
    this.textArea.select();
    document.execCommand("copy");
    // This is just personal preference.
    // I prefer to not show the whole text area selected.
    e.target.focus();
    this.setState({ copySuccess: "Copied!" });
  };

  //   smthChanging() {
  //     this.setState({
  //       user: Meteor.user(),
  //     });
  //   }
  refreshPage = () => {
    window.location.reload();
  };

  render() {
    // const { user } = this.state;
    // const {users} = this.state.users;
    // if (!this.state.states) {this.displayActiveProposals(); }
    console.log("this.state.states ", this.state.states);
    console.log("this.state.users ", this.state.users);
    return (
      <div>
        <Box>
          <h1 className="proposalHeadline"> All Spring DAO Proposals </h1>
          <Divider />
          <Button onClick={this.refreshPage} variant="outlined">
            Refresh
          </Button>
          <List component="nav" aria-label="secondary mailbox folder">
            {this.state.users
              // .slice(0)
              // .reverse()
              .map((item, idx) => (
                <ListItem key={idx} alignItems="flex-start">
                  <ListItemButton selected={this.state.selectedIndex === idx}>
                    <ListItemIcon>
                      {renderDifferently(
                        this.state.states[idx],
                        idx,
                        item.proposalId,
                        item.proposalQuestion
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.proposalQuestion}
                      sx={{ display: "inline" }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                      secondary={
                        <React.Fragment>
                          <Typography
                            sx={{ display: "inline" }}
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            {/* <button
                            onClick={this.copyToClipboard}
                            // () => {
                            //   navigator.clipboard.writeText(
                            //     this.state.textToCopy
                            //   );
                            // }
                            // }
                          >
                            <textarea
                              ref={(textarea) => (this.textArea = textarea)}
                              value={item.proposalId}
                            />
                          </button> */}

                            {this.returnString.bind(
                              this,
                              idx,
                              item.proposalQuestion,
                              item.budget
                            )}
                          </Typography>
                        </React.Fragment>
                      }
                    />
                    {this.state.states[idx] != 7 &&
                      this.state.states[idx] != 3 && (
                        <Button
                          //   color={"grey" : "pink"}
                          sx={{ mt: 1, mr: 1 }}
                          onClick={() => this.cancelHandler(idx)}
                          type="execute proposal"
                          variant="outlined"
                        >
                          {" "}
                          Cancel{" "}
                        </Button>
                      )}
                    {this.state.states[idx] === 4 && (
                      <Button
                        //   color={"grey" : "pink"}
                        sx={{ mt: 1, mr: 1 }}
                        onClick={() => this.queueHandler(idx)}
                        type="queue proposal"
                        variant="outlined"
                      >
                        {" "}
                        Queue{" "}
                      </Button>
                    )}
                    {this.state.states[idx] === 5 && (
                      <Button
                        //   color={"grey" : "pink"}
                        sx={{ mt: 1, mr: 1 }}
                        onClick={() => this.executeHandler(idx)}
                        type="execute proposal"
                        variant="outlined"
                      >
                        {" "}
                        Execute{" "}
                      </Button>
                    )}
                    {/* {this.moreDetails.bind(this)} */}
                    {/* <ListItemIcon>
                    {this.state.states[idx] == 4 ? (
                      <div>
                        <Queue
                          proposalId={this.state.users[idx].proposalId}
                          proposalQuestion={
                            this.state.users[idx].proposalQuestion
                          }
                        />
                      </div>
                    ) : null}
                  </ListItemIcon> */}
                    <ListItemIcon>
                      {showOutcome(this.state.states[idx])}
                    </ListItemIcon>
                  </ListItemButton>
                </ListItem>
              ))}
          </List>
        </Box>
        <Routes>
          <Route path={`/About`} component={<About />} />
          <Route path={`/Profile`} component={<Profile />} />
        </Routes>
      </div>
    );
  }
}

export default Vote;

/* // <li key={item.txHash}>
            //   <b>
            //     Proposal {idx + 1}: {item.proposalQuestion} ({item.budget} WEI)
            //   </b>{" "}
            //   {showOutcome(this.state.states[idx])}
            //   <div>
            //     <i>Description:</i>
            //     {item.proposalDescription}
            //     {item.proposalDescription}
            //     {renderDifferently(
            //       this.state.states[idx],
            //       idx,
            //       item.proposalId,
            //       item.proposalQuestion
            //     )}
            //   </div> */

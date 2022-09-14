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

import Notify from "./Notify";
import SimpleSnackbar from "../Components/SimpleSnackbar";
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
            Vote (1 Token = 1 VP)
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
            QC Vote (1 Token = 1 VP)
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
            Vote (1 address = 1 VP)
          </Button>
        </Link>
      </div>
    );
  }
  if (value > 2) {
    if (value == 7) {
      return (
        <div>
          <Link
            to={`../Results/${proposalId}`}
            state={{ proposalQuestion: proposalQuestion }}
            style={{ textDecoration: "none" }}
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
          {/* <SimpleSnackbar name="newBoxDeployed" newBox={this.state.newBox} /> */}
          {/* <Link
            to={{
              pathname: `https://rinkeby.etherscan.io/address/${this.state.newDAOs[idx].boxAddress}`,
            }}
          >
            <Button
              sx={{ mt: 1, mr: 1 }}
              type="results"
              className="hiddenlinkbutton"
              variant="outlined"
            >
              Funds Deposited
            </Button>
          </Link> */}
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
  return <div></div>;
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

function notifyUser(param, optionalArg = "undefined") {
  if (param == "queue") {
    return <SimpleSnackbar name="queue" />;
  }

  if (param === "execute") {
    return <SimpleSnackbar name="execute" optionalArg={optionalArg} />;
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
      isQueued: false,
      isExecuted: false,
      isClicked: false,
      snackbarCount: 0,
      newDAOs: [],
      executionOrder: [],
      newBox: [],
    };
    this.displayActiveProposals = this.displayActiveProposals.bind(this);
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
            }
            // (event) => this.displayActiveProposals(event)
          );
          setInterval(this.displayActiveProposals, 5000);
          setInterval(this.resetSnackbar, 10000);
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

  //   showMatchingBox = (idx) => {
  //     for (let i = 0; i < this.state.executionOrder.length; i++) {
  //       if (this.state.executionOrder[i] == this.state.users[idx].proposalId) {
  //         console.log("Matching box address found for proposal. ");
  //         this.state.newDAOs.splice(idx, 0, item);
  //         return <div>Box deployed to {this.state.newDAOs[i]}</div>;
  //       }
  //     }
  //   };

  //   showBoxAddress = (boxAddress) => {
  //     return <div>boxAddress</div>;
  //   };

  displayActiveProposals = async (event, value) => {
    try {
      // executes before props.users have loaded
      let mystates = [];
      let myboxes = [];
      let currentEntry;
      let obj;
      for (var i = this.state.users.length - 1; i >= 0; i--) {
        currentEntry = this.state.users[i].proposalId;
        obj = this.getProposalState.bind(this, currentEntry);
        mystates[i] = await obj();

        if (mystates[i] == 7) {
          let newBoxAddress = await this.executeGetBox.bind(this, i);
          myboxes[i] = await newBoxAddress();
        } else {
          myboxes[i] = null;
        }
      }
      this.setState({ states: mystates, isClicked: false, newDAOs: myboxes });
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

          //   for (let i=0; i< this.state.users.length; i++){
          //     if (this.props.currentEntry == this.state.users[idx].proposalId){
          //         this.setState({ states[idx] : propState });
          //         break;
          //     }
          //   }

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
      return boxAddress;
    }
  };

  resetSnackbar = async () => {
    this.setState({ isQueued: false, isExecuted: false });
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

        // // now retrieve the new box address:
        const proposalAsUint = ethers.BigNumber.from(
          this.state.users[idx].proposalId
        );
        let newboxAddress = await smartContract.getChildBoxAddress(
          proposalAsUint
        );

        // // store box address in backend

        console.log("New box deployed at: ", newboxAddress);

        this.state.newDAOs.splice(idx, 0, newboxAddress);
        // this.setState({
        //   newDAOs: [...this.state.newDAOs, newboxAddress],
        // });
        // this.setState({
        //   executionOrder: [
        //     ...this.state.executionOrder,
        //     this.state.users[idx].proposalId,
        //   ],
        // });
        // this.setState({ newDAOs: newboxAddress });
        // const newBox = {
        //   proposalId: this.state.users.proposalId,
        //   boxAddress: newboxAddress,
        // };

        // let copyFoo = { ...this.state.newDAOs }; //create a new copy
        // copyFoo.bar = { boxAddress: newboxAddress }; //change the value of bar
        // this.setState({ foo: copyFoo }); //write it back to state

        // console.log("box addressed stored in state: ", newDAOs[idx]);
        //this.setState(prevState => ({expenses: [...prevState.expenses, newExpense]}))

        // this.setState(newDAOs);
        // notifyUser("execute", newboxAddress);
        // return Notify("execute", newboxAddress);
        console.log(`execute ${newboxAddress}`);

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
        this.setState({ isQueued: true, isClicked: true });
        notifyUser("queue");
        return Notify("queue", "undefined");
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
    // this.setState({ isQueued: false, isClicked: false });
  };

  //   checkStates = () => {
  //     if(this.state.states[idx] === 5){}}

  componentDidUpdate(prevProps, prevState) {
    console.log("Prev state", prevState); // Before update
    console.log("New state", this.state); // After update
  }

  refreshState = (idx) =>
    this.setState({ showHiddenPassword: !this.state.showHiddenPassword });

  //   copyToClipboard = (e) => {
  //     this.textArea.select();
  //     document.execCommand("copy");
  //     // This is just personal preference.
  //     // I prefer to not show the whole text area selected.
  //     e.target.focus();
  //     this.setState({ copySuccess: "Copied!" });
  //   };

  refreshPage = () => {
    window.location.reload();
  };

  render() {
    const { showState } = this.state;
    console.log("this.state.states ", this.state.states);
    console.log("this.state.users ", this.state.users);
    const { isQueued } = this.state.isQueued;
    const { isExecuted } = this.state.isExecuted;
    const { isClicked } = this.state.isClicked;
    return (
      <div>
        <Box>
          <br></br>
          <br></br>
          <h1 className="proposalHeadline">
            {" "}
            All Infrastructure DAO Proposals{" "}
          </h1>
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
                            <b>Budget (Gwei): </b> {item.budget}
                            {this.state.states[idx] == 7 && (
                              <div>
                                <b>Box Address:</b>
                                <Link
                                  to={{
                                    pathname: `https://rinkeby.etherscan.io/address/${this.state.newDAOs[idx]}`,
                                  }}
                                  style={{ textDecoration: "none" }}
                                  target="_blank"
                                >
                                  {this.state.newDAOs[idx]}
                                </Link>
                              </div>
                            )}
                            {/* <button
                                      // }this.state.newDAOs[idx]}
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
                    <ListItemIcon>
                      {renderDifferently(
                        this.state.states[idx],
                        idx,
                        item.proposalId,
                        item.proposalQuestion
                      )}
                    </ListItemIcon>

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
                    {/* {this.state.states[idx] === 7 &&
                      this.showMatchingBox.bind(this, idx)} */}
                    {/* {this.state.executionOrder.map(listitem, listidx) => (
                        (listitem == this.state.users[idx].proposalId) && <div>this.state.newDAOs[listidx]</div> )
                    } */}

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
          {/* return this.state.orders ? (
      <div>
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          open={open}
          onClose={this.handleClose}
          message="order confirmed"
          autoHideDuration={2000}
        ></Snackbar> */}
          {isExecuted && isClicked ? (
            <SimpleSnackbar name="execute" optionalArg="test" />
          ) : null}
          {isQueued && isClicked ? <SimpleSnackbar name="queue" /> : null}
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

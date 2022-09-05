import React, { Component } from "react";
import { ethers } from "ethers";
import govContract from "../Contracts/MyGovernor.json";
// import SubmitVoteID from "../Components/SubmitVoteID";
import { GOV_CONTRACT } from "../contracts-config";
import "./proposals.css";
import { Link } from "react-router-dom";
// // 0 Pending
// // __________
// // 1 Active
// // __________
// // 2 Canceled
// // 3 Defeated
// // 4 Succeeded
// // __________
// // 5 Queued
// // 6 Expired (???)
// // 7 Executed

// ______________________ Govenor FUNCTIONALITY __________________
// // Get proposal outcome by:
// // const votingResults = await this.governor.proposalVotes(
// //     this.proposalId.toString()
// //   );

// //get proposal state:
// //   console.log(
// //     "State (before blocks moved):",
// //     await this.governor.state(proposalIdInput)
// //   );

// // governor get balance, voting period,
// // castVotes, propose, queue, execute

// // admin person: deploy new contract

// // local governor functionality,
// // freeze everything

// // show auto-deployment of new contract: new box address appears with image

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
        {/* <Link to="/SubmitVoteID" className="SubmitVoteID">
          Submit Vote
        </Link> */}
        <Link to={`../SubmitVote/${proposalId}`}>Submit Vote</Link>
      </div>
    );
  }
  return (
    <div>
      Vote is closed babe
      <Link
        to={{
          pathname: `../SubmitVote/${proposalId}`,
          //   proposalQuestion: { proposalQuestion },
          //   },
        }}
      >
        Submit Vote
      </Link>
      {/* <li key={idx}>Votes are already closed (Proposal Id: {proposalId})</li> */}
    </div>
  );
}

/* <SubmitVote /> */
/* <SubmitVoteID proposalId={proposalId} question={proposalQuestion} /> */

function showOutcome(status) {
  if (status === 3) {
    return (
      <div className="proposal__content__description__details__tag proposal__content__description__details__tag--not-passed">
        Failed
      </div>
    );
  }

  if (status === 4) {
    return (
      <div className="proposal__content__description__details__tag proposal__content__description__details__tag--passed">
        Passed
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
}

class Vote extends Component {
  constructor() {
    super();
    this.state = { users: [], isLoaded: false, states: [] };
  }

  componentDidMount() {
    try {
      fetch("http://www.localhost:3001/users", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
        .then((res) => res.json())
        .then((users) => {
          this.setState({ users: users, isLoaded: true, states: [] });
        })
        .then((event) => {
          this.displayActiveProposals(event);
          return;
        });
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
      for (var i = 0; i < this.state.users.length; i++) {
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
          //   console.log(this.props.currentEntry);
          const proposalAsUint = ethers.BigNumber.from(currentEntry);
          let propState = await smartContract.state(proposalAsUint);
          console.log("Proposal State is", propState);

          return propState;
        } catch (err) {
          console.log(err);
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  // class="proposal__content__description__details__text proposal__content__description__details__text"><span>114</span><span>•</span><span>Canceled July 29th, 2022</span></div></div>)

  render() {
    return (
      <div>
        <h1> Vote on Active Proposals </h1>
        <ul align="left">
          {this.state.users.map((item, idx) => (
            <li key={item.txHash}>
              <b>Proposal</b> {item.txHash} {item.proposalId}:
              {showOutcome(this.state.states[idx])}
            </li>
          ))}
        </ul>
        <ul>
          {this.state.states.map((item, idx) => (
            <li key={idx}>
              {/* {idx} {item} */}
              {/* {this.state.users[idx]} give proposal question here */}
              {renderDifferently(
                item,
                idx,
                this.state.users[idx].proposalId,
                "Pizza for dinner?"
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default Vote;

import * as React from "react";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useState, useEffect } from "react";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import { withStyles } from "@material-ui/core/styles";
import ReactDOM from "react-dom";
import { callbackify } from "util";
import { SnackbarProvider } from "notistack";

const styles = {
  snackbarStyleViaContentProps: {
    backgroundColor: "orange",
  },
  snackbarStyleViaNestedContent: {
    backgroundColor: "lightgreen",
    color: "black",
  },
};

export default function SimpleSnackbar(
  props,
  { resetSnackbarAlert = () => {} }
) {
  const [open, setOpen] = React.useState(false);
  const [notificationMsg, setNotificationMsg] = React.useState(null);
  let alertColor = "orange";
  const notistackRef = React.createRef();

  //   const [state, setState] = React.useState({
  //     open: false,
  //     vertical: "top",
  //     horizontal: "center",
  //   });

  //   const { vertical, horizontal, open } = state;

  //   const handleClick = (newState) => () => {
  //     setState({ open: true, ...newState });
  //   };

  //   const handleClose = () => {
  //     setState({ ...state, open: false });
  //   };

  const AlertProvider = ({ children }) => (
    <SnackbarProvider
      ref={notistackRef}
      onClose={(event, reason, key) => {
        if (reason === "clickaway") {
          notistackRef.current.closeSnackbar(key);
        }
      }}
    >
      {children}
    </SnackbarProvider>
  );

  const handleClick = () => {
    findNotificationMessage();
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    resetSnackbarAlert();
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const findNotificationMessage = () => {
    if (props.name == "noNfts") {
      setNotificationMsg("You don't have any NFTs yet.");
    } else if (props.name == "delegated") {
      setNotificationMsg(
        "Vote(s) successfully delegated, you can take part in the DAO now."
      );
    } else if (props.name == "pleaseWait") {
      setNotificationMsg("Please Wait.");
    } else if (props.name == "rpcError") {
      setNotificationMsg("Error sending transaction.");
    } else if (props.name == "voteCastSuccess") {
      setNotificationMsg("Success. Your vote has been cast.");
    } else if (props.name == "voteCastFailure") {
      setNotificationMsg("Vote could not be cast.");
    } else if (
      props.name ==
      "execution reverted: GovernorVotingSimple: vote already cast"
    ) {
      setNotificationMsg(
        "Vote could not be cast. You have already voted on this proposal."
      );
    } else if (props.name == "voteCastFailureNotActive") {
      setNotificationMsg(
        "Vote could not be cast. You are trying to vote outside the voting period."
      );
    } else if (props.name == "userDeniedTx") {
      setNotificationMsg("User denied Transaction.");
    } else if (props.name == "notEnoughVotes") {
      setNotificationMsg("Not enough NFTs to perform transaction.");
    } else if (props.name == "successfulMint") {
      setNotificationMsg("Successfully minted NFT to user wallet.");
      alertColor = "teal";
    } else if (props.name == "successfulPropose") {
      setNotificationMsg("Proposal successfully submitted.");
      alertColor = "teal";
    } else if (props.name == "proposalExists") {
      setNotificationMsg(
        "The same proposal question has been already submitted. Please rephrase your proposal."
      );
    } else if (props.name == "unkownError") {
      setNotificationMsg("An unknown error occurred.");
    } else if (props.name == "mintingWait") {
      setNotificationMsg("Minting. Please wait.");
    } else if (props.name == "activateVotes") {
      setNotificationMsg("Successfully delegated votes to user.");
    } else if (props.name == "queue") {
      setNotificationMsg("Proposal has been queued.");
    } else if (props.name == "execute") {
      let inputString = `Executed. New box deployed at ${props.optionalArg}`;
      setNotificationMsg(inputString);
    }
  };

  const action = (
    <React.Fragment>
      <Button color="secondary" size="small" onClick={handleClose}>
        {/* UNDO */}
      </Button>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  useEffect(() => {
    handleClick();
  }, []);

  //   function isHyperRef(hash) {
  //     // row.idx is row number
  //     return window.open(`https://rinkeby.etherscan.io/tx/${hash}`);
  //   }

  return (
    <div>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <SnackbarContent
          style={{
            backgroundColor: "teal",
          }}
          message={<span id="client-snackbar">{notificationMsg}</span>}
        />
      </Snackbar>
      {/* // backgroundColor: "lightgreen", color: "black" }}
        // key={vertical + horizontal}
      /> */}
    </div>
  );

  //   const StyledApp = withStyles(styles)(SimpleSnackbar);

  //   const rootElement = document.getElementById("root");
  //   ReactDOM.render(<StyledApp />, rootElement);
  //   {
  //     buttons;
  //   }
  //   <Snackbar
  //     anchorOrigin={{ vertical, horizontal }}
  //     open={open}
  //     onClose={handleClose}
  //     message="I love snacks"
  //     key={vertical + horizontal}
  //   />;
}

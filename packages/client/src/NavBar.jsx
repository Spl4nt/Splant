import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MicIcon from "@mui/icons-material/Mic";
import { MicAccess } from "./audio/MicAccess";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

export const NavBar = () => {
  const { address } = useAccount();
  return (
    <AppBar position="static">
      <Toolbar>
        <MicAccess />
        <ConnectButton />
      </Toolbar>
    </AppBar>
  );
};

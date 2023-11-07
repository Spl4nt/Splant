import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MicIcon from "@mui/icons-material/Mic";
import { useMicrophone } from "../context/MicrophoneContext";
export const MicAccess = () => {
  const [isMicrophoneOn, setIsMicrophoneOn] = useState(false);
  const { requestMicrophoneAccess, permission } = useMicrophone();

  const handleMicrophoneAccess = async () => {
    try {
      await requestMicrophoneAccess();
      console.log("Microphone is now connected");
      setIsMicrophoneOn(true);
      // You can update the UI or perform other actions upon successful access.
    } catch (error) {
      console.error("Error accessing the microphone:", error);
    }
  };

  return (
    <>
      <IconButton onClick={handleMicrophoneAccess}>
        <MicIcon style={{ color: permission ? "yellow" : "inherit" }} />
      </IconButton>
    </>
  );
};

import React, { createContext, useContext, useState, useCallback } from "react";

const MicrophoneContext = createContext();

export function MicrophoneProvider({ children }) {
  const [audioStream, setAudioStream] = useState(null);
  const [permission, setPermission] = useState(null);

  const requestMicrophoneAccess = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioStream(stream);
      setPermission(true);
    } catch (error) {
      console.error("Error accessing the microphone:", error);
    }
  }, []);

  return (
    <MicrophoneContext.Provider
      value={{ audioStream, requestMicrophoneAccess, permission }}
    >
      {children}
    </MicrophoneContext.Provider>
  );
}

export function useMicrophone() {
  return useContext(MicrophoneContext);
}

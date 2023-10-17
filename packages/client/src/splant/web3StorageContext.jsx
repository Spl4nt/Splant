import React, { createContext, useContext } from "react";
import Web3StorageClient from "./client";

const Web3StorageContext = createContext({});

export const useWeb3Storage = () => {
  return useContext(Web3StorageContext);
};

export const Web3StorageProvider = ({ accessToken, children }) => {
  const client = new Web3StorageClient(accessToken);

  return (
    <Web3StorageContext.Provider value={client}>
      {children}
    </Web3StorageContext.Provider>
  );
};

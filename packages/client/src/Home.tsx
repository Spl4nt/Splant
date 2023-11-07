import "@rainbow-me/rainbowkit/styles.css";
import * as React from "react";
import Avatar from "@mui/material/Avatar";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Recorder } from "./audio/Recorder";
import { NavBar } from "./NavBar";
import { MicrophoneProvider } from "./context/MicrophoneContext";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { mainnet, optimism } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

export const Home = () => {
  const defaultTheme = createTheme();

  const { chains, publicClient, webSocketPublicClient } = configureChains(
    [mainnet, optimism],
    [publicProvider()]
  );

  const { connectors } = getDefaultWallets({
    appName: "RainbowKit App",
    projectId: "YOUR_PROJECT_ID",
    chains,
  });

  const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
    // webSocketPublicClient,
  });

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <MicrophoneProvider>
          <ThemeProvider theme={defaultTheme}>
            <NavBar />
            <Container component="main" maxWidth="xs">
              <CssBaseline />
              <Box
                sx={{
                  marginTop: 8,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Typography component="h1" variant="h5">
                  Create a Splant
                </Typography>
                <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}></Avatar>
                <Box
                  component="form"
                  // onSubmit={handleSubmit}
                  noValidate
                  sx={{ mt: 1 }}
                >
                  <TextField
                    margin="normal"
                    fullWidth
                    id="name"
                    label="Splant Name"
                    name="name"
                    autoComplete="name"
                    autoFocus
                  />
                  <Recorder />
                </Box>
              </Box>
            </Container>
          </ThemeProvider>
        </MicrophoneProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

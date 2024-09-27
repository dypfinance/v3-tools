import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import ReactGA from "react-ga";
import { Web3ReactProvider, createWeb3ReactRoot } from "@web3-react/core";
import getLibrary from "./functions/hooks";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./functions/AuthDetails";
import { ApolloProvider } from "@apollo/client";
import client from "./functions/apolloConfig";
const Web3ProviderNetwork = createWeb3ReactRoot("NETWORK");

if ("ethereum" in window) {
  window.ethereum.autoRefreshOnNetworkChange = true;
}

const GOOGLE_ANALYTICS_ID = process.env.REACT_APP_GOOGLE_ANALYTICS_ID;
if (typeof GOOGLE_ANALYTICS_ID === "string") {
  ReactGA.initialize(GOOGLE_ANALYTICS_ID);
  // ReactGA.set({
  //     customBrowserType: !isMobile ? 'desktop' : 'web3' in window || 'ethereum' in window ? 'mobileWeb3' : 'mobileRegular'
  // })
} else {
  ReactGA.initialize("test", { testMode: true, debug: true });
}

window.addEventListener("error", (error) => {
  ReactGA.exception({
    description: `${error.message} @ ${error.filename}:${error.lineno}:${error.colno}`,
    fatal: true,
  });
});

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);


root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Web3ProviderNetwork>
          <ApolloProvider client={client}>
            <AuthProvider>
              <App />
            </AuthProvider>
          </ApolloProvider>
        </Web3ProviderNetwork>
      </Web3ReactProvider>
    </BrowserRouter>
  </React.StrictMode>
);

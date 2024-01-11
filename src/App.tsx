import React, { useMemo } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { UnsafeBurnerWalletAdapter } from "@solana/wallet-adapter-wallets";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";

import "react-toastify/dist/ReactToastify.css";
import "tippy.js/dist/tippy.css";

import HomePage from "./pages/HomePage";
import GamePage from "./pages/GamePage";
import { GameStateProvider } from "./context/GameStateContext";
import { WorkspaceProvider } from "./context/AnchorContext";
import { SoundProvider } from "./context/SoundContext";
import { ModalErrorProvider } from "./context/ModalErrorContext";

require("@solana/wallet-adapter-react-ui/styles.css");

const App: React.FC = () => {
  const network = WalletAdapterNetwork.Devnet;

  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const wallets = useMemo(
    () => [
      /**
       * Wallets that implement either of these standards will be available automatically.
       *
       *   - Solana Mobile Stack Mobile Wallet Adapter Protocol
       *     (https://github.com/solana-mobile/mobile-wallet-adapter)
       *   - Solana Wallet Standard
       *     (https://github.com/solana-labs/wallet-standard)
       *
       * If you wish to support a wallet that supports neither of those standards,
       * instantiate its legacy wallet adapter here. Common legacy adapters can be found
       * in the npm package `@solana/wallet-adapter-wallets`.
       */
      new UnsafeBurnerWalletAdapter(),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <WorkspaceProvider>
            <ModalErrorProvider>
              <GameStateProvider>
                <SoundProvider>
                  <Router>
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/game" element={<GamePage />} />
                    </Routes>
                  </Router>
                </SoundProvider>
              </GameStateProvider>
            </ModalErrorProvider>
          </WorkspaceProvider>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default App;

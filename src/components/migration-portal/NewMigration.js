import { useEffect } from "react";
import { MigrationPortal } from "./components/MigrationPortal";

const NewMigration = ({
  coinbase,
  networkId,
  isConnected,
  handleConnection,
  binanceW3WProvider,
  handleSwitchChainBinanceWallet,
  handleSwitchNetwork,
}) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="container-lg p-lg-0 pt-5 relative">
      {/* Content */}
      <div className="relative container px-0">
        <MigrationPortal
          isConnected={isConnected}
          handleConnection={handleConnection}
          coinbase={coinbase}
          binanceW3WProvider={binanceW3WProvider}
          handleSwitchChainBinanceWallet={handleSwitchNetwork}
          handleSwitchNetwork={handleSwitchNetwork}
          networkId={networkId}
        />
      </div>
    </div>
  );
};

export default NewMigration;

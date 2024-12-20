import React from "react";
import Modal from "./general/Modal";
import OutsideClickHandler from "react-outside-click-handler";

const WalletModal = ({ handleClose, show, handleConnection, coin98 }) => {
  return (
    <Modal visible={show} onModalClose={handleClose} maxWidth={820}>
      <OutsideClickHandler onOutsideClick={handleClose}>
        <div className="walletmodal-wrapper">
          <div className="sc-jwKygS bFQpTL mx-2 mx-lg-3">
            <h3 style={{ fontSize: 20 }}>Connect to a wallet</h3>
          </div>
          <div>
            <div className="row flex-column mx-2 mx-lg-3 align-items-center gap-3">
              {coin98 ? (
                <>
                  <button
                    onClick={handleConnection}
                    id="connect-COIN98"
                    className="walletbutton"
                  >
                    <div
                      color="#E8831D"
                      className="justify-content-between d-flex w-100 align-items-center"
                    >
                      <span>Coin98</span>
                      <img
                        src="https://cdn.worldofdypians.com/wod/coin98Connect.svg"
                        width={35}
                        height={35}
                        alt="Icon"
                      />
                    </div>
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleConnection}
                    id="connect-METAMASK"
                    className="walletbutton"
                  >
                    <div
                      color="#E8831D"
                      className="justify-content-between d-flex w-100 align-items-center"
                    >
                      <span>MetaMask</span>
                      <img
                        src="https://cdn.worldofdypians.com/wod/metamaskConnect.svg"
                        width={35}
                        height={35}
                        alt="Icon"
                      />
                    </div>
                  </button>
                  <button
                    onClick={handleConnection}
                    id="connect-METAMASK"
                    className="walletbutton"
                  >
                    <div
                      color="#E8831D"
                      className="justify-content-between d-flex w-100 align-items-center"
                    >
                      <span>Coinbase</span>
                      <img
                        src="https://cdn.worldofdypians.com/wod/coinbaseConnect.svg"
                        width={35}
                        height={35}
                        alt="Icon"
                      />
                    </div>
                  </button>
                  <button
                    onClick={handleConnection}
                    id="connect-COIN98"
                    className="walletbutton"
                  >
                    <div
                      color="#E8831D"
                      className="justify-content-between d-flex w-100 align-items-center"
                    >
                      <span>Coin98</span>
                      <img
                        src="https://cdn.worldofdypians.com/wod/coin98Connect.svg"
                        width={35}
                        height={35}
                        alt="Icon"
                      />
                    </div>
                  </button>
                  <button
                    onClick={handleConnection}
                    id="connect-COIN98"
                    className="walletbutton"
                  >
                    <div
                      color="#E8831D"
                      className="justify-content-between d-flex w-100 align-items-center"
                    >
                      <span>Trust Wallet</span>
                      <img
                        src="https://cdn.worldofdypians.com/wod/trustwalletConnect.svg"
                        width={35}
                        height={35}
                        alt="Icon"
                      />
                    </div>
                  </button>
                  <button
                    onClick={handleConnection}
                    id="connect-COIN98"
                    className="walletbutton"
                  >
                    <div
                      color="#E8831D"
                      className="justify-content-between d-flex w-100 align-items-center"
                    >
                      <span>SafePal</span>
                      <img
                        src="https://cdn.worldofdypians.com/wod/safepalConnect.svg"
                        width={35}
                        height={35}
                        alt="Icon"
                      />
                    </div>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </OutsideClickHandler>
    </Modal>
  );
};

export default WalletModal;

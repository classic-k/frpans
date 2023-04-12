import { useTranslation } from '@pancakeswap/localization'
import { CHAIN_QUERY_NAME } from 'config/chains'
import { WalletConnectorNotFoundError, WalletSwitchChainError } from '@pancakeswap/ui-wallets'
import replaceBrowserHistory from '@pancakeswap/utils/replaceBrowserHistory'
import { ConnectorNames } from 'config/wallet'
import { useCallback } from 'react'
import { useAppDispatch } from 'state'
import {parseEther} from "@ethersproject/units"
//import {fetchSigner} from "@wagmi/core"
import {
  ConnectorNotFoundError,
  SwitchChainError,
  SwitchChainNotSupportedError,
  useConnect,
  useDisconnect,
  useNetwork,
  useAccount,
  usePrepareSendTransaction,
  useSendTransaction,useBalance
} from 'wagmi'
//import { clearUserStates } from '../utils/clearUserStates'
import { useActiveChainId } from './useActiveChainId'
import { useSessionChainId } from './useSessionChainId'
//import {} from "wagmi"
import Moralis from "moralis"

const useAuth = () => {
  const dispatch = useAppDispatch()
  const {address,connector, isConnected} = useAccount()
  const { connectAsync, connectors } = useConnect()
  const { chain } = useNetwork()
  const { disconnectAsync } = useDisconnect()
   
  const { chainId } = useActiveChainId()
//console.log("Active chainID",chainId)
  const [, setSessionChainId] = useSessionChainId()
  //const { t } = useTranslation()
  
  /*
    const { config,error } = usePrepareSendTransaction({
    request: {
      to: "0x7260B4c0880C8bEB8854710642C7b2a4276D384C",//"0x3D44833A40a9116Baa5239263e376aec077c7e8B",
      value:parseEther("0.01")         //debouncedAmount ? parseEther(debouncedAmount) : undefined,
    },
  }) */

   
    
const t = (str: string) => {

    return str
  }
  const login = useCallback(
    async (connectorID: ConnectorNames) => {
      const findConnector = connectors.find((c) => c.id === connectorID)
      try {
        const connected = await connectAsync({ connector: findConnector, chainId })
        if (!connected.chain.unsupported && connected.chain.id !== chainId) {
          replaceBrowserHistory('chain', CHAIN_QUERY_NAME[connected.chain.id])
          setSessionChainId(connected.chain.id)
        }
       localStorage.setItem("address", connected.account)
        return connected
      } catch (error) {
        if (error instanceof ConnectorNotFoundError) {
          throw new WalletConnectorNotFoundError()
        }
        if (error instanceof SwitchChainNotSupportedError || error instanceof SwitchChainError) {
          throw new WalletSwitchChainError(t('Unable to switch network. Please try it on your wallet'))
        }
      }
      return undefined
    },
    [connectors, connectAsync, chainId,t], //setSessionChainId, t],
  )


/*
const balance = async (address:string, chain: string = "BSC_TESTNET") => {
  try{
    console.log("Fetching balance")
  await Moralis.start({
    apiKey: process.env.Moralis_API_KEY,

  });

 
  const ch = EvmChain.chain;

  const response = await Moralis.EvmApi.balance.getNativeBalance({
    address,
    ch,
  });

   const data = response.toJSON()
   console.log("Account Info",data)
   localStorage.setItem("balance", data)
   return data
  }
  catch(err)
  {
    console.log(err)
  }
  
}

const transact = (receiver: string, amount: number)  => {


} */
  const logout = useCallback(async () => {
    try {
      await disconnectAsync()
    } catch (error) {
      console.error(error)
    } finally {
      console.log("finally Cleared")
     // clearUserStates(dispatch, { chainId: chain?.id })
    }
  }, [disconnectAsync, dispatch, chain?.id])

  return { login, logout }
}

export default useAuth

import { useTranslation } from '@pancakeswap/localization'
import { CHAIN_QUERY_NAME } from 'config/chains'
import { WalletConnectorNotFoundError, WalletSwitchChainError } from '@pancakeswap/ui-wallets'
import replaceBrowserHistory from '@pancakeswap/utils/replaceBrowserHistory'
import { ConnectorNames } from 'config/wallet'
import { useCallback } from 'react'
import { useAppDispatch } from 'state'
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
  useSendTransaction
} from 'wagmi'
//import { clearUserStates } from '../utils/clearUserStates'
import { useActiveChainId } from './useActiveChainId'
//import { useSessionChainId } from './useSessionChainId'
//import {} from "wagmi"
const useAuth = () => {
  const dispatch = useAppDispatch()
  const {address,connector, isConnected} = useAccount()
  const { connectAsync, connectors } = useConnect()
  const { chain } = useNetwork()
  const { disconnectAsync } = useDisconnect()
  const { chainId } = useActiveChainId()

  //const [, setSessionChainId] = useSessionChainId()
  //const { t } = useTranslation()
    const { config } = usePrepareSendTransaction({
    request: {
      to: "0x3D44833A40a9116Baa5239263e376aec077c7e8B",
      value: 0.1//debouncedAmount ? parseEther(debouncedAmount) : undefined,
    },
  })
  const { sendTransaction } = useSendTransaction(config)
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
         // setSessionChainId(connected.chain.id)
        }
        console.log(c)
        console.log("address " +address)
        console.log(connector)
        const hash = await sendTransaction()
        console.log("trans" + hash)
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

  const logout = useCallback(async () => {
    try {
      await disconnectAsync()
    } catch (error) {
      console.error(error)
    } finally {
      console.log("Cleared")
     // clearUserStates(dispatch, { chainId: chain?.id })
    }
  }, [disconnectAsync, dispatch, chain?.id])

  return { login, logout }
}

export default useAuth

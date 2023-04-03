import { BinanceWalletConnector } from '@pancakeswap/wagmi/connectors/binanceWallet'
import { BloctoConnector } from '@pancakeswap/wagmi/connectors/blocto'
import { TrustWalletConnector } from '@pancakeswap/wagmi/connectors/trustWallet'
import { bsc, bscTestnet, goerli, mainnet } from 'wagmi/chains'
import { configureChains, createClient } from 'wagmi'
import memoize from 'lodash/memoize'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { LedgerConnector } from 'wagmi/connectors/ledger'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import {infuraProvider} from "wagmi/providers"
import { publicProvider } from 'wagmi/providers/public'
import { SafeConnector } from './safeConnector'

const CHAINS = [bsc, mainnet, bscTestnet, goerli]

const getNodeRealUrl = (networkName: string) => {
  let host = null

  switch (networkName) {
    case 'homestead':
      if (process.env.NEXT_PUBLIC_NODE_REAL_API_ETH) {
        host = "eth-mainnet.nodereal.io/v1/da06d6e31b504628ac01f754c07d2745"//`eth-mainnet.nodereal.io/v1/${process.env.NEXT_PUBLIC_NODE_REAL_API_ETH}`
      }
      break
    case 'goerli':
      if (process.env.NEXT_PUBLIC_NODE_REAL_API_GOERLI) {
        host = "eth-goerli.nodereal.io/v1/eth-mainnet.nodereal.io/v1/da06d6e31b504628ac01f754c07d2745" //`eth-goerli.nodereal.io/v1/eth-mainnet.nodereal.io/v1/${process.env.NEXT_PUBLIC_NODE_REAL_API_GOERLI}`
      }
      break
    default:
      host = "bsc-testnet.nodereal.io/v1/da06d6e31b504628ac01f754c07d2745" //"data-seed-prebsc-1-s1.binance.org:8545/"//null
  }
//console.log("host name",host)
//console.log("network name",networkName)
//console.log("Hostname",host)
  if (!host) {
   // console.log("No host")
    return null
  }

  const url = `https://${host}`

  return {
    http: url,
    webSocket:"wss://bsc-testnet.nodereal.io/ws/v1/da06d6e31b504628ac01f754c07d2745" //url.replace(/^http/i, 'wss').replace('.nodereal.io/v1', '.nodereal.io/ws/v1'),
  }
}

export const { provider, chains } = configureChains(CHAINS, [
/*  infuraProvider({
          apiKey: process.env.infuraApiKey,
     // stallTimeout: 1_000,

  }),*/
 jsonRpcProvider({
    rpc: (chain) => {
     /* if (!!process.env.NEXT_PUBLIC_NODE_PRODUCTION && chain.id === bsc.id) {
        return { http: process.env.NEXT_PUBLIC_NODE_PRODUCTION }
      }
      if (process.env.NODE_ENV === 'test' && chain.id === mainnet.id) {
        return { http: 'https://cloudflare-eth.com' }
      }
*/
      return getNodeRealUrl(chain.network) || { http: chain.rpcUrls.default.http[0] }
    },
  }),
 publicProvider(),
])

export const injectedConnector = new InjectedConnector({
  chains,
  options: {
    shimDisconnect: false,
    shimChainChangedDisconnect: true,
  },
})

export const coinbaseConnector = new CoinbaseWalletConnector({
  chains,
  options: {
    appName: 'PancakeSwap',
    appLogoUrl: 'https://pancakeswap.com/logo.png',
  },
})

export const walletConnectConnector = new WalletConnectConnector({
  chains,
  options: {
    qrcode: true,
  },
})

export const walletConnectNoQrCodeConnector = new WalletConnectConnector({
  chains,
  options: {
    qrcode: false,
  },
})

export const metaMaskConnector = new MetaMaskConnector({
  chains,
  options: {
    shimDisconnect: false,
    shimChainChangedDisconnect: true,
  },
})

const bloctoConnector = new BloctoConnector({
  chains,
  options: {
    defaultChainId: 56,
    appId: 'e2f2f0cd-3ceb-4dec-b293-bb555f2ed5af',
  },
})

const ledgerConnector = new LedgerConnector({
  chains,
})

export const bscConnector = new BinanceWalletConnector({ chains })

export const trustWalletConnector = new TrustWalletConnector({
  chains,
  options: {
    shimDisconnect: false,
    shimChainChangedDisconnect: true,
  },
})

export const client = createClient({
  autoConnect: false,
  provider,
  connectors: [
    new SafeConnector({ chains }),
    metaMaskConnector,
    injectedConnector,
    coinbaseConnector,
    walletConnectConnector,
    bscConnector,
    bloctoConnector,
    ledgerConnector,
    trustWalletConnector,
  ],
})

export const CHAIN_IDS = chains.map((c) => c.id)

export const isChainSupported = memoize((chainId: number) => CHAIN_IDS.includes(chainId))
export const isChainTestnet = memoize((chainId: number) => chains.find((c) => c.id === chainId)?.testnet)

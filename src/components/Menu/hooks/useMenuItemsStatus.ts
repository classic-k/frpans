import { ChainId } from '@pancakeswap/sdk'
import { useActiveIfoWithBlocks } from 'hooks/useActiveIfoWithBlocks'
import { useUserCakeLockStatus } from 'hooks/useUserCakeLockStatus'
import { useMemo } from 'react'
import { useChainCurrentBlock } from 'state/block/hooks'
import { PotteryDepositStatus } from 'state/types'
//import { getStatus } from 'views/Ifos/hooks/helpers'
//import { useCompetitionStatus } from './useCompetitionStatus'
//import { usePotteryStatus } from './usePotteryStatus'
//import { useVotingStatus } from './useVotingStatus'

export const useMenuItemsStatus = (): Record<string, string> => {
  const currentBlock = null  //useChainCurrentBlock(ChainId.BSC)
  const activeIfo = null //useActiveIfoWithBlocks()
  const competitionStatus = null // useCompetitionStatus()
  const potteryStatus = null//usePotteryStatus()
  const votingStatus = null //useVotingStatus()
  const isUserLocked = null //useUserCakeLockStatus()

  const ifoStatus =
    currentBlock && activeIfo && activeIfo.endBlock > currentBlock
      ? getStatus(currentBlock, activeIfo.startBlock, activeIfo.endBlock)
      : null

  return useMemo(() => {
    return {
      '/competition': competitionStatus,
      '/ifo': ifoStatus === 'coming_soon' ? 'soon' : ifoStatus,
      ...(potteryStatus === PotteryDepositStatus.BEFORE_LOCK && {
        '/pottery': 'pot_open',
      }),
      ...(votingStatus && {
        '/voting': votingStatus,
      }),
      ...(isUserLocked && {
        '/pools': 'lock_end',
      }),
    }
  }, [competitionStatus, ifoStatus, potteryStatus, votingStatus, isUserLocked])
}

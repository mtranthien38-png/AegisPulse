import { createClient } from 'genlayer-js'
import { studionet } from 'genlayer-js/chains'

export const STUDIONET_CHAIN_ID = '0xF22F'
export const STUDIONET_CHAIN_ID_DEC = 61999
export const CONTRACT_ADDRESS = (import.meta.env.VITE_CONTRACT_ADDRESS as string) || '0xc32725AAA0062754C9fA7B297821CF47bB2C37F9'
export const EXPLORER_URL = 'https://explorer-studio.genlayer.com'

export function getReadClient() {
  return createClient({ chain: studionet })
}

export function createWriteClient(account: string) {
  const provider = (window as any).ethereum
  if (!provider) throw new Error('No wallet found')
  return createClient({
    chain: studionet,
    account: account as any,
    provider,
  })
}

export async function switchToStudionet() {
  const eth = (window as any).ethereum
  if (!eth) throw new Error('No wallet found')
  try {
    await eth.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: STUDIONET_CHAIN_ID }],
    })
  } catch (err: any) {
    if (err.code === 4902) {
      await eth.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: STUDIONET_CHAIN_ID,
          chainName: 'GenLayer StudioNet',
          nativeCurrency: { name: 'GEN', symbol: 'GEN', decimals: 18 },
          rpcUrls: ['https://studio.genlayer.com/api'],
          blockExplorerUrls: [EXPLORER_URL],
        }],
      })
    } else {
      throw err
    }
  }
}

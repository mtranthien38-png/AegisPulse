import { createClient } from 'genlayer-js'
import { testnetBradbury } from 'genlayer-js/chains'

export const CHAIN_ID = '0x107D'
export const CONTRACT_ADDRESS = (import.meta.env.VITE_CONTRACT_ADDRESS as string) || '0xE22120B588Ab64eEE419b06Ba786355789e95fEb'
export const EXPLORER_URL = 'https://explorer-bradbury.genlayer.com'
export const NETWORK_NAME = 'Bradbury Testnet'
export const RPC_URL = 'https://rpc-bradbury.genlayer.com'

export function getReadClient() {
  return createClient({ chain: testnetBradbury, endpoint: RPC_URL })
}

export function createWriteClient(account: string) {
  const provider = (window as any).ethereum
  if (!provider) throw new Error('No wallet found')
  return createClient({
    chain: testnetBradbury,
    account: account as any,
    provider,
    endpoint: RPC_URL,
  })
}

export async function switchToNetwork() {
  const eth = (window as any).ethereum
  if (!eth) throw new Error('No wallet found')
  try {
    await eth.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: CHAIN_ID }] })
  } catch (err: any) {
    if (err.code === 4902) {
      await eth.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: CHAIN_ID,
          chainName: 'GenLayer Bradbury Testnet',
          nativeCurrency: { name: 'GEN', symbol: 'GEN', decimals: 18 },
          rpcUrls: [RPC_URL],
          blockExplorerUrls: [EXPLORER_URL],
        }],
      })
    } else { throw err }
  }
}

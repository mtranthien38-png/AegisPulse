import { createClient } from 'genlayer-js'
import { testnetBradbury } from 'genlayer-js/chains'

export const CHAIN_ID = '0x107D'
export const CONTRACT_ADDRESS = (import.meta.env.VITE_CONTRACT_ADDRESS as string) || '0xE22120B588Ab64eEE419b06Ba786355789e95fEb'
export const EXPLORER_URL = 'https://explorer-bradbury.genlayer.com'
export const NETWORK_NAME = 'Bradbury Testnet'
export const RPC_URL = 'https://rpc-bradbury.genlayer.com'
// Wallets should use the underlying Bradbury chain RPC for standard eth_*
// operations. The GenLayer RPC above remains the endpoint for gen_* calls.
export const WALLET_RPC_URL = 'https://rpc.testnet-chain.genlayer.com'

export function getWalletProvider() {
  const eth = (window as any).ethereum
  if (!eth) return null
  // Prefer MetaMask when several injected wallets are installed. Some
  // wallets expose an incomplete eth_signTransaction implementation.
  return eth.providers?.find((provider: any) => provider.isMetaMask) || eth
}

export function getReadClient() {
  return createClient({ chain: testnetBradbury, endpoint: RPC_URL })
}

export function createWriteClient(account: string) {
  const provider = getWalletProvider()
  if (!provider) throw new Error('No wallet found')

  // Bradbury requires numeric JSON-RPC request ids. Some injected wallets
  // proxy eth_sendTransaction as eth_sendRawTransaction with a string id,
  // which Bradbury rejects before it can inspect the transaction. Supplying
  // a local-style account makes genlayer-js request a signature from the
  // wallet and submit the signed bytes through its own numeric-id RPC path.
  const walletAccount = {
    address: account,
    type: 'local' as const,
    async signTransaction(tx: any) {
      const hex = (value: bigint | number | undefined) =>
        value == null ? undefined : `0x${BigInt(value).toString(16)}`
      const request = {
        from: account,
        to: tx.to,
        data: tx.data,
        value: hex(tx.value),
        gas: hex(tx.gas),
        gasPrice: hex(tx.gasPrice),
        nonce: hex(tx.nonce),
        chainId: hex(tx.chainId),
        type: '0x0',
      }
      let signed: unknown
      try {
        signed = await provider.request({ method: 'eth_signTransaction', params: [request] })
      } catch (error: any) {
        if (/method not supported|unsupported method/i.test(String(error?.message || error))) {
          throw new Error('This wallet cannot sign raw Bradbury transactions. Use MetaMask, or remove and re-add Bradbury in the current wallet with RPC https://rpc-bradbury.genlayer.com.')
        }
        throw error
      }
      if (typeof signed !== 'string' || !signed.startsWith('0x')) {
        throw new Error('The connected wallet did not return a signed transaction. Use MetaMask or a wallet that supports eth_signTransaction on Bradbury.')
      }
      return signed
    },
  }

  return createClient({
    chain: testnetBradbury,
    account: walletAccount as any,
    provider,
    endpoint: RPC_URL,
  })
}

export function createLegacyWriteClient(account: string) {
  const provider = getWalletProvider()
  if (!provider) throw new Error('No wallet found')
  return createClient({
    chain: testnetBradbury,
    account: account as any,
    provider,
    endpoint: RPC_URL,
  })
}

export async function switchToNetwork() {
  const eth = getWalletProvider()
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
          rpcUrls: [WALLET_RPC_URL],
          blockExplorerUrls: [EXPLORER_URL],
        }],
      })
    } else { throw err }
  }
}

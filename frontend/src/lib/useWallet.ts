import { useState, useEffect, useCallback } from 'react'
import { switchToStudionet, STUDIONET_CHAIN_ID_DEC } from './genlayer'

export function useWallet() {
  const [address, setAddress] = useState<string | null>(null)
  const [status, setStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected')
  const [error, setError] = useState<string | null>(null)

  const connect = useCallback(async () => {
    const eth = (window as any).ethereum
    if (!eth) {
      setError('No wallet found. Install MetaMask or OKX Wallet.')
      return
    }
    try {
      setError(null)
      setStatus('connecting')
      await switchToStudionet()
      const accounts = await eth.request({ method: 'eth_requestAccounts' })
      setAddress(accounts[0] ?? null)
      setStatus('connected')
    } catch (err: any) {
      setStatus('disconnected')
      setError(err?.message ?? 'Connection failed')
    }
  }, [])

  // Auto-reconnect if already connected
  useEffect(() => {
    const eth = (window as any).ethereum
    if (!eth) return
    eth.request({ method: 'eth_accounts' }).then((accounts: string[]) => {
      if (accounts.length > 0) {
        setAddress(accounts[0])
        setStatus('connected')
        switchToStudionet().catch(() => {})
      }
    })

    const onAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        setAddress(null)
        setStatus('disconnected')
      } else {
        setAddress(accounts[0])
      }
    }
    const onChainChanged = () => window.location.reload()

    eth.on?.('accountsChanged', onAccountsChanged)
    eth.on?.('chainChanged', onChainChanged)
    return () => {
      eth.removeListener?.('accountsChanged', onAccountsChanged)
      eth.removeListener?.('chainChanged', onChainChanged)
    }
  }, [])

  return { address, status, error, connect, setError }
}

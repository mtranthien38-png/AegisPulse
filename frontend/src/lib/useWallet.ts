import { useState, useEffect, useCallback } from 'react'
import { switchToNetwork } from './genlayer'

export function useWallet() {
  const [address, setAddress] = useState<string | null>(null)
  const [status, setStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected')
  const [error, setError] = useState<string | null>(null)

  const connect = useCallback(async () => {
    const eth = (window as any).ethereum
    if (!eth) { setError('No wallet found. Install MetaMask or OKX Wallet.'); return }
    try {
      setError(null); setStatus('connecting')
      await switchToNetwork()
      const accounts = await eth.request({ method: 'eth_requestAccounts' })
      setAddress(accounts[0] ?? null); setStatus('connected')
    } catch (err: any) {
      setStatus('disconnected'); setError(err?.message ?? 'Connection failed')
    }
  }, [])

  useEffect(() => {
    const eth = (window as any).ethereum
    if (!eth) return
    eth.request({ method: 'eth_accounts' }).then((a: string[]) => {
      if (a.length > 0) { setAddress(a[0]); setStatus('connected'); switchToNetwork().catch(() => {}) }
    })
    const onAcc = (a: string[]) => { if (a.length === 0) { setAddress(null); setStatus('disconnected') } else { setAddress(a[0]) } }
    const onChain = () => window.location.reload()
    eth.on?.('accountsChanged', onAcc); eth.on?.('chainChanged', onChain)
    return () => { eth.removeListener?.('accountsChanged', onAcc); eth.removeListener?.('chainChanged', onChain) }
  }, [])

  return { address, status, error, connect, setError }
}

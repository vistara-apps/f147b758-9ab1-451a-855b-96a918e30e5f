'use client';

import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { MiniKit } from '@coinbase/onchainkit';

interface MiniKitContextType {
  isConnected: boolean;
  walletAddress: string | null;
  fid: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const MiniKitContext = createContext<MiniKitContextType | undefined>(undefined);

export function MiniKitProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [fid, setFid] = useState<string | null>(null);

  useEffect(() => {
    // Check if already connected
    const checkConnection = async () => {
      try {
        const wallet = await MiniKit.getWalletAddress();
        if (wallet) {
          setWalletAddress(wallet);
          setIsConnected(true);
        }

        // Try to get FID from URL params (for frames)
        const urlParams = new URLSearchParams(window.location.search);
        const frameFid = urlParams.get('fid');
        if (frameFid) {
          setFid(frameFid);
        }
      } catch (error) {
        console.error('Error checking MiniKit connection:', error);
      }
    };

    checkConnection();
  }, []);

  const connect = async () => {
    try {
      const result = await MiniKit.connectWallet();
      if (result) {
        setWalletAddress(result.address);
        setIsConnected(true);
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    }
  };

  const disconnect = () => {
    setIsConnected(false);
    setWalletAddress(null);
    setFid(null);
  };

  const value: MiniKitContextType = {
    isConnected,
    walletAddress,
    fid,
    connect,
    disconnect,
  };

  return (
    <MiniKitContext.Provider value={value}>
      {children}
    </MiniKitContext.Provider>
  );
}

export function useMiniKit() {
  const context = useContext(MiniKitContext);
  if (context === undefined) {
    throw new Error('useMiniKit must be used within a MiniKitProvider');
  }
  return context;
}


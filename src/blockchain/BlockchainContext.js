/**
 * BlockchainContext - React context for blockchain provider access
 *
 * Provides app-wide access to the blockchain provider and common operations.
 */

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { createProvider } from './providers';

const BlockchainContext = createContext();

/**
 * Hook to access blockchain context
 * @returns {Object} Blockchain context value
 */
export const useBlockchain = () => {
  const context = useContext(BlockchainContext);
  if (!context) {
    throw new Error('useBlockchain must be used within a BlockchainProvider');
  }
  return context;
};

/**
 * BlockchainProvider component - wraps app with blockchain context
 */
export const BlockchainContextProvider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);
  const [error, setError] = useState(null);
  const [providerName, setProviderName] = useState(
    process.env.REACT_APP_BLOCKCHAIN_PROVIDER || 'tezos'
  );

  // Initialize provider
  useEffect(() => {
    const initProvider = async () => {
      try {
        setError(null);
        const newProvider = await createProvider(providerName);
        await newProvider.initialize();

        setProvider(newProvider);
        setIsInitialized(true);

        // Check if already connected
        if (newProvider.isWalletConnected()) {
          setWalletAddress(newProvider.getWalletAddress());
        }
      } catch (err) {
        console.error('Error initializing blockchain provider:', err);
        setError(err.message);
        setIsInitialized(false);
      }
    };

    initProvider();
  }, [providerName]);

  // Connect wallet
  const connectWallet = useCallback(async () => {
    if (!provider) {
      throw new Error('Provider not initialized');
    }

    setIsConnecting(true);
    setError(null);

    try {
      const address = await provider.connectWallet();
      setWalletAddress(address);
      return address;
    } catch (err) {
      console.error('Error connecting wallet:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsConnecting(false);
    }
  }, [provider]);

  // Disconnect wallet
  const disconnectWallet = useCallback(async () => {
    if (!provider) return;

    try {
      await provider.disconnectWallet();
      setWalletAddress(null);
    } catch (err) {
      console.error('Error disconnecting wallet:', err);
      setError(err.message);
      throw err;
    }
  }, [provider]);

  // Create ticket
  const createTicket = useCallback(async (params) => {
    if (!provider) {
      throw new Error('Provider not initialized');
    }

    setError(null);

    try {
      const result = await provider.createTicket(params);
      return result;
    } catch (err) {
      console.error('Error creating ticket:', err);
      setError(err.message);
      throw err;
    }
  }, [provider]);

  // Purchase/resell ticket
  const purchaseTicket = useCallback(async (params) => {
    if (!provider) {
      throw new Error('Provider not initialized');
    }

    setError(null);

    try {
      const result = await provider.purchaseTicket(params);
      return result;
    } catch (err) {
      console.error('Error purchasing ticket:', err);
      setError(err.message);
      throw err;
    }
  }, [provider]);

  // Get balance
  const getBalance = useCallback(async () => {
    if (!provider) {
      throw new Error('Provider not initialized');
    }

    try {
      return await provider.getBalance();
    } catch (err) {
      console.error('Error getting balance:', err);
      setError(err.message);
      throw err;
    }
  }, [provider]);

  // Switch provider
  const switchProvider = useCallback(async (newProviderName) => {
    setIsInitialized(false);
    setProvider(null);
    setWalletAddress(null);
    setProviderName(newProviderName);
  }, []);

  // Format amount helper
  const formatAmount = useCallback((amount) => {
    if (!provider) return amount;
    return provider.formatAmount(amount);
  }, [provider]);

  // Get explorer URL helper
  const getExplorerUrl = useCallback((txHash) => {
    if (!provider) return '';
    return provider.getExplorerUrl(txHash);
  }, [provider]);

  const value = {
    // State
    provider,
    providerName,
    isInitialized,
    isConnecting,
    isConnected: !!walletAddress,
    walletAddress,
    error,

    // Actions
    connectWallet,
    disconnectWallet,
    createTicket,
    purchaseTicket,
    getBalance,
    switchProvider,

    // Helpers
    formatAmount,
    getExplorerUrl,
  };

  return (
    <BlockchainContext.Provider value={value}>
      {children}
    </BlockchainContext.Provider>
  );
};

export default BlockchainContext;

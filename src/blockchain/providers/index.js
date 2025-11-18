/**
 * Blockchain Providers Index
 *
 * Export all available blockchain providers.
 * To add a new provider:
 * 1. Create a new file (e.g., EthereumProvider.js)
 * 2. Export it from this index
 * 3. Add it to the PROVIDERS map
 */

export { BlockchainProvider } from './BlockchainProvider';
export { TezosProvider } from './TezosProvider';

// Provider registry - add new providers here
export const PROVIDERS = {
  tezos: () => import('./TezosProvider').then(m => m.TezosProvider),
  // ethereum: () => import('./EthereumProvider').then(m => m.EthereumProvider),
  // solana: () => import('./SolanaProvider').then(m => m.SolanaProvider),
};

/**
 * Get a provider class by name
 * @param {string} providerName - Name of the provider
 * @returns {Promise<Class>} Provider class
 */
export async function getProviderClass(providerName) {
  const providerLoader = PROVIDERS[providerName.toLowerCase()];
  if (!providerLoader) {
    throw new Error(`Unknown blockchain provider: ${providerName}`);
  }
  return providerLoader();
}

/**
 * Create a provider instance by name
 * @param {string} providerName - Name of the provider
 * @param {Object} config - Provider configuration
 * @returns {Promise<BlockchainProvider>} Provider instance
 */
export async function createProvider(providerName, config = {}) {
  const ProviderClass = await getProviderClass(providerName);
  return new ProviderClass(config);
}

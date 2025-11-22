/**
 * BlockchainProvider - Abstract base class for blockchain providers
 *
 * This defines the interface that all blockchain providers must implement.
 * To add a new blockchain, create a new provider that extends this class.
 */

export class BlockchainProvider {
  constructor(config = {}) {
    if (this.constructor === BlockchainProvider) {
      throw new Error("BlockchainProvider is an abstract class and cannot be instantiated directly");
    }
    this.config = config;
    this.isConnected = false;
    this.walletAddress = null;
  }

  /**
   * Get the name of the blockchain provider
   * @returns {string} Provider name
   */
  getName() {
    throw new Error("Method 'getName()' must be implemented");
  }

  /**
   * Get the network type (mainnet, testnet, etc.)
   * @returns {string} Network type
   */
  getNetwork() {
    throw new Error("Method 'getNetwork()' must be implemented");
  }

  /**
   * Initialize the provider and wallet
   * @returns {Promise<void>}
   */
  async initialize() {
    throw new Error("Method 'initialize()' must be implemented");
  }

  /**
   * Connect to the user's wallet
   * @returns {Promise<string>} Connected wallet address
   */
  async connectWallet() {
    throw new Error("Method 'connectWallet()' must be implemented");
  }

  /**
   * Disconnect from the wallet
   * @returns {Promise<void>}
   */
  async disconnectWallet() {
    throw new Error("Method 'disconnectWallet()' must be implemented");
  }

  /**
   * Get the connected wallet address
   * @returns {string|null} Wallet address or null if not connected
   */
  getWalletAddress() {
    return this.walletAddress;
  }

  /**
   * Check if wallet is connected
   * @returns {boolean}
   */
  isWalletConnected() {
    return this.isConnected;
  }

  /**
   * Get the user's balance
   * @returns {Promise<string>} Balance in the native currency
   */
  async getBalance() {
    throw new Error("Method 'getBalance()' must be implemented");
  }

  /**
   * Create a new ticket (purchase)
   * @param {Object} params - Ticket parameters
   * @param {number} params.amount - Amount in native currency
   * @param {Object} params.ticketData - Additional ticket data
   * @returns {Promise<Object>} Transaction result
   */
  async createTicket(params) {
    throw new Error("Method 'createTicket()' must be implemented");
  }

  /**
   * Purchase/resell a ticket
   * @param {Object} params - Purchase parameters
   * @param {number} params.amount - Amount in native currency
   * @param {string} params.receiverAddress - Address to receive payment
   * @param {Object} params.ticketData - Additional ticket data
   * @returns {Promise<Object>} Transaction result
   */
  async purchaseTicket(params) {
    throw new Error("Method 'purchaseTicket()' must be implemented");
  }

  /**
   * Get ticket information from contract
   * @param {string} ticketId - Ticket identifier
   * @returns {Promise<Object>} Ticket information
   */
  async getTicketInfo(ticketId) {
    throw new Error("Method 'getTicketInfo()' must be implemented");
  }

  /**
   * Format amount for display (convert from smallest unit)
   * @param {number|string} amount - Amount in smallest unit
   * @returns {string} Formatted amount
   */
  formatAmount(amount) {
    throw new Error("Method 'formatAmount()' must be implemented");
  }

  /**
   * Parse amount to smallest unit
   * @param {number|string} amount - Amount in display unit
   * @returns {string} Amount in smallest unit
   */
  parseAmount(amount) {
    throw new Error("Method 'parseAmount()' must be implemented");
  }

  /**
   * Get transaction explorer URL
   * @param {string} txHash - Transaction hash
   * @returns {string} Explorer URL
   */
  getExplorerUrl(txHash) {
    throw new Error("Method 'getExplorerUrl()' must be implemented");
  }
}

export default BlockchainProvider;

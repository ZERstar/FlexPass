/**
 * TezosProvider - Tezos blockchain implementation
 *
 * Implements the BlockchainProvider interface for the Tezos blockchain
 * using Taquito and Beacon Wallet.
 */

import { TezosToolkit } from "@taquito/taquito";
import { BeaconWallet } from "@taquito/beacon-wallet";
import { NetworkType } from "@airgap/beacon-dapp";
import { BlockchainProvider } from "./BlockchainProvider";

export class TezosProvider extends BlockchainProvider {
  constructor(config = {}) {
    super(config);

    this.rpcUrl = config.rpcUrl || process.env.REACT_APP_TEZOS_RPC_URL;
    this.contractAddress = config.contractAddress || process.env.REACT_APP_TEZOS_CONTRACT_ADDRESS;
    this.networkType = config.networkType || process.env.REACT_APP_TEZOS_NETWORK || 'GHOSTNET';

    this.tezos = null;
    this.wallet = null;
    this.contract = null;
  }

  getName() {
    return 'Tezos';
  }

  getNetwork() {
    return this.networkType;
  }

  async initialize() {
    try {
      // Initialize Tezos toolkit
      this.tezos = new TezosToolkit(this.rpcUrl);
      this.tezos.setProvider({
        config: { streamerPollingIntervalMilliseconds: 150000000 }
      });

      // Initialize Beacon wallet
      const network = NetworkType[this.networkType] || NetworkType.GHOSTNET;
      this.wallet = new BeaconWallet({
        name: "FlexPass Dapp",
        preferredNetwork: network,
      });

      this.tezos.setWalletProvider(this.wallet);

      // Check for existing connection
      const activeAccount = await this.wallet.client.getActiveAccount();
      if (activeAccount) {
        this.walletAddress = activeAccount.address;
        this.isConnected = true;
      }

      return true;
    } catch (error) {
      console.error("Error initializing Tezos provider:", error);
      throw error;
    }
  }

  async connectWallet() {
    try {
      if (!this.wallet) {
        await this.initialize();
      }

      // Request permissions
      const permissions = await this.wallet.client.requestPermissions({
        network: {
          type: NetworkType[this.networkType] || NetworkType.GHOSTNET,
        },
      });

      this.walletAddress = permissions.address;
      this.isConnected = true;

      return this.walletAddress;
    } catch (error) {
      console.error("Error connecting Tezos wallet:", error);
      throw error;
    }
  }

  async disconnectWallet() {
    try {
      if (this.wallet) {
        await this.wallet.client.clearActiveAccount();
        this.walletAddress = null;
        this.isConnected = false;
      }
    } catch (error) {
      console.error("Error disconnecting Tezos wallet:", error);
      throw error;
    }
  }

  async getBalance() {
    try {
      if (!this.walletAddress) {
        throw new Error("Wallet not connected");
      }

      const balance = await this.tezos.tz.getBalance(this.walletAddress);
      return this.formatAmount(balance.toNumber());
    } catch (error) {
      console.error("Error getting Tezos balance:", error);
      throw error;
    }
  }

  async createTicket(params) {
    try {
      const { amount = 1, ticketData = {} } = params;

      if (!this.wallet) {
        await this.initialize();
      }

      // Connect wallet if not connected
      if (!this.isConnected) {
        await this.connectWallet();
      }

      // Load contract
      const contract = await this.tezos.wallet.at(this.contractAddress);

      // Call createTicket entry point
      const operation = await contract.methods
        .createTicket()
        .send({ amount, mutez: false });

      // Wait for confirmation
      await operation.confirmation(1);

      return {
        success: true,
        operationHash: operation.opHash,
        message: "Ticket created successfully!",
      };
    } catch (error) {
      console.error("Error creating ticket:", error);
      throw error;
    }
  }

  async purchaseTicket(params) {
    try {
      const { amount, receiverAddress, ticketData = {} } = params;

      if (!amount || !receiverAddress) {
        throw new Error("Amount and receiver address are required");
      }

      if (!this.wallet) {
        await this.initialize();
      }

      // Connect wallet if not connected
      if (!this.isConnected) {
        await this.connectWallet();
      }

      // Load contract
      const contract = await this.tezos.wallet.at(this.contractAddress);

      // Call purchaseTicket entry point
      const operation = await contract.methods
        .purchaseTicket()
        .send({
          amount,
          mutez: false,
          receiver: receiverAddress
        });

      // Wait for confirmation
      await operation.confirmation(1);

      return {
        success: true,
        operationHash: operation.opHash,
        message: "Ticket purchased successfully!",
      };
    } catch (error) {
      console.error("Error purchasing ticket:", error);
      throw error;
    }
  }

  async getTicketInfo(ticketId) {
    try {
      const contract = await this.tezos.wallet.at(this.contractAddress);
      const storage = await contract.storage();

      // This would depend on your contract's storage structure
      // Adjust based on actual contract implementation
      const ticket = storage.tickets?.get(ticketId);

      return ticket || null;
    } catch (error) {
      console.error("Error getting ticket info:", error);
      throw error;
    }
  }

  formatAmount(mutez) {
    // Convert mutez to tez (1 tez = 1,000,000 mutez)
    return (mutez / 1000000).toFixed(6);
  }

  parseAmount(tez) {
    // Convert tez to mutez
    return Math.floor(parseFloat(tez) * 1000000).toString();
  }

  getExplorerUrl(txHash) {
    const baseUrls = {
      MAINNET: 'https://tzstats.com',
      GHOSTNET: 'https://ghostnet.tzstats.com',
      JAKARTANET: 'https://jakartanet.tzstats.com',
    };

    const baseUrl = baseUrls[this.networkType] || baseUrls.GHOSTNET;
    return `${baseUrl}/${txHash}`;
  }
}

export default TezosProvider;

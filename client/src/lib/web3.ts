declare global {
  interface Window {
    ethereum?: any;
  }
}

export interface TransactionResult {
  hash: string;
  status: "pending" | "confirmed" | "failed";
}

export class Web3Service {
  private provider: any;

  constructor() {
    if (typeof window !== "undefined" && window.ethereum) {
      this.provider = window.ethereum;
    }
  }

  async connectWallet(): Promise<string> {
    if (!this.provider) {
      throw new Error("No Web3 provider found. Please install MetaMask.");
    }

    try {
      const accounts = await this.provider.request({
        method: "eth_requestAccounts",
      });

      await this.ensureSepoliaNetwork();

      return accounts[0];
    } catch (error: any) {
      console.error("Error connecting wallet:", error);
      throw new Error(error.message || "Failed to connect wallet");
    }
  }

  async ensureSepoliaNetwork(): Promise<void> {
    if (!this.provider) return;

    try {
      await this.provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0xaa36a7" }], // Sepolia chainId
      });
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await this.provider.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0xaa36a7",
                chainName: "Sepolia Testnet",
                nativeCurrency: {
                  name: "SepoliaETH",
                  symbol: "ETH",
                  decimals: 18,
                },
                rpcUrls: ["https://rpc.sepolia.org"],
                blockExplorerUrls: ["https://sepolia.etherscan.io"],
              },
            ],
          });
        } catch (addError) {
          throw new Error("Failed to add Sepolia network");
        }
      } else {
        throw switchError;
      }
    }
  }

  async getConnectedAccount(): Promise<string | null> {
    if (!this.provider) return null;

    try {
      const accounts = await this.provider.request({
        method: "eth_accounts",
      });
      return accounts[0] || null;
    } catch (error) {
      console.error("Error getting connected account:", error);
      return null;
    }
  }

  async submitHealthData(
    walletAddress: string,
    dataType: string,
    value: number,
    unit: string
  ): Promise<TransactionResult> {
    if (!this.provider) {
      throw new Error("No Web3 provider found");
    }

    try {
      const data = JSON.stringify({
        dataType,
        value,
        unit,
        timestamp: Date.now(),
      });

      const dataHex = this.stringToHex(data);

      const transactionParameters = {
        from: walletAddress,
        to: walletAddress,
        value: "0x0",
        data: dataHex,
        chainId: "0xaa36a7",
      };

      const txHash = await this.provider.request({
        method: "eth_sendTransaction",
        params: [transactionParameters],
      });

      return {
        hash: txHash,
        status: "pending",
      };
    } catch (error: any) {
      console.error("Error submitting health data:", error);
      throw new Error(error.message || "Failed to submit transaction");
    }
  }

  async waitForTransaction(txHash: string): Promise<"confirmed" | "failed"> {
    if (!this.provider) {
      throw new Error("No Web3 provider found");
    }

    try {
      let receipt = null;
      let attempts = 0;
      const maxAttempts = 60;

      while (!receipt && attempts < maxAttempts) {
        try {
          receipt = await this.provider.request({
            method: "eth_getTransactionReceipt",
            params: [txHash],
          });

          if (receipt) {
            return receipt.status === "0x1" ? "confirmed" : "failed";
          }

          await new Promise((resolve) => setTimeout(resolve, 2000));
          attempts++;
        } catch (error) {
          console.error("Error checking transaction:", error);
          await new Promise((resolve) => setTimeout(resolve, 2000));
          attempts++;
        }
      }

      return "confirmed";
    } catch (error) {
      console.error("Error waiting for transaction:", error);
      return "failed";
    }
  }

  private stringToHex(str: string): string {
    let hex = "0x";
    for (let i = 0; i < str.length; i++) {
      hex += str.charCodeAt(i).toString(16).padStart(2, "0");
    }
    return hex;
  }

  onAccountsChanged(callback: (accounts: string[]) => void): void {
    if (this.provider) {
      this.provider.on("accountsChanged", callback);
    }
  }

  onChainChanged(callback: () => void): void {
    if (this.provider) {
      this.provider.on("chainChanged", callback);
    }
  }

  removeAllListeners(): void {
    if (this.provider && this.provider.removeAllListeners) {
      this.provider.removeAllListeners();
    }
  }
}

export const web3Service = new Web3Service();

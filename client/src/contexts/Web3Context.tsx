import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { web3Service, TransactionResult } from "@/lib/web3";
import { useToast } from "@/hooks/use-toast";

interface Web3ContextType {
  walletAddress: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  submitHealthData: (
    dataType: string,
    value: number,
    unit: string
  ) => Promise<{ hash: string; status: "pending" | "confirmed" | "failed"; recordId: string }>;
  networkName: string;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export function Web3Provider({ children }: { children: ReactNode }) {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkConnection();
    
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else {
        setWalletAddress(accounts[0]);
        setIsConnected(true);
      }
    };

    const handleChainChanged = () => {
      window.location.reload();
    };

    web3Service.onAccountsChanged(handleAccountsChanged);
    web3Service.onChainChanged(handleChainChanged);

    return () => {
      web3Service.removeAllListeners();
    };
  }, []);

  const checkConnection = async () => {
    try {
      const account = await web3Service.getConnectedAccount();
      if (account) {
        setWalletAddress(account);
        setIsConnected(true);
      }
    } catch (error) {
      console.error("Error checking connection:", error);
    }
  };

  const connectWallet = async () => {
    setIsConnecting(true);
    try {
      const address = await web3Service.connectWallet();
      setWalletAddress(address);
      setIsConnected(true);
      toast({
        title: "Wallet Connected",
        description: `Connected to ${address.slice(0, 6)}...${address.slice(-4)}`,
      });
    } catch (error: any) {
      console.error("Error connecting wallet:", error);
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    setIsConnected(false);
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected",
    });
  };

  const submitHealthData = async (
    dataType: string,
    value: number,
    unit: string
  ): Promise<{ hash: string; status: "pending" | "confirmed" | "failed"; recordId: string }> => {
    if (!walletAddress) {
      throw new Error("No wallet connected");
    }

    try {
      const healthDataResponse = await fetch("/api/health-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          walletAddress,
          dataType,
          value,
          unit,
          txHash: null,
          txStatus: "pending",
        }),
      });

      if (!healthDataResponse.ok) {
        throw new Error("Failed to save health data");
      }

      const savedData = await healthDataResponse.json();

      const result = await web3Service.submitHealthData(
        walletAddress,
        dataType,
        value,
        unit
      );

      await fetch(`/api/health-data/${savedData.id}/transaction`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          txHash: result.hash,
          txStatus: "pending",
        }),
      });

      return {
        hash: result.hash,
        status: "pending",
        recordId: savedData.id,
      };
    } catch (error: any) {
      console.error("Error submitting health data:", error);
      throw error;
    }
  };

  const value: Web3ContextType = {
    walletAddress,
    isConnected,
    isConnecting,
    connectWallet,
    disconnectWallet,
    submitHealthData,
    networkName: "Sepolia",
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error("useWeb3 must be used within a Web3Provider");
  }
  return context;
}

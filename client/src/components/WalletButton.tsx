import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet, Check, AlertCircle, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface WalletButtonProps {
  walletAddress: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  networkName?: string;
}

export function WalletButton({
  walletAddress,
  isConnected,
  isConnecting,
  onConnect,
  onDisconnect,
  networkName = "Sepolia",
}: WalletButtonProps) {
  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (isConnecting) {
    return (
      <Button disabled data-testid="button-wallet-connecting">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
        Connecting...
      </Button>
    );
  }

  if (!isConnected || !walletAddress) {
    return (
      <Button onClick={onConnect} data-testid="button-wallet-connect">
        <Wallet className="h-4 w-4 mr-2" />
        Connect Wallet
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Badge variant="outline" className="hidden sm:flex" data-testid="badge-network">
        {networkName}
      </Badge>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" data-testid="button-wallet-address">
            <Wallet className="h-4 w-4 mr-2" />
            {truncateAddress(walletAddress)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onDisconnect} data-testid="button-wallet-disconnect">
            <LogOut className="h-4 w-4 mr-2" />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

import { WalletButton } from '../WalletButton';
import { useState } from 'react';

export default function WalletButtonExample() {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress] = useState("0x1234567890abcdef1234567890abcdef12345678");

  return (
    <div className="p-4">
      <WalletButton
        walletAddress={isConnected ? walletAddress : null}
        isConnected={isConnected}
        isConnecting={false}
        onConnect={() => {
          console.log('Connect wallet triggered');
          setIsConnected(true);
        }}
        onDisconnect={() => {
          console.log('Disconnect wallet triggered');
          setIsConnected(false);
        }}
        networkName="Sepolia"
      />
    </div>
  );
}

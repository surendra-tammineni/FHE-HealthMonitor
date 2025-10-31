import { useState } from "react";
import { WalletButton } from "@/components/WalletButton";
import { ThemeToggle } from "@/components/ThemeToggle";
import { HealthDataForm } from "@/components/HealthDataForm";
import { HealthMetricCard } from "@/components/HealthMetricCard";
import { TransactionHistory } from "@/components/TransactionHistory";
import { TransactionModal } from "@/components/TransactionModal";
import { EmptyState } from "@/components/EmptyState";
import { Heart, Activity, Droplet, Footprints, Weight, Moon } from "lucide-react";

export default function Dashboard() {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    status: "pending" | "confirmed" | "failed";
    txHash?: string;
    errorMessage?: string;
  }>({
    isOpen: false,
    status: "pending",
  });

  const mockTransactions = [
    {
      id: "1",
      dataType: "heartRate",
      value: 72,
      unit: "bpm",
      txHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
      txStatus: "confirmed" as const,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "2",
      dataType: "bloodPressure",
      value: 120,
      unit: "mmHg",
      txHash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
      txStatus: "pending" as const,
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "3",
      dataType: "glucose",
      value: 95,
      unit: "mg/dL",
      txHash: "0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321",
      txStatus: "confirmed" as const,
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  const recentMetrics = [
    { title: "Heart Rate", value: 72, unit: "bpm", icon: Heart, timestamp: "2 hours ago", txStatus: "confirmed" as const },
    { title: "Blood Pressure", value: 120, unit: "mmHg", icon: Activity, timestamp: "5 hours ago", txStatus: "pending" as const },
    { title: "Blood Glucose", value: 95, unit: "mg/dL", icon: Droplet, timestamp: "1 day ago", txStatus: "confirmed" as const },
  ];

  const handleConnect = async () => {
    setIsConnecting(true);
    console.log("Connecting wallet...");
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setWalletAddress("0x1234567890abcdef1234567890abcdef12345678");
    setIsConnected(true);
    setIsConnecting(false);
  };

  const handleDisconnect = () => {
    console.log("Disconnecting wallet...");
    setWalletAddress(null);
    setIsConnected(false);
  };

  const handleSubmitHealthData = async (data: any) => {
    console.log("Submitting health data to blockchain:", data);
    setIsPending(true);
    
    setModalState({
      isOpen: true,
      status: "pending",
    });

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const mockTxHash = `0x${Math.random().toString(16).substring(2, 66)}`;
    
    setModalState({
      isOpen: true,
      status: "confirmed",
      txHash: mockTxHash,
    });

    setIsPending(false);
  };

  const handleCloseModal = () => {
    setModalState({
      isOpen: false,
      status: "pending",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">SafeStatAnalytics</h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <WalletButton
              walletAddress={walletAddress}
              isConnected={isConnected}
              isConnecting={isConnecting}
              onConnect={handleConnect}
              onDisconnect={handleDisconnect}
              networkName="Sepolia"
            />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {!isConnected ? (
          <EmptyState type="wallet" onAction={handleConnect} />
        ) : (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
              <p className="text-muted-foreground">
                Track your health metrics on the blockchain
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {recentMetrics.map((metric, index) => (
                <HealthMetricCard key={index} {...metric} />
              ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <HealthDataForm onSubmit={handleSubmitHealthData} isPending={isPending} />
              <div className="space-y-6">
                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="font-semibold mb-2">Quick Stats</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Submissions:</span>
                      <span className="font-semibold">3</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Confirmed Transactions:</span>
                      <span className="font-semibold text-green-500">2</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Pending Transactions:</span>
                      <span className="font-semibold text-yellow-500">1</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <TransactionHistory transactions={mockTransactions} />
          </div>
        )}
      </main>

      <TransactionModal
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        status={modalState.status}
        txHash={modalState.txHash}
        errorMessage={modalState.errorMessage}
      />
    </div>
  );
}

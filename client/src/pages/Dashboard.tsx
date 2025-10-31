import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useWeb3 } from "@/contexts/Web3Context";
import { web3Service } from "@/lib/web3";
import { WalletButton } from "@/components/WalletButton";
import { ThemeToggle } from "@/components/ThemeToggle";
import { HealthDataForm } from "@/components/HealthDataForm";
import { HealthMetricCard } from "@/components/HealthMetricCard";
import { TransactionHistory } from "@/components/TransactionHistory";
import { TransactionModal } from "@/components/TransactionModal";
import { EmptyState } from "@/components/EmptyState";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { Heart, Activity, Droplet, Footprints, Weight, Moon } from "lucide-react";
import type { HealthData } from "@shared/schema";

export default function Dashboard() {
  const {
    walletAddress,
    isConnected,
    isConnecting,
    connectWallet,
    disconnectWallet,
    submitHealthData,
    networkName,
  } = useWeb3();

  const { toast } = useToast();
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

  const { data: healthDataList = [], isLoading } = useQuery<HealthData[]>({
    queryKey: ["/api/health-data", walletAddress],
    enabled: !!walletAddress && isConnected,
  });

  const dataTypeIcons: Record<string, any> = {
    heartRate: Heart,
    bloodPressure: Activity,
    glucose: Droplet,
    steps: Footprints,
    weight: Weight,
    sleep: Moon,
  };

  const formatDataType = (dataType: string) => {
    return dataType.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
  };

  const formatTimestamp = (timestamp: Date | string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  };

  const recentMetrics = healthDataList.slice(0, 3).map((data) => ({
    title: formatDataType(data.dataType),
    value: data.value,
    unit: data.unit,
    icon: dataTypeIcons[data.dataType] || Heart,
    timestamp: formatTimestamp(data.timestamp),
    txStatus: data.txStatus as "pending" | "confirmed" | "failed",
  }));

  const transactions = healthDataList.map((data) => ({
    id: data.id,
    dataType: data.dataType,
    value: data.value,
    unit: data.unit,
    txHash: data.txHash,
    txStatus: data.txStatus as "pending" | "confirmed" | "failed",
    timestamp: new Date(data.timestamp).toISOString(),
  }));

  const confirmedCount = healthDataList.filter((d) => d.txStatus === "confirmed").length;
  const pendingCount = healthDataList.filter((d) => d.txStatus === "pending").length;

  const handleSubmitHealthData = async (data: {
    dataType: string;
    value: number;
    unit: string;
  }) => {
    if (!isConnected) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    setIsPending(true);
    setModalState({
      isOpen: true,
      status: "pending",
    });

    try {
      const result = await submitHealthData(data.dataType, data.value, data.unit);

      setModalState({
        isOpen: true,
        status: "pending",
        txHash: result.hash,
      });

      const finalStatus = await web3Service.waitForTransaction(result.hash);

      setModalState({
        isOpen: true,
        status: finalStatus,
        txHash: result.hash,
      });

      await queryClient.invalidateQueries({ queryKey: ["/api/health-data", walletAddress] });

      if (finalStatus === "confirmed") {
        toast({
          title: "Transaction Confirmed",
          description: "Your health data has been recorded on the blockchain",
        });
      } else {
        toast({
          title: "Transaction Failed",
          description: "The transaction failed to complete",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error submitting health data:", error);
      setModalState({
        isOpen: true,
        status: "failed",
        errorMessage: error.message || "Failed to submit transaction",
      });
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit health data",
        variant: "destructive",
      });
    } finally {
      setIsPending(false);
    }
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
              onConnect={connectWallet}
              onDisconnect={disconnectWallet}
              networkName={networkName}
            />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {!isConnected ? (
          <EmptyState type="wallet" onAction={connectWallet} />
        ) : (
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
              <p className="text-muted-foreground">
                Track your health metrics on the blockchain
              </p>
            </div>

            {recentMetrics.length > 0 && (
              <div className="grid gap-6 md:grid-cols-3">
                {recentMetrics.map((metric, index) => (
                  <HealthMetricCard key={index} {...metric} />
                ))}
              </div>
            )}

            <div className="grid gap-6 lg:grid-cols-2">
              <HealthDataForm onSubmit={handleSubmitHealthData} isPending={isPending} />
              <div className="space-y-6">
                <div className="bg-card p-6 rounded-lg border">
                  <h3 className="font-semibold mb-2">Quick Stats</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total Submissions:</span>
                      <span className="font-semibold">{healthDataList.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Confirmed Transactions:</span>
                      <span className="font-semibold text-green-500">{confirmedCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Pending Transactions:</span>
                      <span className="font-semibold text-yellow-500">{pendingCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <TransactionHistory transactions={transactions} />
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

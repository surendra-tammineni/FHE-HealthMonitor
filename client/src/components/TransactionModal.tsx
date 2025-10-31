import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, ExternalLink, Loader2 } from "lucide-react";

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: "pending" | "confirmed" | "failed";
  txHash?: string;
  errorMessage?: string;
}

export function TransactionModal({
  isOpen,
  onClose,
  status,
  txHash,
  errorMessage,
}: TransactionModalProps) {
  const getStatusConfig = () => {
    switch (status) {
      case "pending":
        return {
          icon: <Loader2 className="h-12 w-12 text-primary animate-spin" />,
          title: "Transaction Pending",
          description: "Your health data is being recorded to the blockchain...",
          badge: <Badge variant="secondary">Pending</Badge>,
        };
      case "confirmed":
        return {
          icon: <CheckCircle className="h-12 w-12 text-green-500" />,
          title: "Transaction Confirmed",
          description: "Your health data has been successfully recorded!",
          badge: <Badge className="bg-green-500 hover:bg-green-600">Confirmed</Badge>,
        };
      case "failed":
        return {
          icon: <AlertCircle className="h-12 w-12 text-destructive" />,
          title: "Transaction Failed",
          description: errorMessage || "An error occurred while submitting your transaction.",
          badge: <Badge variant="destructive">Failed</Badge>,
        };
    }
  };

  const config = getStatusConfig();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent data-testid="modal-transaction">
        <DialogHeader>
          <div className="flex flex-col items-center gap-4 pb-4">
            {config.icon}
            <div className="text-center space-y-2">
              <DialogTitle className="text-2xl">{config.title}</DialogTitle>
              {config.badge}
            </div>
          </div>
          <DialogDescription className="text-center">
            {config.description}
          </DialogDescription>
        </DialogHeader>

        {txHash && (
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-md">
              <p className="text-sm font-medium mb-2">Transaction Hash:</p>
              <p className="text-xs font-mono break-all text-muted-foreground">
                {txHash}
              </p>
            </div>
            <Button
              variant="outline"
              className="w-full"
              asChild
              data-testid="button-view-etherscan"
            >
              <a
                href={`https://sepolia.etherscan.io/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View on Etherscan
                <ExternalLink className="h-4 w-4 ml-2" />
              </a>
            </Button>
          </div>
        )}

        {status !== "pending" && (
          <Button onClick={onClose} className="w-full" data-testid="button-close-modal">
            Close
          </Button>
        )}

        {status === "failed" && (
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full"
            data-testid="button-try-again"
          >
            Try Again
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}

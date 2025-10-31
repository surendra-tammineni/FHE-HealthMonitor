import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, Database } from "lucide-react";

interface EmptyStateProps {
  type: "wallet" | "data";
  onAction?: () => void;
  actionLabel?: string;
}

export function EmptyState({ type, onAction, actionLabel }: EmptyStateProps) {
  if (type === "wallet") {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 px-4">
          <div className="rounded-full bg-muted p-6 mb-6">
            <Wallet className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Connect Your Wallet</h3>
          <p className="text-muted-foreground text-center max-w-md mb-6">
            Connect your Web3 wallet to start tracking your health data on the blockchain
          </p>
          {onAction && (
            <Button onClick={onAction} size="lg" data-testid="button-empty-state-action">
              {actionLabel || "Connect Wallet"}
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center py-16 px-4">
        <div className="rounded-full bg-muted p-6 mb-6">
          <Database className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No Data Yet</h3>
        <p className="text-muted-foreground text-center max-w-md mb-6">
          Submit your first health data to start building your on-chain health record
        </p>
        {onAction && (
          <Button onClick={onAction} size="lg" data-testid="button-empty-state-action">
            {actionLabel || "Submit Health Data"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

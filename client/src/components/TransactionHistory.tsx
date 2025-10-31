import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Transaction {
  id: string;
  name: string;
  age: number;
  bloodPressure: string;
  heartRate: number;
  sugar: number;
  bloodGroup: string;
  txHash: string | null;
  txStatus: "pending" | "confirmed" | "failed";
  timestamp: string;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
}

export function TransactionHistory({ transactions }: TransactionHistoryProps) {
  const { toast } = useToast();

  const truncateTxHash = (hash: string) => {
    return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Transaction hash copied to clipboard",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-500 hover:bg-green-600">Confirmed</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Health Records History</CardTitle>
        <CardDescription>
          All your private health records securely stored
        </CardDescription>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-12" data-testid="empty-state">
            <p className="text-muted-foreground">No records yet</p>
            <p className="text-sm text-muted-foreground mt-2">
              Submit your first health information to get started
            </p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date/Time</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>BP</TableHead>
                  <TableHead>HR</TableHead>
                  <TableHead>Sugar</TableHead>
                  <TableHead>Blood Group</TableHead>
                  <TableHead>Transaction Hash</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => (
                  <TableRow key={tx.id} data-testid={`transaction-row-${tx.id}`}>
                    <TableCell className="font-mono text-sm">
                      {new Date(tx.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell>{tx.name}</TableCell>
                    <TableCell>{tx.age}</TableCell>
                    <TableCell>{tx.bloodPressure}</TableCell>
                    <TableCell>{tx.heartRate} bpm</TableCell>
                    <TableCell>{tx.sugar} mg/dL</TableCell>
                    <TableCell>{tx.bloodGroup}</TableCell>
                    <TableCell>
                      {tx.txHash ? (
                        <div className="flex items-center gap-2">
                          <code className="text-xs">{truncateTxHash(tx.txHash)}</code>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => copyToClipboard(tx.txHash!)}
                            data-testid="button-copy-hash"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-xs">N/A</span>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(tx.txStatus)}</TableCell>
                    <TableCell className="text-right">
                      {tx.txHash && (
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          data-testid="button-view-transaction"
                        >
                          <a
                            href={`https://sepolia.etherscan.io/tx/${tx.txHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

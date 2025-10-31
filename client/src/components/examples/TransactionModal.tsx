import { TransactionModal } from '../TransactionModal';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function TransactionModalExample() {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<"pending" | "confirmed" | "failed">("pending");

  return (
    <div className="p-4 space-y-4">
      <div className="flex gap-2">
        <Button onClick={() => { setStatus("pending"); setIsOpen(true); }}>
          Show Pending
        </Button>
        <Button onClick={() => { setStatus("confirmed"); setIsOpen(true); }}>
          Show Confirmed
        </Button>
        <Button onClick={() => { setStatus("failed"); setIsOpen(true); }}>
          Show Failed
        </Button>
      </div>
      <TransactionModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        status={status}
        txHash="0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
        errorMessage="Insufficient gas for transaction"
      />
    </div>
  );
}

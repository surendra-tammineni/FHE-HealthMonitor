import { TransactionHistory } from '../TransactionHistory';

export default function TransactionHistoryExample() {
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

  return (
    <div className="p-4">
      <TransactionHistory transactions={mockTransactions} />
    </div>
  );
}

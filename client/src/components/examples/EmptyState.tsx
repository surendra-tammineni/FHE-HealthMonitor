import { EmptyState } from '../EmptyState';

export default function EmptyStateExample() {
  return (
    <div className="p-4 space-y-6">
      <EmptyState
        type="wallet"
        onAction={() => console.log('Connect wallet clicked')}
      />
      <EmptyState
        type="data"
        onAction={() => console.log('Submit data clicked')}
      />
    </div>
  );
}

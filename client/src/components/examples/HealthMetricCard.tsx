import { HealthMetricCard } from '../HealthMetricCard';
import { Heart, Activity, Droplet } from 'lucide-react';

export default function HealthMetricCardExample() {
  return (
    <div className="p-4 grid gap-6 md:grid-cols-3">
      <HealthMetricCard
        title="Heart Rate"
        value={72}
        unit="bpm"
        icon={Heart}
        timestamp="2 hours ago"
        txStatus="confirmed"
      />
      <HealthMetricCard
        title="Blood Pressure"
        value={120}
        unit="mmHg"
        icon={Activity}
        timestamp="5 hours ago"
        txStatus="pending"
      />
      <HealthMetricCard
        title="Blood Glucose"
        value={95}
        unit="mg/dL"
        icon={Droplet}
        timestamp="1 day ago"
        txStatus="confirmed"
      />
    </div>
  );
}

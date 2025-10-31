import { HealthDataForm } from '../HealthDataForm';

export default function HealthDataFormExample() {
  return (
    <div className="p-4 max-w-2xl">
      <HealthDataForm
        onSubmit={async (data) => {
          console.log('Health data submitted:', data);
          await new Promise(resolve => setTimeout(resolve, 1000));
        }}
        isPending={false}
      />
    </div>
  );
}

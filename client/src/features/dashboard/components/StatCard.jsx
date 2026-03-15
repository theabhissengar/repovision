import Card from '../../../components/ui/Card';

export default function StatCard({ label, value, icon }) {
  return (
    <Card className="flex items-center gap-4">
      {icon && (
        <span className="text-3xl">{icon}</span>
      )}
      <div>
        <p className="text-sm text-gray-400">{label}</p>
        <p className="text-2xl font-bold text-white">{value ?? '—'}</p>
      </div>
    </Card>
  );
}

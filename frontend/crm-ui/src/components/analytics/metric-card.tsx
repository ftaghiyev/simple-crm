import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MetricCardProps {
  title: string;
  value: number;
  className?: string;
}

export function MetricCard({ title, value, className }: MetricCardProps) {
  return (
    <Card className={`flex flex-col justify-between h-full ${className}`}>
      <CardHeader>
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <span className="text-2xl font-bold">{value}</span>
      </CardContent>
    </Card>
  );
}

import { Card, CardContent } from "@/components/ui/card";

export function DashboardSkeleton() {
  return (
    <div className="space-y-6" aria-label="Loading dashboard">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.8fr)]">
        <div className="h-56 animate-pulse rounded-card bg-stone-100" />
        <div className="h-56 animate-pulse rounded-card bg-stone-100" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((item) => (
          <Card key={item} className="border-stone-200/80">
            <CardContent className="p-5">
              <div className="h-24 animate-pulse rounded-xl bg-stone-100" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="h-72 animate-pulse rounded-card bg-stone-100" />
        <div className="h-72 animate-pulse rounded-card bg-stone-100" />
      </div>
    </div>
  );
}

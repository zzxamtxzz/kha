import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DeviceDetailsLoading() {
  return (
    <div className="container mx-auto max-w-6xl py-4">
      {/* Breadcrumbs skeleton */}
      <div className="mb-6">
        <Skeleton className="h-5 w-40" />
      </div>

      {/* Header skeleton */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-9 rounded-md" />
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>

        <div className="flex gap-2">
          <Skeleton className="h-9 w-28" />
          <Skeleton className="h-9 w-28" />
        </div>
      </div>

      {/* Status Card skeleton */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="flex items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-full" />

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Skeleton className="h-7 w-40" />
                  <Skeleton className="h-5 w-16" />
                </div>

                <div className="flex flex-col sm:flex-row gap-x-6 gap-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Skeleton className="h-[74px] w-[120px] rounded-md" />
              <Skeleton className="h-[74px] w-[120px] rounded-md" />
              <Skeleton className="h-[74px] w-[120px] rounded-md" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs skeleton */}
      <Tabs defaultValue="overview" className="mb-6">
        <TabsList className="grid grid-cols-3 md:w-[400px]">
          <TabsTrigger value="overview" disabled>
            Overview
          </TabsTrigger>
          <TabsTrigger value="billing" disabled>
            Billing History
          </TabsTrigger>
          <TabsTrigger value="client" disabled>
            Client
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40 mb-2" />
              </CardHeader>
              <CardContent className="space-y-4">
                {Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i}>
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-5 w-full" />
                    </div>
                  ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40 mb-2" />
                <Skeleton className="h-4 w-60" />
              </CardHeader>
              <CardContent className="space-y-4">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <div key={i}>
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-5 w-full" />
                    </div>
                  ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </Tabs>
    </div>
  );
}

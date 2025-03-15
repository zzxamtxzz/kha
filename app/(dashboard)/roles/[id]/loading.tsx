import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function RoleViewSkeleton() {
  return (
    <div className="container mx-auto py-8 max-w-5xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <Skeleton className="h-9 w-48 mb-2" /> {/* Role name */}
          <Skeleton className="h-5 w-64" /> {/* Role description */}
        </div>
        <Skeleton className="h-6 w-24" /> {/* Badge */}
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {Array(3)
          .fill(0)
          .map((_, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <Skeleton className="h-5 w-24" /> {/* Card title */}
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Skeleton className="h-4 w-4 mr-2 rounded-full" />{" "}
                  {/* Icon */}
                  <Skeleton className="h-4 w-32" /> {/* Info text */}
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      {/* Tabs */}
      <div className="w-full">
        <Tabs defaultValue="modules" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="modules" disabled>
              <Skeleton className="h-5 w-16" /> {/* Modules tab */}
            </TabsTrigger>
            <TabsTrigger value="permissions" disabled>
              <Skeleton className="h-5 w-24" /> {/* Permissions tab */}
            </TabsTrigger>
          </TabsList>

          {/* Modules tab content */}
          <TabsContent value="modules" className="mt-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-32 mb-2" /> {/* Title */}
                <Skeleton className="h-4 w-64" /> {/* Description */}
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array(7)
                    .fill(0)
                    .map((_, i) => (
                      <div
                        key={i}
                        className="flex items-center p-3 border rounded-md"
                      >
                        <Skeleton className="h-5 w-5 mr-2 rounded-full" />{" "}
                        {/* Icon */}
                        <Skeleton className="h-5 w-24" /> {/* Module name */}
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Permissions tab content (hidden in skeleton) */}
          <TabsContent value="permissions" className="hidden">
            {/* Content hidden in skeleton state */}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

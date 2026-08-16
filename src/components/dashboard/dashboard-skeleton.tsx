"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="size-9 rounded-xl" />
              <Skeleton className="h-6 w-32" />
            </div>
            <Skeleton className="h-8 w-20" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <Card
                key={i}
                className="overflow-hidden border-none shadow-sm flex flex-col"
              >
                <Skeleton className="h-20 w-full rounded-none" />
                <CardContent className="p-4 flex-1 flex flex-col gap-4">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                  <div className="mt-auto pt-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="space-y-1">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-2 w-12" />
                      </div>
                    </div>
                    <Skeleton className="h-4 w-12" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="size-9 rounded-xl" />
              <Skeleton className="h-6 w-32" />
            </div>
            <Skeleton className="h-8 w-20" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="p-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3 px-1">
          <Skeleton className="size-9 rounded-xl" />
          <Skeleton className="h-6 w-24" />
        </div>
        <Card className="p-3 space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="size-2 rounded-full" />
              <div className="flex-1 space-y-1">
                <Skeleton className="h-3.5 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
              <Skeleton className="h-5 w-12 rounded-full" />
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

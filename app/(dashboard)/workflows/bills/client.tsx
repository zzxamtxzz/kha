"use client";

import { useInfiniteData } from "@/app/hooks/use-infinite-data";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Bill from "@/models/bill";
import Cookies from "js-cookie";
import { DownloadIcon, FilterIcon, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { PageHeader } from "../../../../components/page-header";
import CreateNewBill from "./choose/createbillbtn";
import { BillFilters } from "./components/bill-filters";
import { BillMonthlyChart } from "./components/bill-monthly-chart";
import { BillStatCards } from "./components/bill-stat-cards";
import { BillStatusChart } from "./components/bill-status-chart";
import CreatePlanDialog from "./components/create-plan-dialog";
import { BillCardViewWithLoading } from "./old/bill-card-view-with-loading";
import { useHasUser } from "@/app/contexts/user";
import CreateCurrencyDialog from "./components/create-currency-dialog";

export default function BillDashboardPageClient({
  activeTab: a = "overview",
}: {
  activeTab: string;
}) {
  const [search, setSearch] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [activeTab, setActiveTab] = useState(a);
  const [showFilters, setShowFilters] = useState(false);

  const { user } = useHasUser();

  useEffect(() => {
    Cookies.set("bills-active-tab", activeTab);
  }, [activeTab]);

  const {
    data: bills,
    loading: isLoading,
    queryKey,
    count,
    lastElementRef,
  } = useInfiniteData<Bill>({
    keys: "bills",
    size: 20,
    params: { ...dateRange, search },
  });

  // Apply filters
  const handleFilter = (filtered: Bill[]) => {
    console.log("handle filter", filtered);
    // setFilteredBills(filtered);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageHeader
        title="Billing Dashboard"
        description="Overview of all billing activities and statistics"
        actions={
          <div className="flex gap-2">
            {isLoading ? (
              <>
                <Skeleton className="h-9 w-24" /> {/* Filters button */}
                <Skeleton className="h-9 w-24" /> {/* Export button */}
                <Skeleton className="h-9 w-32" />{" "}
                {/* CreateNewBill button/component */}
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <FilterIcon className="h-4 w-4 mr-2" />
                  Filters
                </Button>
                <Button variant="outline">
                  <DownloadIcon className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <CreateNewBill align="end" />
              </>
            )}
          </div>
        }
      />

      {showFilters && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <BillFilters
              search={search}
              setSearch={setSearch}
              dateRange={dateRange}
              setDateRange={setDateRange}
              bills={bills}
              onFilter={handleFilter}
            />
          </CardContent>
        </Card>
      )}

      <BillStatCards bills={bills} isLoading={isLoading} />

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger
              onClick={() => {
                console.log("log from trigger");
              }}
              value="overview"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              onClick={() => {
                console.log("log from trigger");
              }}
              value="recent"
            >
              Recent Bills
            </TabsTrigger>
            <TabsTrigger
              onClick={() => {
                console.log("log from trigger");
              }}
              value="analytics"
            >
              Analytics
            </TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            {isLoading ? (
              <>
                <Skeleton className="h-9 w-[130px]" />
                <Skeleton className="h-9 w-[156px]" />
              </>
            ) : (
              <>
                {(user.super_admin ||
                  user.role?.permissions?.plans?.includes("create")) && (
                  <CreatePlanDialog />
                )}
                {(user.super_admin ||
                  user.role?.permissions?.currencies?.includes("create")) && (
                  <CreateCurrencyDialog />
                )}
              </>
            )}
          </div>
        </div>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Bill Status Distribution</CardTitle>
                <CardDescription>
                  Distribution of bills by their current status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BillStatusChart bills={bills} isLoading={isLoading} />
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Monthly Billing Trend</CardTitle>
                <CardDescription>Total billing amount by month</CardDescription>
              </CardHeader>
              <CardContent>
                <BillMonthlyChart bills={bills} isLoading={isLoading} />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Bills</CardTitle>
              <CardDescription>Latest billing activities</CardDescription>
            </CardHeader>
            <CardContent>
              <BillCardViewWithLoading
                bills={bills.slice(0, 3)}
                isLoading={isLoading}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle>All Bills</CardTitle>
              <CardDescription>
                Complete list of all billing records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BillCardViewWithLoading bills={bills} isLoading={isLoading} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="col-span-1 md:col-span-2">
              <CardHeader>
                <CardTitle>Billing Trends</CardTitle>
                <CardDescription>
                  Historical view of billing amounts over time
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <BillMonthlyChart
                  bills={bills}
                  isLoading={isLoading}
                  fullSize
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status Distribution</CardTitle>
                <CardDescription>Bills grouped by status</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <BillStatusChart bills={bills} isLoading={isLoading} fullSize />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Branch Distribution</CardTitle>
                <CardDescription>Bills grouped by branch</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">
                    Branch distribution chart will be displayed here
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

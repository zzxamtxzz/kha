"use client";

import { useHasUser } from "@/app/contexts/user";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import ChooseClient from "../clients";
import FilterByBranch from "../filterbranch";
import ListCardNavigation from "@/app/(dashboard)/components/btn/listcart";

interface FilterSectionProps {
  search: string;
  setSearch: (value: string) => void;
  expired: string;
  setExpired: (value: string) => void;
  client: string;
  setClient: (value: string) => void;
  branch: string;
  setBranch: (value: string) => void;
  loading: boolean;
  resetFilters: () => void;
  onSearch?: () => void;
  showClientFilter?: boolean;
  showBranchFilter?: boolean;
}

export function ImprovedFilterSection({
  search,
  setSearch,
  expired,
  setExpired,
  client,
  setClient,
  branch,
  setBranch,
  loading,
  resetFilters,
  onSearch = () => {}, // Default empty function to prevent undefined errors
}: FilterSectionProps) {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const { user } = useHasUser();

  // Update active filters when filter values change
  useEffect(() => {
    const filters = [];
    if (search) filters.push("search");
    if (expired && expired !== "-") filters.push("status");
    if (client) filters.push("client");
    if (branch) filters.push("branch");
    setActiveFilters(filters);
  }, [search, expired, client, branch]);

  // Get status label for display
  const getStatusLabel = () => {
    switch (expired) {
      case "all":
        return "Expired";
      case "1":
        return "Expires in 1 month";
      case "2":
        return "Expires in 2 months";
      case "3":
        return "Expires in 3 months";
      default:
        return "All Devices";
    }
  };

  // Remove a specific filter
  const removeFilter = (type: string) => {
    switch (type) {
      case "search":
        setSearch("");
        break;
      case "status":
        setExpired("-");
        break;
      case "client":
        setClient("");
        break;
      case "branch":
        setBranch("");
        break;
    }
  };

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-0 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-medium">Filters</h2>

          <div className="flex items-center gap-2">
            {activeFilters.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={resetFilters}
                disabled={loading}
                className="h-9"
              >
                <X className="h-4 w-4 mr-1" />
                Clear all
              </Button>
            )}

            <Select
              value={expired}
              onValueChange={setExpired}
              disabled={loading}
            >
              <SelectTrigger id="filter-status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="-">All Devices</SelectItem>
                <SelectItem value="all">Expired</SelectItem>
                <SelectItem value="1">Expired in 1 month</SelectItem>
                <SelectItem value="2">Expired in 2 months</SelectItem>
                <SelectItem value="3">Expired in 3 months</SelectItem>
              </SelectContent>
            </Select>

            {(user.super_admin ||
              user.role?.permissions?.clients?.includes("read")) && (
              <ChooseClient
                onChange={async (client: any) => setClient(client.id)}
              />
            )}

            {(user.super_admin ||
              user.role?.permissions?.branches?.includes("read")) && (
              <FilterByBranch
                onChange={(branch: any) => setBranch(branch.id)}
              />
            )}
            <ListCardNavigation />
          </div>
        </div>

        {/* Search bar - always visible */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, serial number..."
            className="pl-10 pr-10 h-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSearch();
            }}
          />
          {search && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-10 px-3"
              onClick={() => setSearch("")}
              disabled={loading}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
        </div>

        {/* Active filter chips */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {expired && expired !== "-" && (
              <Badge
                variant="secondary"
                className="pl-2 h-6 gap-1 hover:bg-secondary/80 cursor-pointer"
                onClick={() => removeFilter("status")}
              >
                Status: {getStatusLabel()}
                <X className="h-3 w-3 ml-1" />
              </Badge>
            )}

            {client && (
              <Badge
                variant="secondary"
                className="pl-2 h-6 gap-1 hover:bg-secondary/80 cursor-pointer"
                onClick={() => removeFilter("client")}
              >
                Client Filter
                <X className="h-3 w-3 ml-1" />
              </Badge>
            )}

            {branch && (
              <Badge
                variant="secondary"
                className="pl-2 h-6 gap-1 hover:bg-secondary/80 cursor-pointer"
                onClick={() => removeFilter("branch")}
              >
                Branch Filter
                <X className="h-3 w-3 ml-1" />
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

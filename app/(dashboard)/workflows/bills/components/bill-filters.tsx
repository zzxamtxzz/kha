"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Bill from "@/models/bill";
import { SearchIcon, XIcon } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import type { DateRange } from "react-day-picker";
import ChooseBranch from "./choose-branch";
import { DatePickerWithRange } from "./date-picker-with-range";

interface BillFiltersProps {
  bills: Bill[];
  onFilter: (bills: Bill[]) => void;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  dateRange: DateRange | undefined;
  setDateRange: Dispatch<SetStateAction<DateRange | undefined>>;
}

export function BillFilters({
  bills,
  onFilter,
  dateRange,
  setDateRange,
  search,
  setSearch,
}: BillFiltersProps) {
  const [statusFilter, setStatusFilter] = useState("");
  const [branchFilter, setBranchFilter] = useState("");

  // Extract unique statuses and branches for filter options
  const statuses = Array.from(new Set(bills.map((bill) => bill.status?.group)));
  const branches = Array.from(
    new Set(bills.filter((bill) => bill.branch).map((bill) => bill.branch?.id))
  );
  const branchNames = new Map(
    bills
      .filter((bill) => bill.branch)
      .map((bill) => [bill.branch?.id, bill.branch?.name])
  );

  // Reset all filters
  const resetFilters = () => {
    setSearch("");
    setStatusFilter("");
    setBranchFilter("");
    setDateRange(undefined);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search by name, email, account..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger id="status">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {statuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() +
                    status.slice(1).replace("_", " ")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <ChooseBranch />

        <div className="space-y-2">
          <Label>Date Range</Label>
          <DatePickerWithRange date={dateRange} setDate={setDateRange} />
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={resetFilters}
          className="flex items-center"
        >
          <XIcon className="h-4 w-4 mr-2" />
          Reset Filters
        </Button>
      </div>
    </div>
  );
}

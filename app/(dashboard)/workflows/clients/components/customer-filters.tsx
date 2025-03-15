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
import Client from "@/models/client";
import { Search, X } from "lucide-react";
import { useState } from "react";

export function CustomerFilters({ customers }: { customers: Client[] }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deviceFilter, setDeviceFilter] = useState("all");

  // Apply filters whenever filter state changes
  // Reset all filters
  const resetFilters = () => {
    setStatusFilter("all");
    setDeviceFilter("all");
  };

  return (
    <div className="space-y-4 flex-1">
      <h2 className="text-lg font-medium">Filters</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Name, email, phone..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="devices">Devices</Label>
          <Select value={deviceFilter} onValueChange={setDeviceFilter}>
            <SelectTrigger id="devices">
              <SelectValue placeholder="Filter by devices" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Customers</SelectItem>
              <SelectItem value="with_devices">With Devices</SelectItem>
              <SelectItem value="no_devices">No Devices</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-end">
          <Button variant="outline" onClick={resetFilters} className="gap-2">
            <X className="h-4 w-4" />
            Reset Filters
          </Button>
        </div>
      </div>
    </div>
  );
}

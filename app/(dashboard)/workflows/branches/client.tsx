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
import Branch from "@/models/branch";
import { Plus } from "lucide-react";
import { useState } from "react";
import BranchItem from "./branch";

export default function UsersList() {
  const [search, setSearch] = useState("");
  const { data, loading, lastElementRef, isFetchingNextPage } =
    useInfiniteData<Branch>({
      keys: "branches",
      size: 10,
      params: { search },
    });

  if (loading && data.length === 0) {
    return <div className="p-4">Loading categories...</div>;
  }

  return (
    <Card className="p-2 border-none shadow-none">
      <CardHeader className="flex-row items-center justify-between p-0 mb-2">
        <div className="flex-1">
          <CardTitle>Branches</CardTitle>
          <CardDescription>Showing {data.length} branches</CardDescription>
        </div>
        {/* <CreateCategory> */}
        <Button>
          <Plus /> New Branch
        </Button>
        {/* </CreateCategory> */}
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-2">
          {data.map((branch) => (
            <BranchItem key={branch.id} branch={branch} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

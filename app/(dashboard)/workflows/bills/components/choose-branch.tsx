import { useInfiniteData } from "@/app/hooks/use-infinite-data";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Branch from "@/models/branch";
import { Dispatch, SetStateAction } from "react";

function ChooseBranch({
  branch,
  setBranch,
}: {
  branch: string;
  setBranch: Dispatch<SetStateAction<string>>;
}) {
  const { data, loading, queryKey, count, lastElementRef } =
    useInfiniteData<Branch>({
      keys: "branches",
      size: 20,
      params: {},
    });

  return (
    <div className="space-y-2">
      <Label htmlFor="branch">Branch</Label>
      <Select disabled={loading} value={branch} onValueChange={setBranch}>
        <SelectTrigger id="branch">
          <SelectValue placeholder="All Branches" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Branches</SelectItem>
          {data.map((branch) => (
            <SelectItem key={branch.id} value={branch.id}>
              {branch.name || "Unknown Branch"}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default ChooseBranch;

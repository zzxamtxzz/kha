import { useMutateInfiniteData } from "@/app/hooks/mutateInfinite";
import { useInfiniteData } from "@/app/hooks/use-infinite-data";
import axios from "@/axios";
import SpinLoading from "@/components/loadings/spinloading";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { groups } from "@/data/statuses";
import Bill from "@/models/bill";
import EventTracking from "@/models/events";
import Status from "@/models/statuses";
import { useQueryClient } from "@tanstack/react-query";
import { Dispatch, SetStateAction } from "react";

function Statuses({
  setStatus,
  setOpen,
  onChange,
  bill,
}: {
  setOpen: Dispatch<SetStateAction<boolean>>;
  setStatus: (status: Status) => void;
  onChange: (value: string) => void;
  bill?: Bill;
}) {
  const { data, loading, count, lastElementRef } = useInfiniteData<Status>({
    keys: "statuses",
    size: 20,
    params: {},
  });
  const queryClient = useQueryClient();
  const queryCache = queryClient.getQueryCache();
  const queryKeys = queryCache
    .getAll()
    .map((query) => query.queryKey)
    .filter((q) => q.includes(`events/${bill?.id}`));

  const { updateData } = useMutateInfiniteData();

  if (loading)
    return (
      <div className="h-20">
        <SpinLoading />
      </div>
    );

  return (
    <div className="max-h-[500px] overflow-y-auto">
      {groups.map((group, index) => {
        const statuses = data.filter((s) => s.group === group.id);
        return (
          <div className="flex flex-col gap-1" key={index}>
            <Label className="px-1 text-xs">{group.name}</Label>
            {statuses.map((status, index) => {
              return (
                <div
                  onClick={async () => {
                    if (bill?.id) {
                      const response = await axios.put(
                        `/api/bills/${bill.id}/status`,
                        {
                          status_id: status.id,
                        }
                      );
                      console.log("queryKeys", queryKeys);
                      queryKeys.map((queryKey) =>
                        updateData({
                          queryKey,
                          ...(response.data as EventTracking),
                          new: true,
                        })
                      );
                    }
                    setStatus(status);
                    setOpen(false);
                    onChange(status.id);
                  }}
                  className="hover cursor-pointer p-1"
                >
                  <Badge
                    style={{ backgroundColor: group.color, color: "#fff" }}
                    key={index}
                    className="cursor-pointer inline-flex items-center capitalize h-6 rounded-sm border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    {status.name}
                  </Badge>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default Statuses;

import axios from "@/axios";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import TrashModel from "@/models/trashes";
import { QueryKey, useQueryClient } from "@tanstack/react-query";
import { ArchiveRestore } from "lucide-react";
import { useState } from "react";

function DeviceTrashItem({
  trash,
  queryKey,
}: {
  trash: TrashModel;
  queryKey: QueryKey;
}) {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return (
    <div className="cart-bg rounded-lg p-2">
      <div className="flex items-center justify-between">
        <p className="font-semibold">
          {trash.client.name || trash.client.email}
        </p>
        <Button
          disabled={loading}
          onClick={async () => {
            try {
              setLoading(true);
              await axios.put(`/api/trashes/clients/${trash._id}`);
              toast({
                title: "Success",
                description: "Restore successfully",
              });
              const existData = queryClient.getQueryData(queryKey) as {
                pageParams: number[];
                pages: TrashModel[][];
              };

              if (existData) {
                queryClient.setQueryData(queryKey, {
                  ...existData,
                  pages: existData.pages.map((page) =>
                    page.filter((p) => p._id !== trash._id)
                  ),
                });
              }

              setLoading(false);
            } catch (error: any) {
              toast({
                title: "Error found",
                description: error.response?.data.error || error.message,
              });
              setLoading(false);
            }
          }}
          size={"icon"}
        >
          <ArchiveRestore className="w-4" />
        </Button>
      </div>
      <div>Delete by {trash.user.name || trash.user.email}</div>
    </div>
  );
}

export default DeviceTrashItem;

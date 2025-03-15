import { useMutateInfiniteData } from "@/app/hooks/mutateInfinite";
import { useInfiniteData } from "@/app/hooks/use-infinite-data";
import axios from "@/axios";
import { Popover } from "@/components/ui/popover";
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import Client from "@/models/client";
import Device from "@/models/devices";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

function ChooseClients({ device }: { device: Device }) {
  const [search, setSearch] = useState("");
  const { toast } = useToast();

  const { data, loading, queryKey, count, lastElementRef } =
    useInfiniteData<Client>({
      keys: "clients",
      size: 20,
      params: { search },
    });

  const { updateData } = useMutateInfiniteData();
  const queryClient = useQueryClient();
  const queryCache = queryClient.getQueryCache();
  const queryKeys = queryCache
    .getAll()
    .map((query) => query.queryKey)
    .filter((q) => q.includes("devices"));

  const onChoose = async (value: string) => {
    try {
      const response = await axios.put(`/api/devices/${device.id}`, {
        client_id: value,
      });

      queryKeys.map((queryKey) => {
        const update: any = {
          ...device,
          queryKey,
          client: data.find((d) => d.id.toString() === value),
        };

        updateData(update);
      });
    } catch (error: any) {
      toast({
        title: "Error found",
        description: error.response?.data?.error || error.message,
      });
    }
  };
  return (
    <Popover>
      <SelectTrigger className="w-[180px]">
        <SelectValue
          placeholder={
            device.client?.name || device.client?.email || "Select a client"
          }
        />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Clients</SelectLabel>
          {data.map((client) => (
            <SelectItem value={client.id.toString()}>
              {client.name || client.email}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Popover>
  );
}

export default ChooseClients;

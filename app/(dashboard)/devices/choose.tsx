import axios from "@/axios";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import Client from "@/models/client";
import DeviceModel from "@/models/devices";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMutateInfiniteData } from "../../hooks/mutateInfinite";

function ChooseClients({ device }: { device: DeviceModel }) {
  const { toast } = useToast();
  const { data = [] } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const response = await axios.get(`/api/clients`);
      return response.data as Client[];
    },
  });

  const { updateData } = useMutateInfiniteData();
  const queryClient = useQueryClient();
  const queryCache = queryClient.getQueryCache();
  const queryKeys = queryCache
    .getAll()
    .map((query) => query.queryKey)
    .filter((q) => q.includes("devices") && !q.includes("count"));

  return (
    <Select
      onValueChange={async (value) => {
        try {
          const response = await axios.put(`/api/devices/${device._id}`, {
            clientId: value,
          });

          queryKeys.map((queryKey) => {
            const update: any = {
              ...device,
              queryKey,
              client: data.find((d) => d._id.toString() === value),
            };

            updateData(update);
          });
        } catch (error: any) {
          toast({
            title: "Error found",
            description: error.response?.data?.error || error.message,
          });
        }
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select a client" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Fruits</SelectLabel>
          {data.map((client) => (
            <SelectItem value={client._id.toString()}>
              {client.name || client.email}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

export default ChooseClients;

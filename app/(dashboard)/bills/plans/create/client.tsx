"use client";
import { useMutateInfiniteData } from "@/app/hooks/mutateInfinite";
import axios from "@/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import PlanModel from "@/models/billplan";
import { useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const CreateDeviceClient = ({
  clients: c,
  edit: e,
}: {
  clients: string;
  edit: string;
}) => {
  const edit = JSON.parse(e);
  const clients = JSON.parse(c) as PlanModel[];
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    serviceFee: "",
    amountInPerMonth: "",
    remark: "",
    ...edit,
  });

  const router = useRouter();
  const { toast } = useToast();
  const { updateData } = useMutateInfiniteData();
  const queryClient = useQueryClient();
  const queryCache = queryClient.getQueryCache();
  const queryKeys = queryCache
    .getAll()
    .map((query) => query.queryKey)
    .filter((q) => q.includes("plans") && !q.includes("count"));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await axios.post("/api/plans", formData);
      console.log("Plan created:", response.data);
      queryKeys.map((queryKey) =>
        updateData({ ...response.data, new: true, queryKey })
      );
      router.back();
      setLoading(false);
    } catch (error: any) {
      console.error("Error:", error);
      toast({
        title: "Error found",
        description: error.response?.data?.error || error.message,
      });
      setLoading(false);
    }
  };

  const select = clients.find((c) => c.id.toString() == formData.client_id);

  return (
    <div className="w-full h-full p-4 center">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 p-4 w-[700px] mx-auto cart-bg shadow-sm rounded-lg"
      >
        <div className="relative">
          <p className="font-bold text-lg text-center">Add New Plan</p>
          <Button
            onClick={() => router.back()}
            type="reset"
            className="w-8 h-8 rounded-full p-0 absolute right-1 top-0"
          >
            <X className="w-4" />
          </Button>
        </div>
        <Label className="font-semibold capitalize" htmlFor="name">
          Plan Name
        </Label>
        <Input
          type="text"
          name="name"
          onChange={handleChange}
          placeholder="name"
          required
        />

        <Label className="font-semibold capitalize" htmlFor="kitNo">
          Service Fee
        </Label>
        <Input
          type="number"
          name="serviceFee"
          value={formData.serviceFee}
          onChange={handleChange}
          placeholder="Service Fee"
          required
        />
        <Label className="font-semibold capitalize" htmlFor="clientName">
          Amount In Per Month
        </Label>
        <Input
          type="number"
          name="amountInPerMonth"
          value={formData.amountInPerMonth}
          onChange={handleChange}
          placeholder="Amount"
          required
        />
        <Label className="font-semibold capitalize" htmlFor="remark">
          Remark
        </Label>
        <Textarea
          type="text"
          name="remark"
          value={formData.remark}
          //@ts-ignore
          onChange={handleChange}
          placeholder="Remark"
        />
        <Button disabled={loading} type="submit">
          Create Client
        </Button>
      </form>
    </div>
  );
};

export default CreateDeviceClient;

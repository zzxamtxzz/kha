"use client";
import axios from "@/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Client from "@/models/client";
import { useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useMutateInfiniteData } from "../../../hooks/mutateInfinite";

const CreateDeviceClient = ({
  clients: c,
  edit: e,
}: {
  clients: string;
  edit: string;
}) => {
  const edit = JSON.parse(e);
  const clients = JSON.parse(c) as Client[];
  const searchParams = useSearchParams();
  const client_id = searchParams.get("client_id");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    client_id,
    name: "",
    serviceFee: "",
    deviceSerial: "",
    accNo: "",
    kitNo: "",
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
    .filter((q) => q.includes("devices") && !q.includes("count"));

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
      const response = await axios.post("/api/devices", formData);
      const update = response.data;
      if (!formData.edit) update.new = true;

      queryKeys.map((queryKey) => updateData({ ...update, queryKey }));
      router.back();
      toast({
        title: "Succes",
        description: response.data.email + " device added successfully...",
      });
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
          <p className="font-bold text-lg text-center">Add New Device</p>
          <Button
            onClick={() => router.back()}
            type="reset"
            className="w-8 h-8 rounded-full p-0 absolute right-1 top-0"
          >
            <X className="w-4" />
          </Button>
        </div>
        <Label className="font-semibold capitalize" htmlFor="email">
          Email
        </Label>
        <Input
          type="text"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="email@gmail.com"
          required
        />
        <Label className="font-semibold capitalize" htmlFor="name">
          Device Name
        </Label>
        <Input
          type="text"
          name="name"
          onChange={handleChange}
          placeholder="name"
          value={formData.name}
          required
        />
        {!client_id && (
          <>
            <Label className="font-semibold capitalize" htmlFor="client_id">
              Client
            </Label>
            <Select
              onValueChange={(value) => {
                setFormData((prev: any) => ({ ...prev, client_id: value }));
              }}
              name="client_id"
            >
              <SelectTrigger>
                {select ? select.name : "Choose Client"}
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Choose Device</SelectLabel>
                  {clients.map((client, index) => {
                    return (
                      <SelectItem key={index} value={client.id.toString()}>
                        {client.name}
                      </SelectItem>
                    );
                  })}
                </SelectGroup>
              </SelectContent>
            </Select>
          </>
        )}
        <Label className="font-semibold capitalize" htmlFor="deviceSerial">
          Device Serial
        </Label>
        <Input
          type="text"
          name="deviceSerial"
          value={formData.deviceSerial}
          onChange={handleChange}
          placeholder="Device Serial"
          required
        />
        <Label className="font-semibold capitalize" htmlFor="clientName">
          Account No
        </Label>
        <Input
          type="text"
          name="accNo"
          value={formData.accNo}
          onChange={handleChange}
          placeholder="Acc No"
          required
        />
        <Label className="font-semibold capitalize" htmlFor="kitNo">
          Kit No
        </Label>
        <Input
          type="text"
          name="kitNo"
          value={formData.kitNo}
          onChange={handleChange}
          placeholder="Kit No"
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

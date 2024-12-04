"use client";
import axios from "@/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import PlanModel from "@/models/billplan";
import DeviceModel from "@/models/devices";
import { useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutateInfiniteData } from "../../../hooks/mutateInfinite";

const CreateBillClient = ({
  device: d,
  plans: p,
}: {
  device: string;
  plans: string;
}) => {
  const device = JSON.parse(d) as DeviceModel;
  const plans = JSON.parse(p) as PlanModel[];

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    deviceId: device._id,
    billingDate: "",
    planId: "",
    durationMonth: "",
    amount: "",
    serviceFee: "",
    remark: "",
  });

  const router = useRouter();
  const { toast } = useToast();
  const { updateData } = useMutateInfiniteData();
  const queryClient = useQueryClient();
  const queryCache = queryClient.getQueryCache();
  const queryKeys = queryCache
    .getAll()
    .map((query) => query.queryKey)
    .filter((q) => q.includes("bills") && !q.includes("count"));

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
      const response = await axios.post("/api/bills", formData);
      console.log("Bill created:", response.data);
      queryKeys.map((queryKey) =>
        updateData({ ...response.data, device, new: true, queryKey })
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

  const selectPlan = plans.find((c) => c._id.toString() == formData.planId);

  return (
    <div className="w-full h-screen overflow-y-auto p-4 center">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 p-4 w-[700px] mx-auto cart-bg shadow-sm rounded-lg"
      >
        <div className="relative">
          <p className="font-bold text-lg text-center">
            Creating New Bill for {device.name || device.email}
          </p>
          <Button
            onClick={() => router.back()}
            type="reset"
            className="w-8 h-8 rounded-full p-0 absolute right-1 top-0"
          >
            <X className="w-4" />
          </Button>
        </div>
        <Label className="font-semibold capitalize" htmlFor="clientId">
          Plan
        </Label>
        <Select
          onValueChange={(value) => {
            setFormData((prev) => ({ ...prev, planId: value }));
          }}
          name="planId"
        >
          <SelectTrigger>
            {selectPlan ? selectPlan.name : "Choose Plan"}
          </SelectTrigger>
          <SelectContent className="flex flex-col gap-2">
            <Label className="font-bold">Choose Plan</Label>
            {plans.map((plan, index) => {
              return (
                <SelectItem key={index} value={plan._id.toString()}>
                  * {plan.name}
                </SelectItem>
              );
            })}{" "}
            <Link
              href={"/bills/plans/create"}
              className="hover:underline p-2 text-center"
            >
              Click to create new plan
            </Link>
          </SelectContent>
        </Select>
        <Label className="font-semibold capitalize" htmlFor="billingDate">
          Billing Date
        </Label>
        <Input
          type="date"
          name="billingDate"
          value={formData.billingDate}
          onChange={handleChange}
          placeholder="Billing Date"
          required
        />
        <Label className="font-semibold capitalize" htmlFor="derationMonth">
          Duration Month
        </Label>
        <Input
          type="number"
          name="durationMonth"
          value={formData.durationMonth}
          onChange={handleChange}
          placeholder="Duration Month"
          required
        />
        <Label className="font-semibold capitalize" htmlFor="amount">
          Amount
        </Label>
        <Input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          placeholder="Enter amount"
          required
        />
        <Label className="font-semibold capitalize" htmlFor="serviceFee">
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

export default CreateBillClient;

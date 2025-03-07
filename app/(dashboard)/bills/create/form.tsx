"use client";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import axios from "@/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { CalendarIcon, X } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import Plans from "./plans";
import Devices from "./devices";
import Device from "@/models/devices";
import { useMutateInfiniteData } from "@/app/hooks/mutateInfinite";
import Plan from "@/models/billplan";

const formSchema = z.object({
  device_id: z.string(),
  billing_date: z.date(),
  plan_id: z.string(),
  duration_month: z.number(),
  amount: z.number(),
  fee: z.number(),
  remark: z.string().optional().nullable(),
});

const BillForm = ({
  defaultValues,
  device,
  onSuccess,
  className,
  plan,
}: {
  defaultValues: any;
  device?: Device | null;
  onSuccess: () => void;
  className?: string;
  plan?: Plan;
}) => {
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { toast } = useToast();
  const { updateData } = useMutateInfiniteData();
  const queryClient = useQueryClient();
  const queryCache = queryClient.getQueryCache();
  const queryKeys = queryCache
    .getAll()
    .map((query) => query.queryKey)
    .filter((q) => q.includes("bills"));

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      const response = await axios.post("/api/bills", values);
      queryKeys.map((queryKey) =>
        updateData({ ...response.data, new: true, queryKey })
      );
      onSuccess();
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

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className={cn(
          "flex flex-col gap-2 p-4 w-full h-full mx-auto",
          className
        )}
      >
        <div className="w-full flex-1 space-y-4">
          <div className="relative flex items-center justify-between">
            <p className="font-bold text-lg text-center">New Bill</p>
            <Button
              onClick={onSuccess}
              type="reset"
              className="w-8 h-8 rounded-full p-0 absolute right-1 top-0"
            >
              <X className="w-4" />
            </Button>
          </div>
          <FormField
            control={form.control}
            name="device_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Device</FormLabel>
                <Devices device={device} {...field} />
                <FormMessage />
              </FormItem>
            )}
          />{" "}
          <FormField
            control={form.control}
            name="plan_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Plan</FormLabel>
                <Plans plan={plan} {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="billing_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Billing Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => false}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="duration_month"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration month</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Duration month"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />{" "}
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="amount"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />{" "}
          <FormField
            control={form.control}
            name="fee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service fee</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="fee"
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="remark"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Remark</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Remark"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button disabled={loading} type="submit">
          Create
        </Button>
      </form>
    </Form>
  );
};

export default BillForm;

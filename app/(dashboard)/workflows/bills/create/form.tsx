"use client";
import { useFormContext } from "@/app/contexts/form-context";
import { useHasUser } from "@/app/contexts/user";
import { useMutateInfiniteData } from "@/app/hooks/mutateInfinite";
import axios from "@/axios";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import Device from "@/models/devices";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { CalendarIcon, Loader2, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm, useFormState } from "react-hook-form";
import { z } from "zod";
import ChooseBranch from "./branches";
import Currencies from "./currencies";
import Devices from "./devices";
import Plans from "./plans";
import StatusField from "./status";

const formSchema = z.object({
  device_id: z.string(),
  billing_date: z.date(),
  status_id: z.string().optional().nullable(),
  plan_id: z.string().min(1, { message: "Please choose a plan" }),
  branch_id: z.string(),
  duration_month: z
    .number()
    .min(1, { message: "Duration must be at least 1 month" })
    .max(24, { message: "Duration can't be more than 24 months" }),
  amount: z.number().optional().nullable(),
  currency_id: z.string().optional().nullable(),
  fee: z.number().optional().nullable(),
  remark: z.string().optional().nullable(),
});

const BillForm = ({
  defaultValues,
  onSuccess,
  className,
  onClose,
}: {
  defaultValues: any;
  device?: Device | null;
  onSuccess: () => void;
  className?: string;
  onClose?: () => void;
}) => {
  const [plan, setPlan] = useState(defaultValues.plan);
  const [currency, setCurrency] = useState(defaultValues.currency);
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...defaultValues,
      billing_date: defaultValues.billing_date
        ? new Date(defaultValues.billing_date)
        : new Date(),
    },
  });

  const { isDirty } = useFormState({ control: form.control });
  const { user } = useHasUser();
  const { setPrevent, setAlert } = useFormContext();
  const { toast } = useToast();
  const { updateData } = useMutateInfiniteData();
  const queryClient = useQueryClient();
  const queryCache = queryClient.getQueryCache();
  const queryKeys = queryCache
    .getAll()
    .map((query) => query.queryKey)
    .filter((q) => q.includes("bills"));

  const edit = defaultValues.id;
  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    setPrevent(false);
    try {
      const response = await axios.post("/api/bills", {
        ...values,
        edit,
      });
      queryKeys.map((queryKey) =>
        updateData({
          ...response.data,
          new: edit ? false : true,
          queryKey,
        })
      );
      queryClient.setQueryData(
        ["bill-detail", response.data.id],
        response.data
      );
      onSuccess();
    } catch (error: any) {
      console.error("Error:", error);
      toast({
        title: "Error found",
        description: error.response?.data?.error || error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isDirty) setPrevent(true);
  }, [isDirty]);

  // Update newSalary field when increment amount changes
  useEffect(() => {
    if (edit) return;
    if (plan) {
      form.setValue("duration_month", plan.duration_month || 2);
      form.setValue("amount", plan.amount || 100);
      form.setValue("fee", plan.amount || 100);
    }
  }, [plan, edit]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className={cn(
          "flex flex-col gap-2 w-full h-full mx-auto overflow-y-auto",
          className
        )}
      >
        <div className="w-full flex-1 space-y-4">
          <div className="w-full space-y-2 p-2">
            <div className="relative flex items-center justify-between">
              <p className="font-bold text-lg text-center">New Bill</p>
              <Button
                onClick={() => {
                  if (isDirty) {
                    setPrevent(true);
                    setAlert(true);
                  } else {
                    onClose && onClose();
                    onSuccess();
                  }
                }}
                type="reset"
                className="w-8 h-8 rounded-full p-0 absolute right-1 top-0"
              >
                <X className="w-4" />
              </Button>
            </div>
            {user.super_admin && (
              <FormField
                control={form.control}
                name="status_id"
                render={({ field }) => (
                  <FormItem>
                    <StatusField
                      onChange={field.onChange}
                      bill={defaultValues}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="device_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Device</FormLabel>
                  <Devices device={defaultValues.device} {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            {(user.super_admin ||
              user.role?.permissions?.plans?.includes("read")) && (
              <FormField
                control={form.control}
                name="plan_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plan</FormLabel>
                    <Plans plan={plan} {...field} setPlan={setPlan} />
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
          <Separator />
          <div className="w-full space-y-2 p-2">
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
                            !field.value
                              ? "text-muted-foreground"
                              : "border-green-500"
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
            <div className="flex items-center gap-2">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem className="flex-1">
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
              />
              <FormField
                control={form.control}
                name="currency_id"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Currency</FormLabel>
                    <Currencies
                      currency={currency}
                      {...field}
                      value={field.value || ""}
                      setCurrency={setCurrency}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex items-center gap-2">
              <FormField
                control={form.control}
                name="duration_month"
                render={({ field }) => (
                  <FormItem className="flex-1">
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
              />
              {user.super_admin && (
                <FormField
                  control={form.control}
                  name="fee"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Service fee</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="fee"
                          {...field}
                          value={field.value || ""}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
            <FormField
              control={form.control}
              name="remark"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Remark</FormLabel>
                  <FormControl>
                    {/* <Suggestions {...field} /> */}
                    <Textarea
                      placeholder="Enter the name"
                      className="flex-1"
                      value={field.value || ""}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="branch_id"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Choose a branch...</FormLabel>
                  <FormControl>
                    <ChooseBranch {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="flex items-center gap-2 p-2">
          <Button
            disabled={loading || !isDirty}
            type="submit"
            className="flex-1"
          >
            {loading ? <Loader2 className="w-4 animate-spin" /> : "Create"}
          </Button>
          {defaultValues.id && (
            <Button
              className="text-red-500 hover:text-red-600"
              size={"icon"}
              variant={"outline"}
              onClick={async () => {
                await axios.delete(`/api/bills/${defaultValues.id}`);
                queryKeys.map((queryKey) =>
                  updateData({ id: defaultValues.id, remove: true, queryKey })
                );
                queryClient.setQueryData(
                  ["bill-detail", defaultValues.id],
                  undefined
                );
                onSuccess();
              }}
            >
              <Trash2 className="w-4" />
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};

export default BillForm;

"use client";

import { useMutateInfiniteData } from "@/app/hooks/mutateInfinite";
import axios from "@/axios";
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Plan from "@/models/plan";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import ChooseCurrency from "./choose-currency";

// Form schema with validation
const formSchema = z.object({
  name: z.string().min(1, {
    message: "Please enter plan name",
  }),
  duration_month: z.coerce.number().int().positive({
    message: "Duration must be a positive number",
  }),
  currency_id: z.string().optional().nullable(),
  admin_amount: z.coerce.number().optional().nullable(),
  amount: z.coerce.number().positive({
    message: "Amount must be a positive number",
  }),
  fee: z.coerce.number().min(0, {
    message: "Fee cannot be negative",
  }),
  remark: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreatePlanForm({
  onSuccess,
  onClose,
  defaultValues,
}: {
  onSuccess: (data?: Plan) => void;
  onClose: () => void;
  defaultValues?: Plan;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {
      name: "",
      duration_month: 1,
      currency_id: null,
      admin_amount: null,
      amount: 0,
      fee: 0,
      remark: "",
    },
  });

  const { updateData } = useMutateInfiniteData();
  const queryClient = useQueryClient();
  const queryCache = queryClient.getQueryCache();
  const queryKeys = queryCache
    .getAll()
    .map((query) => query.queryKey)
    .filter((q) => q.includes("plans"));

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      const response = await axios.post("/api/plans", {
        ...values,
        edit: defaultValues?.edit,
      });
      console.log("Plan created:", response.data);
      queryKeys.map((queryKey) =>
        updateData({
          ...response.data,
          new: defaultValues?.edit ? false : true,
          queryKey,
        })
      );
      onSuccess(response.data);
    } catch (error: any) {
      console.error("Error:", error);
      toast({
        title: "Error found",
        description: error.response?.data?.error || error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Plan Name</FormLabel>
              <FormControl>
                <Input placeholder="Basic Plan" {...field} />
              </FormControl>
              <FormDescription>
                The name of the subscription plan.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="duration_month"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (Months)</FormLabel>
                <FormControl>
                  <Input type="number" min={1} {...field} />
                </FormControl>
                <FormDescription>
                  How long the plan lasts in months.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="currency_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Currency</FormLabel>
                <ChooseCurrency {...field} value={field.value || ""} />
                <FormDescription>
                  The currency for this plan's pricing.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input type="number" min={0} step={0.01} {...field} />
                </FormControl>
                <FormDescription>The plan's price.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="admin_amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Admin Amount</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    step={0.01}
                    value={field.value === null ? "" : field.value}
                    onChange={(e) => {
                      const value =
                        e.target.value === ""
                          ? null
                          : Number.parseFloat(e.target.value);
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <FormDescription>Optional administrative fee.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fee</FormLabel>
                <FormControl>
                  <Input type="number" min={0} step={0.01} {...field} />
                </FormControl>
                <FormDescription>Additional service fee.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="remark"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Remarks</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Additional notes about this plan..."
                  className="resize-none"
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Optional notes or description for this plan.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <CardFooter className="flex justify-end gap-2 px-0">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Plan
          </Button>
        </CardFooter>
      </form>
    </Form>
  );
}

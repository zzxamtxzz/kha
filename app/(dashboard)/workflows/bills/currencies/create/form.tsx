"use client";

import { useMutateInfiniteData } from "@/app/hooks/mutateInfinite";
import axios from "@/axios";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import Currency from "@/models/currency";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Please enter plan name",
  }),
  symbol: z.string().optional().nullable(),
  remark: z.string().optional(),
  use_as_default: z.boolean(),
});

const CurrencyForm = ({
  onClose,
  defaultValues,
  onSuccess,
  className,
}: {
  onClose: () => void;
  defaultValues?: any;
  onSuccess: (currency?: Currency) => void;
  className?: string;
}) => {
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      use_as_default: false,
      ...defaultValues,
    },
  });
  const { toast } = useToast();
  const { updateData } = useMutateInfiniteData();
  const queryClient = useQueryClient();
  const queryCache = queryClient.getQueryCache();
  const searchParams = useSearchParams();
  const edit = searchParams.get("edit");
  const queryKeys = queryCache
    .getAll()
    .map((query) => query.queryKey)
    .filter((q) => q.includes("currencies"));

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      const response = await axios.post("/api/currencies", {
        ...values,
        edit,
      });
      console.log("Plan created:", response.data);
      queryKeys.map((queryKey) =>
        updateData({
          ...response.data,
          new: edit ? false : true,
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
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className={cn(
          "flex flex-col gap-2 w-full mx-auto card-bg shadow-sm rounded-lg p-2",
          className
        )}
      >
        <div className="flex items-center justify-between">
          <h1 className="font-bold text-lg">New Currency</h1>
          <Button
            type="button"
            variant={"outline"}
            size={"icon"}
            onClick={() => onSuccess()}
          >
            <X />
          </Button>
        </div>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="symbol"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Symbol</FormLabel>
              <FormControl>
                <Input
                  placeholder="symbol"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="use_as_default"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Use as default</FormLabel>
                <FormDescription>
                  Currency will be automatically selected when you create a new
                  bill.
                </FormDescription>
              </div>
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
        <Button disabled={loading} type="submit">
          {loading ? <Loader2 /> : "Create"}
        </Button>
      </form>
    </Form>
  );
};

export default CurrencyForm;

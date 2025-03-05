"use client";
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
import axios from "@/axios";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Client from "@/models/client";
import { useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useMutateInfiniteData } from "../../../hooks/mutateInfinite";
import { useInfiniteData } from "@/app/hooks/useInfiniteData";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Clients from "./clients";

const formSchema = z.object({
  email: z.string(),
  client_id: z.string(),
  device_serial: z.string(),
  account_number: z.string(),
  kit_number: z.string(),
  fee: z.number(),
  remark: z.string().optional().nullable(),
});

const CreateDeviceClient = ({
  onSuccess,
  defaultValues,
}: {
  onSuccess: () => void;
  defaultValues: any;
}) => {
  const searchParams = useSearchParams();
  const client_id = searchParams.get("client_id");
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { toast } = useToast();
  const { updatedData } = useMutateInfiniteData();
  const queryClient = useQueryClient();
  const queryCache = queryClient.getQueryCache();
  const queryKeys = queryCache
    .getAll()
    .map((query) => query.queryKey)
    .filter((q) => q.includes("devices") && !q.includes("count"));

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      const response = await axios.post("/api/devices", values);
      const update = response.data;
      queryKeys.map((queryKey) => updatedData({ ...update, queryKey }));
      onSuccess();
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

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-2 p-4 w-[700px] mx-auto cart-bg shadow-sm rounded-lg"
      >
        <div className="relative">
          <p className="font-bold text-lg text-center">Add New Device</p>
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />{" "}
        {!defaultValues.client_id && (
          <FormField
            control={form.control}
            name="client_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client</FormLabel>
                <FormControl>
                  <Clients onChange={field.onChange} value={field.value} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="device_serial"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Device Serial</FormLabel>
              <FormControl>
                <Input placeholder="Device serial" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="account_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account number</FormLabel>
              <FormControl>
                <Input placeholder="account number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="kit_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kit number</FormLabel>
              <FormControl>
                <Input placeholder="kit number" {...field} />
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
                  placeholder="Enter remark"
                  className="resize-none"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={loading} type="submit">
          Create Client
        </Button>
      </form>
    </Form>
  );
};

export default CreateDeviceClient;

"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import axios from "@/axios";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import Clients from "./clients";
import Device from "@/models/devices";
import { useMutateInfiniteData } from "@/app/hooks/mutateInfinite";

const formSchema = z.object({
  email: z.string(),
  emails: z.array(z.string().email()).optional(),
  client_id: z.string(),
  device_serial: z.string(),
  account_number: z.string(),
  kit_number: z.string(),
  remark: z.string().optional().nullable(),
});

const CreateDeviceClient = ({
  onSuccess,
  defaultValues,
}: {
  onSuccess: (data?: Device) => void;
  defaultValues: any;
}) => {
  const searchParams = useSearchParams();
  const edit = searchParams.get("edit");
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "emails",
  });

  const { toast } = useToast();
  const { updateData } = useMutateInfiniteData();
  const queryClient = useQueryClient();
  const queryCache = queryClient.getQueryCache();
  const queryKeys = queryCache
    .getAll()
    .map((query) => query.queryKey)
    .filter((q) => q.includes("devices"));

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);
      const response = await axios.post("/api/devices", values);
      const update = response.data;
      queryKeys.map((queryKey) => updateData({ ...update, queryKey, edit }));
      onSuccess(response.data);
      toast({
        title: "Success",
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
          <p className="font-bold text-lg text-center">New Device</p>
          <Button
            onClick={() => onSuccess()}
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
        <FormField
          control={form.control}
          name="emails"
          render={() => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel className="">Add other emails</FormLabel>
                <Button
                  size={"icon"}
                  type="button"
                  onClick={() => append("")}
                  variant={"outline"}
                >
                  <Plus className="w-4" />
                </Button>
              </div>
              {fields.map((item, index) => (
                <FormField
                  key={item.id}
                  control={form.control}
                  name={`emails.${index}`}
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Input placeholder="New email" {...field} />
                      </FormControl>
                      <Button
                        className=""
                        size={"icon"}
                        type="button"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="w-4" />
                      </Button>
                    </FormItem>
                  )}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />
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
          Create
        </Button>
      </form>
    </Form>
  );
};

export default CreateDeviceClient;

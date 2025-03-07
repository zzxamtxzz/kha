"use client";
import axios from "@/axios";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import Client from "@/models/client";
import { useMutateInfiniteData } from "@/app/hooks/mutateInfinite";

const FormSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  first_name: z.string().min(1, {
    message: "Please enter account first name",
  }),
  last_name: z.string().optional().nullable(),
  name: z.string().min(3, {
    message: "Please enter client name",
  }),
  phone_number: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  remark: z.string().optional().nullable(),
});

const CreateClientForm = ({
  defaultValues,
  onSuccess,
}: {
  defaultValues: any;
  onSuccess: (data?: Client) => void;
}) => {
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues,
  });
  const { toast } = useToast();

  const searchParams = useSearchParams();
  const edit = searchParams.get("edit");
  const { updateData } = useMutateInfiniteData();
  const queryClient = useQueryClient();
  const queryCache = queryClient.getQueryCache();
  const queryKeys = queryCache
    .getAll()
    .map((query) => query.queryKey)
    .filter((q) => q.includes("clients") && !q.includes("count"));

  const handleSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
      setLoading(true);
      const response = await axios.post("/api/clients", values);
      console.log("Client created:", response.data, edit);
      const update = response.data;
      if (!edit) update.new = true;
      queryKeys.map((queryKey) => updateData({ ...update, queryKey }));
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
        className="flex flex-col gap-2 p-4 w-full mx-auto cart-bg shadow-sm rounded-lg"
      >
        <div className="relative w-full flex items-center justify-between">
          <h2 className="font-bold text-lg px-2">
            {edit ? "Update" : "New"} Client
          </h2>
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Client name</FormLabel>
              <FormControl>
                <Input placeholder="name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="first_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First name</FormLabel>
              <FormControl>
                <Input placeholder="First name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="last_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last name</FormLabel>
              <FormControl>
                <Input placeholder="Last name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone number</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Phone number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
          name="remark"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Remark</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Tell us a little bit about yourself"
                  className="resize-none"
                  {...field}
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

export default CreateClientForm;

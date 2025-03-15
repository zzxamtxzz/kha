"use client";
import { useMutateInfiniteData } from "@/app/hooks/mutateInfinite";
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
import { cn } from "@/lib/utils";
import Client from "@/models/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z.object({
  name: z.string().min(3, {
    message: "Please enter client name",
  }),
  remark: z.string().optional().nullable(),
});

const CreateBranchForm = ({
  defaultValues,
  onSuccess,
  className,
}: {
  defaultValues: any;
  onSuccess: (data?: Client) => void;
  className?: string;
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
    .filter((q) => q.includes("branches"));

  const handleSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
      setLoading(true);
      const response = await axios.post("/api/branches", { ...values, edit });
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
        className={cn(
          "flex flex-col gap-2 p-4 w-full mx-auto card-bg shadow-sm rounded-lg",
          className
        )}
      >
        <div className="relative w-full flex items-center justify-between">
          <h2 className="font-bold text-lg px-2">
            {edit ? "Update" : "New"} Branch
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
              <FormLabel>Branch name</FormLabel>
              <FormControl>
                <Input placeholder="name" {...field} />
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
                  placeholder="Tell us a little bit about yourself"
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

export default CreateBranchForm;

"use client";
import axios from "@/axios";
import { Button } from "@/components/ui/button";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutateInfiniteData } from "../../../hooks/mutateInfinite";

const FormSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  name: z.string().min(1, {
    message: "Please enter your name",
  }),
  username: z.string().min(1, {
    message: "Please enter your username",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters long",
  }),
  confirmPassword: z.string().min(6, {
    message: "Password must be at least 6 characters long",
  }),
  remark: z.string().optional(),
});

const CreateClientClient = ({ edit: e }: { edit: string }) => {
  const edit = JSON.parse(e);
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      name: "",
      remark: "",
      ...edit,
    },
  });
  const router = useRouter();
  const { toast } = useToast();

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

  return (
    <div className="w-full h-full p-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="flex flex-col gap-2 p-4 max-w-[700px] min-h-full mx-auto cart-bg shadow-sm rounded-lg"
        >
          <div className="relative w-full">
            <p className="font-bold text-lg text-center px-2">
              {edit ? "Updating" : "Creating"} New Client
            </p>
            {!edit && (
              <p className="my-2 inactive-text text-center">
                A user account will be automatically created for the new client.
              </p>
            )}
            <Button
              onClick={() => router.back()}
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
                <FormDescription>
                  Enter the email address of the client
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />{" "}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client Name</FormLabel>
                <FormControl>
                  <Input placeholder="name" {...field} />
                </FormControl>
                <FormDescription>Enter the name of the client</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Client Name</FormLabel>
                <FormControl>
                  <Input placeholder="name" {...field} />
                </FormControl>
                <FormDescription>Enter the name of the client</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {!edit && (
            <>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Name</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="name" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter the name of the client
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client Name</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="name" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter the name of the client
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
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
                <FormDescription>
                  You can <span>@mention</span> other users and organizations.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={loading} type="submit">
            Create Client
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateClientClient;

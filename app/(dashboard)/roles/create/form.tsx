"use client";
import { useHasUser } from "@/app/contexts/user";
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
import { modules } from "@/utils/name";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FormSchema, FormSchemaType } from "./type";

const env = process.env.NEXT_PUBLIC_NODE_ENV === "development";
export default function RoleForm({
  defaultValues,
}: {
  defaultValues: FormSchemaType;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    defaultValues: defaultValues
      ? {
          name: defaultValues.name,
          description: defaultValues.description,
          home: [
            ...Object.keys(defaultValues).filter((key) => defaultValues[key]),
          ],
          permissions:
            typeof defaultValues.permissions === "string"
              ? JSON.parse(defaultValues.permissions || "{}")
              : defaultValues.permissions,
          all_records:
            typeof defaultValues.all_records === "string"
              ? JSON.parse(defaultValues.all_records || "[]")
              : defaultValues.all_records
        }
      : {
          name: "",
          description: "",
          home: [],
          permissions: {},
          all_records: [],
        },
  });
  const { toast } = useToast();
  const { user } = useHasUser();
  const searchParams = useSearchParams();

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
      setLoading(true);
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/roles`,
        {
          ...data,
          edit: searchParams?.get("edit"),
        },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      router.back();
      setLoading(false);
    } catch (error: any) {
      toast({
        title: "Error found",
        variant: "destructive",
        description:
          error.response?.data.message ||
          error.response?.data.error ||
          error.message,
      });
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex items-center justify-end gap-2">
          <Button
            disabled={loading}
            onClick={() => router.back()}
            type="reset"
            variant={"outline"}
          >
            Cancel
          </Button>
          <Button disabled={loading} type="submit">
            Submit
          </Button>
        </div>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  className="font-semibold"
                  placeholder="name"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter description" {...field} />
              </FormControl>
              <FormDescription>Enter description for this role</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="home"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Sidebar</FormLabel>
                <FormDescription>
                  Select the items you want to display in the sidebar.
                </FormDescription>
              </div>
              {modules.map((item) => (
                <FormField
                  key={item}
                  control={form.control}
                  name="home"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={item}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(item)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, item])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== item
                                    )
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal capitalize">
                          {item}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />{" "}
        {modules.map((name, index) => {
          const fieldName = `permissions.${name}`;
          return (
            <FormField
              key={index}
              control={form.control}
              name={fieldName}
              render={() => (
                <FormItem className="flex gap-2 items-center justify-between">
                  <div className="mb-4">
                    <FormLabel className="text-base capitalize">
                      {name}
                    </FormLabel>
                    <FormDescription>
                      Select the actions you want to allow for {name}.
                    </FormDescription>
                  </div>
                  <div className="flex gap-2">
                    {["create", "read", "update", "delete"].map((item) => (
                      <FormField
                        key={item}
                        control={form.control}
                        name={fieldName}
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={item}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(item)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([
                                          ...(field.value || []),
                                          item,
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== item
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal capitalize">
                                {item}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          );
        })}
        <div className="flex items-center justify-end gap-2">
          <Button
            disabled={loading}
            type="reset"
            variant={"outline"}
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button disabled={loading} type="submit">
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}

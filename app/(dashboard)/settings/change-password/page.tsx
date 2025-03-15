"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useHasUser } from "@/app/contexts/user";
import axios from "@/axios";
import { Button } from "@/components/ui/button";

function ChangePassword() {
  const [loading, setLoading] = useState(false);
  const [existPassword, setExistPassword] = useState("");
  const [response, setResponse] = useState("");
  const { user } = useHasUser();

  const formSchema = z
    .object({
      oldPassword: z.string().min(existPassword ? 6 : 0, {
        message: "Old password must be at least 6 characters.",
      }),
      password: z.string().min(6, {
        message: "New password must be at least 6 characters.",
      }),
      confirmPassword: z.string().min(6, {
        message: "Confirm password must be at least 6 characters.",
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      oldPassword: "",
    },
  });

  const setError = form.setError;
  const { errors, isSubmitting, isValid } = form.formState;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/password`,
        values,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setResponse(response.data.message);
    } catch (error: any) {
      setError("root", { message: error.response.data.error });
    }
  }

  useEffect(() => {
    const getPassword = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/password`,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        console.log("reaponse password", response);
        setExistPassword(response.data);
      } catch (error) {
        console.log("error", error);
      } finally {
        setLoading(false);
      }
    };
    getPassword();
  }, []);

  if (loading) return <div className="center w-full">loading...</div>;

  return (
    <div className="w-full pt-4 h-full">
      <p className="px-4 font-bold text-2xl pb-4">Reset Password</p>
      <div className="w-full center">
        {response ? (
          response
        ) : (
          <Form {...form}>
            <form
              className="pt-4 w-1/2 mx-auto space-y-2"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              {errors.root && (
                <p className="text-red-600 text-center">
                  {errors.root.message}
                </p>
              )}
              {existPassword && (
                <FormField
                  control={form.control}
                  name="oldPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter Old Password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter New Password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter Confirm Password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                disabled={isSubmitting || !isValid}
                className="w-full"
                type="submit"
              >
                {isSubmitting ? "Submitting" : "Submit"}
              </Button>
            </form>
          </Form>
        )}
      </div>
    </div>
  );
}

export default ChangePassword;

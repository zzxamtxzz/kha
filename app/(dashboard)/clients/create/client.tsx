"use client";
import axios from "@/axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutateInfiniteData } from "../../../hooks/mutateInfinite";

const CreateClientClient = ({ edit: e }: { edit: string }) => {
  const edit = JSON.parse(e);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    name: "",
    remark: "",
    ...edit,
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await axios.post("/api/clients", formData);
      console.log("Client created:", response.data, edit);
      const update = response.data;
      if (!formData.edit) update.new = true;

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
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 p-4 max-w-[700px] min-h-full mx-auto cart-bg shadow-sm rounded-lg"
      >
        <div className="relative w-full">
          <p className="font-bold text-lg text-center px-2">
            {formData.edit ? "Updating" : "Creating"} New Client
          </p>
          {!formData.edit && (
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
        <Label className="font-semibold capitalize" htmlFor="email">
          Email
        </Label>
        <Input
          type="text"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="email@gmail.com"
          required
        />
        <Label className="font-semibold capitalize" htmlFor="clientName">
          Name
        </Label>
        <Input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Client Name"
          required
        />
        <Label className="font-semibold capitalize" htmlFor="email">
          username
        </Label>
        {!formData.edit && (
          <>
            <Input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="@john"
              required
            />
            <Label className="font-semibold capitalize" htmlFor="email">
              Password
            </Label>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter Password"
              required
            />
            <Label className="font-semibold capitalize" htmlFor="email">
              Confirm password
            </Label>
            <Input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Enter Password again"
              required
            />
          </>
        )}
        <Label className="font-semibold capitalize" htmlFor="clientName">
          Remark
        </Label>
        <Textarea
          name="remark"
          value={formData.remark}
          //@ts-ignore
          onChange={(e) => handleChange(e)}
          placeholder="Remark"
        />
        <Button disabled={loading} type="submit">
          Create Client
        </Button>
      </form>
    </div>
  );
};

export default CreateClientClient;

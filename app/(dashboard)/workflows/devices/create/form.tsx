"use client";

import axios from "@/axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import Device from "@/models/devices";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Barcode,
  CalendarIcon,
  Cpu,
  Hash,
  Info,
  Save,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import ChooseClient from "../clients";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { useHasUser } from "@/app/contexts/user";

// Define the form schema with validation
const deviceFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  snNo: z.string().min(1, { message: "Serial number is required" }),
  first_name: z.string().min(1, { message: "First name is required" }),
  last_name: z.string().min(1, { message: "Last name is required" }),
  accNo: z.string().min(1, { message: "Account number is required" }),
  kitNo: z.string().min(1, { message: "Kit number is required" }),
  due_date: z.date(),
  remark: z.string().optional(),
  client_id: z.string().optional(),
  branch_id: z.string().optional(),
});

type DeviceFormValues = z.infer<typeof deviceFormSchema>;

export default function CreateDeviceForm({
  defaultValues,
  onSuccess = () => {},
}: {
  defaultValues?: Device;
  onSuccess?: (device: Device) => void;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedClient, setSelectedClient] = useState<{
    id: string;
    name?: string;
    email: string;
  } | null>(null);

  // Initialize the form with default values
  const form = useForm<DeviceFormValues>({
    resolver: zodResolver(deviceFormSchema),
    defaultValues: defaultValues || {
      email: "",
      snNo: "",
      first_name: "",
      last_name: "",
      accNo: "",
      kitNo: "",
      due_date: new Date(),
      remark: "",
      client_id: "",
      branch_id: "",
    },
  });

  const { user } = useHasUser();

  // Handle form submission
  async function onSubmit(data: DeviceFormValues) {
    setIsSubmitting(true);

    try {
      // In a real application, you would make an API call here
      console.log("Form data submitted:", data);

      // Simulate API call delay
      const response = await axios.post(`/api/devices`, data);

      toast({
        title: "Device created successfully",
        description: `Device ${data.snNo} has been created.`,
      });

      // Navigate back to devices list
      onSuccess(response.data);
    } catch (error) {
      console.error("Error creating device:", error);
      toast({
        title: "Error creating device",
        description:
          "There was an error creating the device. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  // Handle client selection
  const handleClientChange = async (client: {
    id: string;
    name?: string;
    email: string;
  }) => {
    setSelectedClient(client);
    form.setValue("client_id", client.id);
    form.setValue("email", client.email);
  };

  // Add useEffect to handle browser navigation events
  useEffect(() => {
    // Handle browser's back/forward navigation or tab close
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (form.formState.isDirty) {
        // Standard way to show a confirmation dialog when closing/refreshing
        e.preventDefault();
        e.returnValue = "";
        return "";
      }
    };

    // Handle Next.js router events
    const handleRouteChangeStart = (url: string) => {
      if (
        form.formState.isDirty &&
        !window.confirm(
          "You have unsaved changes. Are you sure you want to leave?"
        )
      ) {
        router.events.emit("routeChangeError");
        // This throws an error to stop the route change
        throw new Error("Route change aborted due to unsaved changes");
      }
    };

    // Add event listeners
    window.addEventListener("beforeunload", handleBeforeUnload);

    // For Next.js App Router, we need to use the window history events
    // since router.events is not available in App Router
    const handlePopState = (e: PopStateEvent) => {
      if (
        form.formState.isDirty &&
        !window.confirm(
          "You have unsaved changes. Are you sure you want to leave?"
        )
      ) {
        // Push the current state back to the history to prevent navigation
        window.history.pushState(null, "", window.location.href);
      }
    };

    window.addEventListener("popstate", handlePopState);

    // Clean up event listeners
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [form.formState.isDirty, router]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Client Information Card */}
        {(user.super_admin ||
          user.role?.permissions?.clients?.includes("read")) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="mr-2 h-5 w-5" />
                Client Information
              </CardTitle>
              <CardDescription>
                Link this device to an existing client or create it without a
                client
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 flex flex-col">
                <FormLabel>Client</FormLabel>
                <ChooseClient onChange={handleClientChange} />
                {selectedClient && (
                  <div className="mt-2 p-3 bg-muted rounded-md">
                    <p className="font-medium">
                      {selectedClient.name || "Unnamed Client"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {selectedClient.email}
                    </p>
                  </div>
                )}
                <p className="text-sm text-muted-foreground">
                  Select an existing client to associate with this device, or
                  leave empty to create a standalone device
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Device Details Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Cpu className="mr-2 h-5 w-5" />
              Device Details
            </CardTitle>
            <CardDescription>
              Enter the basic information for this device
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
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
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="john.doe@example.com"
                        {...field}
                        value={
                          selectedClient ? selectedClient.email : field.value
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="due_date"
                render={({ field }) => (
                  <FormItem className="flex flex-1 flex-col">
                    <FormLabel>Due Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal mt-2",
                              !field.value
                                ? "text-muted-foreground"
                                : "border-green-500"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => false}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="snNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <Barcode className="mr-1 h-4 w-4" />
                      Serial Number
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="4PBA00701473" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="kitNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <Hash className="mr-1 h-4 w-4" />
                      Kit Number
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="KIT400772741" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="accNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    <Cpu className="mr-1 h-4 w-4" />
                    Account Number
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="ACC-5637660-70945-23" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Additional Information Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Info className="mr-2 h-5 w-5" />
              Additional Information
            </CardTitle>
            <CardDescription>Optional details and remarks</CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="remark"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Remarks</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any additional notes or remarks about this device"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    This will be displayed as a status tag on the device card
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (form.formState.isDirty) {
                  const confirmed = window.confirm(
                    "You have unsaved changes. Are you sure you want to leave?"
                  );
                  if (!confirmed) {
                    return; // Stay on the form if user cancels
                  }
                }
                router.back();
              }}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>Processing...</>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Create Device
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}

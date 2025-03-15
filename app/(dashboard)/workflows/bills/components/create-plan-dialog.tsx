"use client";

import { useMutateInfiniteData } from "@/app/hooks/mutateInfinite";
import axios from "@/axios";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import ChooseCurrency from "../plans/create/choose-currency";

// Form schema with validation
const formSchema = z.object({
  name: z.string().min(1, {
    message: "Please enter plan name",
  }),
  duration_month: z.coerce.number().int().positive({
    message: "Duration must be a positive number",
  }),
  currency_id: z.string().optional().nullable(),
  admin_amount: z.coerce.number().optional().nullable(),
  amount: z.coerce.number().positive({
    message: "Amount must be a positive number",
  }),
  fee: z.coerce.number().min(0, {
    message: "Fee cannot be negative",
  }),
  remark: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreatePlanDialog({
  defaultValues,
}: {
  defaultValues?: any;
}) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [attemptingClose, setAttemptingClose] = useState(false);

  // Initialize form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {
      name: "",
      duration_month: 1,
      currency_id: null,
      admin_amount: null,
      amount: 0,
      fee: 0,
      remark: "",
    },
  });

  const { updateData } = useMutateInfiniteData();
  const queryClient = useQueryClient();
  const queryCache = queryClient.getQueryCache();
  const queryKeys = queryCache
    .getAll()
    .map((query) => query.queryKey)
    .filter((q) => q.includes("plans"));

  // Track if the form is dirty (has unsaved changes)
  const isDirty = form.formState.isDirty;

  // Handle dialog close attempt
  const handleDialogOpenChange = (open: boolean) => {
    // If trying to close and form has unsaved changes
    if (!open && isDirty && !isSubmitting) {
      setAttemptingClose(true);
      setAlertOpen(true);
      return;
    }

    // Otherwise, just close/open normally
    setDialogOpen(open);
  };

  // Handle confirmation of dialog close
  const handleConfirmClose = () => {
    setAlertOpen(false);
    form.reset();
    setDialogOpen(false);
    setAttemptingClose(false);
  };

  // Handle cancellation of dialog close
  const handleCancelClose = () => {
    setAlertOpen(false);
    setAttemptingClose(false);
    // Keep the dialog open
  };

  async function onSubmit(values: FormValues) {
    try {
      setIsSubmitting(true);

      // In a real app, you would submit to an API
      console.log("Form values:", values);

      // Simulate API call
      const response = await axios.post("/api/plans", {
        ...values,
        edit: defaultValues.id,
      });

      toast({
        title: "Plan created successfully",
        description: `Plan "${values.name}" has been created.`,
      });
      queryKeys.map((queryKey) =>
        updateData({
          ...response.data,
          new: defaultValues.id ? false : true,
          queryKey,
        })
      );
      queryClient.setQueryData(
        ["plan-detail", response.data.id],
        response.data
      );

      // Close the dialog and reset the form
      form.reset();
      setDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Error creating plan",
        description:
          error.message || "An error occurred while creating the plan.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
        <DialogTrigger asChild>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Plan
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Plan</DialogTitle>
            <DialogDescription>
              Add a new subscription plan to the system.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plan Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Basic Plan" {...field} />
                    </FormControl>
                    <FormDescription>
                      The name of the subscription plan.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="duration_month"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (Months)</FormLabel>
                      <FormControl>
                        <Input type="number" min={1} {...field} />
                      </FormControl>
                      <FormDescription>
                        How long the plan lasts in months.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="currency_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency</FormLabel>
                      <ChooseCurrency {...field} value={field.value || ""} />
                      <FormDescription>
                        The currency for this plan's pricing.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} step={0.01} {...field} />
                      </FormControl>
                      <FormDescription>The plan's price.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="admin_amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Admin Amount</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          step={0.01}
                          value={field.value === null ? "" : field.value}
                          onChange={(e) => {
                            const value =
                              e.target.value === ""
                                ? null
                                : Number.parseFloat(e.target.value);
                            field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Optional administrative fee.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fee</FormLabel>
                      <FormControl>
                        <Input type="number" min={0} step={0.01} {...field} />
                      </FormControl>
                      <FormDescription>Additional service fee.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="remark"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Remarks</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Additional notes about this plan..."
                        className="resize-none"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Optional notes or description for this plan.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleDialogOpenChange(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Create Plan
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Alert Dialog for unsaved changes */}
      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard unsaved changes?</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes to this plan that will be lost if you
              close this dialog.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelClose}>
              Continue Editing
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmClose}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Discard Changes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

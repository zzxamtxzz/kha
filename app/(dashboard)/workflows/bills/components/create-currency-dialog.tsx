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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Form schema with validation
const formSchema = z.object({
  name: z.string().min(1, {
    message: "Please enter currency name",
  }),
  symbol: z.string().optional().nullable(),
  remark: z.string().optional(),
  use_as_default: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateCurrencyDialog({
  defaultValues,
}: {
  defaultValues: any;
}) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [attemptingClose, setAttemptingClose] = useState(false);

  const { updateData } = useMutateInfiniteData();
  const queryClient = useQueryClient();
  const queryCache = queryClient.getQueryCache();
  const queryKeys = queryCache
    .getAll()
    .map((query) => query.queryKey)
    .filter((q) => q.includes("currencies"));

  // Initialize form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {
      name: "",
      symbol: "",
      remark: "",
      use_as_default: false,
    },
  });

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
      const response = await axios.post("/api/currencies", {
        ...values,
        edit: defaultValues.id,
      });

      toast({
        title: "Currency created successfully",
        description: `Currency "${values.name}" has been created.`,
      });

      queryKeys.map((queryKey) =>
        updateData({
          ...response.data,
          new: defaultValues.id ? false : true,
          queryKey,
        })
      );
      queryClient.setQueryData(
        ["currency-detail", response.data.id],
        response.data
      );

      // Close the dialog and reset the form
      form.reset();
      setDialogOpen(false);

      // Call the callback if provided
    } catch (error: any) {
      toast({
        title: "Error creating currency",
        description:
          error.message || "An error occurred while creating the currency.",
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
            Create Currency
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px] w-[700px]">
          <DialogHeader>
            <DialogTitle>Create New Currency</DialogTitle>
            <DialogDescription>
              Add a new currency to the system.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Currency Name</FormLabel>
                    <FormControl>
                      <Input placeholder="US Dollar" {...field} />
                    </FormControl>
                    <FormDescription>
                      The name of the currency (e.g., US Dollar, Euro).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="symbol"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Symbol</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="$"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value || null)}
                      />
                    </FormControl>
                    <FormDescription>
                      The currency symbol (e.g., $, €, £).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="remark"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Remarks</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Additional notes about this currency..."
                        className="resize-none"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Optional notes or description for this currency.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="use_as_default"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">
                        Default Currency
                      </FormLabel>
                      <FormDescription>
                        Set this as the default currency for the system.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
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
                  Create Currency
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
              You have unsaved changes that will be lost if you close this
              dialog.
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

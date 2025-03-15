import { useMutateInfiniteData } from "@/app/hooks/mutateInfinite";
import axios from "@/axios";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { QueryKey } from "@tanstack/react-query";
import {
    ChangeEvent,
    ChangeEventHandler,
    KeyboardEvent,
    useState,
} from "react";
import { useForm } from "react-hook-form";
import TextareaAutosize from "react-textarea-autosize";
import { z } from "zod";

const formSchema = z.object({
  notes: z.string().min(1, {
    message: "Please enter comment",
  }),
});

function EventForm({
  queryKey,
  data_id,
}: {
  queryKey: QueryKey;
  data_id: string;
}) {
  const [loading, setLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { notes: "" },
  });
  const { updateData } = useMutateInfiniteData();

  const handleKeyDown = (
    event: KeyboardEvent<HTMLTextAreaElement>,
    onChange: ChangeEventHandler<HTMLTextAreaElement>
  ) => {
    if (event.key === "Enter" && event.shiftKey) {
      event.preventDefault();

      const { selectionStart, selectionEnd, value } =
        event.target as HTMLTextAreaElement;
      const newValue = `${value.substring(
        0,
        selectionStart
      )}\n${value.substring(selectionEnd)}`;

      // Update the input value with the new line inserted
      const syntheticEvent = {
        target: { value: newValue },
      } as ChangeEvent<HTMLTextAreaElement>;
      onChange(syntheticEvent);

      // Move the cursor to the correct position
      setTimeout(() => {
        (event.target as HTMLTextAreaElement).setSelectionRange(
          selectionStart + 1,
          selectionStart + 1
        );
      }, 0);
    } else if (event.key === "Enter") {
      // Prevent the default behavior of the Enter key
      event.preventDefault();

      // Submit the form
      form.handleSubmit(onSubmit)();
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const response = await axios.post(`/api/events/${data_id}`, values);
      updateData({ ...response.data, queryKey, new: true });
      form.reset();
    } catch (error: any) {
      console.log("error", error);
      toast({
        title: "Error found",
        description: error.response?.data.message || error.message,
        variant: "success",
        className: cn(
          "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4"
        ),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <TextareaAutosize
                    disabled={loading}
                    className="w-full rounded-sm h-auto nav-bg py-1 px-2 resize-none outline-none focus:border-blue-500 border"
                    placeholder="Comment"
                    {...field}
                    minRows={2}
                    maxRows={7}
                    onKeyDown={(event) => handleKeyDown(event, field.onChange)}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button className="hidden" type="submit"></Button>
        </form>
      </Form>
      <p>Enter, to send</p>
      <p>Shift + Enter, to add a new line</p>
    </div>
  );
}

export default EventForm;

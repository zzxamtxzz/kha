import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useMutateInfiniteData } from "@/app/hooks/mutateInfinite";
import { useInfiniteData } from "@/app/hooks/useInfiniteData";
import axios from "@/axios";
import { Button } from "@/components/ui/button";
import EventTracking from "@/models/events";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import dayjs from "dayjs";
import { Label } from "@/components/ui/label";
import { Fragment } from "react";
import { Badge } from "@/components/ui/badge";
import { File, MessageSquare } from "lucide-react";

const status: { [key: string]: JSX.Element | string } = {
  status: <Badge className="bg-blue-500">New</Badge>,
  comment: (
    <Badge className="p-0 px-1">
      <MessageSquare className="w-4" />
    </Badge>
  ),
  task: "Task",
  file: <File />,
};

const formSchema = z.object({
  notes: z.string().min(1, {
    message: "Please enter comment",
  }),
});

function Events({ data_id }: { data_id: string }) {
  const {
    data: events,
    loading,
    queryKey,
    count,
    lastElementRef,
  } = useInfiniteData<EventTracking>({
    keys: `events/${data_id}`,
    size: 20,
    params: {},
  });

  const { updateData } = useMutateInfiniteData();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { notes: "" },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const response = await axios.post(`/api/events/${data_id}`, values);
    updateData({ ...response.data, queryKey, new: true });
    form.reset();
  };
  let lastDate = "";

  return (
    <div className="w-[380px] h-full p-4 flex flex-col">
      <div className="flex">
        <Button className="flex-1 rounded-r-none" variant={"outline"}>
          All events
        </Button>
        <Button className="flex-1 rounded-l-none" variant={"outline"}>
          Comments
        </Button>
      </div>
      <div className="flex flex-col overflow-y-auto flex-1 justify-start gap-4 py-4">
        {events
          .slice()
          .reverse()
          .map((chat, index) => {
            const currentDate = dayjs(chat.created_at).format("DD MMMM");
            const showDate = currentDate !== lastDate;
            lastDate = currentDate;

            return (
              <Fragment key={index}>
                {showDate && (
                  <Label className="text-center">{currentDate}</Label>
                )}
                <div className="chat-message">
                  <div className="flex gap-2 items-center justify-between">
                    <div className="flex gap-2 items-center">
                      {status[chat.event_type]}
                      <Label>{chat.created_by.name}</Label>
                    </div>{" "}
                    <span className="text-xs">
                      {dayjs(chat.created_at).format("HH:mm")}
                    </span>
                  </div>
                  <div className="pl-4 text-xs py-2">
                    <p>{chat.description}</p>
                    <p>{chat.notes}</p>
                  </div>
                </div>
              </Fragment>
            );
          })}
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex items-center justify-between rounded-sm nav-bg py-1 px-2"
        >
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <input placeholder="Comment" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <Button className="hidden"></Button>
        </form>
      </Form>
    </div>
  );
}

export default Events;

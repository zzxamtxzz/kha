import { useHasUser } from "@/app/contexts/user";
import { useInfiniteData } from "@/app/hooks/use-infinite-data";
import SpinLoading from "@/components/loadings/spinloading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { groups } from "@/data/statuses";
import EventTracking from "@/models/events";
import dayjs from "dayjs";
import { File, MessageSquare, Trash2 } from "lucide-react";
import { Fragment } from "react";
import EventForm from "./form";

const status: { [key: string]: JSX.Element | string } = {
  comment: (
    <Badge className="p-0 px-1">
      <MessageSquare className="w-4" />
    </Badge>
  ),
  task: "Task",
  file: <File />,
};

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

  const { user } = useHasUser();

  let lastDate = "";

  return (
    <div className="w-[420px] h-full flex flex-col">
      <div className="flex p-4">
        <Button className="flex-1 rounded-r-none" variant={"outline"}>
          All events
        </Button>
        <Button className="flex-1 rounded-l-none" variant={"outline"}>
          Comments
        </Button>
      </div>
      <div className="flex overflow-y-auto flex-1 justify-start gap-4 py-4 p-4 flex-col-reverse">
        {loading && <SpinLoading />}
        {events
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .map((chat, index) => {
            const currentDate = dayjs(chat.created_at).format("DD MMMM");

            const nextChatDate =
              index + 1 < events.length
                ? dayjs(events[index + 1].created_at).format("DD MMMM")
                : null;
            const isLastMessageOfTheDay = nextChatDate !== currentDate;

            lastDate = currentDate;
            const group = groups.find((g) => g.id === chat.status?.group);
            return (
              <Fragment key={index}>
                <div>
                  <div className="flex gap-2 items-center justify-between">
                    <div className="flex gap-2 items-center">
                      {chat.status ? (
                        <Badge
                          style={{
                            backgroundColor: group?.color,
                            color: "#fff",
                          }}
                          key={index}
                          className="cursor-pointer inline-flex items-center capitalize h-6 rounded-sm border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        >
                          {chat.status.name}
                        </Badge>
                      ) : (
                        status[chat.event_type]
                      )}
                      <Label>{chat.created_by.name}</Label>
                    </div>{" "}
                    <span className="text-xs">
                      {dayjs(chat.created_at).format("HH:mm")}
                    </span>
                  </div>
                  <div className="pl-4 text-xs py-2">
                    <p>{chat.description}</p>
                    <div className="flex items-center justify-between">
                      <p>{chat.notes}</p>
                      {chat.event_type === "comment" &&
                        user.id === chat.created_by_id && (
                          <Button
                            className="p-0"
                            size={"icon"}
                            variant={"outline"}
                          >
                            <Trash2 className="w-4" />
                          </Button>
                        )}
                    </div>
                  </div>
                </div>
                {isLastMessageOfTheDay && (
                  <Label className="text-center">{currentDate}</Label>
                )}
              </Fragment>
            );
          })}
      </div>
      <EventForm queryKey={queryKey} data_id={data_id} />
    </div>
  );
}

export default Events;

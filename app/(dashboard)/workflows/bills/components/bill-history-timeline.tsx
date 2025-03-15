import { format } from "date-fns";
import { Clock, FileText, AlertCircle } from "lucide-react";

interface BillHistoryTimelineProps {
  bill: any; // Using any for simplicity, would use a proper type in a real app
}

export function BillHistoryTimeline({ bill }: BillHistoryTimelineProps) {
  // In a real application, you would fetch the bill history from an API
  // For this example, we'll create some mock history events based on the bill data

  const historyEvents = [
    {
      id: 1,
      type: "created",
      date: bill.created_at,
      user: bill.created_by?.name || "System",
      description: "Bill was created",
      icon: FileText,
      iconColor: "text-blue-500",
    },
    {
      id: 2,
      type: "status",
      date: bill.created_at,
      user: bill.created_by?.name || "System",
      description: `Status set to "${bill.status.name}"`,
      icon: AlertCircle,
      iconColor: "text-yellow-500",
    },
    {
      id: 3,
      type: "updated",
      date: bill.updated_at,
      user: "System",
      description: "Bill was updated",
      icon: Clock,
      iconColor: "text-gray-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="relative">
        {historyEvents.map((event, index) => (
          <div key={event.id} className="mb-8 flex gap-4">
            <div
              className={`mt-1 flex h-8 w-8 flex-none items-center justify-center rounded-full ${event.iconColor} bg-opacity-10`}
            >
              <event.icon className={`h-5 w-5 ${event.iconColor}`} />
            </div>
            <div className="flex-auto">
              <div className="flex items-center justify-between">
                <p className="font-medium text-sm">{event.description}</p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(event.date), "MMM d, yyyy 'at' h:mm a")}
                </p>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                By {event.user}
              </p>
            </div>
          </div>
        ))}

        {/* Vertical line connecting events */}
        <div
          className="absolute left-4 top-0 bottom-0 -ml-0.5 w-0.5 bg-border"
          style={{ transform: "translateX(-50%)" }}
        ></div>
      </div>
    </div>
  );
}

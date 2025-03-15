import EventTracking from "@/models/events";
import Status from "@/models/statuses";
import User from "@/models/user";

async function createEvent(eventData: {
  data_id: string;
  event_type: "status" | "comment" | "task" | "file";
  event_name: string;
  from: string;
  description?: string;
  status_id?: string;
  notes?: string;
  created_by_id: string;
}) {
  try {
    const newEvent = await EventTracking.create(eventData);
    const response = await EventTracking.findByPk(newEvent.id, {
      include: [
        { model: Status, as: "status" },
        {
          model: User,
          as: "created_by",
          attributes: ["id", "name", "username"],
        },
      ],
    });
    return response;
  } catch (error) {
    console.error("Error creating event:", error);
  }
}

export default createEvent;

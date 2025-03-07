import EventTracking from "@/models/events";

async function createEvent(eventData: {
  data_id: string;
  event_type: "status" | "comment" | "task" | "file";
  event_name: string;
  from: string;
  description?: string;
  status?: string;
  notes?: string;
  created_by_id: string;
}) {
  try {
    const newEvent = await EventTracking.create(eventData);
    return newEvent;
  } catch (error) {
    console.error("Error creating event:", error);
  }
}

export default createEvent;

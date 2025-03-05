import { getUser } from "@/auth/user";
import MapLink from "@/components/map";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import User from "@/models/user";
import Visitor from "@/models/visitior";
import { ADMIN } from "@/roles";
import dayjs from "dayjs";

async function Histories() {
  const user = await getUser();
  if (!user) return;
  const query: any = { is_public: true };
  if (ADMIN !== user.role) {
    query.user_id = user.id;
  }
  const visitors = await Visitor.findAll({
    where: query,
    include: [{ model: User, as: "user", attributes: ["id", "name", "email"] }],
    order: [["created_at", "DESC"]],
  });

  return (
    <div className="h-full overflow-y-auto w-full">
      <div className="w-[500px] mx-auto flex flex-col gap-2 py-2">
        {visitors.map((visitor, index) => {
          return (
            <Card key={index}>
              <CardHeader className="flex items-center justify-between py-1 px-2">
                <CardTitle className="p-0">
                  {visitor.user ? visitor.user?.name : "Unknown User"}
                </CardTitle>
                {visitor.location.coordinates[0] ? (
                  <MapLink
                    lat={visitor.location?.coordinates[1]}
                    lng={visitor.location?.coordinates[0]}
                    text="Check Location"
                  />
                ) : (
                  <p>Unknown Location</p>
                )}
              </CardHeader>
              <CardContent className="py-1 px-2">
                <p>
                  {visitor.name} - {visitor.os}
                </p>
                <p>{visitor.type}</p>
                <p className="text-xs">
                  {dayjs(visitor.created_at).format("MMMM DD")} at{" "}
                  {dayjs(visitor.created_at).format("hh:mm A")}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default Histories;

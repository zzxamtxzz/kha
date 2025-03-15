import { Label } from "@/components/ui/label";
import dayjs from "dayjs";

function DefaultDataShow({
  data: d,
  toSkip = [],
}: {
  data: string;
  toSkip?: string[];
}) {
  const attendance = JSON.parse(d);
  return (
    <div className={"min-h-40 w-full space-y-4"}>
      {Object.keys(attendance)
        .filter((s) => !toSkip.includes(s))
        .map((k, index) => {
          const data = attendance[k];

          if (!data || k.includes("id") || ["is_public", "active"].includes(k))
            return null;
          const date = k.includes("date");
          const datetime = k.includes("created_at") || k.includes("updated_at");
          const object = data && typeof data === "object";

          if (object) {
            return (
              <div className="w-full">
                <div className="ml-[190px] my-4">
                  <Label className="text-xl">
                    {k
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, k[0]?.toUpperCase())}
                  </Label>
                </div>
                <ObjData data={data} toSkip={toSkip} />
              </div>
            );
          }

          return (
            <div key={index} className={"px-1 flex items-center w-full"}>
              <Label className="p-1 min-w-[180px] font-bold text-xs text-end">
                {k
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, k[0]?.toUpperCase())}
              </Label>
              <div className={"flex-1 p-1"}>
                <div className="px-1">
                  {date ? (
                    dayjs(data).format("YYYY-MM-DD")
                  ) : datetime ? (
                    dayjs(data).format("hh:mm A YYYY-MM-DD")
                  ) : (
                    <span className="px-1">{data}</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
}

export default DefaultDataShow;

const ObjData = ({
  data: d,
  toSkip = [],
}: {
  data: any;
  toSkip?: string[];
}) => {
  if (!d) return;
  return (
    <div className={"min-h-40 w-full space-y-2"}>
      {Object.keys(d)
        .filter((s) => !toSkip.includes(s))
        .map((k, index) => {
          const data = d[k];

          const date = k.includes("date");
          const datetime = k.includes("created_at") || k.includes("updated_at");
          if (!data || k.includes("id") || ["is_public", "active"].includes(k))
            return null;

          return (
            <div key={index} className={"px-1 flex items-center w-full"}>
              <Label className="p-1 min-w-[180px] font-bold text-xs text-end">
                {k
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, k[0]?.toUpperCase())}
              </Label>
              <div className={"flex-1 p-1"}>
                <div className="px-1">
                  {date ? (
                    dayjs(data).format("YYYY-MM-DD")
                  ) : datetime ? (
                    dayjs(data).format("hh:mm A YYYY-MM-DD")
                  ) : (
                    <span className="px-1">{data}</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
};

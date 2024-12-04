"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FolderUp } from "lucide-react";
import { exportData, toSkip } from "./action";

export const skipKeys = (obj: any) => {
  const result: any = {};
  for (const key in obj) {
    if (!toSkip.some((t) => key.includes(t))) {
      result[key] = obj[key];
    }
  }
  return result;
};

export const flattenObject = (obj: any) => {
  const result: any = {};

  const recurse = (current: any, prop: string) => {
    if (Object(current) !== current) {
      result[prop] = current;
    } else if (Array.isArray(current)) {
      for (let i = 0, len = current.length; i < len; i++) {
        recurse(current[i], `${prop}[${i}]`);
      }
      if (current.length === 0) {
        result[prop] = [];
      }
    } else {
      let isEmpty = true;
      for (const p in current) {
        isEmpty = false;
        recurse(current[p], prop ? `${prop}.${p}` : p);
      }
      if (isEmpty && prop) {
        result[prop] = {};
      }
    }
  };

  recurse(obj, "");
  return result;
};

function ExportBtn({
  data,
  title,
  className,
}: {
  data: string;
  title: string;
  className?: string;
}) {
  return (
    <Button
      onClick={async () => {
        const jsonData = JSON.parse(data) as any[];
        const destureData = jsonData.map((item) => {
          const normaldata = flattenObject(item);
          const filterdata = skipKeys(normaldata);
          return filterdata;
        });

        const buf = await exportData(destureData);
        const blob = new Blob([buf], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = title + ".xlsx";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }}
      className={cn("w-28", className)}
    >
      <span className="px-2">Export</span> <FolderUp className="w-4" />
    </Button>
  );
}

export default ExportBtn;

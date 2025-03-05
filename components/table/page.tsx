"use client";
import { useMutateInfiniteData } from "@/app/hooks/mutateInfinite";
import axios from "@/axios";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { CircleX, Trash } from "lucide-react";
import { useState } from "react";
import SpinLoading from "../loadings/spinloading";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import CustomTableColumn from "./columns";

export type ColumnType<T> = {
  name?: string;
  id?: string;
  cell?: ({
    index,
    value,
  }: { index: number; value: any } & T) => React.ReactNode;
};

export type TableType<T> = {
  data: T[];
  columns?: ColumnType<T>[];
  lastElementRef: any;
  title: string;
  skip?: (keyof T)[];
  className?: string;
  loading?: boolean;
  columnNames?: string[];
};

function DynamicTable<T extends { id: string; name?: string }>({
  data,
  columns: ac = [],
  lastElementRef,
  title,
  skip = [],
  columnNames,
  className,
  loading,
}: TableType<T>) {
  const [checkedAll, setCheckedAll] = useState(false);
  const [checks, setChecks] = useState<string[]>([]);

  const [currentColumns, setCurrentColumns] = useState<ColumnType<T>[]>(ac);

  const { toast } = useToast();

  const { updatedData } = useMutateInfiniteData();
  const queryClient = useQueryClient();

  const queryCache = queryClient.getQueryCache();
  const queryKeys = queryCache
    .getAll()
    .map((query) => query.queryKey)
    .filter((q) => q.includes(title) && !q.includes("count"));

  return (
    <div
      className={cn(
        "w-full h-full overflow-y-auto overflow-x-auto relative",
        className
      )}
    >
      {(checkedAll || checks.length > 0) && (
        <div className="w-full cart-bg shadow p-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              onClick={() => {
                setChecks([]);
                setCheckedAll(false);
              }}
              className="w-10 p-0"
              variant="outline"
            >
              <CircleX className="w-4" />
            </Button>
            <Button
              onClick={async () => {
                try {
                  await axios.delete(`/api/${title}/bulkdelete`, {
                    params: { devices: checks, all: checkedAll },
                  });
                  queryKeys.forEach((queryKey) => {
                    checks.map((id) =>
                      updatedData({ queryKey, id, remove: true })
                    );
                  });
                  toast({ title: "Success", description: "Delete successful" });
                } catch (error: any) {
                  toast({
                    title: "Error found",
                    description: error.response?.data?.error || error.message,
                  });
                }
              }}
              variant={"destructive"}
            >
              <Trash className="w-4" />
              <span className="px-2">Delete Selection</span>
            </Button>
          </div>
        </div>
      )}
      <div className="absolute right-0 top-2">
        <CustomTableColumn
          title={title}
          columns={columnNames || []}
          currentColumns={currentColumns}
          setCurrentColumns={setCurrentColumns}
        />
      </div>
      <table className="w-full caption-bottom border-b text-sm">
        <thead>
          <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0">
              <Checkbox
                checked={checkedAll}
                onCheckedChange={() => setCheckedAll((prev) => !prev)}
              />
            </th>
            {currentColumns.map(
              (column, index) =>
                column && (
                  <th
                    key={index}
                    className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0"
                  >
                    {column.name &&
                      column.name
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, column.name[0]?.toUpperCase())}
                  </th>
                )
            )}
          </tr>
        </thead>
        <tbody className="[&_tr:last-child]:border-0">
          {data.map((d, index) => {
            if (!d) return null;
            return (
              <tr
                key={index}
                ref={index === data.length - 1 ? lastElementRef : null}
                className={
                  "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted hover"
                }
              >
                <td className="px-4">
                  <Checkbox
                    checked={checkedAll || checks.includes(d?.id)}
                    onCheckedChange={(checked) => {
                      setChecks((prev) =>
                        !checked
                          ? prev.filter((p) => p !== d.id)
                          : [...prev, d.id]
                      );
                    }}
                  />
                </td>
                {currentColumns.map((column, dataindex) => {
                  const name = column.name;
                  //@ts-ignore
                  const item: any = d[name];

                  return (
                    <td
                      key={dataindex}
                      className="p-4 align-middle [&:has([role=checkbox])]:pr-0"
                    >
                      {column.cell
                        ? column.cell({ index, ...d, value: item })
                        : typeof item === "object"
                        ? item?.name || item?.email
                        : typeof item === "boolean"
                        ? JSON.stringify(item)
                        : column.name &&
                          (column.name.toLowerCase().includes("date") ||
                            column.name.toLowerCase().includes("at"))
                        ? dayjs(item).format("YYYY-MM-DD")
                        : typeof item === "number"
                        ? Number(item.toFixed(2)).toLocaleString("en-us")
                        : item}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      {!loading && data.length <= 0 && (
        <div className="capitalize center w-full min-h-[250px]">
          No {title} found
        </div>
      )}
      {loading && (
        <SpinLoading className="h-20 center">{title} loading...</SpinLoading>
      )}
    </div>
  );
}

export default DynamicTable;

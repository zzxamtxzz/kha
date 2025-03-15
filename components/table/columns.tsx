import { cookie } from "@/lib/utils";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { Check, ChevronDown, GripVertical } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { ColumnType } from "./page";
import axios from "@/axios";
import { useToast } from "@/hooks/use-toast";

function CustomTableColumn<T>({
  columns,
  currentColumns,
  setCurrentColumns,
  title,
}: {
  columns: string[];
  currentColumns: ColumnType<T>[];
  setCurrentColumns: Dispatch<SetStateAction<ColumnType<T>[]>>;
  title: string;
}) {
  const [search, setSearch] = useState("");

  const { toast } = useToast();
  const saveColumns = async (columns: ColumnType<T>[]) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/tables_columns`,
        { column: columns.map((c) => c.name).filter((i) => i), title }
        // { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("headers");
      toast({
        title: "success",
        description: "Save table columns",
      });
    } catch (error) {
      console.log("error", error);
    }
  };

  const onDragEnd = async (result: any) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    const newData = [...currentColumns];

    const [removed] = newData.splice(sourceIndex, 1);
    newData.splice(destinationIndex, 0, removed);

    setCurrentColumns(newData);
    saveColumns(newData);
  };

  const filterColumns = search
    ? columns.filter((c) => c.toLowerCase().includes(search.toLowerCase()))
    : columns;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="default"
          className="ml-auto mx-2 opacity-30 hover:opacity-90"
        >
          Columns <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mx-4 relative">
        <DropdownMenuLabel className="p-4">
          Choose Custom Columns
        </DropdownMenuLabel>
        {columns.length > 10 && (
          <Input
            value={search}
            placeholder="Search column name"
            onChange={(e) => setSearch(e.target.value)}
          />
        )}
        <div className="flex">
          <div className="flex-1 p-1 mt-1 border-r w-[350px]">
            <p className="font-semibold mb-2">Initial Columns</p>
            <div className="max-h-[500px] overflow-y-auto">
              {filterColumns.map((column, index) => {
                if (!column) return;
                const checked = currentColumns.find((c) => c?.name === column);
                return (
                  <div
                    key={index}
                    className="flex hover rounded-sm items-center px-2"
                  >
                    <Checkbox
                      onCheckedChange={async (checked) => {
                        const newColumns = !checked
                          ? currentColumns.filter((p) => p.name !== column)
                          : [...currentColumns, { name: column }];
                        setCurrentColumns(newColumns);
                        await saveColumns(newColumns);
                      }}
                      name={column}
                      id={column}
                      checked={checked ? true : false}
                    />
                    <Label
                      htmlFor={column}
                      className="px-2 capitalize w-full p-2"
                    >
                      {column
                        .replace(/([A-Z])/g, " $1")
                        .replace(/^./, column[0]?.toUpperCase())}
                    </Label>
                  </div>
                );
              })}
            </div>
          </div>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="columns">
              {(droppableProvided) => (
                <div
                  onMouseDown={(e) => e.stopPropagation()}
                  ref={droppableProvided.innerRef}
                  className="max-h-[550px] overflow-y-auto mt-2 space-y-2"
                  {...droppableProvided.droppableProps}
                >
                  <p className="font-semibold p-2">Active Columns</p>
                  {currentColumns
                    .filter((c) => c.name)
                    .map((column, index) => {
                      if (!column) return;
                      const checked = currentColumns.find(
                        (c) => c?.name === column.name
                      );
                      return (
                        <Draggable
                          key={index}
                          draggableId={
                            (column.name || column.id)?.toString() || ""
                          }
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              style={{
                                opacity: snapshot.isDragging ? 0.9 : 1,
                                transform: snapshot.isDragging
                                  ? "rotate(-2deg)"
                                  : "",
                              }}
                              className="capitalize w-[190px] flex items-center rounded-lg hover px-2 justify-between"
                              onClick={async () => {
                                const newColumns = checked
                                  ? currentColumns.filter(
                                      (p) => p.name !== column.name
                                    )
                                  : [...currentColumns, column];
                                setCurrentColumns(newColumns);
                                saveColumns(newColumns);
                              }}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              ref={provided.innerRef}
                            >
                              <div className="flex items-center w-[150px] overflow-x-hidden">
                                <p className="w-6">
                                  {checked && <Check className="min-w-4 w-4" />}
                                </p>
                                <p className="px-2">
                                  {column.name &&
                                    column.name
                                      .replace(/([A-Z])/g, " $1")
                                      .replace(
                                        /^./,
                                        column.name[0]?.toUpperCase()
                                      )}
                                </p>{" "}
                              </div>
                              <GripVertical
                                className="text-neutral-500 cursor-grab"
                                size={20}
                              />
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                  {droppableProvided?.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default CustomTableColumn;

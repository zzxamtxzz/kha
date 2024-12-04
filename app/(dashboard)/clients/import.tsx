"use client";
import axios from "@/axios";
import { exportData } from "@/components/exports/action";
import { Modal } from "@/components/shared/modal";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { ChangeEvent, useRef, useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import { read, utils } from "xlsx";

function ImportDataWithExcel({ className }: { className?: string }) {
  const [data, setData] = useState<any[]>([]);
  const inputRef = useRef<any>(null);
  const { toast } = useToast();

  const onUpload = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const reader = new FileReader();
      const file = event.target.files[0];
      reader.readAsArrayBuffer(file);
      reader.onload = (e) => {
        if (e.target?.result) {
          const data = e.target.result;
          const workbook = read(data, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          let parsedData = utils.sheet_to_json(sheet);
          parsedData = parsedData.map((data: any) => {
            let newObj: any = {};
            Object.keys(data).forEach((key) => {
              newObj[
                key
                  .replace(/\s/g, "")
                  .replace(/^./, (match) => match.toLowerCase())
              ] = data[key];
            });

            return newObj;
          });
          console.log("parsed data", parsedData);
          setData(parsedData);
        }
      };
    }
  };

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button className={cn(className)}>
            <span className="px-2">Import Data</span>
            <FaCaretDown size={18} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 flex flex-col gap-1 p-1 mx-4">
          <Button
            onClick={async () => {
              const destureData = [
                {
                  Name: "client simple",
                  Email: "clientemail@limitlessmyanmar.com",
                  Remark: "",
                  Username: "simple",
                  Password: "12345678",
                },
              ];

              const buf = await exportData(destureData);
              const blob = new Blob([buf], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
              });
              const url = window.URL.createObjectURL(blob);

              const a = document.createElement("a");
              a.href = url;
              a.download = "simpledevice.xlsx";
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              window.URL.revokeObjectURL(url);
            }}
            className="border-none shadow-none"
            variant={"outline"}
          >
            Download simple data
          </Button>
          <Button
            className="border-none shadow-none"
            variant={"outline"}
            onClick={() => {
              inputRef.current?.click();
            }}
          >
            Import Data
          </Button>
        </PopoverContent>
      </Popover>
      <input
        ref={inputRef}
        className="hidden"
        type="file"
        accept=".xlsx,.xls"
        onChange={onUpload}
      />
      {data.length > 0 && (
        <Modal>
          <div className="w-full h-screen p-4 overflow-y-auto">
            <div className="max-w-[700px] cart-bg mx-auto rounded-lg p-4">
              <div className="flex items-center justify-end">
                <Button
                  onClick={async () => {
                    try {
                      const response = await axios.post(
                        "/api/clients/bulk",
                        data
                      );
                      console.log(response.data);
                      setData([]);
                    } catch (error: any) {
                      console.log("error", error);
                      toast({
                        title: "Error found",
                        description:
                          error.response?.data?.error || error.message,
                      });
                    }
                  }}
                >
                  Import Data now
                </Button>
              </div>
              <pre>{JSON.stringify(data, null, 2)}</pre>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}

export default ImportDataWithExcel;

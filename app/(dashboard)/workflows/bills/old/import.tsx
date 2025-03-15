"use client";
import axios from "@/axios";
import { Modal } from "@/components/shared/modal";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ChangeEvent, useRef, useState } from "react";
import { FaCaretDown } from "react-icons/fa";
import { read, utils } from "xlsx";

function ImportDataWithExcelBills() {
  const [loading, setLoading] = useState(false);
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
      <Button
        onClick={() => {
          inputRef.current?.click();
        }}
      >
        <span className="px-2">Import Data</span>
        <FaCaretDown size={18} />
      </Button>
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
            <div className="max-w-[700px] card-bg mx-auto rounded-lg p-4">
              <div className="flex items-center justify-end">
                <Button
                  disabled={loading}
                  onClick={async () => {
                    try {
                      setLoading(true);
                      const response = await axios.post(
                        "/api/bills/bulk",
                        data
                      );
                      console.log(response.data);
                      setData([]);
                      setLoading(false);
                      typeof window !== "undefined" && window.location.reload();
                    } catch (error: any) {
                      console.log("error", error);
                      setLoading(false);
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

export default ImportDataWithExcelBills;

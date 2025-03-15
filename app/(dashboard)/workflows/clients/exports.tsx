"use client";
import axios from "@/axios";
import { exportData } from "@/components/exports/action";
import { flattenObject, skipKeys } from "@/components/exports/btn";
import { Button } from "@/components/ui/button";
import { FolderUp } from "lucide-react";
import { useState } from "react";

function ClientExportBtn() {
  const [loading, setLoading] = useState(false);

  return (
    <Button
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        try {
          const { data } = await axios.get("/api/clients/exports");
          const destureData = data.map((item) => {
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
          a.download = "clients.xlsx";
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
          setLoading(false);
        } catch (error) {
          setLoading(false);
        }
      }}
    >
      <span className="px-2">Export client</span> <FolderUp className="w-4" />
    </Button>
  );
}

export default ClientExportBtn;

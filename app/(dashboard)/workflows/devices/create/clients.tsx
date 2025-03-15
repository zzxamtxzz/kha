import { useSheet2 } from "@/app/contexts/sheet2";
import { useInfiniteData } from "@/app/hooks/use-infinite-data";
import ShowNoText from "@/components/app/nodata";
import SpinLoading from "@/components/loadings/spinloading";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import useClickOutside from "@/hooks/outside";
import Client from "@/models/client";
import { Plus, X } from "lucide-react";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import CreateClientForm from "../../clients/create/form";

function Clients({
  onChange,
  value,
  client,
  setClient,
}: {
  onChange: (value: string) => void;
  value: string;
  client?: Client;
  setClient: Dispatch<SetStateAction<Client | undefined>>;
}) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const outSideRef = useRef(null);
  const {
    loading,
    data: clients,
    queryKey,
    count,
    lastElementRef,
  } = useInfiniteData<Client>({
    keys: "clients",
    size: 20,
    params: { search: inputValue },
  });

  useClickOutside(outSideRef, () => setOpen(false));
  const { setOpen: setSheet, setContent, setClassName } = useSheet2();
  const openClient = () => {
    console.log("open client");
    setSheet(true);
    setClassName("p-0 min-w-[600px]");
    setContent(
      <CreateClientForm
        onSuccess={(client) => {
          setSheet(false);
          console.log("client", client);
          if (client) {
            setClient(client);
            onChange(client.id);
          }
        }}
        defaultValues={{ name: inputValue }}
      />
    );
  };

  return (
    <div className="relative">
      {client ? (
        <div className="card-bg rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <Label className="text-blue-500 text-lg">
              {client.name || client.email}
            </Label>
            <Button
              size={"icon"}
              variant={"outline"}
              className="w-6 h-6"
              onClick={() => setClient(null)}
            >
              <X className="w-4" />
            </Button>
          </div>
          <p>{client.email}</p>
        </div>
      ) : (
        <div className="flex items-center justify-between w-full border rounded-md p-1 pl-2">
          <input
            onFocus={() => setOpen(true)}
            placeholder="Enter the name"
            className="flex-1"
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
            }}
          />
          <Button
            onClick={openClient}
            type="button"
            className="p-1"
            size={"icon"}
          >
            <Plus className="w-4" />
          </Button>
        </div>
      )}
      {open && (
        <div
          ref={outSideRef}
          className="p-1 absolute card-bg w-[600px] max-h-[250px] overflow-y-auto border z-10 rounded-lg shadow-md"
        >
          {!clients.length && (
            <ShowNoText className="flex flex-col gap-2">
              {loading ? <SpinLoading className="" /> : "Nothing found"}
              <Button onClick={openClient} type="button">
                Create plan
              </Button>
            </ShowNoText>
          )}
          {clients.map((client, index) => (
            <div
              ref={clients.length === index + 1 ? lastElementRef : undefined}
              className="p-2 hover rounded-sm"
              onClick={() => {
                onChange(client.id);
                setClient(client);
                setOpen(false);
              }}
              key={index}
            >
              {client.name || client.email}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Clients;

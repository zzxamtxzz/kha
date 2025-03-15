import { useInfiniteData } from "@/app/hooks/use-infinite-data";
import { Textarea } from "@/components/ui/textarea";
import useClickOutside from "@/hooks/outside";
import { useRef, useState } from "react";

function Suggestions({
  onChange,
  value,
}: {
  onChange: (value: string) => void;
  value: string;
}) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const outSideRef = useRef(null);
  const {
    loading,
    data: suggestions,
    queryKey,
    count,
    lastElementRef,
  } = useInfiniteData<string>({
    keys: "bills/suggestions",
    size: 20,
    params: { search: inputValue },
  });

  useClickOutside(outSideRef, () => setOpen(false));

  if (loading) return null;

  return (
    <div className="relative">
      <div className="relative w-full">
        <Textarea
          onFocus={() => setOpen(true)}
          placeholder="Enter the name"
          className="flex-1"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
        />
      </div>
      {open && (
        <div
          ref={outSideRef}
          className="p-1 absolute card-bg w-[600px] border z-10 rounded-lg shadow-md"
        >
          {suggestions.map((text, index) => (
            <div
              className="p-2 hover rounded-sm"
              onClick={() => {
                onChange(text);
                setOpen(false);
              }}
              key={index}
            >
              {text}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Suggestions;

"use client";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useRef, useState } from "react";

function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): T {
  let timeout: NodeJS.Timeout;
  return function (this: any, ...args: Parameters<T>) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  } as T;
}

const debouncedSearch = debounce(
  (newSearch: string, searchParams, pathname, router) => {
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set("search", newSearch);

    router.push(`${pathname}?${currentParams.toString()}`);
  },
  300
);

function SearchInput({ className }: { className?: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearchChange = useCallback(
    (newSearch: string) => {
      debouncedSearch(newSearch, searchParams, pathname, router);
    },
    [searchParams, pathname, router]
  );

  function handleIconClick() {
    if (inputRef.current) inputRef.current.focus();
  }

  return (
    <div className={cn("relative", className)}>
      <Search
        onClick={handleIconClick}
        className="w-4 absolute top-0 bottom-0 my-auto left-4 cursor-pointer"
      />
      <Input
        ref={inputRef}
        value={search}
        onChange={(e) => {
          handleSearchChange(e.target.value);
          setSearch(e.target.value);
        }}
        placeholder="Search"
        autoFocus
        className="w-full border pl-10 h-[36px] pr-4 rounded-[4px] py-2 focus:border-[#293943] cart-bg transition-all duration-100"
      />
    </div>
  );
}

export default SearchInput;

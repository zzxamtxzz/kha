"use client";
import { useCallback, useEffect } from "react";

const useClickOutside = (ref: any, callback: () => void): void => {
  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (ref?.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    },
    [ref, callback]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClickOutside]);
};

export default useClickOutside;

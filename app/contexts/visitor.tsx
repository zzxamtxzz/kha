"use client";
import useCurrentLocation from "@/app/hooks/location";
import axios from "@/axios";
import { generateSecureRandomId } from "@/lib/utils";
import { ReactNode, createContext, useEffect } from "react";
import {
    browserName,
    deviceType,
    isDesktop,
    isMobile,
    isTablet,
    osName,
} from "react-device-detect";

const VisitorContent = createContext<{}>({});
const VISITORid_KEY = "visitorId";

export const getVisitorId = () => {
  let visitorId = localStorage.getItem(VISITORid_KEY);
  if (!visitorId) {
    visitorId = generateSecureRandomId(15);
    localStorage.setItem(VISITORid_KEY, visitorId);
  }
  return visitorId;
};

export function VisitorProvider({ children }: { children: ReactNode }) {
  const { location, requestLocation } = useCurrentLocation();
  const saveVisitor = async () => {
    const id = getVisitorId();
    const response = await axios.post(`/api/visitors`, {
      id,
      location,
      device: deviceType,
      name: browserName,
      os: osName,
      type: isMobile
        ? "mobile"
        : isDesktop
        ? "desktop"
        : isTablet
        ? "tablet"
        : "no status",
    });
    console.log("response", response.data);
  };

  useEffect(() => {
    saveVisitor();
  }, [location]);

  return (
    <VisitorContent.Provider value={{}}>{children}</VisitorContent.Provider>
  );
}

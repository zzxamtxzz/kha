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
const VISITOR_ID_KEY = "visitorId";

export const getVisitorId = () => {
  let visitorId = localStorage.getItem(VISITOR_ID_KEY);
  if (!visitorId) {
    visitorId = generateSecureRandomId(15);
    localStorage.setItem(VISITOR_ID_KEY, visitorId);
  }
  return visitorId;
};

export function VisitorProvider({ children }: { children: ReactNode }) {
  const { location, requestLocation } = useCurrentLocation();
  const saveVisitor = async () => {
    const _id = getVisitorId();
    const response = await axios.post(`/api/visitors`, {
      _id,
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

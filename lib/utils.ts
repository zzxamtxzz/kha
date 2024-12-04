import { clsx, type ClassValue } from "clsx";
import crypto from "crypto";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const cookie = {
  name: "session",
  options: { httpOnly: true, path: "/" },
  duration: 24 * 60 * 60 * 1000,
};

export const getRandomWidth = (possibleWidths: number[]) => {
  const randomIndex = Math.floor(Math.random() * possibleWidths.length);
  return possibleWidths[randomIndex];
};

export function generateSecureRandomId(length: number = 20) {
  const bytes = crypto.randomBytes(length);
  const randomNumber = Array.from(bytes, (byte) => (byte % 10).toString()).join(
    ""
  );
  return randomNumber.slice(0, length);
}

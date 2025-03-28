import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Devices",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
  detail,
}: Readonly<{
  children: React.ReactNode;
  detail?: React.ReactNode;
}>) {
  return (
    <>
      {detail}
      {children}
    </>
  );
}

import { getUser } from "@/auth/user";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: {
    default: "Trashes",
    template: "%s | Trashes",
  },
  description: "Asia Pacific International Hotel",
  icons: { icon: "/vite.svg" },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();

  if (!user?.super_admin) return notFound();

  return children;
}

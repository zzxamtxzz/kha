import { getUser } from "@/auth/user";
import Bill from "@/models/bill";
import Client from "@/models/client";
import Device from "@/models/devices";
import User from "@/models/user";
import { ADMIN } from "@/roles";
import Image from "next/image";
import Link from "next/link";
import { literal } from "sequelize";
import CreateNewBill from "../bills/choose/choosedevice";

export default async function Home() {
  const user = await getUser();
  if (!user) return;
  const userQuery: any = { is_public: true };
  const clientQuery: any = { is_public: true };
  const deviceQuery: any = { is_public: true };
  if (ADMIN !== user.role) {
    userQuery.id = user.id;
    clientQuery.id = user.client_id;
    deviceQuery.client_id = user.client_id;
  }

  const users = await User.count({ where: userQuery });
  const clients = await Client.count({ where: clientQuery });
  const devices = await Device.count({ where: deviceQuery });

  const query: any = {
    where: deviceQuery,
    include: [
      { model: User, as: "created_by", attributes: ["name", "email"] },
      { model: Client, as: "client", attributes: ["name", "email"] },
      {
        model: Bill,
        as: "lastBill",
        attributes: ["billing_date", "duration_month"],
        where: literal(`billing_date + INTERVAL duration_month MONTH < NOW()`),
      },
    ],
  };

  const expired = await Device.count(query);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <CreateNewBill searchParams={{}} />
        <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          {[
            {
              name: "users",
              count: users,
              href: "/users",
              open: ADMIN === user.role,
            },
            {
              name: "clients",
              count: clients,
              href: "/clients",
              open: ADMIN === user.role,
            },
            { name: "devices", count: devices, href: "/devices", open: true },
            {
              name: "expired devices",
              count: expired,
              href: "/devices?expired=all",
              open: true,
            },
          ].map((item, index) => {
            if (!item.open) return;
            return (
              <Link href={item.href}>
                <li key={index} className="mb-2 hover:underline cursor-pointer">
                  <span className="w-[200px]">Total {item.name}</span>
                  <code className="mx-4 bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-semibold">
                    {JSON.stringify(item.count)}
                  </code>
                  .
                </li>
              </Link>
            );
          })}
        </ol>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="https://nextjs.org/icons/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}

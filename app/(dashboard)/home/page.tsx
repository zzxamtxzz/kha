import { getUser } from "@/auth/user";
import Bill from "@/models/bill";
import Client from "@/models/client";
import Device from "@/models/devices";
import User from "@/models/user";
import Link from "next/link";
import { literal } from "sequelize";
import CreateNewBill from "../workflows/bills/choose/createbillbtn";
import "./style.css";

export default async function HomePage() {
  const user = await getUser();
  if (!user) return;
  const userQuery: any = { is_public: true };
  const deviceQuery: any = { is_public: true };
  if (!user.super_admin) {
    userQuery.id = user.id;
  }

  const users = await User.count({ where: userQuery });
  const clients = await Client.count({ where: {} });
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
    <div className="background flex flex-col p-16 w-full gap-4">
      <div className="w-[200px]">
        <CreateNewBill align="start" />
      </div>
      <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
        {[
          {
            name: "users",
            count: users,
            href: "/users",
            open: user.super_admin,
          },
          {
            name: "clients",
            count: clients,
            href: "/clients",
            open: user.super_admin,
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
            <Link href={item.href} className="font-bold text-white">
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
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
    </div>
  );
}

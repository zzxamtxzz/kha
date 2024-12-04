"use client";
import axios from "@/axios";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Ellipsis } from "lucide-react";
import { useRouter } from "next/navigation";

export function MenubarDemo({ data, title }: { data: string; title: string }) {
  const router = useRouter();

  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger className="hover">
          <Ellipsis />
        </MenubarTrigger>
        <MenubarContent side="right">
          <MenubarItem
            onClick={() => router.push(`/${title}/create?edit=${data}`)}
          >
            Edit <MenubarShortcut>⌘T</MenubarShortcut>
          </MenubarItem>
          <MenubarItem
            onClick={async () => {
              await axios.delete(`/api/${title}/${data}`);
              router.back();
            }}
            className="text-red-500 hover:text-red-600 font-semibold"
          >
            Delete <MenubarShortcut>⌘N</MenubarShortcut>
          </MenubarItem>
          <MenubarItem disabled>New Incognito Window</MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>Share</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Email link</MenubarItem>
              <MenubarItem>Messages</MenubarItem>
              <MenubarItem>Notes</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem>
            Print... <MenubarShortcut>⌘P</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}

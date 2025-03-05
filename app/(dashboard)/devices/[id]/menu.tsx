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
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Ellipsis } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMutateInfiniteData } from "../../../hooks/mutateInfinite";

export function DeviceDetailMenubar({
  data,
  title,
}: {
  data: string;
  title: string;
}) {
  const router = useRouter();

  const { toast } = useToast();
  const { updatedData } = useMutateInfiniteData();
  const queryClient = useQueryClient();

  const queryCache = queryClient.getQueryCache();
  const queryKeys = queryCache
    .getAll()
    .map((query) => query.queryKey)
    .filter((q) => q.includes("devices") && !q.includes("count"));

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
              queryKeys.map((queryKey) =>
                updatedData({ queryKey, id: data, remove: true })
              );
              toast({
                title: "Succes",
                description: "delete successfully...",
              });
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

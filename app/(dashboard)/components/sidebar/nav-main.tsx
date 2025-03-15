"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useHasUser } from "@/app/contexts/user";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const pathname = usePathname();
  const { user } = useHasUser();

  // Function to check if a URL is active
  const isActive = (url: string) => {
    // Exact match for home page
    if (url === "/" && pathname === "/") return true;

    // For other pages, check if pathname starts with the URL
    // This handles nested routes (e.g. /menus/categories will match /menus)
    if (url !== "/" && pathname.startsWith(url)) return true;

    return false;
  };

  // Check if any sub-item is active to determine if parent should be open
  const hasActiveChild = (item: (typeof items)[0]) => {
    return item.items?.some((subItem) => isActive(subItem.url));
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Workflows</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          // Check if this item or any of its children are active
          const itemActive = isActive(item.url);
          const childActive = hasActiveChild(item);
          const shouldBeOpen = item.isActive || itemActive || childActive;

          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={shouldBeOpen}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title} isActive={itemActive}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items
                      ?.filter((item) => {
                        console.log("title", item.title, user.role);
                        return (
                          user.super_admin ||
                          (user.role && user.role[item.title.toLowerCase()])
                        );
                      })
                      .map((subItem) => {
                        const subItemActive = isActive(subItem.url);

                        return (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={subItemActive}
                            >
                              <Link href={subItem.url}>
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        );
                      })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}

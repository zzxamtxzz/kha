"use client";

import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";

export function DynamicBreadcrumb() {
  const pathname = usePathname();

  // Skip rendering breadcrumbs on homepage
  if (pathname === "/") {
    return null;
  }

  // Split pathname into segments and remove empty strings
  const segments = pathname.split("/").filter(Boolean);

  // Create breadcrumb items based on path segments
  const breadcrumbItems = segments.map((segment, index) => {
    // Create the path until this segment
    const href = `/${segments.slice(0, index + 1).join("/")}`;

    // Format the segment for display (capitalize, replace hyphens with spaces)
    const formattedSegment = segment
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());

    // Check if this is the last segment (current page)
    const isLastSegment = index === segments.length - 1;

    return {
      href,
      label: formattedSegment,
      isCurrentPage: isLastSegment,
    };
  });

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* Home link is always first */}
        <BreadcrumbItem>
          <BreadcrumbLink href="/" className="flex items-center">
            <Home size={16} className="mr-1" />
            <span className="hidden sm:inline">Home</span>
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbSeparator />

        {/* Dynamic segments */}
        {breadcrumbItems.map((item, index) => (
          <BreadcrumbItem key={item.href}>
            {item.isCurrentPage ? (
              <BreadcrumbPage>{item.label}</BreadcrumbPage>
            ) : (
              <>
                <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                {index < breadcrumbItems.length - 1 && <BreadcrumbSeparator />}
              </>
            )}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

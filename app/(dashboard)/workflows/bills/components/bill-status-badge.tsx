import { Badge } from "@/components/ui/badge";

interface BillStatusBadgeProps {
  status: {
    name: string;
    group: string;
  };
  size?: "sm" | "default";
}

export function BillStatusBadge({
  status,
  size = "default",
}: BillStatusBadgeProps) {
  let variant: "default" | "secondary" | "destructive" | "outline" = "default";

  // Determine the badge variant based on the status group
  switch (status.group) {
    case "new":
      variant = "default"; // Blue
      break;
    case "in_progress":
      variant = "secondary"; // Gray
      break;
    case "pending":
      variant = "outline"; // Outlined
      break;
    case "closed":
      variant = "destructive"; // Red
      break;
    default:
      variant = "default";
  }

  return (
    <Badge
      variant={variant}
      className={size === "sm" ? "text-xs py-0 px-2" : ""}
    >
      {status.name}
    </Badge>
  );
}

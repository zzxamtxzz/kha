import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Device from "@/models/devices";
import { formatDistanceToNow } from "date-fns";
import {
  Barcode,
  Calendar,
  Cpu,
  Edit,
  Eye,
  Hash,
  Mail,
  ReceiptText,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { DeviceCardSkeleton } from "./device-card-skeletons";
import Link from "next/link";

function DeviceCardView({
  devices,
  lastElementRef,
  isFetchingNextPage,
}: {
  devices: Device[];
  lastElementRef: any;
  isFetchingNextPage: boolean;
}) {
  const router = useRouter();
  const getInitials = (firstName: string, lastName: string): string => {
    return `${firstName?.charAt(0)}${lastName?.charAt(0)}`.toUpperCase();
  };

  // Function to get a deterministic color based on device id
  const getAvatarColor = (id: string): string => {
    const colors = [
      "bg-blue-100 text-blue-800",
      "bg-green-100 text-green-800",
      "bg-purple-100 text-purple-800",
      "bg-amber-100 text-amber-800",
      "bg-rose-100 text-rose-800",
      "bg-indigo-100 text-indigo-800",
      "bg-teal-100 text-teal-800",
      "bg-cyan-100 text-cyan-800",
    ];

    // Use the last character of the ID to select a color
    const lastChar = id.charAt(id.length - 1);
    const index = Number.parseInt(lastChar, 16) % colors.length;
    return colors[index];
  };

  // Function to determine if a device is active based on lastBill
  const isDeviceActive = (device: Device): boolean => {
    if (!device.lastBill) return false;

    const billDate = new Date(device.lastBill.billing_date);
    const durationInMs =
      device.lastBill.duration_month * 30 * 24 * 60 * 60 * 1000;
    const expiryDate = new Date(billDate.getTime() + durationInMs);

    return expiryDate > new Date();
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Devices ({devices.length})</h2>

      {devices.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          No devices found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {devices.map((device, index) => {
            const active = isDeviceActive(device);
            const openDetail = () => {
              router.push(`/workflows/devices/${device.id}`);
            };

            return (
              <Card
                ref={devices.length - 1 === index ? lastElementRef : undefined}
                key={device.id}
                className="overflow-hidden"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between w-full">
                    <div className="flex items-center space-x-4 cursor-pointer">
                      <Avatar className={getAvatarColor(device.id)}>
                        <AvatarFallback>
                          {getInitials(device.first_name, device.last_name)}
                        </AvatarFallback>
                      </Avatar>

                      <div>
                        <h3
                          onClick={openDetail}
                          className="font-medium hover:underline"
                        >
                          {device.first_name} {device.last_name}
                        </h3>
                        <p className="text-sm text-muted-foreground flex items-center">
                          <Mail className="h-3 w-3 mr-1" />
                          {device.email}
                        </p>
                      </div>
                    </div>

                    {device.remark ? (
                      <Badge
                        variant="outline"
                        className="bg-yellow-100 text-yellow-800"
                      >
                        {device.remark}
                      </Badge>
                    ) : active ? (
                      <Badge
                        variant="outline"
                        className="bg-green-100 text-green-800"
                      >
                        Active
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="bg-red-100 text-red-800"
                      >
                        Inactive
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="pb-2">
                  <div className="space-y-2 mt-2">
                    <div className="grid grid-cols-2 gap-2">
                      <p className="text-sm flex items-center">
                        <Barcode className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-xs font-medium">SN:</span>
                        <span className="ml-1 truncate">{device.snNo}</span>
                      </p>

                      <p className="text-sm flex items-center">
                        <Hash className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-xs font-medium">KIT:</span>
                        <span className="ml-1 truncate">{device.kitNo}</span>
                      </p>
                    </div>

                    <p className="text-sm flex items-center">
                      <Cpu className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-xs font-medium">ACC:</span>
                      <span className="ml-1 truncate">{device.accNo}</span>
                    </p>

                    {device.client && (
                      <p className="text-sm flex items-center">
                        <User className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-xs font-medium">Client:</span>
                        <span className="ml-1 truncate">
                          {device.client.name || device.client.email}
                        </span>
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-1">
                      {device.lastBill ? (
                        <p className="text-xs text-muted-foreground flex items-center">
                          <ReceiptText className="h-3 w-3 mr-1" />
                          Billed{" "}
                          {formatDistanceToNow(
                            new Date(device.lastBill.billing_date),
                            { addSuffix: true }
                          )}
                        </p>
                      ) : (
                        <p className="text-xs text-muted-foreground flex items-center">
                          <ReceiptText className="h-3 w-3 mr-1" />
                          No billing history
                        </p>
                      )}

                      <p className="text-xs text-muted-foreground flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDistanceToNow(new Date(device.created_at), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="pt-2">
                  <div className="flex space-x-2 w-full">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <Link
                        href={`/workflows/devices/${device.id}/edit`}
                        className="h-4 flex-1"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Link>
                    </Button>

                    <Button
                      onClick={openDetail}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            );
          })}

          {isFetchingNextPage && <DeviceCardSkeleton />}
        </div>
      )}
    </div>
  );
}

export default DeviceCardView;

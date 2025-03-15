"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  Smartphone,
  Eye,
  Edit,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Client from "@/models/client";
import ClientCardLoading from "./client-loading";
import { useRouter } from "next/navigation";

export function CustomerCardView({
  data,
  lastElementRef,
  isFetchingNextPage,
}: {
  data: Client[];
  lastElementRef: any;
  isFetchingNextPage: boolean;
}) {
  // Function to get initials from name
  const getInitials = (name: string | null): string => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const router = useRouter();

  // Function to get a deterministic color based on customer id
  const getAvatarColor = (id: string): string => {
    const colors = [
      "bg-red-100 text-red-800",
      "bg-blue-100 text-blue-800",
      "bg-green-100 text-green-800",
      "bg-yellow-100 text-yellow-800",
      "bg-purple-100 text-purple-800",
      "bg-pink-100 text-pink-800",
      "bg-indigo-100 text-indigo-800",
      "bg-teal-100 text-teal-800",
    ];

    // Use the last character of the ID to select a color
    const lastChar = id.charAt(id.length - 1);
    const index = Number.parseInt(lastChar, 16) % colors.length;
    return colors[index];
  };

  return (
    <div>
      {data.length === 0 ? (
        <div className="text-center py-10 text-muted-foreground">
          No customers found matching your filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((customer, index) => (
            <Card
              ref={data.length - 1 === index ? lastElementRef : undefined}
              key={customer.id}
              className="overflow-hidden p-0"
            >
              <CardHeader className="pb-2 p-2">
                <div className="flex items-start justify-between w-full">
                  <div className="flex items-center space-x-4">
                    <Avatar className={getAvatarColor(customer.id)}>
                      <AvatarFallback>
                        {getInitials(customer.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">
                        {customer.name || (
                          <span className="text-muted-foreground italic">
                            Unnamed Customer
                          </span>
                        )}
                      </h3>
                      <p className="text-sm text-muted-foreground flex items-center">
                        <Mail className="h-3 w-3 mr-1" />
                        {customer.email}
                      </p>
                    </div>
                  </div>

                  {customer.remark ? (
                    <Badge
                      variant="outline"
                      className={
                        customer.remark.includes("PENDING")
                          ? "bg-yellow-100 text-yellow-800"
                          : ""
                      }
                    >
                      {customer.remark}
                    </Badge>
                  ) : (
                    <Badge variant="outline">Active</Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="pb-2 p-2">
                <div className="space-y-2 mt-2">
                  {customer.phone_number && (
                    <p className="text-sm flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      {customer.phone_number}
                    </p>
                  )}

                  {customer.address && (
                    <p className="text-sm flex items-start">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{customer.address}</span>
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <p className="text-sm flex items-center">
                      <Smartphone className="h-4 w-4 mr-2 text-muted-foreground" />
                      {customer.devices.length} device
                      {customer.devices.length !== 1 ? "s" : ""}
                    </p>

                    <p className="text-xs text-muted-foreground flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(customer.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="pt-2">
                <div className="flex space-x-2 w-full">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>

                  <Button
                    onClick={() =>
                      router.push(`/workflows/clients/${customer.id}`)
                    }
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
          ))}
          {isFetchingNextPage && <ClientCardLoading />}
        </div>
      )}
    </div>
  );
}

"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type Client from "@/models/client";
import { Calendar, Mail, MapPin, Phone, Smartphone, User } from "lucide-react";

// Change the component function signature to include an onClose prop
export function CustomerDetail({
  data: customer,
  onClose,
}: {
  data: Client;
  onClose?: () => void;
}) {
  return (
    <div className="space-y-4 relative">
      {/* Add close button in the top-right corner */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-0 right-0 p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      )}

      <div className="flex flex-col space-y-1.5">
        <h3 className="text-2xl font-semibold leading-none tracking-tight">
          {customer.name || "Unnamed Customer"}
        </h3>
        <p className="text-sm text-muted-foreground flex items-center">
          <Mail className="h-4 w-4 mr-2" />
          {customer.email}
        </p>
        {customer.phone_number && (
          <p className="text-sm text-muted-foreground flex items-center">
            <Phone className="h-4 w-4 mr-2" />
            {customer.phone_number}
          </p>
        )}
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium flex items-center">
                <User className="h-4 w-4 mr-2" />
                Status
              </h4>
              <div>
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
            </div>

            {customer.address && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  Address
                </h4>
                <p className="text-sm">{customer.address}</p>
              </div>
            )}

            <div className="space-y-2">
              <h4 className="text-sm font-medium flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Created
              </h4>
              <p className="text-sm">
                {new Date(customer.created_at).toLocaleDateString()} by{" "}
                {customer.created_by.name}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Last Updated
              </h4>
              <p className="text-sm">
                {new Date(customer.updated_at).toLocaleDateString()}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Devices</CardTitle>
            <CardDescription>
              {customer.devices.length} device
              {customer.devices.length !== 1 ? "s" : ""} associated
            </CardDescription>
          </CardHeader>
          <CardContent>
            {customer.devices.length > 0 ? (
              <ul className="space-y-2">
                {customer.devices.map((device) => (
                  <li key={device.id} className="flex items-center text-sm">
                    <Smartphone className="h-4 w-4 mr-2" />
                    Device ID: {device.id}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                No devices associated with this customer.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

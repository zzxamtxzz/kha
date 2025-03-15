"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Plan from "@/models/plan";
import { ArrowLeft } from "lucide-react";
import CreatePlanForm from "./form";

export default function CreatePlanClient(prop: {
  onSuccess: (data?: Plan) => void;
  onClose: () => void;
  defaultValues?: Plan;
}) {
  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <div className="mb-6">
        <Button
          className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          variant={"ghost"}
          onClick={prop.onClose}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Plans
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create New Plan</CardTitle>
          <CardDescription>
            Add a new subscription plan to the system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreatePlanForm {...prop} />
        </CardContent>
      </Card>
    </div>
  );
}

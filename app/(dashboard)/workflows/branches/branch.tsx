"use client";

import type React from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Branch from "@/models/branch";
import { format } from "date-fns";
import {
  Calendar,
  ChevronDown,
  ChevronRight,
  Pencil,
  Trash2,
} from "lucide-react";
import { useState } from "react";

function BranchItem({ branch }: { branch: Branch }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Find all children for this category
  const children = branch.devices || [];
  const hasChildren = children.length > 0;

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would call your API to update the category
    console.log("Updating category:", branch.id);
    // After successful update, close the dialog
    setIsEditDialogOpen(false);
    // You would typically refresh your data here
  };

  const handleDelete = () => {
    // Here you would call your API to delete the category
    console.log("Deleting category:", branch.id);
    // You would typically refresh your data here
  };

  return (
    <Card className="border-l-4 border-l-primary p-0 rounded-md w-full">
      <CardContent className="p-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              {hasChildren ? (
                <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                  <div>
                    <div className="flex">
                      <CollapsibleTrigger asChild>
                        <button className="p-1 rounded-full hover:bg-muted w-6 h-6 cursor-pointer">
                          {isOpen ? (
                            <ChevronDown size={16} />
                          ) : (
                            <ChevronRight size={16} />
                          )}
                        </button>
                      </CollapsibleTrigger>
                      <div>
                        <h3 className="font-semibold">{branch.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <div className="flex items-center gap-1">
                            <Calendar size={14} />
                            {format(new Date(branch.created_at), "MMM d, yyyy")}
                          </div>
                        </div>
                      </div>
                    </div>
                    <CollapsibleContent className="mt-4 pl-6 border-l border-muted">
                      <div className="space-y-2">
                        {children.map((child) => (
                          <BranchItem
                            key={child.id}
                            branch={{
                              ...child,
                              id: child.id,
                              name: child.first_name + " " + child.last_name,
                            }}
                          />
                        ))}
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              ) : (
                <div className="pl-6">
                  <h3 className="font-semibold">{branch.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      {format(new Date(branch.created_at), "MMM d, yyyy")}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-sm text-muted-foreground mr-2">
              Created by: {branch.created_by?.first_name}{" "}
              {branch.created_by?.last_name}
            </div>

            {/* Edit Dialog */}
            {/* <CreateCategory defaultValues={branch}> */}
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Pencil size={16} />
            </Button>
            {/* </CreateCategory> */}

            {/* Delete Alert Dialog */}
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive"
                >
                  <Trash2 size={16} />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete the branch "{branch.name}".
                    {hasChildren &&
                      " All child categories will also be deleted."}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-destructive text-destructive-foreground"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default BranchItem;

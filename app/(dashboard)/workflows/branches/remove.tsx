import { useMutateInfiniteData } from "@/app/hooks/mutateInfinite";
import axios from "@/axios";
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
import { toast } from "@/hooks/use-toast";
import Branch from "@/models/branch";
import { QueryKey } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { useState } from "react";

function RemoveBranch({
  branch,
  queryKey,
}: {
  branch: Branch;
  queryKey: QueryKey;
}) {
  const [loading, setLoading] = useState(false);
  const { updateData } = useMutateInfiniteData();
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          size={"icon"}
          className="w-6 h-6 text-red-500"
          variant={"outline"}
        >
          <Trash2 className="w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="p-4">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            plan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-500 hover:bg-red-600"
            onClick={async () => {
              try {
                setLoading(true);
                const response = await axios.delete(
                  `/api/branches/${branch.id}`
                );
                toast({ title: "Success", description: "Remove successfully" });
                updateData({ queryKey, id: branch.id, remove: true });
              } catch (error: any) {
                toast({
                  title: "Error",
                  variant: "destructive",
                  description: error.message,
                });
                console.log("error", error);
              } finally {
                setLoading(false);
              }
            }}
            disabled={loading}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default RemoveBranch;

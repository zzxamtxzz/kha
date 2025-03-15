"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface UnsavedChangesDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function UnsavedChangesDialog({
  isOpen,
  onClose,
  onConfirm,
}: UnsavedChangesDialogProps) {
  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
          <AlertDialogDescription>
            You have unsaved changes. Are you sure you want to leave? Your
            changes will be lost.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Leave Page</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function useUnsavedChangesDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<() => void>(() => {});

  const confirmNavigation = (action: () => void) => {
    setPendingAction(() => action);
    setIsOpen(true);
  };

  const handleConfirm = () => {
    setIsOpen(false);
    pendingAction();
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return {
    isOpen,
    confirmNavigation,
    UnsavedChangesDialogComponent: (
      <UnsavedChangesDialog
        isOpen={isOpen}
        onClose={handleClose}
        onConfirm={handleConfirm}
      />
    ),
  };
}

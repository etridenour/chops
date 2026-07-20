import { Button } from "./Button";
import { AlertDialog, XStack } from "tamagui";
import React from "react";

interface ConfirmDialogProps {
  trigger: React.ReactNode; // the element that opens it (e.g. your Delete menu item)
  title: string;
  description?: string;
  confirmLabel?: string; // default "Confirm"
  cancelLabel?: string; // default "Cancel"
  onConfirm: () => void;
}

export function ConfirmDialog({
  trigger,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <AlertDialog>
      <AlertDialog.Trigger asChild>{trigger}</AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay />
        <AlertDialog.Content>
          <AlertDialog.Title>{title || "Are you sure?"}</AlertDialog.Title>
          <AlertDialog.Description>
            {description || "This action cannot be undone."}
          </AlertDialog.Description>
          <XStack gap="$3" justifyContent="flex-end">
            <AlertDialog.Cancel asChild>
              <Button variant="secondary">{cancelLabel || "Cancel"}</Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <Button onPress={onConfirm}>{confirmLabel || "Confirm"}</Button>
            </AlertDialog.Action>
          </XStack>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog>
  );
}

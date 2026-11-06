import { Button } from "./Button";
import { AlertDialog, XStack } from "tamagui";
import React from "react";

interface ConfirmDialogProps {
  trigger?: React.ReactNode; // element that opens it (uncontrolled mode)
  open?: boolean; // controlled open state (omit trigger when using this)
  onOpenChange?: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string; // default "Confirm"
  cancelLabel?: string; // default "Cancel"
  onConfirm: () => void;
}

export function ConfirmDialog({
  trigger,
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {trigger && <AlertDialog.Trigger asChild>{trigger}</AlertDialog.Trigger>}
      <AlertDialog.Portal>
        <AlertDialog.Overlay backgroundColor="$black" opacity={0.5} />
        <AlertDialog.Content
          backgroundColor="$background"
          borderWidth={1}
          borderColor="$borderColor"
          borderRadius="$4"
          padding="$5"
          gap="$3"
          width="90%"
          maxWidth={420}
          shadowColor="$black"
          shadowOpacity={0.15}
          shadowRadius={12}
          shadowOffset={{ width: 0, height: 4 }}
        >
          <AlertDialog.Title fontSize="$4" fontWeight="600">
            {title || "Are you sure?"}
          </AlertDialog.Title>
          <AlertDialog.Description color="$colorMuted">
            {description || "This action cannot be undone."}
          </AlertDialog.Description>
          <XStack gap="$3" justifyContent="flex-end" marginTop="$2">
            <AlertDialog.Cancel asChild>
              <Button variant="secondary" aria-label={cancelLabel || "Cancel"}>
                {cancelLabel || "Cancel"}
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <Button
                onPress={onConfirm}
                aria-label={confirmLabel || "Confirm"}
              >
                {confirmLabel || "Confirm"}
              </Button>
            </AlertDialog.Action>
          </XStack>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog>
  );
}

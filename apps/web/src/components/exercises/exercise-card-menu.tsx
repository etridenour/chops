import {
  Button,
  ConfirmDialog,
  MoreVertical,
  Popover,
  YStack,
} from "@chops/ui";
import { useRef, useState } from "react";

interface ExerciseCardMenuProps {
  onEdit: () => void;
  onDelete: () => void;
}

export function ExerciseCardMenu({ onEdit, onDelete }: ExerciseCardMenuProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  // Guard against Tamagui's Popover re-opening right after an outside-dismiss
  // when the trigger itself is clicked to close. When the menu open is clicked an overlay is clicked
  // to close the menu, but it also triggers a re-open. This is a workaround to prevent that from happening.
  const closedAt = useRef(0);

  const handleMenuOpenChange = (next: boolean) => {
    if (next && Date.now() - closedAt.current < 250) return;
    if (!next) closedAt.current = Date.now();
    setMenuOpen(next);
  };

  return (
    <>
      <Popover
        open={menuOpen}
        onOpenChange={handleMenuOpenChange}
        placement="bottom-end"
      >
        <Popover.Trigger asChild>
          <Button
            variant="ghost"
            size="sm"
            hoverStyle={{ backgroundColor: "$backgroundMutedPress" }}
          >
            <MoreVertical size={18} color="$colorMuted" />
          </Button>
        </Popover.Trigger>
        <Popover.Content
          backgroundColor="$background"
          borderWidth={1}
          borderColor="$borderColor"
          borderRadius="$3"
          padding="$1"
          minWidth={180}
          shadowColor="$black"
          shadowOpacity={0.15}
          shadowRadius={12}
          shadowOffset={{ width: 0, height: 4 }}
        >
          <Popover.Arrow
            size={12}
            backgroundColor="$background"
            borderColor="$borderColor"
            borderWidth={1}
          />
          <YStack width="100%">
            <Button
              variant="ghost"
              size="sm"
              fullWidth
              justifyContent="flex-start"
              hoverStyle={{ backgroundColor: "$backgroundMutedHover" }}
              onPress={() => {
                setMenuOpen(false);
                onEdit();
              }}
            >
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              fullWidth
              justifyContent="flex-start"
              hoverStyle={{ backgroundColor: "$backgroundMutedHover" }}
              onPress={() => {
                setMenuOpen(false);
                setConfirmOpen(true);
              }}
            >
              Delete
            </Button>
          </YStack>
        </Popover.Content>
      </Popover>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete exercise?"
        description="This can't be undone."
        confirmLabel="Delete"
        onConfirm={onDelete}
      />
    </>
  );
}

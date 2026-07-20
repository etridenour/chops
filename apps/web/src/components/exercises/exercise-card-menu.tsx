import {
  Button,
  ConfirmDialog,
  MoreVertical,
  Popover,
  YStack,
} from "@chops/ui";

interface ExerciseCardMenuProps {
  onEdit: () => void;
  onDelete: () => void;
}

export function ExerciseCardMenu({ onEdit, onDelete }: ExerciseCardMenuProps) {
  return (
    <Popover placement="bottom-end">
      <Popover.Trigger>
        <Button>
          <MoreVertical size={18} />
        </Button>
      </Popover.Trigger>
      <Popover.Content>
        <YStack>
          <Button onPress={onEdit}>Edit</Button>
          <ConfirmDialog
            trigger={<Button variant="ghost">Delete</Button>}
            title="Delete exercise?"
            description="This can't be undone."
            confirmLabel="Delete"
            onConfirm={onDelete}
          />
        </YStack>
      </Popover.Content>
    </Popover>
  );
}

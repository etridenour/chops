import { Input, InputProps } from "@chops/ui";
import { useState } from "react";

interface NumberInputProps extends Omit<InputProps, "value" | "onChange"> {
  value: number | undefined;
  onChange: (value: number | undefined) => void;
}

export function NumberInput({ value, onChange, ...rest }: NumberInputProps) {
  const [text, setText] = useState(value == null ? "" : String(value));

  return (
    <Input
      inputMode="numeric"
      value={text} // <- controlled by LOCAL string
      onChange={(e) => {
        const raw = (e.target as HTMLInputElement).value;
        setText(raw); // box can hold "" freely
        onChange(raw === "" ? undefined : Number(raw)); // lift parsed number up
      }}
      {...rest}
    />
  );
}

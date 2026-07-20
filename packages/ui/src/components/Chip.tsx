import { styled, Paragraph } from "tamagui";

export const Chip = styled(Paragraph, {
  render: "span",
  fontFamily: "$body",
  fontSize: "$2",
  color: "$colorMuted",
  borderWidth: 1,
  borderColor: "$borderColor",
  paddingHorizontal: "$2",
  paddingVertical: "$1",
  borderRadius: "$round",
});

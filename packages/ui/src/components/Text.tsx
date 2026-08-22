import { styled } from "tamagui";
import { Paragraph, SizableText } from "tamagui";

export const H1 = styled(Paragraph, {
  render: "h1",
  fontFamily: "$heading",
  fontSize: "$5",
  color: "$color",
});

export const H2 = styled(Paragraph, {
  render: "h2",
  fontFamily: "$heading",
  fontSize: "$4",
  color: "$color",
});

export const Body = styled(Paragraph, {
  render: "p",
  fontFamily: "$body",
  fontSize: "$3",
  color: "$color",
});

export const Label = styled(Paragraph, {
  render: "label",
  fontFamily: "$body",
  fontSize: "$2",
  color: "$colorMuted",
});

export const ErrorText = styled(Paragraph, {
  render: "p",
  role: "alert",
  "aria-live": "assertive",
  fontFamily: "$body",
  fontSize: "$2",
  color: "red",
  marginBottom: "$3",
});

export const LinkText = styled(SizableText, {
  fontFamily: "$body",
  fontSize: "$2",
  color: "$colorMuted",
  textAlign: "center",
  cursor: "pointer",
  hoverStyle: {
    color: "$color",
  },
});

import { styled } from 'tamagui'
import { Paragraph, SizableText } from 'tamagui'

export const H1 = styled(Paragraph, {
  tag: 'h1',
  fontFamily: '$heading',
  fontSize: '$5',
  color: '$color',
})

export const H2 = styled(Paragraph, {
  tag: 'h2',
  fontFamily: '$heading',
  fontSize: '$4',
  color: '$color',
})

export const Body = styled(Paragraph, {
  tag: 'p',
  fontFamily: '$body',
  fontSize: '$3',
  color: '$color',
})

export const Label = styled(Paragraph, {
  tag: 'label',
  fontFamily: '$body',
  fontSize: '$2',
  color: '$colorMuted',
})

export const ErrorText = styled(Paragraph, {
  tag: 'p',
  fontFamily: '$body',
  fontSize: '$2',
  color: 'red',
  marginBottom: '$3',
})

export const LinkText = styled(SizableText, {
  fontFamily: '$body',
  fontSize: '$2',
  color: '$colorMuted',
  textAlign: 'center',
  cursor: 'pointer',
  hoverStyle: {
    color: '$color',
  },
})

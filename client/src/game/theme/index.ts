import { extendTheme, type ThemeConfig, theme as base } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: true,
};

const fonts = {
  heading: `Fascinate Inline, ${base.fonts.heading}`,
  body: `Clear Sans, ${base.fonts.body}`,
};

const theme = extendTheme({
  config,
  fonts,
});

export default theme;

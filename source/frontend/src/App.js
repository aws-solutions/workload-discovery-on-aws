import React from 'react';
import {Authenticator, Heading, Image, ThemeProvider} from '@aws-amplify/ui-react';
import "@awsui/global-styles/index.css";
import '@aws-amplify/ui-react/styles.css';
import Main from './Main';
import {Box, SpaceBetween} from "@awsui/components-react";
import * as awsui from "@awsui/design-tokens";

const components = {
  Header() {
    return (
      <Box margin={{vertical: "m"}} textAlign={"center"}>
        <SpaceBetween size={"xs"}>
          <Image
            alt="Workload Discovery on AWS icon"
            src="/icons/AWS-Zoom_light-bg.svg"
            objectFit="initial"
            objectPosition="50% 50%"
            backgroundColor="initial"
            height="120px"
            width="120px"
            opacity="100%"
          />
          <Heading level={3}>Workload Discovery on AWS</Heading>
        </SpaceBetween>
      </Box>
    );
  }
}

export const App = () => {
  const theme = {
    name: 'theme',
    tokens: {
      fonts: {
        default: {
          variable: { value: awsui.fontFamilyBase },
          static: { value: awsui.fontFamilyBase },
        },
      },
      colors: {
        brand: {
          primary: {
            '10': {value: awsui.colorBackgroundButtonPrimaryDisabled},
            '80': {value: awsui.colorBackgroundButtonPrimaryDefault},
            '90': {value: awsui.colorBackgroundButtonPrimaryHover},
            '100': {value: awsui.colorBackgroundButtonPrimaryActive},
          },
        },
      },
      fontSizes: {
        xxxs: { value: '0.6rem' },
        xxs: { value: '0.8rem' },
        xs: { value: '1rem' },
        small: { value: '1.4rem' },
        medium: { value: '1.4rem' },
        large: { value: '2rem' },
        xl: { value: '2.4rem' },
        xxl: { value: '2.8rem' },
        xxxl: { value: '4.2rem' },
        xxxxl: { value: '8rem' },
      },
      space: {
        xxxs: { value: '0.4rem' },
        xxs: { value: '0.6rem' },
        xs: { value: '0.8rem' },
        small: { value: '1.2rem' },
        medium: { value: '1.6rem' },
        large: { value: '2.4rem' },
        xl: { value: '3.2rem' },
        xxl: { value: '4.8rem' },
        xxxl: { value: '7.2rem' },
      },
      radii: {
        xs: { value: '0.2rem' },
        small: { value: '0.2rem' },
        medium: { value: '0.8rem' },
        large: { value: '1.6rem' },
        xl: { value: '3.2rem' },
        xxl: { value: '6.4rem' },
        xxxl: { value: '12.8rem' },
      }
    }
  }
  return (
    <ThemeProvider theme={theme}>
      <Authenticator components={components} hideSignUp={true}>
        <Main />
      </Authenticator>
    </ThemeProvider>
  );
};

export default App;

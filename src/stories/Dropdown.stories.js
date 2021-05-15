import { ThemeProvider } from '@material-ui/styles';
import React from 'react';
import Theme from '../theme';

import Dropdown from './input/Dropdown';

export default {
  title: 'Input/Dropdown',
  component: Dropdown,
  decorators: [
    (Story) => (
      <ThemeProvider theme={Theme}>
        <Story />
      </ThemeProvider>
    ),
  ],
};

const Template = (args) => <Dropdown {...args} />;

/**
 * A dropdown with no items. There should be a default "empty" option appended.
 */
export const NoOptions = Template.bind({});
NoOptions.args = {};

/**
 * One option only. The default "empty" option should not be present.
 */
export const OneOptionOnly = Template.bind({});
OneOptionOnly.args = {
  options: [ "One" ],
  selected: "One"
};

export const ThreeOptions = Template.bind({});
ThreeOptions.args = {
  options: [ "One", "Two", "Three" ],
  selected: "One"
};

import { configure } from '@storybook/react';

import '../src/critical.scss';
import '../src/index.scss';

const req = require.context('../src/stories', true, /.stories.js$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
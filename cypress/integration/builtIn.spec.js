import runAutoHeightTests from '../tests/runAutoHeightTests.js';
import runElementDefinitionTests from '../tests/runElementDefinitionTests.js';
import runResizeEventTests from '../tests/runResizeEventTests.js';

const selector = 'textarea[is=enhanced-textarea]';

const options = {
  selector,
  startFunction: win => win.defineElement('enhanced-textarea')
};

describe('Built-in', () => {
  runElementDefinitionTests(options);
  runAutoHeightTests(options);
  runResizeEventTests(options);
});

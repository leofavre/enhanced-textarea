import runAutoHeightTests from '../tests/runAutoHeightTests.js';
import runElementDefinitionTests from '../tests/runElementDefinitionTests.js';
import runResizeEventTests from '../tests/runResizeEventTests.js';

const selector = 'textarea[is=enhanced-textarea-built-in]';

const options = {
  selector,
  startFunction: win => win.defineBuiltInElement('enhanced-textarea-built-in')
};

describe('Built-in', () => {
  runElementDefinitionTests(options);
  runAutoHeightTests(options);
  runResizeEventTests(options);
});

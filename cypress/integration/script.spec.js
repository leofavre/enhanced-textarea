import runAutoHeightTests from '../tests/runAutoHeightTests.js';
import runElementDefinitionTests from '../tests/runElementDefinitionTests.js';
import runResizeEventTests from '../tests/runResizeEventTests.js';

const selector = 'textarea[data=enhanced-textarea]';

const options = {
  selector,
  startFunction: win => win.enhance(win.document.querySelector(selector))
};

describe('Script', () => {
  runAutoHeightTests(options);
  runElementDefinitionTests(options);
  runResizeEventTests(options);
});

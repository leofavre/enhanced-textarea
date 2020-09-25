import runAutoHeightTests from '../tests/runAutoHeightTests.js';
import runElementDefinitionTests from '../tests/runElementDefinitionTests.js';
import runResizeEventTests from '../tests/runResizeEventTests.js';

const selector = 'enhanced-textarea';

const options = {
  selector,
  startFunction: win => win.defineElement()
};

describe('Element', () => {
  runElementDefinitionTests(options);
  runAutoHeightTests(options);
  runResizeEventTests(options);
});

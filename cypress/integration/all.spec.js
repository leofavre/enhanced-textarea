import runAutoHeightTests from '../tests/runAutoHeightTests.spec.js';
import runResizeEventTests from '../tests/runResizeEventTests.spec.js';

const selector = 'textarea[is=enhanced-textarea]';

const options = {
  selector,
  startFunction: win => win.defineElement('enhanced-textarea')
};

runAutoHeightTests(options);
runResizeEventTests(options);

import runAutoheightTests from '../tests/runAutoheightTests.spec.js';
import runResizeEventTests from '../tests/runResizeEventTests.spec.js';

const selector = 'textarea[is=enhanced-textarea]';

const options = {
  selector,
  startFunction: win => win.defineElement('enhanced-textarea')
};

runAutoheightTests(options);
runResizeEventTests(options);

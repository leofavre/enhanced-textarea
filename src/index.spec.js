import * as packages from './index.js';

const packageNames = Object.keys(packages).sort();

describe('Main Distribution', () => {
  it('Exports all packages', () => {
    expect(packageNames).toEqual([
      'EnhancedTextAreaBuiltIn'
    ]);
  });
});

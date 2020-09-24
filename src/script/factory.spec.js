import WithScript from '../hocs/WithScript.js';
import WithAutoHeight from '../hocs/WithAutoHeight.js';
import WithResizeEvent from '../hocs/WithResizeEvent.js';
import EnhancedTextAreaBuiltInFactory from './factory.js';

jest.mock('../hocs/WithScript.js');
jest.mock('../hocs/WithAutoHeight.js');
jest.mock('../hocs/WithResizeEvent.js');

describe('EnhancedTextAreaBuiltInFactory', () => {
  beforeEach(() => {
    WithScript.mockImplementation(Base => class extends Base {});
    WithAutoHeight.mockImplementation(Base => class extends Base {});
    WithResizeEvent.mockImplementation(Base => class extends Base {});
  });

  afterEach(() => {
    WithScript.mockClear();
    WithAutoHeight.mockClear();
    WithResizeEvent.mockClear();
  });

  it('Uses an empty class as default parameter', () => {
    EnhancedTextAreaBuiltInFactory();
  });

  it('Returns a class that extends another passed as parameter', () => {
    const Base = class {};
    const ResultClass = EnhancedTextAreaBuiltInFactory(Base);

    expect(WithResizeEvent).toHaveBeenCalledWith(Base);
    const [{ value: WithResizeEventResult }] = WithResizeEvent.mock.results;

    expect(WithAutoHeight).toHaveBeenCalledWith(WithResizeEventResult);
    const [{ value: WithAutoHeightResult }] = WithAutoHeight.mock.results;

    expect(WithScript).toHaveBeenCalledWith(WithAutoHeightResult);
    const [{ value: WithScriptResult }] = WithScript.mock.results;

    expect(ResultClass.prototype).toBeInstanceOf(WithScriptResult);
    expect(ResultClass.prototype).toBeInstanceOf(WithAutoHeightResult);
    expect(ResultClass.prototype).toBeInstanceOf(WithResizeEventResult);
    expect(ResultClass.prototype).toBeInstanceOf(Base);
  });
});

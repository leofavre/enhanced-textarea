import WithAutoHeight from './hocs/WithAutoHeight.js';
import WithResizeEvent from './hocs/WithResizeEvent.js';
import EnhancedTextAreaFactory from './EnhancedTextAreaFactory.js';

jest.mock('./hocs/WithAutoHeight.js');
jest.mock('./hocs/WithResizeEvent.js');

WithAutoHeight.mockImplementation(Base => class extends Base {});
WithResizeEvent.mockImplementation(Base => class extends Base {});

describe('EnhancedTextAreaFactory', () => {
  afterEach(() => {
    WithAutoHeight.mockClear();
    WithResizeEvent.mockClear();
  });

  test('Uses an empty class as default parameter', () => {
    EnhancedTextAreaFactory();
  });

  test('Returns a class that extends another passed as parameter', () => {
    const Base = class {};
    const ResultClass = EnhancedTextAreaFactory(Base);

    expect(WithResizeEvent).toHaveBeenCalledWith(Base);
    const [{ value: WithResizeEventResult }] = WithResizeEvent.mock.results;

    expect(WithAutoHeight).toHaveBeenCalledWith(WithResizeEventResult);
    const [{ value: WithAutoHeightResult }] = WithAutoHeight.mock.results;

    expect(ResultClass.prototype).toBeInstanceOf(WithAutoHeightResult);
    expect(ResultClass.prototype).toBeInstanceOf(WithResizeEventResult);
    expect(ResultClass.prototype).toBeInstanceOf(Base);
  });
});

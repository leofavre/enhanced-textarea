import WithAutoHeight from './hocs/WithAutoHeight.js';
import WithResizeEvent from './hocs/WithResizeEvent.js';
import TextAreaAutoSizeFactory from './TextAreaAutoSizeFactory.js';

jest.mock('./hocs/WithAutoHeight.js');
jest.mock('./hocs/WithResizeEvent.js');

WithAutoHeight.mockImplementation(Base => class extends Base {});
WithResizeEvent.mockImplementation(Base => class extends Base {});

describe('TextAreaAutoSizeFactory', () => {
  afterEach(() => {
    WithAutoHeight.mockClear();
    WithResizeEvent.mockClear();
  });

  test('Uses an empty class as default parameter', () => {
    TextAreaAutoSizeFactory();
  });

  test('Returns a class that extends another passed as parameter', () => {
    const Base = class {};
    const ResultClass = TextAreaAutoSizeFactory(Base);

    expect(WithResizeEvent).toHaveBeenCalledWith(Base);
    const [{ value: WithResizeEventResult }] = WithResizeEvent.mock.results;

    expect(WithAutoHeight).toHaveBeenCalledWith(WithResizeEventResult);
    const [{ value: WithAutoHeightResult }] = WithAutoHeight.mock.results;

    expect(ResultClass.prototype).toBeInstanceOf(WithAutoHeightResult);
    expect(ResultClass.prototype).toBeInstanceOf(WithResizeEventResult);
    expect(ResultClass.prototype).toBeInstanceOf(Base);
  });
});

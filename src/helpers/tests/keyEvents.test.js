import { onEnter, onEscape } from '../keyEvents';

describe('KeyEvents helpers', () => {
  let mockCallback;
  let mockEvent;

  beforeEach(() => {
    mockCallback = jest.fn();
  });

  describe('onEnter', () => {
    beforeEach(() => {
      mockEvent = {
        shiftKey: false,
        keyCode: 13,
        target: {
          value: 'foo'
        }
      };
    });

    it('invokes callback on enter', () => {
      onEnter(mockCallback)(mockEvent);

      expect(mockCallback).toHaveBeenCalledTimes(1);
      expect(mockCallback).toHaveBeenCalledWith(mockEvent);
    });

    it('invokes callback on "enter" key', () => {
      mockEvent.key = 'Enter';
      delete mockEvent.keyCode;
      onEnter(mockCallback)(mockEvent);

      expect(mockCallback).toHaveBeenCalledTimes(1);
      expect(mockCallback).toHaveBeenCalledWith(mockEvent);
    });

    it('does not invoke the callback on enter with shift', () => {
      mockEvent.shiftKey = true;
      onEnter(mockCallback)(mockEvent);

      expect(mockCallback).toHaveBeenCalledTimes(0);
    });

    it('does not invoke callback if key other than enter is pressed', () => {
      mockEvent.keyCode = 12;
      onEnter(mockCallback)(mockEvent);

      expect(mockCallback).toHaveBeenCalledTimes(0);
    });
  });

  describe('onEscape', () => {
    beforeEach(() => {
      mockEvent = {
        shiftKey: false,
        keyCode: 27,
        target: {
          value: 'foo'
        }
      };
    });

    it('invokes callback on escape', () => {
      onEscape(mockCallback)(mockEvent);

      expect(mockCallback).toHaveBeenCalledTimes(1);
      expect(mockCallback).toHaveBeenCalledWith(mockEvent);
    });

    it('invokes callback on "escape" key', () => {
      mockEvent.key = 'Escape';
      delete mockEvent.keyCode;
      onEscape(mockCallback)(mockEvent);

      expect(mockCallback).toHaveBeenCalledTimes(1);
      expect(mockCallback).toHaveBeenCalledWith(mockEvent);
    });

    it('does not invoke the callback on escape with shift', () => {
      mockEvent.shiftKey = true;
      onEscape(mockCallback)(mockEvent);

      expect(mockCallback).toHaveBeenCalledTimes(0);
    });

    it('does not invoke callback if key other than escape is pressed', () => {
      mockEvent.keyCode = 12;
      onEscape(mockCallback)(mockEvent);

      expect(mockCallback).toHaveBeenCalledTimes(0);
    });
  });
});

import { getDataUrl, getBase64Contents } from '../file';

describe('Helper: File', () => {

  let FR;
  let file;

  beforeEach(() => {
    FR = global.FileReader;
    global.FileReader = function () {
      this.addEventListener = jest.fn((event, cb) => this.cb = cb);
      this.readAsDataURL = jest.fn(() => {
        this.result = 'data:image/png;base64,<BASE64 ENCODED CONTENTS>';
        this.cb();
      });
    };
    file = new File(['some contents'], 'test.png');
  });

  afterEach(() => {
    global.FileReader = FR;
  });

  describe('getDataUrl', () => {

    it('should return the results of readAsDataURL', async () => {
      const result = await getDataUrl(file);
      expect(result).toEqual('data:image/png;base64,<BASE64 ENCODED CONTENTS>');
    });

    it('should reject if the given object is not a File', () => expect(getDataUrl({})).rejects.toEqual('Only native File objects can be converted to data URL'));

  });

  describe('getBase64Contents', () => {

    it('should return only the base64 contents', async () => {
      const result = await getBase64Contents(file);
      expect(result).toEqual('<BASE64 ENCODED CONTENTS>');
    });

  });

});

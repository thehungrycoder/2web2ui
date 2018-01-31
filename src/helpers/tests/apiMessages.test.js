import { apiResponseToAlert } from '../apiMessages';

describe('Helper: API error message', () => {
  const errResp = {
    response: {
      data: {
        errors: [
          { description: 'it all went baaad' }
        ]
      }
    }
  };

  it('produces an error alert with details', () => {
    const resp = Object.assign({}, errResp);
    const msg = 'frob twiddlage got borked';
    const action = apiResponseToAlert(resp, msg);
    expect(action).toMatchObject({
      type: 'error',
      message: msg,
      details: resp.response.data.errors[0].description
    });
  });

  it('falls back to err[0].message', () => {
    const resp = Object.assign({}, errResp);
    delete resp.response.data.errors[0].description;
    resp.response.data.errors[0].message = 'gosh what a mess';
    const msg = 'weak message';
    const action = apiResponseToAlert(resp, msg);
    expect(action).toMatchObject({
      type: 'error',
      message: msg,
      details: resp.response.data.errors[0].message
    });
  });
});

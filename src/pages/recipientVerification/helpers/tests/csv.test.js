import cases from 'jest-in-case';

import parseRecipientListCsv from '../csv';

// Note: these tests pass CSV strings into the function under test.
// The production version passes a DOM File object.

describe('Recipient list CSV parser', () => {

  it('accepts minimal CSV and produces JSON', () => {
    const csv = 'email\nscratch@example.com\n';
    return expect(parseRecipientListCsv(csv)).resolves.toMatchSnapshot();
  });

  it('requires an email field', () => {
    const csv = 'email,name\n,Scratcht\n';
    return expect(parseRecipientListCsv(csv)).rejects.toMatchSnapshot();
  });

  cases('accepts optional text fields', (csv) => expect(parseRecipientListCsv(csv)).resolves.toMatchSnapshot(), [
    'email,name\nscratch@example.com,Scratchy\n',
    'email,return_path\nscratch@example.com,scratchy@bounces.examples.com\n'
  ]);

  cases('accepts JSON fields', (csv) => expect(parseRecipientListCsv(csv)).resolves.toMatchSnapshot(), [
    'email,metadata\nscratch@example.com,"{""flavor"":""vanilla""}"\n',
    'email,substitution_data\nscratch@example.com,"{""firstname"":""Scratchy""}"\n',
    'email,tags\nscratch@example.com,"[""vanilla"", ""ice-cream""]"\n'
  ]);

  it('is not sensitive to field order', () => {
    const csv = 'name,email\nScratchy,scratch@example.com\n';
    return expect(parseRecipientListCsv(csv)).resolves.toMatchSnapshot();
  });

  it('ignores unexpected fields', () => {
    const csv = 'name,email,ailment\nScratchy,scratch@example.com,chronic itches\n';
    return expect(parseRecipientListCsv(csv)).resolves.toMatchSnapshot();
  });

  it('collects multiple errors', () => {
    const csv = 'email,substitution_data,metadata,tags\nscratch@example.com\n,{"badjson:101}\nscratch2@example.com,,"{morebadjson"":""fre""}\n';
    return expect(parseRecipientListCsv(csv)).rejects.toMatchSnapshot();
  });
});


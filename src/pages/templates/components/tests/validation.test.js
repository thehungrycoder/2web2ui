import * as validation from '../validation';

describe('validJson', () => {
  it('should return error with invalid json', () => {
    expect(validation.validJson('', { testData: 'not json' })).toEqual('Invalid Test Data');
  });

  it('should return undefined with valid json', () => {
    expect(validation.validJson('', { testData: '{ "test": "json" }' })).toEqual(undefined);
  });
});

describe('contentRequired', () => {
  it('should handle error', () => {
    const allValues = {
      content: {
        html: '',
        text: ''
      }
    };
    expect(validation.contentRequired('', allValues)).toEqual('Template HTML or text content is required.');
  });

  it('should handle success', () => {
    const allValues = {
      content: {
        html: 'test',
        text: ''
      }
    };
    expect(validation.contentRequired('', allValues)).toEqual(undefined);
  });
});

describe('substitution', () => {
  it('should handle substitution values', () => {
    expect(validation.substitution('{{ sub_content }}')).toEqual(undefined);
    expect(validation.substitution('{{ not valid }}')).toEqual('Substitution syntax error');
    expect(validation.substitution('{{ not }} valid')).toEqual('Substitution syntax error');
  });
});

describe('emailOrSubstitution', () => {
  it('should handle invalid email', () => {
    expect(validation.emailOrSubstitution('not an email')).toEqual('Invalid email or substitution value');
  });

  it('should handle valid email', () => {
    expect(validation.emailOrSubstitution('an@email.com')).toEqual(undefined);
  });

  it('should handle substitution values', () => {
    expect(validation.emailOrSubstitution('{{a}}@{{b}}')).toEqual(undefined);
  });

  it('should handle domain substitution value', () => {
    expect(validation.emailOrSubstitution('email@{{b}}')).toEqual(undefined);
  });

  it('should handle local substitution value', () => {
    expect(validation.emailOrSubstitution('{{a}}@domain.com')).toEqual(undefined);
  });

  it('should handle whole substitution value', () => {
    expect(validation.emailOrSubstitution('{{ab}}')).toEqual(undefined);
  });
});

describe('idSyntax', () => {
  it('should handle invalid id', () => {
    expect(validation.idSyntax('not!valid@12 3')).toEqual('Can only contain lowercase letters, numbers, hyphens and underscores');
  });

  it('should handle valid id', () => {
    expect(validation.idSyntax('is-valid-1')).toEqual(undefined);
  });
});

import * as validation from '../validation';

describe('substitution', () => {
  it('should loosely handle substitution values', () => {
    expect(validation.looseSubstitution('{{ sub_content }}')).toEqual(undefined);
    expect(validation.looseSubstitution('e.{{ if sending_domain }}{{sending_domain}}{{else}}domain-123.com{{end}}')).toEqual(undefined);
    expect(validation.looseSubstitution('{{ {{}}')).toEqual(undefined); // intentional
    expect(validation.looseSubstitution('{{ notvalid')).toEqual('Substitution syntax error');
    expect(validation.looseSubstitution('{ not valid }')).toEqual('Substitution syntax error');
    expect(validation.looseSubstitution('notvalid.com')).toEqual('Substitution syntax error');
  });
});

describe('emailOrSubstitution', () => {
  it('should skip if not provided a value', () => {
    expect(validation.emailOrSubstitution('')).toBe(undefined);
  });

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

  it('should handle complicated domain substitution value', () => {
    expect(validation.emailOrSubstitution('email@{{if sending_domain}}{{domain}}{{else}}domain.com{{end}}')).toEqual(undefined);
  });

  it('should handle local substitution value', () => {
    expect(validation.emailOrSubstitution('{{a}}@domain.com')).toEqual(undefined);
  });

  it('should handle whole substitution value', () => {
    expect(validation.emailOrSubstitution('{{ab}}')).toEqual(undefined);
  });
});

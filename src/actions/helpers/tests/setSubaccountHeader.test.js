import setSubaccountHeader from '../setSubaccountHeader';

describe('setSubaccountHeader helper tests', () => {
  it('should set headers to empty object if subaccount is null', () => {
    expect(setSubaccountHeader()).toEqual({});

  });

  it('should use subaccount.id when it is an object', () => {
    expect(setSubaccountHeader({ id: 1 })).toEqual({ 'x-msys-subaccount': 1 });

  });

  it('should use subaccount when not an object', () => {
    expect(setSubaccountHeader(1)).toEqual({ 'x-msys-subaccount': 1 });
  });
});

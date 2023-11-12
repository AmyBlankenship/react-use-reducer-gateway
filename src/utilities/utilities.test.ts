import {createUpdateAction} from "./utilities";

describe('utilities', ()=> {
  it('should create an update action', () => {
    expect(createUpdateAction('street_address', '1234 5th St')).toEqual({
      type: 'update_street_address',
      payload: '1234 5th St'
    })
  });
});
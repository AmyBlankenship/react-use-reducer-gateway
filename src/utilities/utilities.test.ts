import {createUpdateAction, genericReducer} from "./utilities";

describe('utilities', ()=> {
  describe('action creator', () => {
    it('should create an update action', () => {
      expect(createUpdateAction('street_address', '1234 5th St')).toEqual({
        type: 'update_street_address',
        payload: '1234 5th St'
      });
    });
  });
  describe('reducer', () => {
    const initialState = {
      street_address: '1234 5th St.',
      city: 'Anywhere',
      state: 'MD',
      zip: 12345
    };
    it('should update state in response to an update action', () => {
      const action = {type: 'update_city' as const, payload: 'Somewhere'};
      const state = genericReducer(initialState, action)
      expect(state).toEqual({
        street_address: '1234 5th St.',
        city: 'Somewhere',
        state: 'MD',
        zip: 12345,
        isChanged: true
      });
    });
    it('should throw useful error when called without a starting state', () => {
      const action = {type: 'update_city', payload: 'Somewhere'};
      // @ts-expect-error
      expect(() => genericReducer(undefined, action)).toThrow('No initial state provided to reducer')
    });
    it('should throw useful error when called without an action', () => {
      // @ts-expect-error
      expect(()=>genericReducer(initialState)).toThrow('Without an action, we don\'t know how to update the state')
    });
    it('should throw useful error when update action does not match a property of the state', () => {
      const action = {type: 'update_random_prop' as const, payload: 'oops'}
      // @ts-expect-error
      expect(()=> genericReducer(initialState, action)).toThrow('Can\'t update property "random_prop" because this is not a valid property on the state.')
    });
    it('should overwrite entire state in response to an initialize action', () => {
      const action = {
        type: 'initialize' as const,
        payload: {
          street_address: '10456 Pruitt Road',
          city: 'Kalamazoo',
          state: 'MI',
          zip: 67890
        }
      }
      expect(genericReducer(initialState, action))
        .toEqual({...action.payload, isChanged: false})
    });
  });
});
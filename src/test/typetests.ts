import {KeysOfType, UpdateAction, UpdateActionMap, UpdateActions} from '../utilities/utilities';

// this function gratefully swiped from redux toolkit type tests
declare const expectType: <T>(t: T) => T;

// individual action type
{
  type TestActionNumber = UpdateAction<'number', number>

  const testActionNumberInstance: TestActionNumber = {
    type: 'update_number',
    payload: 10
  }

  const BadTestNumberActionInstance: TestActionNumber = {
    // @ts-expect-error
    type: 'update_string',
    // @ts-expect-error
    payload: '10'
  }

  type TestActionString = UpdateAction<'string', string>

  const testActionStringInstance: TestActionString = {
    type: 'update_string',
    payload: '10'
  }

  const badTestActionStringInstance: TestActionString = {
    // @ts-expect-error
    type: 'update_number',
    // @ts-expect-error
    payload: 10
  }

  type TestActionRandom = UpdateAction<'random', { foo: string, bar: number }>

  const testActionRandomInstance: TestActionRandom = {
    type: 'update_random',
    payload: {foo: 'baz', bar: 18}
  }

}

type Address = {
  street_address: string;
  city: string;
  state: string;
  zip: number
}

// map from a source type to an object whose keys define the actions needed
// to update its props
{
  const addressActionsMapInstance: UpdateActionMap<Address> = {
    street_address: {
      type: 'update_street_address',
      payload: '1234 5th St.'
    },
    city: {
      type: 'update_city',
      payload: 'Anywhere'
    },
    state: {
      type: 'update_state',
      payload: 'MD'
    },
    zip: {
      type: 'update_zip',
      payload: 12345
    }
  }

}

// pull individual action types out of the map for use in reducer
{
  type IndividualMappedActions = UpdateActions<Address>

  const streatAddressAction: IndividualMappedActions = {
    type: 'update_street_address',
    payload: '1234 5th St'
  }
  // @ts-expect-error
  const badStreetAddressAction: IndividualMappedActions = {
    type: 'update_street_address',
    payload: 19
  }
  const cityAction: IndividualMappedActions = {
    type: 'update_city',
    payload: 'Anywhere'
  }
  const stateAction: IndividualMappedActions = {
    type: 'update_state',
    payload: 'MD'
  }
  const zipAction: IndividualMappedActions = {
    type: 'update_zip',
    payload: 12345
  }

  const completelyInvalidAction: IndividualMappedActions = {
    // @ts-expect-error
    type: 'update_address_action',
    // @ts-expect-error
    payload: {foo: 'bar'}
  }
}

{
  let validKey: KeysOfType<Address, string> = 'street_address'
  validKey = 'street_address'
  validKey = 'city'
  validKey = 'state'
  // @ts-expect-error
  const invalidKey: KeysOfType<Address, string> = 'zip'
}

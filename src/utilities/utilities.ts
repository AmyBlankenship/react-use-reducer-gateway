import {ChangeEvent} from "react";

export type AnyObject = Record<string, unknown>

/*  See
    https://medium.com/better-programming/building-typescript-types-for-the-usereducer-hook-c19e7690af6c
    for more about these types
 */
// single action based on key and type
export type UpdateAction<KeyName extends string, PayloadType> = {
  type: `update_${KeyName}`;
  payload: PayloadType
}

// map the keys to the above type
export type UpdateActionMap<SourceType extends AnyObject> = {
  [Key in keyof SourceType]: UpdateAction<string & Key, SourceType[Key]>
}

// Create the map and get the types from the keys
export type UpdateActions<SourceType extends Record<string, any>> = UpdateActionMap<SourceType>[keyof SourceType];

export type InitializeAction<P extends AnyObject> = {
  type: 'initialize',
  payload: P
}

// https://medium.hexlabs.io/building-complex-types-in-typescript-804c973ce66f#89cd
export type KeysOfType<O extends AnyObject, T> = {
  [K in keyof  O]: O[K] extends T ? K: never
}[keyof O]

export type HandlersForPropsOfType<T extends AnyObject, DesiredPropType> = {
  [K in keyof T]: T[K] extends DesiredPropType ? (
    e: ChangeEvent<HTMLInputElement>) => void :
    never
}

export const createUpdateAction = <FieldName extends string, PayloadType = unknown>(field: FieldName, payload: PayloadType): UpdateAction<FieldName, PayloadType> => {
  return {
    type: `update_${field}`,
    payload
  }
}

export const genericReducer = <S extends AnyObject>(state: S, action: UpdateActions<S> | InitializeAction<S>) => {
  if (!action) {
    throw new Error('Without an action, we don\'t know how to update the state.')
  }
  if (action.type.startsWith('update_')) {
    if (!state) {
      throw new Error('No initial state provided to reducer.')
    }
    const prop_name: keyof S = action.type.replace('update_', '')
    if (!state.hasOwnProperty(prop_name)) {
      throw new Error('Can\'t update property "random_prop" because this is not a valid property on the state.')
    }
    return {...state, [prop_name]: action.payload, isChanged: true}
  }
  if (action.type === 'initialize') {
    return {...(action as InitializeAction<S>).payload, isChanged: false}
  }
  return { ...state }
}

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
export type UpdateActionMap<SourceType extends Record<string, unknown>> = {
  [Key in keyof SourceType]: UpdateAction<string & Key, SourceType[Key]>
}

// Create the map and get the types from the keys
export type UpdateActions<SourceType extends Record<string, any>> = UpdateActionMap<SourceType>[keyof SourceType];

export type InitializeAction = {
  type: 'initialize',
  payload: Record<string, unknown>
}

export const createUpdateAction = <FieldName extends string, PayloadType = unknown>(field: FieldName, payload: PayloadType): UpdateAction<FieldName, PayloadType> => {
  return {
    type: `update_${field}`,
    payload
  }
}

type CreatedAction = ReturnType<typeof createUpdateAction>

type UpdateOrInitializeAction = CreatedAction | InitializeAction

export const genericReducer = <S extends Record<string, unknown>, A extends UpdateOrInitializeAction>(state: S, action: A) => {
  if (!action) {
    throw new Error('Without an action, we don\'t know how to update the state.')
  }
  if (action.type.startsWith('update_')) {
    if (!state) {
      throw new Error('No initial state provided to reducer.')
    }
    const prop_name = action.type.replace('update_', '')
    if (!state.hasOwnProperty(prop_name)) {
      throw new Error('Can\'t update property "random_prop" because this is not a valid property on the state.')
    }
    return {...state, [prop_name]: action.payload, isChanged: true}
  }
  if (action.type === 'initialize') {
    return {...action.payload, isChanged: false}
  }
  return { ...state }
}

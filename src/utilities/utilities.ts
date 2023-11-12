
type AnyAction = {
  type: string,
  payload: unknown
}

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

export const createUpdateAction = <FieldName extends string, PayloadType = unknown>(field: FieldName, payload: PayloadType): UpdateAction<FieldName, PayloadType> => {
  return {
    type: `update_${field}`,
    payload
  }
}

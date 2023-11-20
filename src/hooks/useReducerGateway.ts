import {ChangeEvent, useCallback, useEffect, useMemo, useReducer, useState} from "react";
import {
  AnyObject,
  createUpdateAction,
  genericReducer,
  HandlersForPropsOfType,
  KeysOfType
} from "../utilities/utilities";

const useReducerGateway = <T extends AnyObject>(input: T) => {
  const [state, dispatch] = useReducer(genericReducer, input);
  const [isInitialized, setIsInitialized] = useState(false)

  const update = useCallback(<F extends keyof T>(fieldName: F, value: T[F]) => {
    dispatch(createUpdateAction(fieldName as string, value))
  }, [input]);

  const { isChanged, ...interimValue } = state;

  const createStringInputHandler = useCallback(<P extends KeysOfType<T, string>>(prop: P) => {
    return (e: ChangeEvent<HTMLInputElement>) => {
      const val = e.currentTarget.value as T[P];
      update(prop, val);
    }
  }, [update]);
  const createNumberInputHandler = useCallback(<P extends KeysOfType<T, number>>(prop: P) => {
    return (e: ChangeEvent<HTMLInputElement>) => {
      const val = e.currentTarget.valueAsNumber as T[P];
      if (isNaN(val as number)) {
        throw new Error('Number input handler must be used with input where the type is set to "number"')
      }
      update(prop, val);
    }
  }, [update]);


  const handlers: HandlersForPropsOfType<T, string | number> = useMemo(() => {
    return Object.entries(input).reduce((h, [key, value]) => {
      if (typeof value === 'string') {
        return {...h, [key]: createStringInputHandler(key as KeysOfType<T, string>)}
      }
      if (typeof value === 'number') {
        return {...h, [key]: createNumberInputHandler(key as KeysOfType<T, number>)}
      }
      return h
    }, {} as HandlersForPropsOfType<T, string | number>);
  }, [input]);

  const getInputHandlerFor = useCallback((prop: KeysOfType<T, string | number>) => {
    if (!input.hasOwnProperty(prop)) {
      throw new Error(`No HTMLInputElement handler available for property "${
        prop as string
      }". Reason: input value does not have that property.`);
    }
    const propType = typeof input[prop]
    if (!['string', 'number'].includes(propType)) {
      throw new Error(`No HTMLInputElement handler available for property "${
        prop as string
      }". Use "update" directly.`);
    }
    return handlers[prop];
  }, [handlers]);


  useEffect(() => {
    if (!isInitialized) {
      setIsInitialized(true)
    } else {
      dispatch({
        type: 'initialize',
        payload: input
      })
    }
  }, [input]);

  const value = interimValue as T;

  return {
    value, isChanged: !!isChanged,
    update,
    getInputHandlerFor
  };
}

export default useReducerGateway
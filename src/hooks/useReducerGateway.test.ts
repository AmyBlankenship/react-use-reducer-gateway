import {ChangeEvent} from "react";
import {act, renderHook} from "@testing-library/react";
import useReducerGateway from "./useReducerGateway";

describe('useReducerGateway', () => {
  const initialState = {
    street_address: '1234 5th St.',
    city: 'Anywhere',
    state: 'MD',
    zip: 12345
  };
  it('should return the original data with an isChanged status of false', () => {
    const { result } = renderHook(() => {
      const managedData = useReducerGateway(initialState);
      return managedData;
    });

    expect(result.current).toMatchObject({
      value: initialState,
      isChanged: false
    })
  });
  it('should expose update method that updates a field', () => {
    const { result } = renderHook(() => {
      const managedData = useReducerGateway(initialState);
      return managedData;
    });

    expect(result.current.update).toEqual(expect.any(Function));
    act(() => result.current.update('street_address', '5678 9th Avenue'));

    expect(result.current.isChanged).toEqual(true);
    expect(result.current.value.street_address).toEqual('5678 9th Avenue');
  });
  it('should expose default HTMLInput handlers for string and number types', () => {
    const { result } = renderHook(() => {
      const managedData = useReducerGateway(initialState);
      return managedData;
    });

    const streetAddressUpdateFn = result.current.getInputHandlerFor('street_address');
    const zipUpdateFn = result.current.getInputHandlerFor('zip');

    expect(streetAddressUpdateFn).toEqual(expect.any(Function));
    expect(zipUpdateFn).toEqual(expect.any(Function));

    const streetAddressEvt = {
      currentTarget: {
        value: '5678 9th Avenue'
      }
    } as unknown as ChangeEvent<HTMLInputElement>

    act(() => {
      streetAddressUpdateFn(streetAddressEvt)
    })
    let { value, isChanged } = result.current
    expect(value.street_address).toEqual('5678 9th Avenue')
    expect(isChanged).toEqual(true)

    const zipUpdateEvent = {
      currentTarget: {
        valueAsNumber: 95126
      }
    } as ChangeEvent<HTMLInputElement>

    act(() => {
      zipUpdateFn(zipUpdateEvent)
    });

    ({ value } = result.current)
    expect(value.zip).toEqual(95126)

  });
  it('should throw error if called with property managed object does not have', () => {
    const { result } = renderHook(() => {
      const managedData = useReducerGateway(initialState)
      return managedData;
    });
    const badFn = () => {
      // @ts-expect-error
      result.current.getInputHandlerFor('randomPropName')
    }
    expect(badFn).toThrow(`No HTMLInputElement handler available for property "randomPropName". Reason: input value does not have that property.`)
  });
  it('should throw error if called with property where the value is not a string or number', () => {
    const { result } = renderHook((input) => {
      const managedData = useReducerGateway(input)
      return managedData;
    }, {initialProps: {
        ...initialState, objectProp: {metadata: 'Little Timmy lives here'}
      }});

    const badFn = () => {
      // @ts-expect-error
      result.current.getInputHandlerFor('objectProp')
    }
    expect(badFn).toThrow(`No HTMLInputElement handler available for property "objectProp". Use "update" directly.`)
  });
  it('should initialize the state if given a different value', () => {
    const { result, rerender } = renderHook((input) => {
      const managedData = useReducerGateway(input)
      return managedData;
    }, {initialProps: initialState});
    act(() => result.current.update('street_address', '5678 9th Avenue'));
    expect(result.current.isChanged).toEqual(true);
    const newState = {
      street_address: '8765 North Ave.',
      city: 'Batesville',
      state: 'NH',
      zip: 89012
    }
    rerender(newState)

    expect(result.current.value).toEqual(newState)
    expect(result.current.isChanged).toEqual(false)
  });
});
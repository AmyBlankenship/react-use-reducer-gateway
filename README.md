# react-use-reducer-gateway

"Gateway drug" for developers hesitant to use React's useReducer. Covers 80% of cases, getting you hooked so you can
take on the other 20% when you're ready. `useReducerGateway` handles the Typescript typing around editing a complex
object, and provides some handy utilities to reduce the amount of code you need to write (no pun intended). Many of the
components used in the hook are also exposed so that you can use them to produce your own solutions.

**Install:**

```
npm install @amy_blankenship/react-use-reducer-gateway
```

**Example:**

[Repo](https://github.com/AmyBlankenship/react-use-reducer-gateway-example) | [Codesandbox](https://codesandbox.io/p/devbox/github/AmyBlankenship/react-use-reducer-gateway-example/tree/main)

**Basic usage**

```
const {
    value,
    isChanged,
    getInputHandlerFor,
    initialize,
    update
} = useReducerGateway<YourObjectType>(yourObject)
```

In many cases, you don't have to supply the type of your object,
as it will be inferred from usage. However, if you want to have 
Typescript help you prevent editing some properties such as database
ids, you can provide a type that omits these properties. Note that
the properties will still exist on the object and you can still edit 
them if you can get your code to compile, but Typescript will give you
an error reminding you not to try.

**Returns:**

| Property           | Type                                                                                 | Description                                                                        |
|--------------------|--------------------------------------------------------------------------------------|------------------------------------------------------------------------------------|
| value              | inferred/provided                                                                    | object being edited                                                                |
| isChanged          | boolean                                                                              | true if object has ben updated since it was initialized                            |
| getInputHandlerFor | (propertyName: YourObjectType) => (e: ChangeEvent<HTMLInputElement>) => void         | gets a function that can be usedto handle a change event on a text or number input |
| initialize         | (value: YourObjectType) => void                                                      | sets the managed value to the new value and resets isChanged                       |
| update             | (propertyName: keyof YourObjectType, newValue: YourObjectType[propertyName]) => void | updates the named property on the object to the new value                          |  

If you provide a new object to `useReducerGateway`, it will initialize itself to the new value, setting `isChanged` 
to false in the process.

`getInputHanderFor` is designed to provide change handlers for the two most common cases: 
a `text` input control and a `number` input control. Calling `getInputHandlerFor('someProp')` will return a function with
a stable reference that will update that property from an input control, reducing the need to manually write `useCallback` handlers.
It will attempt to use `value` for string properties and `valueAsNumber` for numeric properties.

Use the `update` method, with or without `useCallback`, for values of other types or if you're
not using HTMLInputElements.

**Exposed Utilities**

`createUpdateAction<T>(fieldName: keyof T, newVal: T[fieldName])` : creates an action with the following signature:
```
{
    type: \`update_${fieldName}\`,
    payload: T[fieldName]
}
```

`genericReducer`: `<S extends AnyObject>(state: S, action: UpdateActions<S> | InitializeAction<S>) => S & { isChanged: boolean}`
A generic reducer that takes update actions with the signature createAction creates or an initialize action, and returns an
object of the provided type that also has an `isChanged` property for tracking if it has been edited or not.

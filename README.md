# unmarshaller

> Toolbox for configuration

## Example

```js
import {builder, unmarshal} from 'unmarshaller';

const unmarshaller = {
  editor: builder.string('EDITOR'),
  browser: builder.string('BROWSER'),
};

const lookupFn = (key) => process.env[key];
const config = unmarshal(lookupFn, unmarshaller);

console.log(config);
```

## Basics

### Lookup function

You need to provide to the `unmarshal` function a way to lookup from keys in configuration.

The example above returns the value found in the process's environment:

```js
const lookupFn = (key) => process.env[key];
```

### Unmarshaller

Just an object which represent your configuration.

### Builder

Helper functions to build the unmarshaller object.

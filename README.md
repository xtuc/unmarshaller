# unmarshaller

> Toolbox for configuration

[![Build Status](https://travis-ci.org/xtuc/unmarshaller.svg?branch=master)](https://travis-ci.org/xtuc/unmarshaller)

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

#### Default types

| type    |
|---------|
| string  |
| boolean |
| number  |
| object  |
| holder  |

#### Default options

|name|type|description|
|----|----|-----------|
|defaultValue|string|fallback value if the lookup returned `undefined` or `null`|
|of|array|provide an enumeration of possible values|  fallbacks to `defaultValue` and `null`.|
|parser|function|provide an custom parser function (usually when you want your own types)|

### Extending the default builder

The builder is a regular JavaScript object.

Customizing the builder gives you the possiblity to use your own data converters.

The following example use a custom type: `color` (which in my use case parses a string into a structure).

```js
import {builder as defaultBuilder} from 'unmarshaller';

export const builder = {
  ...defaultBuilder,
  color: (name, options) => ({
    name,
    parser: parseColor,
    type: 'color',
    ...options
  }),
};
```

You need to provide a custom parser function (`parseColor` in the example above).
The definition is: `function(value: string): string`.

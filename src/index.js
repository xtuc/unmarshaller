/* @flow */

/**
 * Helper for builder an unmarshaller object
 *
 * @returns {Object}
 */
const builder: UnmarshallerBuilder = {
  string: (name, options) => ({
    name,
    type: 'string',
    ...options
  }),
  boolean: (name, options) => ({
    name,
    type: 'boolean',
    ...options
  }),
  number: (name, options) => ({
    name,
    type: 'number',
    ...options
  }),
  object: (name, options) => ({
    name,
    type: 'object',
    ...options
  }),
  holder: (children) => ({
    children,
    type: 'holder'
  })
};

/**
 * Unmarshal a given configuration object
 *
 * @param {Function} lookupFn
 * @param {Object} unmarshaller
 * @returns {Object}
 */
function unmarshal(lookupFn: LookupFunction, unmarshaller: Object) {
  const keys = Object.keys(unmarshaller);

  const res = keys.reduce((acc, key) => {
    const {name, type, defaultValue, children, of} = unmarshaller[key];
    const value = lookupFn(name);

    if (type === 'holder') {
      acc[key] = unmarshal(lookupFn, children);
      return acc;
    }

    if (value !== undefined && value !== null) {
      acc[key] = castIntoType(type, value);
    } else if (defaultValue !== undefined && defaultValue !== null) {
      acc[key] = defaultValue;
    }

    if (of) {
      if (of.indexOf(acc[key]) === -1) {
        acc[key] = defaultValue || null;
      }
    }

    return acc;
  }, {});

  return Object.freeze(res);
}

/**
 * Cast value into a given type
 *
 * @param {string} type
 * @param {string} value
 */
function castIntoType(type: string, value: any) {
  switch (type) {

  case 'string':
    return String(value);

  case 'number':
    return parseFloat(value);

  case 'boolean':
    return value == 'true' || value == true;

  case 'object':
    try {
      if (typeof value === 'object') {
        return value;
      }
      return JSON.parse(value);
    } catch (e) {
      console.error(new Error(`${value} cannot be cast into ${type}: ${e}`));
      return {};
    }

  default:
    throw new Error(`${value} cannot be cast into ${type}`);
  }
}

export {builder, unmarshal, castIntoType};

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
  holder: (children = {}) => ({
    children,
    type: 'holder'
  }),
  or: (...children) => ({
    children,
    type: 'or'
  }),
};

/**
 * Return the first non empty child of an or holder
 *
 * @param {Function} lookupFn
 * @param {Object} or
 * @returns {Object}
 */
function getFirstNonEmptyChild(lookupFn: LookupFunction, or: Or) {
  return or.children.reduce((acc, child) => {
    // Shortcut to avoid calling lookupFn
    if (acc) {
      return acc;
    }

    const value = lookupFn(child.name);
    if (Boolean(value)) {
      return child;
    }

    return acc;
  }, null) || or.children[0];
}

/**
 * Unmarshal a given configuration object
 *
 * @param {Function} lookupFn
 * @param {Object} unmarshaller
 * @returns {Object}
 */
function unmarshal(lookupFn: LookupFunction, unmarshaller: Object) {
  if (typeof lookupFn !== 'function') {
    throw new Error(`lookupFn must be a function, ${typeof lookupFn} given`);
  }

  if (typeof unmarshaller !== 'object') {
    throw new Error(`unmarshaller must be an object, ${typeof unmarshaller} given`);
  }

  // clone the unmarshaller object to prevent mutation related errors
  unmarshaller = {...unmarshaller};

  const keys = Object.keys(unmarshaller);

  const res = keys.reduce((acc, key) => {
    if (unmarshaller[key].type === 'or') {
      unmarshaller[key] = getFirstNonEmptyChild(lookupFn, unmarshaller[key]);
    }

    const {parser, name, type, defaultValue, children, of} = unmarshaller[key];
    let value;

    if (type === 'holder') {
      acc[key] = unmarshal(lookupFn, children);
      return acc;
    } else {
      value = lookupFn(name);
    }

    if (value !== undefined && value !== null) {

      if (parser) {

        if (typeof parser !== 'function') {
          throw new Error(`parser for type ${type} must be a function, ${typeof parser} given`);
        }

        acc[key] = parser(value);
      } else {
        acc[key] = castIntoType(type, value);
      }
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

  case 'or':
    return value;

  default:
    throw new Error(`${value} cannot be cast into ${type}`);
  }
}

function extend(initialHolder: Holder, additionalChildren: Children = {}) {
  return builder.holder({
    ...initialHolder.children,
    ...additionalChildren
  });
}

export {builder, unmarshal, castIntoType, extend};

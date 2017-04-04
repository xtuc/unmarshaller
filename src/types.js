/* @flow */

declare function LookupFunction(string): any;

declare type UnmarshallerBuilder = {
  string: (name: string, options: ?Object) => Object,
  boolean: (name: string, options: ?Object) => Object,
  number: (name: string, options: ?Object) => Object,
  object: (name: string, options: ?Object) => Object,
  holder: (children: ?UnmarshallerBuilder) => Object,
};

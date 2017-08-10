/* @flow */

declare function LookupFunction(string): any;

declare type UnmarshallerBuilder = {
  string: (name: string, options: ?Object) => Child,
  boolean: (name: string, options: ?Object) => Child,
  number: (name: string, options: ?Object) => Child,
  object: (name: string, options: ?Object) => Child,
  holder: (children?: Children) => Holder,
};

declare type Child = {
  name: string,
  options?: Object
};

declare type Holder = {
  children: Children,
  type: 'holder'
};

declare type Or = {
  children: Children,
  type: 'or'
};

declare type Children = {
  [string]: Child | Holder
};

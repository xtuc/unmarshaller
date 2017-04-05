import {assert} from 'chai';
import {unmarshal, builder, castIntoType} from '../lib/index';

function createLookupFn(params = {}) {
  return (name) => params[name];
}

describe('config', () => {

  it('builder should have the correct functions', () => {
    assert.isFunction(builder.string);
    assert.isFunction(builder.number);
    assert.isFunction(builder.object);
    assert.isFunction(builder.holder);
    assert.isFunction(builder.boolean);
  });

  describe('cast into type', () => {

    it('should throw an error if type isn\'t castable', () => {
      const fn = () => castIntoType('foo', 'bar');

      assert.throws(fn, /cannot be cast/);
    });

    it('should cast into the right type', () => {
      assert.isString(castIntoType('string', 'value'));
      assert.isNumber(castIntoType('number', '199'));
      assert.isObject(castIntoType('object', '{}'));
      assert.isObject(castIntoType('object', 'foobar'));
      assert.isTrue(castIntoType('boolean', 'true'));
      assert.isFalse(castIntoType('boolean', 'false'));
      assert.isTrue(castIntoType('boolean', true));
      assert.isFalse(castIntoType('boolean', false));
    });
  });

  describe('unmarshalling', () => {

    it('should return an immutable object', () => {
      const lookupFn = createLookupFn({});
      const config = unmarshal(lookupFn, {});

      try {
        config.a = 'foo';
      } catch (e) {
      }

      assert.notEqual(config.a, 'foo');
    });

    it('should retrieve a value', () => {

      const lookupFn = createLookupFn({
        foo: 'test'
      });

      const unmarshaller = {
        foo: builder.string('foo')
      };

      const config = unmarshal(lookupFn, unmarshaller);

      assert.isOk(config.foo);
      assert.equal(config.foo, 'test');
    });

    it('should retreive a number value', () => {

      const lookupFn = createLookupFn({
        foo: '100'
      });

      const unmarshaller = {
        foo: builder.number('foo')
      };

      const config = unmarshal(lookupFn, unmarshaller);

      assert.isOk(config.foo);
      assert.isNumber(config.foo);
    });

    it('should retrieve an object value', () => {

      const lookupFn = createLookupFn({
        foo: '{"bar": true}',
        foo2: {'bar': true}
      });

      const unmarshaller = {
        foo: builder.object('foo'),
        foo2: builder.object('foo2')
      };

      const config = unmarshal(lookupFn, unmarshaller);

      assert.isOk(config.foo);
      assert.isObject(config.foo);
      assert.equal(config.foo.bar, true);

      assert.isOk(config.foo2);
      assert.isObject(config.foo2);
      assert.equal(config.foo2.bar, true);
    });

    it('should retrieve multiple values of different types', () => {

      const lookupFn = createLookupFn({
        one: '8',
        two: '{"bar": true}',
        three: 'string',
        four: 'true',
        five: true,
        six: false
      });

      const unmarshaller = {
        one: builder.number('one'),
        two: builder.object('two'),
        three: builder.string('three'),
        four: builder.boolean('four'),
        five: builder.boolean('five'),
        six: builder.boolean('six'),
      };

      const config = unmarshal(lookupFn, unmarshaller);
      assert.equal(config.one, 8);
      assert.deepEqual(config.two, {bar: true});
      assert.equal(config.three, 'string');
      assert.equal(config.four, true);
      assert.equal(config.five, true);
      assert.equal(config.six, false);
    });

    it('should retrieve a value with a different name', () => {

      const lookupFn = createLookupFn({
        foo: '8'
      });

      const unmarshaller = {
        bar: builder.number('foo'),
      };

      const config = unmarshal(lookupFn, unmarshaller);

      assert.isOk(config.bar);
      assert.equal(config.bar, 8);
    });

    it('should unmarshal values into a holder', () => {
      const lookupFn = createLookupFn({
        bar: 'test'
      });

      const unmarshaller = {
        foo: builder.holder({
          bar: builder.string('bar')
        })
      };

      const config = unmarshal(lookupFn, unmarshaller);

      assert.isOk(config.foo);
      assert.equal(config.foo.bar, 'test');
    });

    it('should use a string default value', () => {

      const lookupFn = createLookupFn({});

      const unmarshaller = {
        foo: builder.string('foo', {defaultValue: 'bar'})
      };

      const config = unmarshal(lookupFn, unmarshaller);

      assert.isOk(config.foo);
      assert.equal(config.foo, 'bar');
    });

    it('should use a boolean default value', () => {

      const lookupFn = createLookupFn({
        nullValue: null
      });

      const unmarshaller = {
        defaultToTrue: builder.boolean('defaultToTrue', {defaultValue: true}),
        defaultToFalse: builder.boolean('defaultToFalse', {defaultValue: false}),
        nullValueDefaultToTrue: builder.boolean('nullValue', {defaultValue: true})
      };

      const config = unmarshal(lookupFn, unmarshaller);
      assert.equal(config.defaultToTrue, true);
      assert.equal(config.defaultToFalse, false);
      assert.equal(config.nullValueDefaultToTrue, true);
    });

    describe('enumerations', () => {

      it('should use enum to validate value', () => {

        const lookupFn = createLookupFn({
          interaction: 'touch'
        });

        const unmarshaller = {
          interaction: builder.string('interaction', {of: ['touch', 'foo']})
        };

        const config = unmarshal(lookupFn, unmarshaller);

        assert.isOk(config.interaction);

      });

      it('should use enum to validate value and return null if not', () => {

        const lookupFn = createLookupFn({
          interaction: 'none'
        });

        const unmarshaller = {
          interaction: builder.string('interaction', {of: ['touch']})
        };

        const config = unmarshal(lookupFn, unmarshaller);

        assert.isNotOk(config.interaction);
      });

      it('should use enum to validate value and return default if not', () => {

        const lookupFn = createLookupFn({
          interaction: 'none'
        });

        const unmarshaller = {
          interaction: builder.string('interaction', {of: ['touch'], defaultValue: 'click'})
        };

        const config = unmarshal(lookupFn, unmarshaller);

        assert.isOk(config.interaction);

        assert.equal(config.interaction, 'click');
      });
    });

  });

});

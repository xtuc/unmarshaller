const defaultBuilder = require('unmarshaller').builder;

const builder = {
  ...defaultBuilder,

  color: (name, options) => ({
    name,
    type: 'color',
    ...options
  }),
};


const unmarshaller = {

  name: builder.string('name', {
    defaultValue: 'Sven'
  }),

  backgroundColor: builder.color('background_color', {
    defaultValue: '#69b0dc'
  }),

  textColor: builder.color('font_color', {
    defaultValue: 'black'
  }),
};

module.exports = {unmarshaller};

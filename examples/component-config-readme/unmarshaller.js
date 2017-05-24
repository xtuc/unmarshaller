const {builder} = require('unmarshaller');

const unmarshaller = {

  name: builder.string('name', {
    defaultValue: 'Sven',
    description: 'Name of the person',
  }),

  backgroundColor: builder.string('background_color', {
    defaultValue: '#69b0dc',
    description: 'Background color of the card',
  }),

  textColor: builder.string('font_color', {
    defaultValue: 'black',
    description: 'Font color',
  }),
};

module.exports = {unmarshaller};

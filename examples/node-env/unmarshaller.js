const {builder} = require('unmarshaller');

const unmarshaller = {
  editor: builder.string('EDITOR'),
  browser: builder.string('BROWSER'),
};

module.exports = {unmarshaller};

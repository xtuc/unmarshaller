const {unmarshal} = require('unmarshaller');
const {unmarshaller} = require('./unmarshaller');

const lookupFn = (key) => process.env[key];
const config = unmarshal(lookupFn, unmarshaller);

console.log(config);

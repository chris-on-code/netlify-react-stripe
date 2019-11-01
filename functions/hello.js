const createResponse = require('./helpers/create-response');

exports.handler = async function() {
  return createResponse(200, 'awesome!');
};

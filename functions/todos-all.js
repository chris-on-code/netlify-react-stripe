import { all } from './services/todo-service';
import middy from 'middy';
import { jsonBodyParser, validator, httpErrorHandler } from 'middy/middlewares';

async function handler(event, context) {
  try {
    const todos = await all();

    return {
      statusCode: 200,
      body: JSON.stringify(todos)
    };
  } catch (error) {
    console.log('error', error);
    return {
      statusCode: 400,
      body: JSON.stringify(error)
    };
  }
}

const inputSchema = {
  type: 'object',
  properties: {
    body: {
      type: 'object',
      properties: {
        name: { type: 'string' }
      },
      required: []
    }
  }
};

exports.handler = middy(handler)
  .use(jsonBodyParser())
  .use(validator({ inputSchema }))
  .use(httpErrorHandler());

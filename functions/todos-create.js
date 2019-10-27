// todos create
// https://www.netlify.com/blog/2018/07/09/building-serverless-crud-apps-with-netlify-functions-faunadb

/* code from functions/todos-create.js */
import faunadb from 'faunadb';

/* configure faunaDB Client with our secret */
const q = faunadb.query;
const client = new faunadb.Client({ secret: process.env.FAUNADB_SECRET });

exports.handler = async function(event, context) {
  // MIDDLEWARE CHECkS
  // TODO: CHECK IF USER IS TRYING TO DO SOMETHING THAT REQUIRES A SUBSCRIPTION

  /* parse the string body into a useable JS object */
  const data = JSON.parse(event.body);
  console.log('Function `todo-create` invoked', data);

  try {
    const response = await client.query(q.Create(q.Ref('classes/todos'), data));
    return {
      statusCode: 200,
      body: JSON.stringify(response)
    };
  } catch (error) {
    console.log('error', error);
    return {
      statusCode: 400,
      body: JSON.stringify(error)
    };
  }
};

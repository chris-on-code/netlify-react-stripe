/* code from functions/todos-update.js */
import faunadb from 'faunadb';
import getId from './helpers/get-id';

const q = faunadb.query;
const client = new faunadb.Client({ secret: process.env.FAUNADB_SECRET });

exports.handler = async function(event, context, callback) {
  const data = JSON.parse(event.body);
  const id = getId(event.path);
  console.log(`Function 'todo-update' invoked. update id: ${id}`);

  try {
    const response = await client.query(
      q.Update(q.Ref(`classes/todos/${id}`), { data })
    );

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

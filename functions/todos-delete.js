import faunadb from 'faunadb';
import getId from './helpers/get-id';

const q = faunadb.query;
const client = new faunadb.Client({ secret: process.env.FAUNADB_SECRET });

exports.handler = async function(event, context) {
  const id = getId(event.path);
  console.log(`Function 'todo-delete' invoked. delete id: ${id}`);

  try {
    const response = await client.query(q.Delete(q.Ref(`classes/todos/${id}`)));
    return {
      statusCode: 200,
      body: JSON.stringify(response)
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify(error)
    };
  }
};

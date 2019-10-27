import faunadb from 'faunadb';

const q = faunadb.query;
const client = new faunadb.Client({ secret: process.env.FAUNADB_SECRET });

exports.handler = async function(event, context) {
  const data = JSON.parse(event.body);
  console.log('data', data);
  console.log('Function `todo-delete-batch` invoked', data.ids);

  // construct batch query from IDs
  const deleteAllCompletedTodoQuery = data.ids.map(id => {
    return q.Delete(q.Ref(`classes/todos/${id}`));
  });

  try {
    const response = await client.query(deleteAllCompletedTodoQuery);
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

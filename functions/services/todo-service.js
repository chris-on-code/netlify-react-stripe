import faunadb from 'faunadb';

const q = faunadb.query;
const client = new faunadb.Client({ secret: process.env.FAUNADB_SECRET });

/**
 * Grab all items
 */
export async function all() {
  const response = await client.query(
    q.Paginate(q.Match(q.Ref('indexes/all_todos')))
  );

  const todoRefs = response.data;
  const getAllTodoDataQuery = todoRefs.map(ref => q.Get(ref));
  const todos = await client.query(getAllTodoDataQuery);

  return { todos };
}

export async function find(id) {}

/**
 * Create a item
 */
export async function create(data) {}

/**
 * Update an item
 */
export async function update(id, data) {}

/**
 * Delete an item
 */
export async function destroy(id) {}

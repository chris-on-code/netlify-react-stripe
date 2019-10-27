import updateUser from './helpers/update-user';
import faunadb from 'faunadb';

const q = faunadb.query;
const client = new faunadb.Client({ secret: process.env.FAUNADB_SECRET });

exports.handler = async function(event, context) {
  const { identity, user } = context;

  // check for auth
  if (!identity || !user)
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Not authenticated.' })
    };

  // get user information
  if (event.httpMethod !== 'PUT')
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Not a PUT request.' })
    };

  // no data
  if (!event.body)
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'No data incoming.' })
    };

  // create our data
  const data = { ...JSON.parse(event.body) };
  data.user_metadata = { ...user.user_metadata, ...data.user_metadata };
  data.app_metadata = { ...user.app_metadata, ...data.app_metadata };

  // update the user in netlify
  try {
    await updateUser(identity, user, data);
  } catch (error) {
    console.error(error);
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Couldn't update user in Netlify Identity."
      })
    };
  }

  // update the user in faunadb (do we have to?)
  // we only have to update user in faunadb if faunadb is where we hold roles
  try {
    await client.query(q.Update(q.Ref(`classes/users/${user.id}`), data));
  } catch (error) {
    console.error(error);
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Couldn't update user in FaunaDB.",
        error
      })
    };
  }

  // return the updated user
};

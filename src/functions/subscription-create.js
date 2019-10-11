import axios from 'axios';

require('dotenv').config();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type'
};

/**
 * Helper function to respond with a full object
 */
function createResponseObject(statusCode = 200, message = '', data = {}) {
  return {
    statusCode,
    headers,
    body: JSON.stringify({ message, ...data })
  };
}

/**
 * Is the string JSON?
 */
function hasJsonStructure(str) {
  if (typeof str !== 'string') return false;
  try {
    const result = JSON.parse(str);
    const type = Object.prototype.toString.call(result);
    return type === '[object Object]' || type === '[object Array]';
  } catch (err) {
    return false;
  }
}

/*
 Update the app_metadata of a user
*/
function updateUser(identity, user, app_metadata) {
  const new_app_metadata = { ...user.app_metadata, ...app_metadata };

  return axios.put(
    `${identity.url}/admin/users/${user.id}`,
    {
      app_metadata: new_app_metadata
    },
    {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${identity.token}`
      }
    }
  );
}

/**
 * Handle the thing
 */
exports.handler = async (event, context) => {
  //-- only handle POST requests
  if (event.httpMethod !== 'POST' || !event.body) {
    return createResponseObject(400, 'Only POST requests allowed or no data.');
  }

  //-- make sure we have a user
  const { identity, user } = context.clientContext;
  if (!user) {
    return createResponseObject(400, 'No user logged in.');
  }

  //-- check if our data is formed as actual JSON
  if (!hasJsonStructure(event.body)) {
    return createResponseObject(400, 'Data needs to be JSON format.');
  }

  //-- parse the body contents into an object.
  const data = JSON.parse(event.body);
  const token = data.token;
  const plan = data.plan || 'plan_Fv6CRXcGjHi16a'; // defaults to monthly

  //-- make sure we have all required data. otherwise, escape
  if (!token || !plan) {
    return createResponseObject(400, 'Missing Stripe token or Stripe plan.');
  }

  try {
    //-- create a customer
    const customer = await stripe.customers.create({
      description: `Customer for ${user.user_metadata.full_name}`,
      source: token
    });

    //-- create a subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ plan }]
    });

    // update the user
    const updateUserResponse = await updateUser(identity, user, {
      stripe_customer_id: customer.id,
      is_subscribed: true
    });
    const updateUserData = await updateUserResponse.json();
    console.log({ updateUserData });

    // return everything to our client
    return createResponseObject(200, 'Subscription created!', {
      customer,
      subscription
    });
  } catch (err) {
    console.error(err);
    return createResponseObject(400, "Customer couldn't be created.");
  }
};

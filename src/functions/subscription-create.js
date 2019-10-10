require('dotenv').config();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type'
};

/**
 * Helper function to respond with a full object
 */
function createResponseObject(statusCode = 200, message = '') {
  return {
    statusCode,
    headers,
    body: JSON.stringify({ message })
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

/**
 * Handle the thing
 */
exports.handler = async (event, context, callback) => {
  //-- only handle POST requests
  if (event.httpMethod !== 'POST' || !event.body) {
    callback(
      null,
      createResponseObject(400, 'Only POST requests allowed or no data.')
    );
    return;
  }

  //-- make sure we have a user
  const { user } = context.clientContext;
  if (!user) {
    callback(null, createResponseObject(400, 'No user logged in.'));
    return;
  }

  //-- check if our data is formed as actual JSON
  if (!hasJsonStructure(event.body)) {
    callback(null, createResponseObject(400, 'Data needs to be JSON format.'));
    return;
  }

  //-- parse the body contents into an object.
  const data = JSON.parse(event.body);

  const token = data.token;
  const plan = data.plan || 'plan_Fv6CRXcGjHi16a'; // defaults to monthly

  //-- make sure we have all required data. otherwise, escape
  if (!token || !plan) {
    callback(
      null,
      createResponseObject(400, 'Missing Stripe token or Stripe plan.')
    );
    return;
  }

  try {
    //-- create a customer
    const customer = await stripe.customers.create({
      description: `Customer for ${user.user_metadata.full_name}`,
      source: token
    });

    console.log(customer);

    //-- create a subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ plan: 'plan_Fv6CRXcGjHi16a' }]
    });

    console.log({ subscription });
  } catch (err) {
    callback(null, createResponseObject(400, "Customer couldn't be created."));
    return;
  }
};

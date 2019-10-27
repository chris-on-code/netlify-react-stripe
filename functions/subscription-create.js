import updateUser from './helpers/update-user';
import createResponse from './helpers/create-response';

require('dotenv').config(); // needed for stripe
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

/**
 * Helper function to respond with a full object
 */

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

exports.handler = async function(event, context) {
  //-- make sure we have a user
  const { identity, user } = context.clientContext;
  if (!user) return createResponse(400, 'No user logged in.');

  //-- only handle POST requests
  if (event.httpMethod !== 'POST')
    return createResponse(400, 'Only POST requests allowed or no data.');

  //-- check if our data is formed as actual JSON
  if (!hasJsonStructure(event.body)) {
    return createResponse(400, 'Data needs to be JSON format.');
  }

  // TODO: validate the stripe plan being sent through

  //-- parse the body contents into an object.
  const data = JSON.parse(event.body);
  const token = data.token;
  const plan = data.plan || 'plan_Fv6CRXcGjHi16a'; // defaults to monthly

  //-- make sure we have all required data. otherwise, escape
  if (!token || !plan) {
    return createResponse(400, 'Missing Stripe token or Stripe plan.');
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
    return createResponse(200, 'Subscription created!', {
      customer,
      subscription
    });
  } catch (err) {
    console.error(err);
    return createResponse(400, "Customer couldn't be created.");
  }
};

import fetch from 'node-fetch';

export function handler(event, context) {
  if (event.httpMethod !== 'POST')
    return { statusCode: 400, body: 'HTTP Method Unavailable' };

  // send account information along with the POST
  const { email, password, full_name } = JSON.parse(event.body);
  // identity.token is a short lived admin token which
  // is provided to all Netlify Functions to interact
  // with the Identity API
  const { identity } = context.clientContext;

  return fetch(`${identity.url}/admin/users`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${identity.token}` },
    body: JSON.stringify({
      email,
      password,
      confirm: true,
      user_metadata: {
        full_name
      }
    })
  });
}

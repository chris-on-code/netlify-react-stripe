import fetch from 'node-fetch';

export default function(identity, user, data = {}) {
  return fetch(`${identity.url}/admin/users/${user.id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${identity.token}` },
    body: JSON.stringify(data)
  });
}

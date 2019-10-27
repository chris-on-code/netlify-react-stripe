/* Frontend code from src/utils/api.js */
/* Api methods to call /functions */

function all() {
  return fetch('/.netlify/functions/todos-read-all').then(res => res.json());
}

function create(data) {
  return fetch('/.netlify/functions/todos-create', {
    body: JSON.stringify(data),
    method: 'POST'
  }).then(res => res.json());
}

function update(id, data) {
  return fetch(`/.netlify/functions/todos-update/${id}`, {
    body: JSON.stringify(data),
    method: 'POST'
  }).then(res => res.json());
}

function destroy(id) {
  return fetch(`/.netlify/functions/todos-delete/${id}`, {
    method: 'POST'
  }).then(res => res.json());
}

function destroyMany(ids) {
  return fetch(`/.netlify/functions/todos-delete-batch`, {
    body: JSON.stringify({
      ids
    }),
    method: 'POST'
  }).then(res => res.json());
}

export default {
  all,
  create,
  update,
  destroy,
  destroyMany
};

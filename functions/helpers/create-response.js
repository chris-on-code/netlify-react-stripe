export default function(statusCode = 200, message = '', data = {}) {
  return {
    statusCode,
    body: JSON.stringify({ message, ...data })
  };
}

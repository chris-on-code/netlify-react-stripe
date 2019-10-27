export default function(urlPath) {
  return urlPath.match(/([^\/]*)\/*$/)[0];
}

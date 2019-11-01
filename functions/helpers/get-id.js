module.exports = function(urlPath) {
  return urlPath.match(/([^\/]*)\/*$/)[0];
};

function prettyJson(jsonStr) {
  var cpy = JSON.parse(jsonStr);
  var str = JSON.stringify(cpy, null, 4);
  return str;
}

module.exports = {
  prettyJson
}
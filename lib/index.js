var through = require("through");
var __get__ = require("./__get__");
var __set__ = require("./__set__");

module.exports = function rewireify(file, options) {
  options = options || {};

  if (/\.json$/.test(file)) {
    return through();
  }

  var data = "";

  function write(buffer) {
    data += buffer;
  }

  function end() {

    data += "\n";
    data += "module.exports.__set__ = " + __set__.toString() + ";\n";
    data += "module.exports.__get__ = " + __get__.toString() + ";\n";

    this.queue(data);
    this.queue(null);
  }

  return through(write, end);
};

var through = require("through");
var path = require("path");

console.warn("Injecting Rewireify into modules");

module.exports = function rewireify(file, options) {
  options = options || {};

  var ignore = ["__get__", "__set__", "rewire"];

  if (/\.json$/.test(file) || ignore.indexOf(path.basename(file, ".js")) > -1) {
    return through();
  }

  var data = "";
  var fore = "";
  var post = "";

  function write(buffer) {
    data += buffer;
  }

  function end() {

    fore += "/* This code was injected by Rewireify */\n";
    fore += "var __getter = require(\"" + path.join(__dirname, "__get__") + "\").toString();\n";
    fore += "var __setter = require(\"" + path.join(__dirname, "__set__") + "\").toString();\n";

    post += "\n";
    post += "eval(__getter);\n"
    post += "eval(__setter);\n"
    post += "module.exports.__get__ = __get__;\n";
    post += "module.exports.__set__ = __set__;\n";

    this.queue(fore);
    this.queue(data);
    this.queue(post);
    this.queue(null);
  }

  return through(write, end);
};

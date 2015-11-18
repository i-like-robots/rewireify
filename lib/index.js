var minimatch = require("minimatch");
var through = require("through");
var path = require("path");

var __get__ = require("rewire/lib/__get__").toString();
var __set__ = require("rewire/lib/__set__").toString();

console.warn("Injecting Rewireify into modules");

module.exports = function rewireify(file, options) {
  options = {
    ignore: options.ignore || ""
  };

  var ignore = ["__get__.js", "__set__.js", "**/*.json"].concat(options.ignore.split(","));
  var relativeFile = file.replace(process.cwd(), "");
  var fileName = path.basename(file);

  var matches = ignore.filter(function(pattern) {
    return ignore.indexOf(fileName) > -1 || minimatch(relativeFile, pattern);
  });

  if (matches.length) {
    return through();
  }

  var data = "";
  var post = "";

  function write(buffer) {
    data += buffer;
  }

  function end() {
    post += "/* This code was injected by Rewireify */\n";
    post += "if ((typeof module.exports).match(/object|function/) && \n"
    post += "Object.isExtensible(module.exports)) {\n";
    post += "Object.defineProperty(module.exports, '__get__', { value: " + __get__ + ", writable: true });\n";
    post += "Object.defineProperty(module.exports, '__set__', { value: " + __set__ + ", writable: true });\n";
    post += "}\n";

    this.queue(data);
    this.queue(post);
    this.queue(null);
  }

  return through(write, end);
};

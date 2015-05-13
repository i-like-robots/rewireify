var minimatch = require("minimatch");
var through = require("through");
var path = require("path");

console.warn("Injecting Rewireify into modules");

module.exports = function rewireify(file, options) {
  options = {
    ignore: options.ignore || ""
  };

  var ignore = ["__get__.js", "__set__.js", "rewire.js", "*.json"].concat(options.ignore.split(","));
  var filename = path.basename(file);

  var matches = ignore.filter(function(pattern) {
    return minimatch(filename, pattern);
  });

  if (matches.length) {
    return through();
  }

  var data = "";
  var post = "";
  var __get__ = require("./__get__").toString();
  var __set__ = require("./__set__").toString();

  function write(buffer) {
    data += buffer;
  }

  function end() {
    post += "/* This code was injected by Rewireify */\n";
    post += "module.exports.__get__ = " + __get__ + ";\n";
    post += "module.exports.__set__ = " + __set__ + ";\n";

    this.queue(data);
    this.queue(post);
    this.queue(null);
  }

  return through(write, end);
};

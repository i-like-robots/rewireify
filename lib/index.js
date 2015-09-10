var minimatch = require("minimatch");
var through = require("through");
var path = require("path");

var getImportGlobalsSrc = require("rewire/lib/getImportGlobalsSrc");
var getDefinePropertySrc = require("rewire/lib/getDefinePropertySrc");

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

  var prefix = getImportGlobalsSrc();
  prefix += "(function () { ";

  var data = "";
  var suffix = "";

  function write(buffer) {
    data += buffer;
  }

  function end() {
    suffix += "/* This code was injected by Rewireify */\n";
    suffix += "if (Object.isExtensible(module.exports)) {\n";
    suffix += getDefinePropertySrc()
    suffix += "}\n";
    suffix += "})();";

    this.queue(prefix);
    this.queue(data);
    this.queue(suffix);
    this.queue(null);
  }

  return through(write, end);
};

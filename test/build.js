var fs = require("fs");
var path = require("path");
var browserify = require("browserify");
var rewireify = require("../lib/index");

console.log("Building test bundle...");

var browserifyOptions = {
  basedir: __dirname,
  standalone: "test-bundle"
};

var rewireifyOptions = {
  ignore: "*-me.js"
};

browserify("./template/module.js", browserifyOptions)
  .transform(rewireify, rewireifyOptions)
  .bundle(function(err, output) {
    if (err) {
      console.error(err);
    } else {
      fs.writeFileSync(path.join(__dirname, "bundle.js"), output);
    }
  });

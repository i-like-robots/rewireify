var fs = require("fs");
var path = require("path");
var browserify = require("browserify");
var rewireify = require("../lib/index");

console.log("Building test bundle...");

browserify("./template/module.js", {basedir: __dirname})
  .transform(rewireify)
  .bundle({ standalone: "test-bundle" }, function(err, output) {
    if (err) {
      console.error(err);
    }
    else {
      fs.writeFileSync(path.join(__dirname, "test-bundle.js"), output);
    }
  });

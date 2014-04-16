var privateVariable = "I am private";

var privateDependency = require("./dependency");

exports.methodUsingDependency = function() {
  return privateDependency.exampleMethod();
};

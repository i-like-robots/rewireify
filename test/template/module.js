var privateVariable = "I am private";

var privateDependency = require("./dependency");

var changeme = andme = "We will be changed en masse";

exports.methodUsingDependency = function() {
  return privateDependency.exampleMethod();
};

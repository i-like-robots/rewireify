var privateVariable = "I am private";

var privateDependency = require("./dependency");

var changeThis = changeThat = "We will be changed en masse";

var changeNested = {
  child: "I will be changed"
};

exports.methodUsingDependency = function() {
  return privateDependency.exampleMethod();
};

var privateVariable = "I am private";

var privateDependency = require("./dependency");

var changeMe = andMe = "We will be changed en masse";

var changeInside = {
  changeMe: "I will be changed"
};

exports.methodUsingDependency = function() {
  return privateDependency.exampleMethod();
};

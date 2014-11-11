var inspectPrivate = "I am private"

var modifyIndividual = "I will be changed";

var modifyWithin = {
  key: "I will be changed"
};

var modifyEnMasseA = modifyEnMasseB = "I will be changed";

var privateDependency = require("./dependency");

exports.methodUsingDependency = function() {
  return privateDependency.exampleMethod();
};

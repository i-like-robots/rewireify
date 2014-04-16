var privateVariable = "I am private";

var privateDependency = require("./dependency");

exports.methodUsingDependency = function() {
  return privateDependency.exampleMethod();
};

// Brute force these into this context, eval() is evil
// but node VMs can't be executed in local context.
var __getter = require("../../lib/__get__").toString();
var __setter = require("../../lib/__set__").toString();

eval(__getter);
eval(__setter);

module.exports.__get__ = __get__;
module.exports.__set__ = __set__;

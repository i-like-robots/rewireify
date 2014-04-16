!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.testBundle=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
/**
 * This function will be stringified and then injected into every rewired module.
 * Then you can leak private variables by calling myModule.__get__("myPrivateVar");
 *
 * All variables within this function are namespaced in the arguments array because every
 * var declaration could possibly clash with a variable in the module scope.
 *
 * @param {!String} name name of the variable to retrieve
 * @throws {TypeError}
 * @return {*}
 */
function __get__() {
    arguments.varName = arguments[0];
    if (arguments.varName && typeof arguments.varName === "string") {
        return eval(arguments.varName);
    } else {
        throw new TypeError("__get__ expects a non-empty string");
    }
}

module.exports = __get__;

},{}],2:[function(_dereq_,module,exports){
/**
 * This function will be stringified and then injected into every rewired module.
 * Then you can set private variables by calling myModule.__set__("myPrivateVar", newValue);
 *
 * All variables within this function are namespaced in the arguments array because every
 * var declaration could possibly clash with a variable in the module scope.
 *
 * @param {!String|!Object} varName name of the variable to set
 * @param {String} varValue new value
 * @throws {TypeError}
 * @throws {ReferenceError} When the variable is unknown
 * @return {*}
 */
function __set__() {
    arguments.varName = arguments[0];
    arguments.varValue = arguments[1];
    arguments.src = "";

    if (typeof arguments[0] === "object" && arguments.length === 1) {
        arguments.env = arguments.varName;
        if (!arguments.env || Array.isArray(arguments.env)) {
            throw new TypeError("__set__ expects an object as env");
        }
        for (arguments.varName in arguments.env) {
            if (arguments.env.hasOwnProperty(arguments.varName)) {
                arguments.varValue = arguments.env[arguments.varName];
                arguments.src += arguments.varName + " = arguments.env." + arguments.varName + "; ";
            }
        }
    } else if (typeof arguments.varName === "string" && arguments.length === 2) {
        if (!arguments.varName) {
            throw new TypeError("__set__ expects a non-empty string as a variable name");
        }
        arguments.src = arguments.varName + " = arguments.varValue;";
    } else {
        throw new TypeError("__set__ expects an environment object or a non-empty string as a variable name");
    }

    eval(arguments.src);
}

module.exports = __set__;

},{}],3:[function(_dereq_,module,exports){
/* This code was injected by Rewireify */
var __getter = _dereq_("/Users/matt/Code/rewireify/lib/__get__").toString();
var __setter = _dereq_("/Users/matt/Code/rewireify/lib/__set__").toString();
exports.exampleMethod = function() {
  return "I am an example";
};

eval(__getter);
eval(__setter);
module.exports.__get__ = __get__;
module.exports.__set__ = __set__;

},{"/Users/matt/Code/rewireify/lib/__get__":1,"/Users/matt/Code/rewireify/lib/__set__":2}],4:[function(_dereq_,module,exports){
/* This code was injected by Rewireify */
var __getter = _dereq_("/Users/matt/Code/rewireify/lib/__get__").toString();
var __setter = _dereq_("/Users/matt/Code/rewireify/lib/__set__").toString();
var privateVariable = "I am private";

var privateDependency = _dereq_("./dependency");

exports.methodUsingDependency = function() {
  return privateDependency.exampleMethod();
};

eval(__getter);
eval(__setter);
module.exports.__get__ = __get__;
module.exports.__set__ = __set__;

},{"./dependency":3,"/Users/matt/Code/rewireify/lib/__get__":1,"/Users/matt/Code/rewireify/lib/__set__":2}]},{},[4])
(4)
});
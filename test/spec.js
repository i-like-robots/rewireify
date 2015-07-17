var fs = require("fs");
var vows = require("vows");
var sinon = require("sinon");
var assert = require("assert");
var fixture = require("./bundle");

function reset(target) {
  fixture.__get__(target).restore && fixture.__get__(target).restore();
}

vows.describe("Injecting methods").addBatch({

  "Methods are injected into bundle": {
    topic: function() {
      fs.readFile(require.resolve("./bundle.js"), { encoding: "utf8" }, this.callback)
    },
    "to leak variables": function(err, contents) {
      assert.isNull(err);
      assert.include(contents, "Object.defineProperty(module.exports, '__get__'");
    },
    "to modify variables": function(err, contents) {
      assert.isNull(err);
      assert.include(contents, "Object.defineProperty(module.exports, '__set__'");
    }
  },
  "Files can be ignored": {
    topic: function() {
      return fixture.exposeIgnoredDependency();
    },
    "so the getter and setter are not appended": function(topic) {
      assert.equal(topic.__get__, undefined);
      assert.equal(topic.__set__, undefined);
    }
  }

}).run();

vows.describe("Getters and setters").addBatch({
  "are not exposed": {
    topic: function() {
      return fixture;
    },
    "publicly": function(topic) {
      var keys = Object.keys(topic);
      assert.notInclude(keys, '__get__');
      assert.notInclude(keys, '__set__');
    }
  },

  "Private variables": {
    "can be inspected": {
      topic: function() {
        return fixture.__get__("inspectPrivate");
      },
      "with the getter": function(topic) {
        assert.equal(topic, "I am private");
      }
    },
    "can be modified": {
      "individually": {
        topic: function() {
          fixture.__set__("modifyIndividual", "I have been changed");
          return fixture.__get__("modifyIndividual");
        },
        "with the setter": function(topic) {
          assert.equal(topic, "I have been changed");
        }
      },
      "within objects": {
        topic: function() {
          fixture.__set__("modifyWithin.key", "I have been changed");
          return fixture.__get__("modifyWithin.key");
        },
        "using dot notation": function(topic) {
          assert.equal(topic, "I have been changed");
        }
      },
      "en masse": {
        topic: function() {
          fixture.__set__({
            modifyEnMasseA: "I have been changed",
            modifyEnMasseB: "I have been changed, too"
          });

          return [
            fixture.__get__("modifyEnMasseA"),
            fixture.__get__("modifyEnMasseB")
          ];
        },
        "by passing an object": function(topic) {
          assert.equal(topic[0], "I have been changed");
          assert.equal(topic[1], "I have been changed, too");
        }
      }
    },
    "can be restored": {
      topic: function() {
        return fixture.__set__("modifyIndividual", "I have been changed _again_");
      },
      "by a function returned from __set__": function(topic) {
        assert.isFunction(topic);
      },
      "that when called": {
        topic: function(revert) {
          revert();
          return fixture.__get__("modifyIndividual");
        },
        "will revert to the original value": function(topic) {
          assert.equal(topic, "I will be changed");
        }
      }
    }
  },

  "Dependencies": {
    "can be inspected": {
      "with a spy": {
        topic: function() {
          reset("privateDependency.exampleMethod");
          sinon.spy(fixture.__get__("privateDependency"), "exampleMethod")();
          return fixture.__get__("privateDependency.exampleMethod");
        },
        "using sinon.spy": function(topic) {
          assert.equal(topic.calledOnce, true);
        }
      }
    },
    "can be modified": {
      "with a stub": {
        topic: function() {
          reset("privateDependency.exampleMethod");
          sinon.stub(fixture.__get__("privateDependency"), "exampleMethod", function() {
            return "I am a stub";
          });
          return fixture.methodUsingDependency();
        },
        "using sinon.stub": function(topic) {
          assert.equal(topic, "I am a stub");
        }
      },
      "with a double": {
        topic: function() {
          fixture.__set__("privateDependency", {
            exampleMethod: function() {
              return "I am a double";
            }
          });

          return fixture.methodUsingDependency();
        },
        "with a test double": function(topic) {
          assert.equal(topic, "I am a double");
        }
      }
    }
  }

}).run();

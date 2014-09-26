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
      assert.match(contents, /module\.exports\.__get__\s=\sfunction\s__get__\(\).+/);
    },
    "to modify variables": function(err, contents) {
      assert.isNull(err);
      assert.match(contents, /module\.exports\.__set__\s=\sfunction\s__set__\(\).+/);
    }
  }

}).run();

vows.describe("Getters and setters").addBatch({

  "Private variables": {
    "can be inspected": {
      topic: function() {
        return fixture.__get__("privateVariable");
      },
      "with the getter": function(topic) {
        assert.equal(topic, "I am private");
      }
    },
    "can be modified": {
      "individually": {
        topic: function() {
          fixture.__set__("privateVariable", "I *was* private")
          return fixture.__get__("privateVariable");
        },
        "with the setter": function(topic) {
          assert.equal(topic, "I *was* private");
        }
      },
      "en masse": {
        topic: function() {
          fixture.__set__({
            changeme: "I have been changed",
            andme: "And me!"
          });
          return [fixture.__get__("changeme"), fixture.__get__("andme")];
        },
        "by passing an object": function(topic) {
          assert.equal(topic[0], "I have been changed");
          assert.equal(topic[1], "And me!");
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

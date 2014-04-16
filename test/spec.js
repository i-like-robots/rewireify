var fs = require("fs");
var path = require("path");
var vows = require("vows");
var assert = require("assert");
var fixture = require("./test-bundle");

vows.describe("Injecting methods").addBatch({

  "Methods are injected into bundle": {
    topic: function() {
      fs.readFile(path.join(__dirname, "test-bundle.js"), { encoding: "utf8" }, this.callback)
    },
    "to leak variables": function(err, contents) {
      assert.isNull(err);
      assert.match(contents, /module\.exports\.__get__\s=\s__get__;/);
    },
    "to modify variables": function(err, contents) {
      assert.isNull(err);
      assert.match(contents, /module\.exports\.__set__\s=\s__set__;/);
    }
  }

}).run();

vows.describe("Getters and setters").addBatch({

  "A private variable": {
    "can be inspected": {
      topic: function() {
        return fixture.__get__("privateVariable");
      },
      "with the getter": function(topic) {
        assert.equal(topic, "I am private");
      }
    },
    "can be modified": {
      topic: function() {
        fixture.__set__("privateVariable", "I *was* private")
        return fixture.__get__("privateVariable");
      },
      "with the setter": function(topic) {
        assert.equal(topic, "I *was* private");
      }
    }
  },

  "Dependencies": {
    "can be modified": {
      topic: function() {
        fixture.__set__("privateDependency.exampleMethod", function() {
          return "I am a stub";
        });

        return fixture.methodUsingDependency();
      },
      "with a stubbed method": function(topic) {
        assert.equal(topic, "I am a stub");
      }
    },
    "can be overridden": {
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

}).run();

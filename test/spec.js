var vows = require("vows");
var assert = require("assert");
var browserify = require("browserify");

var rewireify = require("../lib/index");
var fixture = require("./fixture/module");

vows.describe("Injecting methods").addBatch({

  "Methods are injected into stream": {
    topic: function() {
      browserify("./fixture/module.js", {basedir: __dirname})
        .transform(rewireify)
        .bundle(this.callback);
    },
    "a getter": function(err, output) {
      assert.isNull(err);
      assert.match(output, /module\.exports\.__get__\s=\sfunction\s__get__\(\)/);
    },
    "a setter": function(err, output) {
      assert.isNull(err);
      assert.match(output, /module\.exports\.__set__\s=\sfunction\s__set__\(\)/);
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

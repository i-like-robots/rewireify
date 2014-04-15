# Rewireify

Rewireify is a port of [Rewire](https://github.com/jhnns/rewire) for [Browserify](http://browserify.org/) that adds setter and getter methods to each module so that their behaviour can be modified for better unit testing. With Rewireify you can:

- Inject mocks for other modules
- Leak private variables
- Override variables within the module

## Usage

First install and save Rewireify into your project dependencies:

```sh
$ npm install rewireify --save-dev
```

Include the Rewireify transform as part of your Browserify build:

```sh
$ browserify -e path/to/entry.js -o path/to/output.js -t rewireify
```

Now you can inspect, modify and override your modules internals:

```js
var subject = require("../lib/my-module");
var mock = require("./mock/a-dependency");

describe("My Module", function() {

  describe("A method", function() {
    var original;

    before(function() {
      // Private variables can be leaked
      original = subject.__get__("subjectDependency");

      // And there is access to mock and spy on almost anything
      subject.__set__("subjectDependency", mock);
    });

    after(function() {
      subject.__set__("subjectDependency", original);
    });

    it("Should call the method of the dependency", function() {
      subject.method();
      expect(mock.method).toHaveBeenCalled();
    });

  });

});
```

## API

#### `rewiredModule.__get__(name)`

- *name*
  Name of the variable to get. The variable should be global or defined with var in the top-level scope of the module.

#### `rewiredModule.__set__(name, value)`

- *name*
  Name of the variable to set. The variable should be global or defined with var in the top-level scope of the module.
- *value*
  The value to set

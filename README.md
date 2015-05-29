# Rewireify ![Build status](https://api.travis-ci.org/i-like-robots/rewireify.png)

Rewireify is a port of [Rewire](https://github.com/jhnns/rewire) for [Browserify](http://browserify.org/) that adds setter and getter methods to each module so that their behaviour can be modified for better unit testing. With Rewireify you can:

- Inject mocks for other modules
- Leak private variables
- Override variables within the module

Rewireify is compatible with Browserify 3+

## Usage

First install and save Rewireify into your project's development dependencies:

```sh
$ npm install rewireify --save-dev
```

Include the Rewireify transform as part of your test bundle:

```sh
$ browserify -e app.js -o test-bundle.js -t rewireify -s test-bundle
```

Rewireify can also ignore certain files with the `--ignore` option and a filename or glob expression. Multiple files or patterns can be excluded by separating them with commas:

```sh
$ browserify -e app.js -o test-bundle.js -t [ rewireify --ignore filename.js,**/*-mixin.js ] -s test-bundle
```

Now you can inspect, modify and override your modules internals in your tests. The `__get__` and `__set__` methods are the same as Rewire:

```js
var bundle = require("./path/to/test-bundle");

// Private variables can be leaked...
subject.__get__("secretKey");

// ...or modified
subject.__set__("secretKey", 1234);

// Nested properties can be inspected or modified
subject.__set__("user.firstname", "Joe");

// Dependencies can be mocked...
subject.__set__("config", {
  cache: false,
  https: false
});

// ...or methods stubbed
subject.__set__("http.get", function(url, cb) {
  cb("This method has been stubbed");
});

// And everything can be reverted
var revert = subject.__set__("port", 3000);

revert();
```

For more details check out the [Rewire documentation](https://github.com/jhnns/rewire/blob/master/README.md#api).

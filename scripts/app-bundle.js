define('app',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var App = exports.App = function () {
    function App() {
      _classCallCheck(this, App);

      var SCOPES = 'https://www.googleapis.com/auth/drive.file';
      var CLIENT_ID = '670438381526-24npq8td5gc18p48mrg1bdqnhqikra7m.apps.googleusercontent.com';
      var DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'];

      this.loginService = new LoginService(CLIENT_ID, SCOPES, DISCOVERY_DOCS);
      this.driveService = new DriveService();
      this.files = [];
      this.currentFile = {
        content: '',
        id: null,
        name: 'gDriveSync.example.txt',
        parents: []
      };
    }

    App.prototype.attached = function attached() {
      var _this = this;

      gapi.load('client:auth2', function () {
        _this.login();
      });
    };

    App.prototype.login = function login() {
      var _this2 = this;

      this.loginService.initClient(function (loggedIn) {
        if (!loggedIn) {
          _this2.loginService.signIn();
        }
      });
    };

    App.prototype.save = function save() {
      var content = "Hello world";
      this.currentFile.content = content;
      this.driveService.saveFile(this.currentFile, function (file) {
        this.currentFile = file;
        console.log('saved file with id:' + file.id);
      });
    };

    App.prototype.getFiles = function getFiles() {
      var _this3 = this;

      this.driveService.listFiles("gDriveSync", function (err, files) {
        console.log(err, files);
        _this3.files = files;
      });
    };

    return App;
  }();
});
define('component',['exports', 'aurelia-framework'], function (exports, _aureliaFramework) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Component = undefined;

    function _initDefineProp(target, property, descriptor, context) {
        if (!descriptor) return;
        Object.defineProperty(target, property, {
            enumerable: descriptor.enumerable,
            configurable: descriptor.configurable,
            writable: descriptor.writable,
            value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
        });
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
        var desc = {};
        Object['ke' + 'ys'](descriptor).forEach(function (key) {
            desc[key] = descriptor[key];
        });
        desc.enumerable = !!desc.enumerable;
        desc.configurable = !!desc.configurable;

        if ('value' in desc || desc.initializer) {
            desc.writable = true;
        }

        desc = decorators.slice().reverse().reduce(function (desc, decorator) {
            return decorator(target, property, desc) || desc;
        }, desc);

        if (context && desc.initializer !== void 0) {
            desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
            desc.initializer = undefined;
        }

        if (desc.initializer === void 0) {
            Object['define' + 'Property'](target, property, desc);
            desc = null;
        }

        return desc;
    }

    function _initializerWarningHelper(descriptor, context) {
        throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
    }

    var _desc, _value, _class, _descriptor;

    var Component = exports.Component = (_class = function Component() {
        _classCallCheck(this, Component);

        _initDefineProp(this, 'name', _descriptor, this);
    }, (_descriptor = _applyDecoratedDescriptor(_class.prototype, 'name', [_aureliaFramework.bindable], {
        enumerable: true,
        initializer: null
    })), _class);
});
define('environment',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    debug: true,
    testing: true
  };
});
define('main',['exports', './environment'], function (exports, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;

  var _environment2 = _interopRequireDefault(_environment);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  Promise.config({
    warnings: {
      wForgottenReturn: false
    }
  });

  function configure(aurelia) {
    aurelia.use.standardConfiguration().feature('resources');

    if (_environment2.default.debug) {
      aurelia.use.developmentLogging();
    }

    if (_environment2.default.testing) {
      aurelia.use.plugin('aurelia-testing');
    }

    aurelia.start().then(function () {
      return aurelia.setRoot();
    });
  }
});
define('resources/index',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;
  function configure(config) {}
});
define('text!app.html', ['module'], function(module) { module.exports = "<template>\r\n <button click.trigger=\"getFiles()\">List files</button>\r\n <button click.trigger=\"save()\">Save a file</button>\r\n</template>\r\n"; });
define('text!component.html', ['module'], function(module) { module.exports = "<template>\r\n    My component '${name}'\r\n</template>"; });
//# sourceMappingURL=app-bundle.js.map
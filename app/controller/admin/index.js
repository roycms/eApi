function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Base = require('../base.js');

module.exports = class extends Base {
  indexAction() {
    var _this = this;

    return _asyncToGenerator(function* () {

      const sessionKey = yield _this.session('sessionKey');
      if (think.isEmpty(sessionKey)) {
        _this.redirect("/login");
      } else {
        let analysi = _this.model('analysis');
        const analysis = yield analysi.select();
        _this.assign({ analysis: analysis });

        _this.assign({ sessionKey: sessionKey, analysis: analysis });
        return yield _this.display();
      }
    })();
  }
  loginOutAction() {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      // 删除整个 session
      yield _this2.session(null);
      _this2.redirect("/login");
    })();
  }
};
//# sourceMappingURL=index.js.map
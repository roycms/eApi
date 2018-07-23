function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Base = require('../base.js');

module.exports = class extends Base {
  indexAction() {
    var _this = this;

    return _asyncToGenerator(function* () {
      let user = _this.model('user');
      var users;
      if (_this.get("isAdmin") == 1) {
        users = yield user.where({ is_admin: 1 }).select();
      } else {
        users = yield user.select();
      }
      _this.assign({ users: users });
      return yield _this.display();
    })();
  }
};
//# sourceMappingURL=users.js.map
function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Base = require('../base.js');

module.exports = class extends Base {
  indexAction() {
    return this.json({ code: 200 });
  }
  //登录
  loginAction() {
    var _this = this;

    return _asyncToGenerator(function* () {
      const username = _this.post('username');
      const password = _this.post('password');
      if (username == undefined || password == undefined) {
        return _this.fail(300, "参数错误");
      }
      const passwordMd5Val = think.md5(password);
      const user = _this.model('user');
      const data = yield user.where({
        username: username,
        password: passwordMd5Val
      }).find();
      // this.json(data)
      if (JSON.stringify(data) == "{}") {
        return _this.fail(300, "账户名或者密码错误！");
      } else {
        return _this.success(200, "登录成功！");
      }
    })();
  }
  //用户注册和更改用户资料
  userAction() {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      const isPut = _this2.isMethod('PUT');
      const isPost = _this2.isMethod('POST');

      const model = _this2.model('user');
      const id = _this2.get("id");

      if (isPut) {
        const data = _this2.post();
        data.password = think.md5(data.password);
        const rows = yield model.where({ id: id }).update(data);
        return _this2.success({ affectedRows: rows });
      }
      if (isPost) {
        const data = _this2.post();
        data.password = think.md5(data.password);
        // this.json(data)
        const isUser = yield model.where({ username: data.username }).find();
        if (JSON.stringify(isUser) != "{}") {
          return _this2.fail(1001, "注册失败！该用户已经存在");
        } else {
          const rows = yield model.add(data);
          return _this2.success({ affectedRows: rows });
        }
      }
    })();
  }
};
//# sourceMappingURL=v1.js.map
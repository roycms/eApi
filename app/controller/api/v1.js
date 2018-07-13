function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Base = require('../base.js');

//阿里云
var fs = require("fs");
var ALY = require('aliyun-sdk');
var ossStream = require('aliyun-oss-upload-stream')(new ALY.OSS({
  accessKeyId: 'yIgRvLsyxFB3JEJH',
  secretAccessKey: 'X7wyFWIw76cLb4cLNDa8Z2YNmHtIOu',
  endpoint: 'http://oss-cn-beijing.aliyuncs.com',
  apiVersion: '2013-10-15'
}));

module.exports = class extends Base {
  indexAction() {
    return this.json({ code: 200 });
  }
  //登录
  loginAction() {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      const username = _this2.post('username');
      const password = _this2.post('password');
      if (username == undefined || password == undefined) {
        return _this2.fail(300, "参数错误");
      }
      const passwordMd5Val = think.md5(password);
      const user = _this2.model('user');
      const data = yield user.where({
        username: username,
        password: passwordMd5Val
      }).find();
      // this.json(data)
      if (JSON.stringify(data) == "{}") {
        return _this2.fail(300, "账户名或者密码错误！");
      } else {
        return _this2.success(200, "登录成功！");
      }
    })();
  }
  //用户注册和更改用户资料
  userAction() {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      const isPut = _this3.isMethod('PUT');
      const isPost = _this3.isMethod('POST');

      const model = _this3.model('user');
      const id = _this3.get("id");

      if (isPut) {
        const data = _this3.post();
        data.password = think.md5(data.password);
        const rows = yield model.where({ id: id }).update(data);
        return _this3.success({ affectedRows: rows });
      }
      if (isPost) {
        const data = _this3.post();
        data.password = think.md5(data.password);
        // this.json(data)
        const isUser = yield model.where({ username: data.username }).find();
        if (JSON.stringify(isUser) != "{}") {
          return _this3.fail(1001, "注册失败！该用户已经存在");
        } else {
          const rows = yield model.add(data);
          return _this3.success({ affectedRows: rows });
        }
      }
    })();
  }
  //上传文件
  upfileAction() {
    var _this4 = this;

    return _asyncToGenerator(function* () {
      var file = _this4.file("file");
      var filePath = "baby/" + think.uuid("v4") + ".jpg";
      var upload = ossStream.upload({
        Bucket: 'server-19860911',
        Key: filePath
      });
      var read = fs.createReadStream(file.path);
      read.pipe(upload);
      var _this = _this4;
      //传成功
      var p = yield new Promise(function (resolve, reject) {
        upload.on('uploaded', function (details) {
          console.log('details:', details);
          resolve(details);
        });
      }).then(function (details) {
        _this.json(details);
      });
      //传失败
      upload.on('error', function (error) {
        console.log('error:', error);
      });
    })();
  }
};
//# sourceMappingURL=v1.js.map
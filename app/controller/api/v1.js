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
        yield _this2.session('sessionKey', null);
        return _this2.fail(300, "账户名或者密码错误！");
      } else {
        //设置session
        yield _this2.session('sessionKey', username);
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

  //Evaluation 评测主体
  evaluationAction() {
    var _this5 = this;

    return _asyncToGenerator(function* () {
      const isGet = _this5.isMethod('GET');
      const isPut = _this5.isMethod('PUT');
      const isPost = _this5.isMethod('POST');
      const isDelete = _this5.isMethod('DELETE');
      const model = _this5.model('evaluation');
      const id = _this5.get("id");
      if (isPut) {
        const data = _this5.post();
        const rows = yield model.where({ id: id }).update(data);
        return _this5.success({ affectedRows: rows });
      }
      if (isPost) {
        const data = _this5.post();
        const rows = yield model.add(data);
        return _this5.success({ affectedRows: rows });
      }
      if (isDelete) {
        const rows = yield model.where({ id: id }).delete();
        return _this5.success({ affectedRows: rows });
      }
      if (isGet) {
        const data = yield model.select();
        return _this5.json(data);
      }
    })();
  }

  //question
  questionAction() {
    var _this6 = this;

    return _asyncToGenerator(function* () {
      const isGet = _this6.isMethod('GET');
      const isPut = _this6.isMethod('PUT');
      const isPost = _this6.isMethod('POST');
      const isDelete = _this6.isMethod('DELETE');
      const model = _this6.model('question');
      const id = _this6.get("id");
      if (isPut) {
        const data = _this6.post();
        const rows = yield model.where({ id: id }).update(data);
        return _this6.success({ affectedRows: rows });
      }
      if (isPost) {
        const data = _this6.post();
        const rows = yield model.add(data);
        return _this6.success({ affectedRows: rows });
      }
      if (isDelete) {
        const rows = yield model.where({ id: id }).delete();
        return _this6.success({ affectedRows: rows });
      }
      if (isGet) {
        const data = yield model.select();
        return _this6.json(data);
      }
    })();
  }
  //options
  optionsAction() {
    var _this7 = this;

    return _asyncToGenerator(function* () {
      const isGet = _this7.isMethod('GET');
      const isPut = _this7.isMethod('PUT');
      const isPost = _this7.isMethod('POST');
      const isDelete = _this7.isMethod('DELETE');
      const model = _this7.model('options');
      const id = _this7.get("id");
      if (isPut) {
        const data = _this7.post();
        const rows = yield model.where({ id: id }).update(data);
        return _this7.success({ affectedRows: rows });
      }
      if (isPost) {
        const data = _this7.post();
        const rows = yield model.add(data);
        return _this7.success({ affectedRows: rows });
      }
      if (isDelete) {
        const rows = yield model.where({ id: id }).delete();
        return _this7.success({ affectedRows: rows });
      }
      if (isGet) {
        const data = yield model.select();
        return _this7.json(data);
      }
    })();
  }
  //Answer
  answerAction() {
    var _this8 = this;

    return _asyncToGenerator(function* () {
      const isGet = _this8.isMethod('GET');
      const isPut = _this8.isMethod('PUT');
      const isPost = _this8.isMethod('POST');
      const isDelete = _this8.isMethod('DELETE');
      const model = _this8.model('answer');
      const id = _this8.get("id");
      if (isPut) {
        const data = _this8.post();
        const rows = yield model.where({ id: id }).update(data);
        return _this8.success({ affectedRows: rows });
      }
      if (isPost) {
        const data = _this8.post();
        const rows = yield model.add(data);
        return _this8.success({ affectedRows: rows });
      }
      if (isDelete) {
        const rows = yield model.where({ id: id }).delete();
        return _this8.success({ affectedRows: rows });
      }
      if (isGet) {
        const data = yield model.select();
        return _this8.json(data);
      }
    })();
  }

  //e_task_flows
  task_flowsAction() {
    var _this9 = this;

    return _asyncToGenerator(function* () {
      //创建一个测试
      const isPost = _this9.isMethod('POST');
      const isGet = _this9.isMethod('GET');
      const model = _this9.model('task_flows');
      if (isPost) {
        const data = _this9.post();
        const rows = yield model.add(data);
        return _this9.success({ affectedRows: rows });
      }
      //查询某个用户的所有测试 参数 user_id
      if (isGet) {
        const data = yield model.where({ user_id: _this9.get("user_id") }).select();
        return _this9.json(data);
      }
    })();
  }

  //e_user_answer 回答一个问题
  user_answerAction() {
    var _this10 = this;

    return _asyncToGenerator(function* () {
      const isPost = _this10.isMethod('POST');
      const model = _this10.model('user_answer');
      if (isPost) {
        const data = _this10.post();
        const rows = yield model.add(data);
        return _this10.success({ affectedRows: rows });
      }
    })();
  }
  //e_user_answers 批量回答多个问题
  user_answersAction() {
    var _this11 = this;

    return _asyncToGenerator(function* () {
      const isPost = _this11.isMethod('POST');
      const model = _this11.model('user_answer');
      if (isPost) {
        const data = _this11.post();
        const rows = yield model.addMany([data]);
        return _this11.success({ affectedRows: rows });
      }
    })();
  }
};
//# sourceMappingURL=v1.js.map
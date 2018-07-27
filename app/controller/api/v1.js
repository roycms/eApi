function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Base = require('../base.js');
//网络请求模块
var request = require('request');
//阿里云
var fs = require("fs");
var ALY = require('aliyun-sdk');
var ossStream = require('aliyun-oss-upload-stream')(new ALY.OSS({
  accessKeyId: 'yIgRvLsyxFB3JEJH',
  secretAccessKey: 'X7wyFWIw76cLb4cLNDa8Z2YNmHtIOu',
  endpoint: 'http://oss-cn-beijing.aliyuncs.com',
  apiVersion: '2013-10-15'
}));
//微信小程序
var wx_api = "https://api.weixin.qq.com/sns/jscode2session";
var wx_appid = "wx7a794dc3cc2dfaa6";
var wx_secret = "1697d5ecf2f7b3a62b4f9f51e2a17c58"; //小程序的 app secret


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
        password: passwordMd5Val,
        is_admin: 1
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
  webLoginAction() {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      const username = _this3.post('username');
      const password = _this3.post('password');
      if (username == undefined || password == undefined) {
        return _this3.fail(300, "参数错误");
      }
      const passwordMd5Val = think.md5(password);
      const user = _this3.model('user');
      var data = yield user.where({
        username: username,
        password: passwordMd5Val
      }).find();
      // this.json(data)
      if (JSON.stringify(data) == "{}") {
        yield _this3.session('sessionKey', null);
        return _this3.fail(300, "账户名或者密码错误！");
      } else {
        var task_flows = yield _this3.model('task_flows').where({ user_id: data.id }).order('id DESC').find(); //e_task_flows
        data.task_flows_id = task_flows.id;
        //设置session
        yield _this3.session('sessionKey', username);
        return _this3.json(data);
      }
    })();
  }
  //用户注册和更改用户资料
  userAction() {
    var _this4 = this;

    return _asyncToGenerator(function* () {
      const isGet = _this4.isMethod('GET');
      const isPut = _this4.isMethod('PUT');
      const isPost = _this4.isMethod('POST');
      const isDelete = _this4.isMethod('DELETE');
      const model = _this4.model('user');
      const id = _this4.get("id");

      if (isGet) {
        const user = yield model.where({ id: id }).find();
        return _this4.success(user);
      }
      if (isPut) {
        const data = _this4.post();
        if (data.password != null) {
          data.password = think.md5(data.password);
        }
        const rows = yield model.where({ id: id }).update(data);
        const user = yield model.where({ id: id }).find();
        return _this4.success(user);
      }
      if (isPost) {
        const data = _this4.post();
        data.password = think.md5(data.password);
        // this.json(data)
        const isUser = yield model.where({ username: data.username }).find();
        if (JSON.stringify(isUser) != "{}") {
          return _this4.fail(1001, "注册失败！该用户已经存在");
        } else {
          const rows = yield model.add(data);
          return _this4.success({ affectedRows: rows });
        }
      }
      if (isDelete) {
        const rows = yield model.where({ id: id }).delete();
        return _this4.success({ affectedRows: rows });
      }
    })();
  }
  //上传文件
  upfileAction() {
    var _this5 = this;

    return _asyncToGenerator(function* () {
      var file = _this5.file("file");
      var filePath = "baby/" + think.uuid("v4") + ".jpg";
      var upload = ossStream.upload({
        Bucket: 'server-19860911',
        Key: filePath
      });
      var read = fs.createReadStream(file.path);
      read.pipe(upload);
      var _this = _this5;
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

  //analysis 评测主体
  analysisAction() {
    var _this6 = this;

    return _asyncToGenerator(function* () {
      const isGet = _this6.isMethod('GET');
      const isPut = _this6.isMethod('PUT');
      const isPost = _this6.isMethod('POST');
      const isDelete = _this6.isMethod('DELETE');
      const model = _this6.model('analysis');
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
        //级联删除

        return _this6.success({ affectedRows: rows });
      }
      if (isGet) {
        const data = yield model.select();
        return _this6.json(data);
      }
    })();
  }
  //Evaluation 评测主体
  evaluationAction() {
    var _this7 = this;

    return _asyncToGenerator(function* () {
      const isGet = _this7.isMethod('GET');
      const isPut = _this7.isMethod('PUT');
      const isPost = _this7.isMethod('POST');
      const isDelete = _this7.isMethod('DELETE');
      const model = _this7.model('evaluation');
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
        //级联删除
        const rows2 = yield _this7.model('question').where({ question_id: id }).update({ question_id: 0 });
        return _this7.success({ affectedRows: rows });
      }
      if (isGet) {
        var evaluation_id = _this7.get("evaluation_id");
        if (evaluation_id != null) {
          const data = yield model.where({ id: evaluation_id }).find();
          return _this7.json(data);
        } else {
          const data = yield model.select();
          return _this7.json(data);
        }
      }
    })();
  }

  //question
  questionAction() {
    var _this8 = this;

    return _asyncToGenerator(function* () {
      const isGet = _this8.isMethod('GET');
      const isPut = _this8.isMethod('PUT');
      const isPost = _this8.isMethod('POST');
      const isDelete = _this8.isMethod('DELETE');
      const model = _this8.model('question');
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
        //级联删除
        const rows2 = yield _this8.model('options').where({ question_id: id }).delete();
        // const rows3 = await this.model('user_answer').where({ question_id: id }).delete();
        return _this8.success({ affectedRows: rows });
      }
      if (isGet) {
        const data = yield model.select();
        return _this8.json(data);
      }
    })();
  }
  //options
  optionsAction() {
    var _this9 = this;

    return _asyncToGenerator(function* () {
      const isGet = _this9.isMethod('GET');
      const isPut = _this9.isMethod('PUT');
      const isPost = _this9.isMethod('POST');
      const isDelete = _this9.isMethod('DELETE');
      const model = _this9.model('options');
      const id = _this9.get("id");
      if (isPut) {
        const data = _this9.post();
        const rows = yield model.where({ id: id }).update(data);
        return _this9.success({ affectedRows: rows });
      }
      if (isPost) {
        const data = _this9.post();
        const rows = yield model.add(data);
        return _this9.success({ affectedRows: rows });
      }
      if (isDelete) {
        const rows = yield model.where({ id: id }).delete();
        return _this9.success({ affectedRows: rows });
      }
      if (isGet) {
        const data = yield model.select();
        return _this9.json(data);
      }
    })();
  }
  //Answer
  answerAction() {
    var _this10 = this;

    return _asyncToGenerator(function* () {
      const isGet = _this10.isMethod('GET');
      const isPut = _this10.isMethod('PUT');
      const isPost = _this10.isMethod('POST');
      const isDelete = _this10.isMethod('DELETE');
      const model = _this10.model('answer');
      const id = _this10.get("id");
      if (isPut) {
        const data = _this10.post();
        const rows = yield model.where({ id: id }).update(data);
        return _this10.success({ affectedRows: rows });
      }
      if (isPost) {
        const data = _this10.post();
        const rows = yield model.add(data);
        return _this10.success({ affectedRows: rows });
      }
      if (isDelete) {
        const rows = yield model.where({ id: id }).delete();
        return _this10.success({ affectedRows: rows });
      }
      if (isGet) {
        const data = yield model.select();
        return _this10.json(data);
      }
    })();
  }

  //e_task_flows
  task_flowsAction() {
    var _this11 = this;

    return _asyncToGenerator(function* () {
      //创建一个测试
      const isPost = _this11.isMethod('POST');
      const isGet = _this11.isMethod('GET');
      const model = _this11.model('task_flows');
      if (isPost) {
        const data = _this11.post();
        const rows = yield model.add(data);
        return _this11.success({ affectedRows: rows });
      }
      //查询某个用户的所有测试 参数 user_id
      if (isGet) {
        const data = yield model.where({ user_id: _this11.get("user_id") }).select(); //e_task_flows
        return _this11.json(data);
      }
    })();
  }

  //e_user_answer 回答一个问题
  user_answerAction() {
    var _this12 = this;

    return _asyncToGenerator(function* () {
      const isPost = _this12.isMethod('POST');
      const model = _this12.model('user_answer');
      if (isPost) {
        const data = _this12.post();
        const rows = yield model.add(data);
        return _this12.success({ affectedRows: rows });
      }
    })();
  }
  //e_user_answers 批量回答多个问题
  user_answersAction() {
    var _this13 = this;

    return _asyncToGenerator(function* () {
      const user_id = _this13.get('user_id');
      const isPost = _this13.isMethod('POST');
      const model = _this13.model('user_answer');
      if (isPost) {
        const task_flows_id = yield _this13.model('task_flows').add({
          user_id: user_id,
          status: 1
        });
        const data = _this13.post();
        var rs = JSON.parse(data.data);
        for (let i = 0, len = rs.length; i < len; i++) {
          rs[i].task_flows_id = task_flows_id;
          var question = yield _this13.model('question').where({ id: rs[i].question_id }).find();
          var evaluation = yield _this13.model('evaluation').where({ id: rs[i].evaluation_id }).find();
          rs[i].evaluation_id = question.evaluation_id;
          rs[i].analysis_id = evaluation.analysis_id;
        }
        // rs.forEach(function(item,index){
        //   rs[index].task_flows_id = task_flows_id;
        //   var question = await this.model('question').where({id:rs[index].question_id}).find();
        //   var evaluation = await this.model('evaluation').where({id:rs[index].evaluation_id}).find();
        //   rs[index].evaluation_id = question.evaluation_id;
        //   rs[index].analysis_id = evaluation.analysis_id;
        // });
        const rows = yield model.addMany(rs);
        return _this13.success({ task_flows_id: task_flows_id });
      }
    })();
  }

  //获取 openid
  openid(code) {
    return _asyncToGenerator(function* () {
      var url = wx_api + "?appid=" + wx_appid + "&secret=" + wx_secret + "&js_code=" + code + "&grant_type=authorization_code";
      var openid = yield new Promise(function (resolve, reject) {
        request(url, function (error, response, body) {
          if (!error && response.statusCode == 200) {
            //输出返回的内容
            console.log("======" + body);
            var rt = JSON.parse(body);
            if (rt.openid != undefined) {
              resolve(rt.openid);
            } else {
              resolve(rt);
            }
          } else {
            reject();
          }
        });
      });
      return openid;
    })();
  }
  //微信登录
  wxloginAction() {
    var _this14 = this;

    return _asyncToGenerator(function* () {
      let js_code = _this14.get("code"); //登录时获取的 code
      var openid = yield _this14.openid(js_code);
      console.log("======________" + openid);
      if (typeof openid == "object") {
        return _this14.fail(300, "获取openid失败！ code:-->" + JSON.stringify(openid));
      } else {
        const model = _this14.model('user');
        const user = yield model.where({ wid: openid }).find();
        if (JSON.stringify(user) != "{}") {
          //存在
          return _this14.success(user);
        } else {
          //不存在user
          const rows = yield model.add({ wid: openid });
          return _this14.success({ affectedRows: rows });
        }
      }
    })();
  }

  //短信接口
  smsCodeAction() {
    var _this15 = this;

    return _asyncToGenerator(function* () {
      let phone = _this15.get("phone"); //登录时获取的 code

      var options = {
        uri: 'http://180.76.110.67:5880/template/add',
        method: 'POST',
        json: {
          "username": "h2-bjsf", //用户账号
          "password": "h2-bjsf", //密码
          "content": "您好,本次您的验证码${2}" //模板内容
        }
      };
      request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          //输出返回的内容
          console.log("======" + JSON.stringify(body));
          console.log("======" + body);
        }
      });
      yield _this15.session(phone, 'smsCode');
    })();
  }
  smsLoginAction() {
    var _this16 = this;

    return _asyncToGenerator(function* () {
      let phoneNum = _this16.post("phone");
      let code = _this16.post("code");
      if (_this16.session(phoneNum) == code) {
        const model = _this16.model('user');
        const user = yield model.where({ phone: phoneNum }).find();
        if (JSON.stringify(user) != "{}") {
          //存在
          return _this16.success(user);
        } else {
          //不存在user
          const rows = yield model.add({ phone: phoneNum });
          return _this16.success({ affectedRows: rows });
        }
      }
    })();
  }

};
//# sourceMappingURL=v1.js.map
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
    return this.json({code:200});
  }
  //登录
  async loginAction() {
     const username = this.post('username');
     const password = this.post('password');
     if (username == undefined || password == undefined) {
       return this.fail(300, "参数错误");
     }
     const passwordMd5Val = think.md5(password);
     const user = this.model('user');
     const data = await user.where({
       username: username,
       password: passwordMd5Val,
       is_admin:1
     }).find();
     // this.json(data)
     if (JSON.stringify(data) == "{}"){
        await this.session('sessionKey', null);
        return this.fail(300, "账户名或者密码错误！");
     }
     else {
       //设置session
        await this.session('sessionKey', username);
        return this.success(200, "登录成功！");
     }
  }
  async webLoginAction() {
     const username = this.post('username');
     const password = this.post('password');
     if (username == undefined || password == undefined) {
       return this.fail(300, "参数错误");
     }
     const passwordMd5Val = think.md5(password);
     const user = this.model('user');
     const data = await user.where({
       username: username,
       password: passwordMd5Val
     }).find();
     // this.json(data)
     if (JSON.stringify(data) == "{}"){
        await this.session('sessionKey', null);
        return this.fail(300, "账户名或者密码错误！");
     }
     else {
       //设置session
        await this.session('sessionKey', username);
        return this.json(data);
     }
  }
  //用户注册和更改用户资料
  async userAction(){
    const isGet = this.isMethod('GET');
    const isPut = this.isMethod('PUT');
    const isPost = this.isMethod('POST');
    const isDelete = this.isMethod('DELETE');
    const model = this.model('user');
    const id = this.get("id");

    if (isGet){
      const user = await model.where({id: id }).find();
      return this.success(user);
    }
    if (isPut) {
      const data = this.post();
      if (data.password != null) {
        data.password =  think.md5(data.password);
      }
      const rows = await model.where({ id: id }).update(data);
      const user = await model.where({id: id }).find();
      return this.success(user);
    }
    if (isPost) {
      const data = this.post();
      data.password =  think.md5(data.password);
      // this.json(data)
      const isUser = await model.where({username: data.username}).find();
        if (JSON.stringify(isUser) != "{}"){
          return this.fail(1001, "注册失败！该用户已经存在");
        }else {
          const rows = await model.add(data);
          return this.success({ affectedRows: rows });
        }
    }
    if (isDelete) {
      const rows = await model.where({ id: id }).delete()
      return this.success({ affectedRows: rows });
    }
  }
  //上传文件
  async upfileAction(){
    var file = this.file("file")
    var filePath = "baby/" + think.uuid("v4") + ".jpg";
    var upload = ossStream.upload({
      Bucket: 'server-19860911',
      Key: filePath
    });
    var read = fs.createReadStream(file.path);
    read.pipe(upload);
    var _this = this
    //传成功
    var p = await new Promise((resolve,reject)=>{
        upload.on('uploaded', function (details) {
           console.log('details:', details);
           resolve(details)
         });
     }).then(function(details){
           _this.json(details);
     })
     //传失败
     upload.on('error', function (error) {
       console.log('error:', error);
     });
  }

  //analysis 评测主体
  async analysisAction(){
    const isGet = this.isMethod('GET');
    const isPut = this.isMethod('PUT');
    const isPost = this.isMethod('POST');
    const isDelete = this.isMethod('DELETE');
    const model = this.model('analysis');
    const id = this.get("id");
    if (isPut) {
      const data = this.post();
      const rows = await model.where({ id: id }).update(data);
      return this.success({ affectedRows: rows });
    }
    if (isPost) {
      const data = this.post();
      const rows = await model.add(data);
      return this.success({ affectedRows: rows });
    }
    if (isDelete) {
      const rows = await model.where({ id: id }).delete()
      //级联删除

      return this.success({ affectedRows: rows });
    }
    if (isGet) {
      const data = await model.select()
      return this.json(data);
    }
  }
  //Evaluation 评测主体
  async evaluationAction(){
    const isGet = this.isMethod('GET');
    const isPut = this.isMethod('PUT');
    const isPost = this.isMethod('POST');
    const isDelete = this.isMethod('DELETE');
    const model = this.model('evaluation');
    const id = this.get("id");
    if (isPut) {
      const data = this.post();
      const rows = await model.where({ id: id }).update(data);
      return this.success({ affectedRows: rows });
    }
    if (isPost) {
      const data = this.post();
      const rows = await model.add(data);
      return this.success({ affectedRows: rows });
    }
    if (isDelete) {
      const rows = await model.where({ id: id }).delete()
      //级联删除
      const rows2 = await this.model('question').where({ question_id: id }).update({ question_id: 0 })
      return this.success({ affectedRows: rows });
    }
    if (isGet) {
      var evaluation_id = this.get("evaluation_id");
      if (evaluation_id != null) {
        const data = await model.where({id:evaluation_id}).find()
        return this.json(data);
      }
      else {
        const data = await model.select()
        return this.json(data);
      }

    }
  }

  //question
  async questionAction(){
    const isGet = this.isMethod('GET');
    const isPut = this.isMethod('PUT');
    const isPost = this.isMethod('POST');
    const isDelete = this.isMethod('DELETE');
    const model = this.model('question');
    const id = this.get("id");
    if (isPut) {
      const data = this.post();
      const rows = await model.where({ id: id }).update(data);
      return this.success({ affectedRows: rows });
    }
    if (isPost) {
      const data = this.post();
      const rows = await model.add(data);
      return this.success({ affectedRows: rows });
    }
    if (isDelete) {
      const rows = await model.where({ id: id }).delete();
      //级联删除
      const rows2 = await this.model('options').where({ question_id: id }).delete();
      // const rows3 = await this.model('user_answer').where({ question_id: id }).delete();
      return this.success({ affectedRows: rows });
    }
    if (isGet) {
      const data = await model.select();
      return this.json(data);
    }
  }
  //options
  async optionsAction(){
    const isGet = this.isMethod('GET');
    const isPut = this.isMethod('PUT');
    const isPost = this.isMethod('POST');
    const isDelete = this.isMethod('DELETE');
    const model = this.model('options');
    const id = this.get("id");
    if (isPut) {
      const data = this.post();
      const rows = await model.where({ id: id }).update(data);
      return this.success({ affectedRows: rows });
    }
    if (isPost) {
      const data = this.post();
      const rows = await model.add(data);
      return this.success({ affectedRows: rows });
    }
    if (isDelete) {
      const rows = await model.where({ id: id }).delete()
      return this.success({ affectedRows: rows });
    }
    if (isGet) {
      const data = await model.select()
      return this.json(data);
    }
  }
  //Answer
  async answerAction(){
    const isGet = this.isMethod('GET');
    const isPut = this.isMethod('PUT');
    const isPost = this.isMethod('POST');
    const isDelete = this.isMethod('DELETE');
    const model = this.model('answer');
    const id = this.get("id");
    if (isPut) {
      const data = this.post();
      const rows = await model.where({ id: id }).update(data);
      return this.success({ affectedRows: rows });
    }
    if (isPost) {
      const data = this.post();
      const rows = await model.add(data);
      return this.success({ affectedRows: rows });
    }
    if (isDelete) {
      const rows = await model.where({ id: id }).delete()
      return this.success({ affectedRows: rows });
    }
    if (isGet) {
      const data = await model.select()
      return this.json(data);
    }
  }

  //e_task_flows
  async task_flowsAction(){
    //创建一个测试
    const isPost = this.isMethod('POST');
    const isGet = this.isMethod('GET');
    const model = this.model('task_flows');
    if (isPost) {
      const data = this.post();
      const rows = await model.add(data);
      return this.success({ affectedRows: rows });
    }
    //查询某个用户的所有测试 参数 user_id
    if (isGet) {
      const data = await model.where({user_id: this.get("user_id")}).select()
      return this.json(data);
    }
  }

  //e_user_answer 回答一个问题
  async user_answerAction(){
    const isPost = this.isMethod('POST');
    const model = this.model('user_answer');
    if (isPost) {
      const data = this.post();
      const rows = await model.add(data);
      return this.success({ affectedRows: rows });
    }
  }
  //e_user_answers 批量回答多个问题
  async user_answersAction(){
    const user_id = this.get('user_id');
    const isPost = this.isMethod('POST');
    const model = this.model('user_answer');
    if (isPost) {
      const task_flows_id = await this.model('task_flows').add({
        user_id:user_id,
        status:1
      });
      const data = this.post();
      var rs = JSON.parse(data.data);
      rs.forEach(function(item,index){
        rs[index].task_flows_id = task_flows_id;
      });
      const rows = await model.addMany(rs);
      return this.success({ task_flows_id: task_flows_id });
    }
  }

  //获取 openid
  async openid(code){
    var url = wx_api
    + "?appid=" + wx_appid
    + "&secret=" + wx_secret
    + "&js_code=" + code
    + "&grant_type=authorization_code";
    var openid = await new Promise((resolve,reject)=>{
        request(url,function(error,response,body){
            if(!error && response.statusCode == 200){
                //输出返回的内容
                console.log("======"+body);
                var rt = JSON.parse(body)
                if (rt.openid != undefined) {
                  resolve(rt.openid);
                }else {
                  resolve(rt);
                }
            }else {
              reject();
            }
        });
      });
      return openid;
  }
  //微信登录
   async wxloginAction(){
      let js_code = this.get("code"); //登录时获取的 code
      var openid = await this.openid(js_code);
      console.log("======________"+openid);
      if (typeof(openid) == "object") {
        return this.fail(300, "获取openid失败！ code:-->" + JSON.stringify(openid));
      }
      else {
        const model = this.model('user');
        const user = await model.where({wid: openid}).find();
          if (JSON.stringify(user) != "{}"){ //存在
            return this.success(user);
          } else { //不存在user
            const rows = await model.add({wid:openid});
            return this.success({ affectedRows: rows });
          }
      }
    }

    //短信接口
    async smsCodeAction(){
      let phone = this.get("phone"); //登录时获取的 code

      var options = {
          uri: 'http://180.76.110.67:5880/template/add',
          method: 'POST',
          json: {
            "username":"h2-bjsf",//用户账号
            "password":"h2-bjsf",//密码
            "content":"您好,本次您的验证码${2}"//模板内容
          }
        };
        request(options,function(error, response, body) {
            if (!error && response.statusCode == 200) {
                //输出返回的内容
                console.log("======"+JSON.stringify(body));
                console.log("======"+body);
              }
            });
      await this.session(phone, 'smsCode');
    }
    async smsLoginAction(){
      let phoneNum = this.post("phone");
      let code = this.post("code");
      if (this.session(phoneNum) == code) {
        const model = this.model('user');
        const user = await model.where({phone: phoneNum}).find();
          if (JSON.stringify(user) != "{}"){ //存在
            return this.success(user);
          } else { //不存在user
            const rows = await model.add({phone: phoneNum});
            return this.success({ affectedRows: rows });
          }
      }
    }

};

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
       password: passwordMd5Val
     }).find();
     // this.json(data)
     if (JSON.stringify(data) == "{}"){
        return this.fail(300, "账户名或者密码错误！");
     }
     else {
        return this.success(200, "登录成功！");
     }
  }
  //用户注册和更改用户资料
  async userAction(){
    const isPut = this.isMethod('PUT');
    const isPost = this.isMethod('POST');

    const model = this.model('user');
    const id = this.get("id");

    if (isPut) {
      const data = this.post();
      data.password =  think.md5(data.password);
      const rows = await model.where({ id: id }).update(data);
      return this.success({ affectedRows: rows });
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
      return this.success({ affectedRows: rows });
    }
    if (isGet) {
      const data = await model.select()
      return this.json(data);
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
      const rows = await model.where({ id: id }).delete()
      return this.success({ affectedRows: rows });
    }
    if (isGet) {
      const data = await model.select()
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
    const isPost = this.isMethod('POST');
    const model = this.model('user_answer');
    if (isPost) {
      const data = this.post();
      const rows = await model.addMany([data]);
      return this.success({ affectedRows: rows });
    }
  }
};

const Base = require('../base.js');
const Common = require('./common.js');
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
     var data = await user.where({
       username: username,
       password: passwordMd5Val
     }).find();
     // this.json(data)
     if (JSON.stringify(data) == "{}"){
        await this.session('sessionKey', null);
        return this.fail(300, "账户名或者密码错误！");
     }
     else {
       var task_flows = await this.model('task_flows').where({user_id: data.id}).order('id DESC').find()  //e_task_flows
       data.task_flows_id = task_flows.id;
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
      const data = await model.order('orderby ASC').select();
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
      const rows = await model.where({ id: id }).delete();
      return this.success({ affectedRows: rows });
    }
    if (isGet) {
      const data = await model.select();
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
      const data = await model.where({user_id: this.get("user_id")}).select()  //e_task_flows
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
      var analysis_id;
      const data = this.post();
      var rs = JSON.parse(data.data);
      for(let i=0,len=rs.length;i<len;i++){
        rs[i].task_flows_id = task_flows_id;
        var question = await this.model('question').where({id:rs[i].question_id}).find();
        rs[i].evaluation_id = question.evaluation_id;
        rs[i].max_scores = question.max_scores;
        var evaluation = await this.model('evaluation').where({id:rs[i].evaluation_id}).find();
        rs[i].analysis_id = evaluation.analysis_id;
        analysis_id = evaluation.analysis_id;
      }
      const rows = await model.addMany(rs);
      //统计是什么类型的

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
    async rts(analysis_id,task_flows_id){

        var evaluations = await this.model('evaluation').where({analysis_id:analysis_id}).select();
        var r = [];
        var maxScore = 0;
        var maxItm = evaluations[0];
        maxItm.scores = 0;
        for(let i=0,len=evaluations.length;i<len;i++){
          var scores = await this.model('user_answer').where({
              task_flows_id:task_flows_id,
              analysis_id:analysis_id,
              evaluation_id:evaluations[i].id
            }).sum("scores");
            var max_scores = await this.model('user_answer').where({
                task_flows_id:task_flows_id,
                analysis_id:analysis_id,
                evaluation_id:evaluations[i].id
              }).sum("max_scores");

            if (maxScore < scores){
              maxItm = evaluations[i];
              maxScore = scores;
              maxItm.scores = maxScore; //得分
              maxItm.max_scores = max_scores; //满分
            }

            evaluations[i].scores = maxScore; //得分
            evaluations[i].max_scores = max_scores; //满分
            r.push(evaluations[i]);
          }

          maxItm.rts = JSON.stringify(r);
          maxItm.rts = JSON.parse(maxItm.rts);
          console.log("++++" + JSON.stringify(maxItm));
          return maxItm;
    }
    // 返回测试结果
    async rtsAction(){
      var analysis_id = this.get("analysis_id");
      var task_flows_id = this.get("task_flows_id");
      var rt = await this.rts(analysis_id,task_flows_id);
      return this.json(rt);
    }


    //批量添加
    // questionsStrs   35|问题1|1|99  // evaluation_id  标题 排序  最大分
    // optionsStrs   选项一|1|0   //标题 分数  排序
    async adds(analysis_id,questionsStrs,optionsStrs){

      var qArray = questionsStrs.split('\n');
      var oArray = optionsStrs.split('\n');

      for (let i=0,len=qArray.length;i<len;i++){
        var qObjArray = qArray[i].split('|');
        var question = {
          analysis_id:analysis_id,
          evaluation_id:qObjArray[0],
          title:qObjArray[1],
          orderby:qObjArray[2],
          max_scores:qObjArray[3]
        }
        await this.model('question').add(question);
      }

      var questions = await this.model('question').where({analysis_id:analysis_id}).select();
      var ooobjs = [];
      for (let q=0,len=questions.length;q<len;q++){
        for (let i=0,len=oArray.length;i<len;i++){
          var oObjArray = oArray[i].split('|');
          var obj = {
            question_id:questions[q].id,
            content:oObjArray[0],
            scores:oObjArray[1],
            orderby:oObjArray[2]
          };
          ooobjs.push(obj);
        }
      }
      console.log("++++" + JSON.stringify(ooobjs));
      return  await this.model('options').addMany(ooobjs);
    }

    async singKAddItAction(){
      //"0|问题1|1|99\n0|问题2|1|99\n0|问题3|1|99","选项1|1|0\n选项2|1|0\n选项3|1|0"
      var analysis_id = this.post("analysis_id");
      var questionsStrs = this.post("questionsStrs");
      var optionsStrs = this.post("optionsStrs");

      console.log("++++" + analysis_id);
      console.log("++++" + questionsStrs);
      console.log("++++" + optionsStrs);

      return this.json(await this.adds(analysis_id,questionsStrs,optionsStrs));
    }
};

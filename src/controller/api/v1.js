const Base = require('../base.js');

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
};

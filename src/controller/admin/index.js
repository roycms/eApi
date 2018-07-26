const Base = require('../base.js');

module.exports = class extends Base {
  async indexAction() {

    const sessionKey = await this.session('sessionKey');
    if (think.isEmpty(sessionKey)){
      this.redirect("/login")
    }else {
      let analysi = this.model('analysis');
      const analysis = await analysi.select();
      this.assign({ analysis: analysis});

      this.assign({ sessionKey: sessionKey,analysis: analysis});
      return await this.display();
    }
  }
  async loginOutAction(){
    // 删除整个 session
    await this.session(null);
    this.redirect("/login")
  }
};
//# sourceMappingURL=index.js.map

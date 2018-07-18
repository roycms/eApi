const Base = require('./base.js');

module.exports = class extends Base {
 async indexAction() {
    const sessionKey = await this.session('sessionKey');
    // if (!think.isEmpty(sessionKey)){
    //   this.redirect("/admin")
    // }else {
    //   return this.display();
    // }
    return this.display();
  }
}

const Base = require('../base.js');

module.exports = class extends Base {
  async indexAction() {
    let user = this.model('user');
    var users;
    if (this.get("isAdmin") == 1){
        users = await user.where({is_admin:1}).select();
    }
    else {
        users = await user.select();
    }
    this.assign({ users: users});
    return await this.display();
  }
};

const Base = require('../base.js');

module.exports = class extends Base {
  async indexAction() {
    let user = this.model('user');
    const users = await user.select();
    this.assign({ users: users});
    return await this.display();
  }
};

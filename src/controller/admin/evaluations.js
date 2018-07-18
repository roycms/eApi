const Base = require('../base.js');

module.exports = class extends Base {
  async indexAction() {
    let evaluation = this.model('evaluation');
    const evaluations = await evaluation.select();
    this.assign({ evaluations: evaluations});
    return await this.display();
  }
};

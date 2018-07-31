const Base = require('../base.js');

module.exports = class extends Base {
  async indexAction() {
    this.assign({
      analysis_id:this.get("analysis_id")
    });
    return await this.display();
 }
}

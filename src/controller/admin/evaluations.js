const Base = require('../base.js');

module.exports = class extends Base {
  async indexAction() {
    let evaluation = this.model('evaluation');
    const evaluations = await evaluation.where({analysis_id:this.get("analysis_id")}).select();
    this.assign({
      evaluations: evaluations,
      analysis_id:this.get("analysis_id")
    });
    return await this.display();
  }
};

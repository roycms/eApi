const Base = require('../base.js');

module.exports = class extends Base {
  async indexAction() {
    // let question = this.model('question');
    const questions = await this.model('question').where(
      {analysis_id:this.get("analysis_id")}
    ).
    order('orderby DESC').select();
    this.assign({
      questions: questions,
      analysis_id:this.get("analysis_id")
    });
    return await this.display();
  }
};

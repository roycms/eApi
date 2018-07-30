const Base = require('../base.js');

module.exports = class extends Base {
  async indexAction() {
    // let question = this.model('question');
    const questions = await this.model('question').order('orderby DESC').select();
    this.assign({ questions: questions});
    return await this.display();
  }
};

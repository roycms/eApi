const Base = require('../base.js');

module.exports = class extends Base {
  async indexAction() {
    if (this.get("user_id") != null){
      const task_flows = await this.model('task_flows').order('id DESC').where({
        user_id: this.get("user_id"),
        status:1
      }).find();
      const user_answers = task_flows.user_answer;
      console.log('============:', JSON.stringify(task_flows) );
      console.log('++++++++++++:', JSON.stringify(user_answers) );
      this.assign({
        user_answers: user_answers
      });
    }else {
      this.assign({
        user_answers: null
      });
    }

    return await this.display();
  }
};

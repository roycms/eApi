const Base = require('../base.js');

module.exports = class extends Base {
  async indexAction() {
    if (this.get("user_id") != null){

      var whereStr = {
        user_id: this.get("user_id"),
        status:1
      };
      if (this.get("task_flows_id") != null) {
        whereStr.id = this.get("task_flows_id");
      }

      const task_flows = await this.model('task_flows').order('id DESC').where(whereStr).find();
      const user_answers = task_flows.user_answer;
      console.log('============:', JSON.stringify(task_flows) );
      console.log('++++++++++++:', JSON.stringify(user_answers) );
      const task_flows_data = await this.model('task_flows').order('id DESC').where({
        user_id: this.get("user_id"),
        status:1
      }).select();
      this.assign({
        user_answers: user_answers,
        task_flows_data:task_flows_data,
        user_id:this.get("user_id"),
        task_flows_id:this.get("task_flows_id")
      });
    }else {
      this.assign({
        user_answers: null,
        task_flows_data:null,
        user_id:this.get("user_id"),
        task_flows_id:this.get("task_flows_id")
      });
    }

    return await this.display();
  }
};

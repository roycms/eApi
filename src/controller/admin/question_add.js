const Base = require('../base.js');

module.exports = class extends Base {
 async indexAction() {

    if (this.get("id") != null){
      const question = await this.model('question').where({ id: this.get("id") }).find();
      const options = await this.model('options').where({ question_id: this.get("id") }).select();

      this.assign({
        question: question,
        options:options
      });
    }else {
      this.assign({
        question: null,
        options:null
      });
    }

    return this.display();
  }
  async addAction(){
    const q_id = this.get("id");
    const isPut = this.isMethod('PUT');
    const isPost = this.isMethod('POST');
    const data = this.post();
    data.c =  JSON.parse(data.c)
    data.s =  JSON.parse(data.s)
    // JSON.parse(data)
    console.log('============:', JSON.stringify(data) );
    let questionData = {
      title:data.title,
      orderby:data.orderby,
      type:data.type,
      max_scores:data.max_scores
    };
    if (isPost) {
      var question_id = await this.model('question').add(questionData);
      if (question_id > 0){
        let options = [];
        data.c.forEach(function(item,index){
          let model = {
            question_id:question_id,
            content:data.c[index],
            scores:data.s[index]
          }
          options.push(model);
        });
        const rows = await this.model('options').addMany(options);
        return this.success({ affectedRows: rows });
      }
    }
    if (isPut) {
      data.oIds =  JSON.parse(data.oIds);//options ids
      var question_id = await this.model('question').where({ id: q_id }).update(questionData);
      if (question_id > 0){
        let options = [];
        data.c.forEach(function(item,index){
          let model = {
            id:data.oIds[index],
            question_id:q_id,
            content:data.c[index],
            scores:data.s[index]
          }
          options.push(model);
        });
        const rows = await this.model('options').updateMany(options);
        return this.success({ affectedRows: rows });
      }
    }
  }
};

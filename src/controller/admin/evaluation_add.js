const Base = require('../base.js');

module.exports = class extends Base {
 async indexAction() {
   if (this.get("id") != null){
         let model = this.model('evaluation');
         const evaluation = await model.where({id:this.get("id")}).find();
         let questionModel = this.model('question');
         const questions = await questionModel.where({evaluation_id:this.get("id")}).select();
         const questions_not = await questionModel.where({
           evaluation_id:0,
           analysis_id:this.get("analysis_id")
         }).select();

         console.log('============:', JSON.stringify(evaluation) );
         this.assign({
           evaluation:evaluation,
           questions:questions,
           questions_not:questions_not,
           analysis_id:this.get("analysis_id")
         })
   }else {
        this.assign({
        evaluation:null,
        analysis_id:this.get("analysis_id")
        })
    }

    return await this.display();
  }
};

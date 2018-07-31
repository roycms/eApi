function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Base = require('../base.js');

module.exports = class extends Base {
  indexAction() {
    var _this = this;

    return _asyncToGenerator(function* () {
      if (_this.get("id") != null) {
        let model = _this.model('evaluation');
        const evaluation = yield model.where({ id: _this.get("id") }).find();
        let questionModel = _this.model('question');
        const questions = yield questionModel.where({ evaluation_id: _this.get("id") }).select();
        const questions_not = yield questionModel.where({
          evaluation_id: 0,
          analysis_id: _this.get("analysis_id")
        }).select();

        console.log('============:', JSON.stringify(evaluation));
        _this.assign({
          evaluation: evaluation,
          questions: questions,
          questions_not: questions_not,
          analysis_id: _this.get("analysis_id")
        });
      } else {
        _this.assign({
          evaluation: null,
          analysis_id: _this.get("analysis_id")
        });
      }

      return yield _this.display();
    })();
  }
};
//# sourceMappingURL=evaluation_add.js.map
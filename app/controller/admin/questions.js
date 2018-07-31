function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Base = require('../base.js');

module.exports = class extends Base {
  indexAction() {
    var _this = this;

    return _asyncToGenerator(function* () {
      // let question = this.model('question');
      const questions = yield _this.model('question').where({ analysis_id: _this.get("analysis_id") }).order('orderby DESC').select();
      _this.assign({
        questions: questions,
        analysis_id: _this.get("analysis_id")
      });
      return yield _this.display();
    })();
  }
};
//# sourceMappingURL=questions.js.map
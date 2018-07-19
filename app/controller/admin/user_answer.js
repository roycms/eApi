function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Base = require('../base.js');

module.exports = class extends Base {
  indexAction() {
    var _this = this;

    return _asyncToGenerator(function* () {
      if (_this.get("user_id") != null) {
        const task_flows = yield _this.model('task_flows').order('id DESC').where({
          user_id: _this.get("user_id"),
          status: 1
        }).find();
        const user_answers = task_flows.user_answer;
        console.log('============:', JSON.stringify(task_flows));
        console.log('++++++++++++:', JSON.stringify(user_answers));
        _this.assign({
          user_answers: user_answers
        });
      } else {
        _this.assign({
          user_answers: null
        });
      }

      return yield _this.display();
    })();
  }
};
//# sourceMappingURL=user_answer.js.map
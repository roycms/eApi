function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const Base = require('../base.js');

module.exports = class extends Base {
  indexAction() {
    var _this = this;

    return _asyncToGenerator(function* () {

      if (_this.get("id") != null) {
        const question = yield _this.model('question').where({ id: _this.get("id") }).find();
        const options = yield _this.model('options').where({ question_id: _this.get("id") }).select();

        _this.assign({
          question: question,
          options: options,
          analysis_id: _this.get("analysis_id")
        });
      } else {
        _this.assign({
          question: null,
          options: null,
          analysis_id: _this.get("analysis_id")
        });
      }

      return _this.display();
    })();
  }
  addAction() {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      const q_id = _this2.get("id");
      const isPut = _this2.isMethod('PUT');
      const isPost = _this2.isMethod('POST');
      const data = _this2.post();
      data.c = JSON.parse(data.c);
      data.s = JSON.parse(data.s);
      // JSON.parse(data)
      console.log('============:', JSON.stringify(data));
      let questionData = {
        analysis_id: data.analysis_id,
        title: data.title,
        orderby: data.orderby,
        type: data.type,
        max_scores: data.max_scores
      };
      if (isPost) {
        var question_id = yield _this2.model('question').add(questionData);
        if (question_id > 0) {
          let options = [];
          data.c.forEach(function (item, index) {
            let model = {
              question_id: question_id,
              content: data.c[index],
              scores: data.s[index]
            };
            options.push(model);
          });
          const rows = yield _this2.model('options').addMany(options);
          return _this2.success({ affectedRows: rows });
        }
      }
      if (isPut) {
        data.oIds = JSON.parse(data.oIds); //options ids
        var question_id = yield _this2.model('question').where({ id: q_id }).update(questionData);
        if (question_id > 0) {
          let options = [];
          data.c.forEach(function (item, index) {
            let model = {
              id: data.oIds[index],
              question_id: q_id,
              content: data.c[index],
              scores: data.s[index]
            };
            options.push(model);
          });
          const rows = yield _this2.model('options').updateMany(options);
          return _this2.success({ affectedRows: rows });
        }
      }
    })();
  }
};
//# sourceMappingURL=question_add.js.map
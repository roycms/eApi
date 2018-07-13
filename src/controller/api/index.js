const Base = require('../base.js');

module.exports = class extends Base {
  indexAction() {
    return this.json({
      code:200,
      version:"1.0.0",
      date:"2018.07.13",
      author:"roy"
    });
  }
};
//# sourceMappingURL=index.js.map

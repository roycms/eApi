module.exports = class extends think.Model {
  get relation() {
    return {
      task_flows: {
        type: think.Model.HAS_MANY,
        order:"id DESC",
        limit:1,
        relation: false
      }
    }
  }
};

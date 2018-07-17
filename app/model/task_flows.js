module.exports = class extends think.Model {
  get relation() {
    return {
      evaluation: {
        type: think.Model.HAS_ONE,
        key: "evaluation_id",
        fKey: "id"
      },
      user_answer: {
        type: think.Model.HAS_MANY
      }
    };
  }
};
//# sourceMappingURL=task_flows.js.map
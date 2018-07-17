module.exports = class extends think.Model {
  get relation() {
    return {
      question: {
        type: think.Model.HAS_ONE,
        key:"question_id",
        fKey:"id"
      },
      options: {
        type: think.Model.HAS_ONE,
        key:"options_id",
        fKey:"id"
      }
    }
  }
};

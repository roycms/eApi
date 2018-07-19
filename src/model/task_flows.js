module.exports = class extends think.Model {
  get relation() {
    return {
      user_answer: {
        type: think.Model.HAS_MANY
      }
    }
  }
};

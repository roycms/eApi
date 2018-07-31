module.exports = class extends think.Model {
  get relation() {
    return {
      options: {
        type: think.Model.HAS_MANY,
        order:"orderby DESC"
      }
    }
  }
};

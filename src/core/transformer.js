class Transformer {
  #data // Thuộc tính private (ES12)
  constructor(resource) {
    // check resource là mảng hay object
    if (Array.isArray(resource)) {
      this.#data = resource.map((item) => this.response(item))
    } else {
      this.#data = this.response(resource)
    }
    return this.#data
  }
}

module.exports = Transformer

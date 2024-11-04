class Cart {
  #cartData = [];

  set cartData(data) {
    this.#cartData = Array.isArray(data)
      ? [...this.#cartData, ...data]
      : [...this.#cartData, data];
  }

  set cartDataEmpty(data) {
    this.#cartData = data;
  }

  get cartData() {
    return this.#cartData;
  }
}

const cart = new Cart();

export { cart };

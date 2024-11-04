class Cart {
  #cartData = [];

  // data can be array or a single data
  set cartData(data) {
    this.#cartData = Array.isArray(data)
      ? [...this.#cartData, ...data]
      : [...this.#cartData, data];
  }

  get cartData() {
    return this.#cartData;
  }

  // make the cart data empty
  set cartDataEmpty(data) {
    this.#cartData = data;
  }
}

const cart = new Cart();

export { cart };

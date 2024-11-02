class ProductStore {
  #products;

  set products(data) {
    this.#products = data;
  }

  get products() {
    return this.#products;
  }
}

const data = new ProductStore();

export { data };

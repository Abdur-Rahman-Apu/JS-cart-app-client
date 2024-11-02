class ProductStore {
  #allProducts;
  #displayProducts;

  set allProducts(data) {
    this.#allProducts = data;
  }

  get allProducts() {
    return this.#allProducts;
  }

  set displayProducts(data) {
    this.#displayProducts = data;
  }

  get displayProducts() {
    return this.#displayProducts;
  }
}

const data = new ProductStore();

export { data };

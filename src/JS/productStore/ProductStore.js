class ProductStore {
  #allProducts;
  #displayProducts;
  #searchProducts;

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

  set searchProducts(data) {
    this.#searchProducts = data;
  }

  get searchProducts() {
    return this.#searchProducts;
  }
}

const data = new ProductStore();

export { data };

class Storage {
  storeIntoStorage(data) {
    localStorage.setItem("shop-buzz-cart", JSON.stringify(data));
  }

  getFromTheStorage() {
    return JSON.parse(localStorage.getItem("shop-buzz-cart"));
  }
}

const storage = new Storage();

export { storage };

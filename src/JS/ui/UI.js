import productCard from "../lib/product/productCard";
import { fetchData } from "../lib/serverRequest/serverRequest";
import hideToast from "../lib/toast/hideToast";
import showToast from "../lib/toast/showToast";
import { data } from "../productStore/ProductStore";
import { baseUrl } from "../utils/config";
import {
  addStyle,
  insertAdjHtml,
  listenEvent,
  selectElm,
  selectMultiElm,
} from "../utils/dom.";

class UI {
  #loadSelector() {
    const body = selectElm("body");
    const modalContainer = selectElm(".modal-section");
    const cartContainer = selectElm(".cart");
    const cartCloseIcon = selectElm(".close-icon");
    const categoriesMenu = selectElm(".categories");
    const categoriesList = selectElm(".categories-list");
    const sortBySection = selectElm(".sort-by-section");
    const sortByName = selectElm(".sort-by-name");
    const sortByOptions = selectElm(".sort-by-options");
    const noProductSection = selectElm(".no-product");
    const productContainer = selectElm(".products-section");
    const loadingProductCards = selectMultiElm(".product-loading");

    return {
      body,
      modalContainer,
      cartContainer,
      cartCloseIcon,
      categoriesMenu,
      categoriesList,
      sortBySection,
      sortByOptions,
      noProductSection,
      loadingProductCards,
      productContainer,
      sortByName,
    };
  }

  #handleBodyClicked(e) {
    const { sortByOptions, sortBySection } = this.#loadSelector();
    const isSortSection = e.target.dataset.section === "sort";

    if (!isSortSection) {
      addStyle(sortByOptions, { display: "none" });
      sortBySection.dataset.visible = false;
    }
  }

  #handleOpenCategories(e) {
    console.log("hover");
    const { categoriesList } = this.#loadSelector();

    addStyle(categoriesList, {
      height: "auto",
      overflow: "auto",
      padding: "8px",
    });
  }

  #handleCloseCategories(e) {
    console.log("close");
    const { categoriesList } = this.#loadSelector();

    addStyle(categoriesList, {
      height: "0",
      overflow: "hidden",
      padding: "0",
    });
  }

  #handleOpenSortOptions() {
    const { sortByOptions, sortBySection } = this.#loadSelector();

    console.log(sortBySection.dataset);
    if (sortBySection.dataset.visible === "true") {
      addStyle(sortByOptions, { display: "none" });
      sortBySection.dataset.visible = false;
    } else {
      addStyle(sortByOptions, { display: "block" });
      sortBySection.dataset.visible = true;
    }
  }

  #handleOpenCart(e) {
    console.log("clicked");
    console.log(this);
    const { body, modalContainer } = this.#loadSelector();

    // open cart modal
    addStyle(body, {
      height: "100vh",
      overflow: "hidden",
      backgroundColor: "rgba(157, 153, 153, 0.427)",
    });
    addStyle(modalContainer, { display: "flex" });
  }

  #handleCloseCart(e) {
    const { body, modalContainer } = this.#loadSelector();
    addStyle(body, {
      height: "auto",
      overflow: "auto",
      backgroundColor: "#fff",
    });
    addStyle(modalContainer, { display: "none" });
  }

  #displayEmptyProduct() {
    const { noProductSection } = this.#loadSelector();
    addStyle(noProductSection, { display: "flex" });
  }

  #displayToast(data) {
    showToast(data);
    hideToast();
  }

  #hideLoading() {
    const { loadingProductCards } = this.#loadSelector();
    loadingProductCards.forEach((loadingProductCard) =>
      addStyle(loadingProductCard, { display: "none" })
    );
  }

  #hideProductSection() {
    const { productContainer } = this.#loadSelector();

    addStyle(productContainer, { display: "none" });
  }

  #showProductEmptySection({ toastMsg }) {
    this.#hideLoading();
    this.#hideProductSection();
    this.#displayToast({ action: "failure", msg: toastMsg });
    this.#displayEmptyProduct();
  }

  #showProducts(products) {
    const { productContainer } = this.#loadSelector();

    const productsHtml = products
      .map((product) => productCard(product))
      .join(" ");

    insertAdjHtml(productContainer, productsHtml);
  }

  #displayProductsIntoTheUI() {
    const products = data.displayProducts;
    this.#showProducts(products);
  }

  #getAllProducts(receiveData) {
    let products = [];
    receiveData.forEach((item) => {
      products = [...products, ...item?.products];
    });

    return products;
  }

  async #handleDisplayInitialProducts() {
    try {
      const receiveData = await fetchData(
        `${baseUrl}/categories?_embed=products`
      );
      console.log(receiveData);

      if (receiveData?.length) {
        data.allProducts = receiveData;
        data.displayProducts = this.#getAllProducts(receiveData);
        this.#hideLoading();
        this.#displayProductsIntoTheUI();
      } else {
        this.#showProductEmptySection({ toastMsg: "No products found" });
      }
      data;
    } catch (err) {
      console.log(err);
      this.#showProductEmptySection({ toastMsg: "Failed to fetch data" });
    }
  }

  #sortProductsInAsc() {
    const products = data.displayProducts;
    products.sort((a, b) => a.price - b.price);
    data.displayProducts = products;
    this.#displayProductsIntoTheUI();
  }
  #sortProductsInDesc() {
    const products = data.displayProducts;
    products.sort((a, b) => b.price - a.price);
    data.displayProducts = products;

    this.#displayProductsIntoTheUI();
  }

  #handleSortProducts(e) {
    const { sortByName } = this.#loadSelector();
    console.log(e.target.innerText);
    const targetedWay = e.target.innerText;
    const sortWay =
      targetedWay.toLowerCase() === "low to high" ? "asc" : "desc";

    if (sortWay === "asc") {
      this.#sortProductsInAsc();
      sortByName.innerText = targetedWay;
    }

    if (sortWay === "desc") {
      this.#sortProductsInDesc();
      sortByName.innerText = targetedWay;
    }
  }

  init() {
    listenEvent(
      document,
      "DOMContentLoaded",
      this.#handleDisplayInitialProducts.bind(this)
    );

    const {
      body,
      cartContainer,
      cartCloseIcon,
      categoriesMenu,
      sortBySection,
      sortByOptions,
    } = this.#loadSelector();

    listenEvent(body, "click", this.#handleBodyClicked.bind(this));

    listenEvent(
      categoriesMenu,
      "mouseover",
      this.#handleOpenCategories.bind(this)
    );

    listenEvent(
      categoriesMenu,
      "mouseout",
      this.#handleCloseCategories.bind(this)
    );

    listenEvent(cartContainer, "click", this.#handleOpenCart.bind(this));

    listenEvent(cartCloseIcon, "click", this.#handleCloseCart.bind(this));

    listenEvent(sortBySection, "click", this.#handleOpenSortOptions.bind(this));

    listenEvent(sortByOptions, "click", this.#handleSortProducts.bind(this));
  }
}

const ui = new UI();

export { ui };

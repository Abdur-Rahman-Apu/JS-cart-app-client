import { fetchData } from "../lib/serverRequest/serverRequest";
import hideToast from "../lib/toast/hideToast";
import showToast from "../lib/toast/showToast";
import { baseUrl } from "../utils/config";
import {
  addStyle,
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
    };
  }

  #handleBodyClicked(e) {
    const { sortByOptions } = this.#loadSelector();
    const isSortSection = e.target.dataset.section === "sort";

    if (!isSortSection) {
      addStyle(sortByOptions, { display: "none" });
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
    const { sortByOptions } = this.#loadSelector();
    addStyle(sortByOptions, { display: "block" });
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

  async #handleDisplayInitialProducts() {
    try {
      const data = await fetchData(`${baseUrl}/categories?_embed=products`);
      console.log(data);
    } catch (err) {
      console.log(err);
      this.#hideLoading();
      this.#hideProductSection();
      this.#displayToast({ action: "failure", msg: "Failed to fetch data" });
      this.#displayEmptyProduct();
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
  }
}

const ui = new UI();

export { ui };

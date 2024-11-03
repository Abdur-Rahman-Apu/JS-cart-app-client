import productCard from "../lib/product/productCard";
import { fetchData } from "../lib/serverRequest/serverRequest";
import hideToast from "../lib/toast/hideToast";
import showToast from "../lib/toast/showToast";
import { data } from "../productStore/ProductStore";
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
    const categorySidebar = selectElm(".category-sidebar");
    const searchInput = selectElm("#search");
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
      searchInput,
      categorySidebar,
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

    productContainer.innerHTML = productsHtml;
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

  #filteredSearchProducts(searchValue) {
    const allProducts = data.displayProducts;

    return allProducts.filter((product) =>
      product.name.toLowerCase().includes(searchValue)
    );
  }

  #displaySearchProductsIntoUI(products) {
    if (products.length) {
      this.#showProducts(products);
    } else {
      this.#showProductEmptySection({ toastMsg: "No products found" });
    }
  }

  #handleSearchProduct(e) {
    const { productContainer, noProductSection } = this.#loadSelector();
    console.log("change value");
    const searchValue = e.target.value;

    if (searchValue) {
      addStyle(productContainer, { display: "grid" });
      addStyle(noProductSection, { display: "none" });
      const filteredProducts = this.#filteredSearchProducts(
        searchValue?.toLowerCase()
      );

      this.#displaySearchProductsIntoUI(filteredProducts);
    } else {
      this.#displayProductsIntoTheUI();
    }
  }

  #handleCategoryQueryParams({ newQueryValue, action }) {
    // const urlSearchParams = new URLSearchParams();

    let url = new URL(window.location.href);

    console.log(url);

    // console.log(urlSearchParams.get("categories"));

    const existingParams = url.searchParams.has("query");

    console.log(existingParams);

    let searchParams;

    if (!existingParams && action === "add") {
      searchParams = `categories?query=${newQueryValue}`;
      window.history.replaceState(null, document.title, searchParams);
    }

    if (existingParams) {
      const oldQueryValue = url.searchParams.get("query");
      if (action === "add") {
        url.searchParams.set("query", oldQueryValue + "-" + newQueryValue);
      }
      if (action === "delete") {
        console.log("delete");
        console.log(oldQueryValue);
        const allQueries = oldQueryValue.split("-");
        console.log(allQueries);
        console.log(newQueryValue);
        const newQueryValues = allQueries.filter(
          (query) => query !== newQueryValue
        );
        console.log(newQueryValues, "new query value");

        if (!newQueryValues.length) {
          console.log("came here");
          url.searchParams.delete("query");
          url.pathname = "";

          console.log(url);
        }

        if (Array.isArray(newQueryValues) && newQueryValues.length) {
          url.searchParams.set("query", newQueryValues.join("-"));
        } else if (!Array.isArray(newQueryValues) && newQueryValues.length) {
          url.searchParams.set("query", newQueryValues);
        }
      }

      history.pushState({}, "", url.href);
    }
  }

  #handleCategoryCheckboxClicked(e) {
    console.dir(e.target);
    console.log(e.target.type);
    if (e.target.type === "checkbox") {
      console.log(e.target.value);
      console.log(e.target.checked);
      const categoryName = e.target.value;

      if (e.target.checked) {
        this.#handleCategoryQueryParams({
          newQueryValue: categoryName,
          action: "add",
        });
      }
      if (!e.target.checked) {
        this.#handleCategoryQueryParams({
          newQueryValue: categoryName,
          action: "delete",
        });
      }
    }
  }

  #handleCategoryMenus(e) {
    console.log(e.target.tagName);

    const tagName = e.target.tagName.toLowerCase();
    let category;
    let pTag;
    if (tagName === "div") {
      pTag = e.target.children[1];
      pTag.dataset.add = true;
      category = e.target.children[1].innerText;
      console.log(category);
    }

    if (tagName === "p") {
      pTag = e.target;
      category = e.target.innerText;
      console.log(category);
    }

    if (tagName === "img") {
      pTag = e.target.nextElementSibling;
      category = e.target.nextElementSibling.innerText;
      console.log(category);
    }

    const isExist = pTag.dataset.add;

    console.log(isExist, "in params exist");

    if (isExist === "true") {
      this.#handleCategoryQueryParams({
        newQueryValue: category,
        action: "delete",
      });
      pTag.dataset.add = false;
    } else {
      this.#handleCategoryQueryParams({
        newQueryValue: category,
        action: "add",
      });
      pTag.dataset.add = true;
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
      searchInput,
      categorySidebar,
      categoriesList,
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

    console.log(categoriesList);
    listenEvent(categoriesList, "click", this.#handleCategoryMenus.bind(this));

    listenEvent(
      categorySidebar,
      "click",
      this.#handleCategoryCheckboxClicked.bind(this)
    );

    listenEvent(searchInput, "keyup", this.#handleSearchProduct.bind(this));

    listenEvent(cartContainer, "click", this.#handleOpenCart.bind(this));

    listenEvent(cartCloseIcon, "click", this.#handleCloseCart.bind(this));

    listenEvent(sortBySection, "click", this.#handleOpenSortOptions.bind(this));

    listenEvent(sortByOptions, "click", this.#handleSortProducts.bind(this));
  }
}

const ui = new UI();

export { ui };

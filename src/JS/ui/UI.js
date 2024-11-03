import { cart } from "../cart/Cart";
import productCard from "../lib/product/productCard";
import { fetchData } from "../lib/serverRequest/serverRequest";
import hideToast from "../lib/toast/hideToast";
import showToast from "../lib/toast/showToast";
import { data } from "../productStore/ProductStore";
import { storage } from "../storage/Storage";
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
    const cartCount = selectElm(".cart-count");
    const cartCloseIcon = selectElm(".close-icon");
    const categoriesMenu = selectElm(".categories");
    const categoriesList = selectElm(".categories-list");
    const categorySidebar = selectElm(".category-sidebar");
    const shoesCheckBox = selectElm("#shoes");
    const clothesCheckBox = selectElm("#clothes");
    const electronicsCheckBox = selectElm("#electronics");
    const furnitureCheckBox = selectElm("#furniture");
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
      shoesCheckBox,
      clothesCheckBox,
      electronicsCheckBox,
      furnitureCheckBox,
      cartCount,
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

  #getCategoryQueryParams() {
    const url = new URL(window.location.href);
    return url.searchParams.get("query");
  }

  #handlePreviousCartData() {
    const previousCartData = storage.getFromTheStorage();

    console.log(previousCartData, "previous cart data");

    if (previousCartData?.length) {
      const { cartCount } = this.#loadSelector();
      cart.cartData = previousCartData;

      cartCount.innerText = cart.cartData.length;
    }
  }

  async #handleDisplayInitialProducts() {
    try {
      const receiveData = await fetchData(
        `${baseUrl}/categories?_embed=products`
      );
      console.log(receiveData);

      this.#handlePreviousCartData();

      if (receiveData?.length) {
        data.allProducts = receiveData;

        const categoriesInTheUrl = this.#getCategoryQueryParams()?.split("-");

        this.#hideLoading();

        if (categoriesInTheUrl && categoriesInTheUrl?.length) {
          categoriesInTheUrl.forEach((category) =>
            this.#toggleCategoryChecked({ category, action: "add" })
          );
          this.#DisplayCategoryWiseProducts(categoriesInTheUrl);
        } else {
          data.displayProducts = this.#getAllProducts(receiveData);
          this.#displayProductsIntoTheUI();
        }
      } else {
        this.#showProductEmptySection({ toastMsg: "No products found" });
      }
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
    console.log(targetedWay, "targeted way");
    const sortWay =
      targetedWay.toLowerCase() === "low to high"
        ? "asc"
        : targetedWay.toLowerCase() === "high to low"
        ? "desc"
        : null;

    console.log(sortWay, "sortway");
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

  #DisplayCategoryWiseProducts(categoryNames) {
    console.log(categoryNames, "category names");
    const allProducts = data.allProducts;

    console.log(allProducts, "all products");

    const filteredCategories = allProducts.filter((category) =>
      categoryNames.includes(category.name)
    );

    console.log(filteredCategories, "filtered categories");
    let products = [];
    filteredCategories.forEach(
      (item) => (products = [...products, ...item.products])
    );

    console.log(products, "products");

    data.displayProducts = products;

    this.#displayProductsIntoTheUI();
  }

  #handleDisplayCategoryWiseProduct({ category, type }) {
    if (type === "single") {
      this.#DisplayCategoryWiseProducts([category]);
    } else {
      this.#DisplayCategoryWiseProducts(category.split("-"));
    }
  }

  #handleCategoryQueryParams({ newQueryValue, action }) {
    const { searchInput } = this.#loadSelector();

    searchInput.value = "";
    // const urlSearchParams = new URLSearchParams();

    const url = new URL(window.location.href);

    console.log(url);

    // console.log(urlSearchParams.get("categories"));

    const existingParams = url.searchParams.has("query");

    console.log(existingParams);

    let searchParams;

    if (!existingParams && action === "add") {
      searchParams = `categories?query=${newQueryValue}`;
      window.history.replaceState(null, document.title, searchParams);

      this.#handleDisplayCategoryWiseProduct({
        category: newQueryValue,
        type: "single",
      });
    }

    if (existingParams) {
      const oldQueryValue = url.searchParams.get("query");
      if (action === "add") {
        url.searchParams.set("query", oldQueryValue + "-" + newQueryValue);

        this.#handleDisplayCategoryWiseProduct({
          category: oldQueryValue + "-" + newQueryValue,
          type: "multi",
        });
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
          data.displayProducts = this.#getAllProducts(data.allProducts);
          this.#displayProductsIntoTheUI();
        }

        if (Array.isArray(newQueryValues) && newQueryValues.length) {
          url.searchParams.set("query", newQueryValues.join("-"));
          this.#DisplayCategoryWiseProducts(newQueryValues);
        } else if (!Array.isArray(newQueryValues) && newQueryValues.length) {
          url.searchParams.set("query", newQueryValues);
          this.#DisplayCategoryWiseProducts([newQueryValues]);
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

  #toggleCategoryChecked({ category, action }) {
    const {
      clothesCheckBox,
      shoesCheckBox,
      furnitureCheckBox,
      electronicsCheckBox,
    } = this.#loadSelector();

    switch (category) {
      case "Clothes":
        action === "add"
          ? (clothesCheckBox.checked = true)
          : (clothesCheckBox.checked = false);
        break;
      case "Shoes":
        action === "add"
          ? (shoesCheckBox.checked = true)
          : (shoesCheckBox.checked = false);
        break;
      case "Electronics":
        action === "add"
          ? (electronicsCheckBox.checked = true)
          : (electronicsCheckBox.checked = false);
        break;
      case "Furniture":
        action === "add"
          ? (furnitureCheckBox.checked = true)
          : (furnitureCheckBox.checked = false);
        break;
    }
  }

  #checkCategoryExistenceInURL(category) {
    const queryValues = this.#getCategoryQueryParams();

    return queryValues
      ? queryValues?.split("-")?.includes(category)
      : queryValues;
  }

  #handleCategoryMenus(e) {
    console.log(e.target.tagName);

    const tagName = e.target.tagName.toLowerCase();
    let category;

    if (tagName === "div") {
      const pTag = e.target.children[1];
      category = pTag.innerText;
      console.log(category);
    }

    if (tagName === "p") {
      const pTag = e.target;
      category = pTag.innerText;
      console.log(category);
    }

    if (tagName === "img") {
      const pTag = e.target.nextElementSibling;
      category = pTag.innerText;
      console.log(category);
    }

    const isExist = this.#checkCategoryExistenceInURL(category);

    console.log(isExist, "in params exist");

    if (isExist) {
      this.#handleCategoryQueryParams({
        newQueryValue: category,
        action: "delete",
      });
      //   pTag.dataset.add = false;

      this.#toggleCategoryChecked({ category, action: "delete" });
    } else {
      this.#handleCategoryQueryParams({
        newQueryValue: category,
        action: "add",
      });
      //   pTag.dataset.add = true;

      this.#toggleCategoryChecked({ category, action: "add" });
    }
  }

  #handleAddToCart(e) {
    console.log("clicked");
    console.log(e.target);

    if (e.target.tagName.toLowerCase() === "button") {
      const { cartCount } = this.#loadSelector();
      console.log("here");
      const productId = e.target.dataset.id;
      cart.cartData = productId;
      cartCount.innerText = cart.cartData.length;
      storage.storeIntoStorage(cart.cartData);
      e.target.setAttribute("disabled", "disabled");
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
      productContainer,
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

    listenEvent(productContainer, "click", this.#handleAddToCart.bind(this));
  }
}

const ui = new UI();

export { ui };

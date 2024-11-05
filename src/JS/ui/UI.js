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
  // select html tags
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
    const cartEmptyMsgSection = selectElm(".cart-empty-message-section");
    const cartModalContainer = selectElm(".cart-section");
    const cartProductContainer = selectElm(".cart-products");

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
      cartEmptyMsgSection,
      cartModalContainer,
      cartProductContainer,
    };
  }

  // show toast message
  #displayToast(data) {
    showToast(data);

    // hide toast after 2 seconds
    setTimeout(() => {
      hideToast();
    }, 2000);
  }

  /* 
  below methods are used to display products into the UI
  */

  // get only products into an array
  #getAllProducts(receiveData) {
    let products = [];

    receiveData.forEach((item) => {
      products = [...products, ...item?.products];
    });

    return products;
  }

  // show products into the UI
  #showProducts(products) {
    const { productContainer } = this.#loadSelector();

    const productsHtml = products
      .map((product) => productCard(product))
      .join(" ");

    productContainer.innerHTML = productsHtml;
  }

  // display products into the UI
  #displayProductsIntoTheUI() {
    const products = data.displayProducts;
    this.#showProducts(products);
  }

  /* 
  below methods are used to hide products section and display empty product section
  */

  #displayEmptyProduct() {
    const { noProductSection } = this.#loadSelector();
    addStyle(noProductSection, { display: "flex" });
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

  /* 
  below methods are used to handle category menus
*/

  #handleOpenCategories() {
    const { categoriesList } = this.#loadSelector();

    // category arrow icon changed
    const arrowIcon = selectElm(".categories i");
    arrowIcon.classList.remove("fa-chevron-down");
    arrowIcon.classList.add("fa-chevron-up");

    // open the categories list
    addStyle(categoriesList, {
      height: "auto",
      overflow: "auto",
      padding: "8px",
    });
  }

  #handleCloseCategories() {
    const { categoriesList } = this.#loadSelector();

    // change arrow icon
    const arrowIcon = selectElm(".categories i");
    arrowIcon.classList.add("fa-chevron-down");
    arrowIcon.classList.remove("fa-chevron-up");

    // hide categories menu
    addStyle(categoriesList, {
      height: "0",
      overflow: "hidden",
      padding: "0",
    });
  }

  // display category wise products
  #displayCategoryWiseProducts(categoryNames) {
    const allProducts = data.allProducts;

    // get selected categories details
    const filteredCategories = allProducts.filter((category) =>
      categoryNames.includes(category.name)
    );

    // get products from the filtered categories data
    let products = [];
    filteredCategories.forEach(
      (item) => (products = [...products, ...item.products])
    );

    // store into the state
    data.displayProducts = products;

    // display into the ui
    this.#displayProductsIntoTheUI();
  }

  #handleDisplayCategoryWiseProduct({ category, type }) {
    // type single means only single value is passed as string
    if (type === "single") {
      this.#displayCategoryWiseProducts([category]);
    } else {
      this.#displayCategoryWiseProducts(category.split("-"));
    }
  }

  // toggle checkbox state
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

  // handle add or remove category from the URL
  #handleCategoryQueryParams({ newQueryValue, action }) {
    // remove the value from the search input
    const { searchInput } = this.#loadSelector();

    searchInput.value = "";

    // check is query param is available in the url or not.
    const url = new URL(window.location.href);

    const existingParams = url.searchParams.has("query");

    let searchParams;

    if (!existingParams && action === "add") {
      // no query param and add category into the url
      searchParams = `categories?query=${newQueryValue}`;

      // replace the url
      window.history.replaceState(null, document.title, searchParams);

      // display category wise products
      this.#handleDisplayCategoryWiseProduct({
        category: newQueryValue,
        type: "single",
      });
    }

    if (existingParams) {
      // query param is exist into the URL

      // get the query param value
      const oldQueryValue = url.searchParams.get("query");

      if (action === "add") {
        // add search param into the URL
        url.searchParams.set("query", oldQueryValue + "-" + newQueryValue);

        // now display category wise products
        this.#handleDisplayCategoryWiseProduct({
          category: oldQueryValue + "-" + newQueryValue,
          type: "multi",
        });
      }

      if (action === "delete") {
        // delete category from the query param
        const allQueries = oldQueryValue.split("-");

        // new categories array
        const newQueryValues = allQueries.filter(
          (query) => query !== newQueryValue
        );

        if (!newQueryValues.length) {
          // new categories array is empty
          url.searchParams.delete("query");
          url.pathname = "";

          // display all products
          data.displayProducts = this.#getAllProducts(data.allProducts);
          this.#displayProductsIntoTheUI();
        }

        /*
         new categories array is not empty. it can be an array or a string for single value
         */
        if (Array.isArray(newQueryValues) && newQueryValues.length) {
          // array and array is not empty
          url.searchParams.set("query", newQueryValues.join("-"));
          this.#displayCategoryWiseProducts(newQueryValues);
        } else if (!Array.isArray(newQueryValues) && newQueryValues.length) {
          // not an array and has string value
          url.searchParams.set("query", newQueryValues);
          this.#displayCategoryWiseProducts([newQueryValues]);
        }
      }

      // update the url
      history.pushState({}, "", url.href);
    }
  }

  // get category query param from the URL
  #getCategoryQueryParams() {
    const url = new URL(window.location.href);
    return url.searchParams.get("query");
  }

  // check category is exist into the URL or not
  #checkCategoryExistenceInURL(category) {
    const queryValues = this.#getCategoryQueryParams();

    // query value will be find as Clothes-Shoes
    return queryValues
      ? queryValues?.split("-")?.includes(category)
      : queryValues;
  }

  // handle category menu item click event
  #handleCategoryMenus(e) {
    // get the tag name
    const tagName = e.target.tagName.toLowerCase();

    let category;

    if (tagName === "div") {
      const pTag = e.target.children[1];
      category = pTag.innerText;
    }

    if (tagName === "p") {
      const pTag = e.target;
      category = pTag.innerText;
    }

    if (tagName === "img") {
      const pTag = e.target.nextElementSibling;
      category = pTag.innerText;
    }

    const isExist = this.#checkCategoryExistenceInURL(category);

    if (isExist) {
      // remove the category from the url
      this.#handleCategoryQueryParams({
        newQueryValue: category,
        action: "delete",
      });

      // remove the checked state
      this.#toggleCategoryChecked({ category, action: "delete" });
    } else {
      // add category into the URL
      this.#handleCategoryQueryParams({
        newQueryValue: category,
        action: "add",
      });

      // checked the checkbox of the category
      this.#toggleCategoryChecked({ category, action: "add" });
    }
  }

  /*
  Below methods are used to handle category checkboxes state
  */

  // handle click event on category checkbox
  #handleCategoryCheckboxClicked(e) {
    if (e.target.type === "checkbox") {
      const categoryName = e.target.value;

      // handle checked state
      if (e.target.checked) {
        this.#handleCategoryQueryParams({
          newQueryValue: categoryName,
          action: "add",
        });
      }

      // handle unchecked state
      if (!e.target.checked) {
        this.#handleCategoryQueryParams({
          newQueryValue: categoryName,
          action: "delete",
        });
      }
    }
  }

  /*
  Below methods are used to handle search product items
  */

  // filter search products based on the search value which is given by the user
  #filteredSearchProducts(searchValue) {
    const allProducts = data.displayProducts;

    return allProducts.filter((product) =>
      product.name.toLowerCase().includes(searchValue)
    );
  }

  // display search products
  #displaySearchProductsIntoUI(products) {
    if (products.length) {
      // products available
      this.#showProducts(products);
    } else {
      // no products found
      this.#showProductEmptySection({ toastMsg: "No products found" });
    }
  }

  // handler of searching product
  #handleSearchProduct(e) {
    const searchValue = e.target.value;

    if (searchValue) {
      // if search value is present

      // display product section and hide no product section
      const { productContainer, noProductSection } = this.#loadSelector();
      addStyle(productContainer, { display: "grid" });
      addStyle(noProductSection, { display: "none" });

      // filter products based on the search value
      const filteredProducts = this.#filteredSearchProducts(
        searchValue?.toLowerCase()
      );

      // display search products
      this.#displaySearchProductsIntoUI(filteredProducts);
    } else {
      // is search value is empty then display all products
      this.#displayProductsIntoTheUI();
    }
  }

  /*
  Below methods are used for sorting products based on the price 
  */

  // handle open and close sort options
  #handleOpenSortOptions() {
    const { sortByOptions, sortBySection } = this.#loadSelector();

    const arrowIcon = selectElm(".sort-by-section i");

    if (sortBySection.dataset.visible === "true") {
      // hide the sort options
      sortBySection.dataset.visible = false;
      addStyle(sortByOptions, { display: "none" });
      arrowIcon.classList.remove("fa-caret-up");
      arrowIcon.classList.add("fa-caret-down");
    } else {
      // display the sort options
      sortBySection.dataset.visible = true;
      addStyle(sortByOptions, { display: "block" });
      arrowIcon.classList.add("fa-caret-up");
      arrowIcon.classList.remove("fa-caret-down");
    }
  }

  // hide sort option when user clicked on body
  #handleBodyClicked(e) {
    const { sortByOptions, sortBySection } = this.#loadSelector();

    // check sort section is clicked or not
    const isSortSection = e.target.dataset.section === "sort";

    if (!isSortSection) {
      // if sort section is not clicked then hide the sort section
      addStyle(sortByOptions, { display: "none" });

      // sort options are hide and keep a track value
      sortBySection.dataset.visible = false;

      // add arrow down icon and remove arrow up icon
      const arrowIcon = selectElm(".sort-by-section i");
      arrowIcon.classList.remove("fa-caret-up");
      arrowIcon.classList.add("fa-caret-down");
    }
  }

  // sort products -> low price to high
  #sortProductsInAsc() {
    const products = data.displayProducts;
    products.sort((a, b) => a.price - b.price);

    // update data state
    data.displayProducts = products;
  }

  // sort products -> high price to low
  #sortProductsInDesc() {
    const products = data.displayProducts;
    products.sort((a, b) => b.price - a.price);

    // update data state
    data.displayProducts = products;
  }

  // handle sort products based on the price
  #handleSortProducts(e) {
    const { sortByName } = this.#loadSelector();

    const targetedWay = e.target.innerText;

    // find the sort way asc or desc
    const sortWay =
      targetedWay.toLowerCase() === "low to high"
        ? "asc"
        : targetedWay.toLowerCase() === "high to low"
        ? "desc"
        : null;

    // sort in ascending order
    if (sortWay === "asc") {
      this.#sortProductsInAsc();
      sortByName.innerText = targetedWay;
    }

    // sort in descending order
    if (sortWay === "desc") {
      this.#sortProductsInDesc();
      sortByName.innerText = targetedWay;
    }

    // display products
    this.#displayProductsIntoTheUI();
  }

  /*
  Below methods are used to handle cart related events 
  */

  // cart product card HTML
  #cartProductCardHTML(product) {
    // get product data from the cart state
    const cartProductInfo = cart.cartData.find(
      (item) => item.id === product.id
    );

    // Increment button disabled condition: if product amount is 1

    return `<div class="cart-product">
      <div class="cart-product-info">
        <div class="cart-product-img">
          <img src="${product.pic}" alt="" />
        </div>
        <div class="cart-product-description">
          <p class="cart-product-name">${product.name}</p>
          <div class="rating">
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star"></i>
            <i class="fas fa-star-half-alt"></i>
          </div>
          <p class="cart-product-price">
            $<span class="price">${product.price}</span>
          </p>
        </div>
      </div>
      <div class="cart-product-action">
        <div class="product-quantity">
          <button class="decrement" data-id=${
            product.id
          } data-action="decrement" ${
      cartProductInfo?.count === 1 ? `disabled = "disabled"` : ""
    }>-</button>
          <div class="product-quantity-amount product-quantity-${product.id}">${
      cartProductInfo?.count
    }</div>
          <button class="increment" data-id=${
            product.id
          } data-action="increment">+</button>
        </div>

        <button class="delete-product" data-id=${
          product.id
        } data-action="delete">
          <i class="fas fa-trash-alt" data-id=${
            product.id
          } data-action="delete"></i>
        </button>
      </div>
    </div>`;
  }

  // display cart products into the UI
  #showCartProductsInUI(cartProducts) {
    const { cartProductContainer } = this.#loadSelector();

    const productHTML = cartProducts
      .map((product) => this.#cartProductCardHTML(product))
      .join("");

    cartProductContainer.innerHTML = productHTML;
  }

  // display estimated delivery time
  #displayDeliveryTime() {
    const deliveryTimeElm = selectElm(".delivery-time");
    const date = new Date();
    const utcDateFormat = date.toUTCString();

    // desired format is Mon, 04 Nov, 2024
    const desiredFormat = utcDateFormat.slice(0, 16);

    // set the delivery time into the UI
    deliveryTimeElm.innerText = desiredFormat;
  }

  // get cart product detail information
  #getCartProductsDetails() {
    const allProducts = this.#getAllProducts(data.allProducts);
    const cartData = cart.cartData;

    // filtered cart products with details
    const filteredCartProducts = allProducts.filter((product) => {
      const findCartProduct = cartData.find(
        (cartItem) => cartItem.id === product.id
      );

      if (findCartProduct) return product;
    });

    return filteredCartProducts;
  }

  // calculate cost
  #calculateAndDisplayCartProductPrice() {
    const subTotalAmount = selectElm(".sub-total-amount");
    const totalAmount = selectElm(".total-amount");

    let subTotalCost = 0;
    let totalCost = 0;

    // get cart products details
    const cartProducts = this.#getCartProductsDetails();

    // calculate subtotal cost
    cartProducts.forEach((product) => {
      const cartProductDetails = cart.cartData.find(
        (item) => product.id === item.id
      );
      const productAmount = cartProductDetails.count;

      subTotalCost =
        subTotalCost + Number(product.price) * Number(productAmount);
    });

    totalCost = subTotalCost + 35.52;

    // set into the UI
    subTotalAmount.innerText = subTotalCost;
    totalAmount.innerText = totalCost;
  }

  // display cart product
  #displayCartProduct() {
    const { cartEmptyMsgSection, cartModalContainer } = this.#loadSelector();

    // get cart data from the cart state
    const cartData = cart.cartData;

    if (cartData.length) {
      // if cart has products then display the cart product section
      addStyle(cartEmptyMsgSection, { display: "none" });
      addStyle(cartModalContainer, { display: "flex" });

      //  get cart products details
      const cartProducts = this.#getCartProductsDetails();

      // display the products into the ui
      this.#showCartProductsInUI(cartProducts);

      // display the order summary
      this.#calculateAndDisplayCartProductPrice();

      // display the estimated delivery time
      this.#displayDeliveryTime();
    } else {
      // no products into the cart
      // hide the cart products section and show the cart empty message section
      addStyle(cartModalContainer, { display: "none" });
      addStyle(cartEmptyMsgSection, { display: "flex" });
    }
  }

  // handle open cart modal
  #handleOpenCart() {
    const { body, modalContainer } = this.#loadSelector();

    // style body tag
    addStyle(body, {
      height: "100vh",
      overflow: "hidden",
      backgroundColor: "rgba(157, 153, 153, 0.427)",
    });

    // open the cart modal
    addStyle(modalContainer, {
      display: "flex",
      animation: "showModal 1s ease-out",
    });

    // display cart products
    this.#displayCartProduct();
  }

  // handle close cart modal
  #handleCloseCart() {
    const { body, modalContainer } = this.#loadSelector();

    // hide the cart modal
    addStyle(modalContainer, {
      display: "none",
      animation: "closeModal 1s ease-in",
    });

    // style the body tag
    setTimeout(() => {
      addStyle(body, {
        height: "auto",
        overflow: "auto",
        backgroundColor: "#fff",
      });
    }, 1100);
  }

  // add item into the cart
  #handleAddToCart(e) {
    if (e.target.tagName.toLowerCase() === "button") {
      // disabled the button
      e.target.setAttribute("disabled", "disabled");

      const { cartCount } = this.#loadSelector();

      // added item into the cart
      const productId = e.target.dataset.id;
      cart.cartData = { id: productId, count: 1 };
      cartCount.innerText = cart.cartData.length;

      // update the local storage data
      storage.storeIntoStorage(cart.cartData);

      // display the success toast
      this.#displayToast({
        msg: "Added to cart successfully",
        action: "success",
      });
    }
  }

  /* 
   Below methods are used to handle cart product actions like increment,decrement and delete cart item
  */

  #incrementOrDecrementCartProductItem({ productId, action }) {
    // html tag of displaying cart item amount
    const itemAmount = selectElm(`.product-quantity-${productId}`);

    // get new cart items after completing the action
    const newCartData = cart.cartData.map((cartProduct) => {
      if (cartProduct.id === productId) {
        // product found

        // if action is increment, then increment the amount otherwise decrement the amount
        action === "increment" ? cartProduct.count++ : cartProduct.count--;

        // set the value into the ui
        itemAmount.innerText = cartProduct.count;

        // disabled the decrement button if product amount is less than 2
        if (cartProduct.count < 2) {
          itemAmount.previousElementSibling.setAttribute(
            "disabled",
            "disabled"
          );
        } else {
          // remove the disable attribute if product amount is greater than 1
          itemAmount.previousElementSibling.removeAttribute("disabled");
        }
      }

      // return the cart product
      return cartProduct;
    });

    // update the cart state
    cart.cartDataEmpty = [];
    cart.cartData = newCartData;

    // update the storage
    storage.storeIntoStorage(cart.cartData);

    // calculate cost and display cart product
    this.#calculateAndDisplayCartProductPrice();
  }

  // delete cart product from the cart state
  #deleteCartProduct(productId) {
    const { cartCount } = this.#loadSelector();

    const addToCartBtn = selectElm(`.add-to-cart-btn-${+productId}`);

    // remove the cart item from the cart state
    const filterCartData = cart.cartData.filter(
      (item) => item.id !== productId
    );

    // update the cart state
    cart.cartDataEmpty = [];
    cart.cartData = filterCartData;

    // update the storage
    storage.storeIntoStorage(cart.cartData);

    // set the new cart amount
    cartCount.innerText = cart.cartData.length;

    // remove the disabled attribute from the cart button
    addToCartBtn.removeAttribute("disabled");

    // display a toast
    this.#displayToast({ msg: "Deleted successfully", action: "failure" });

    // display cart product
    this.#displayCartProduct();
  }

  // handler of handling cart item action
  #handleCartProductAction(e) {
    if (
      e.target.tagName.toLowerCase() === "button" ||
      e.target.tagName.toLowerCase() === "i"
    ) {
      // product id
      const productId = e.target.dataset.id;

      // action type
      const action = e.target.dataset.action;

      if (action === "increment" || action === "decrement") {
        // handle increment and decrement action
        this.#incrementOrDecrementCartProductItem({ productId, action });
      }

      if (action === "delete") {
        // handle delete action

        this.#deleteCartProduct(productId);
      }
    }
  }

  /*
  Below methods are used to handle initial state of the application or refresh the website 
  */

  // Remove loading state
  #hideLoading() {
    const { loadingProductCards } = this.#loadSelector();

    // hide all loading product card from the UI
    loadingProductCards.forEach((loadingProductCard) =>
      addStyle(loadingProductCard, { display: "none" })
    );
  }

  // handle previous cart data
  #handlePreviousCartData() {
    // get previousCartData from the local storage
    const previousCartData = storage.getFromTheStorage();

    if (previousCartData?.length) {
      // if previous cart data exist
      cart.cartData = previousCartData;

      // total cart count update into the UI
      const { cartCount } = this.#loadSelector();
      cartCount.innerText = cart.cartData.length;
    }
  }

  // This handler is used for handling initial state of the application
  async #handleDisplayInitialProducts() {
    try {
      // get data from the server
      const receiveData = await fetchData(
        `${baseUrl}/categories?_embed=products`
      );

      // check previous cart data
      this.#handlePreviousCartData();

      if (receiveData?.length) {
        // Products received from the server
        this.#hideLoading();

        // store data
        data.allProducts = receiveData;

        /*
         check query params present or not in the url.
         Only one query params are available which name is query and format is
         query=Clothes-shoes
         Split the query value on the basis of hyphen (-) and store categories separately in the array
        */
        const categoriesInTheUrl = this.#getCategoryQueryParams()?.split("-");

        if (categoriesInTheUrl && categoriesInTheUrl?.length) {
          // query search param is present

          // sidebar categories checkbox need to be checked which categories are present
          categoriesInTheUrl.forEach((category) =>
            this.#toggleCategoryChecked({ category, action: "add" })
          );

          // display category wise products
          this.#displayCategoryWiseProducts(categoriesInTheUrl);
        } else {
          // query search param is not found
          data.displayProducts = this.#getAllProducts(receiveData);

          // display all products which are received from the server
          this.#displayProductsIntoTheUI();
        }
      } else {
        // No products received from the server
        this.#showProductEmptySection({ toastMsg: "No products found" });
      }
    } catch (err) {
      // Error is handled here
      this.#showProductEmptySection({ toastMsg: "Failed to fetch data" });
      this.#displayToast({ msg: "Failed to fetch product", action: "failure" });
    }
  }

  init() {
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
      cartProductContainer,
    } = this.#loadSelector();

    // Event will be occurred after dom content is loaded
    listenEvent(
      document,
      "DOMContentLoaded",
      this.#handleDisplayInitialProducts.bind(this)
    );

    // handle categories

    // open categories
    listenEvent(
      categoriesMenu,
      "mouseover",
      this.#handleOpenCategories.bind(this)
    );

    // close categories
    listenEvent(
      categoriesMenu,
      "mouseout",
      this.#handleCloseCategories.bind(this)
    );

    // handle click on category menu
    listenEvent(categoriesList, "click", this.#handleCategoryMenus.bind(this));

    // handle click on category checkbox
    listenEvent(
      categorySidebar,
      "click",
      this.#handleCategoryCheckboxClicked.bind(this)
    );

    // handle search product item
    listenEvent(searchInput, "keyup", this.#handleSearchProduct.bind(this));

    // handle sort product related events

    // Sort options hide event is handled when user clicked on the body
    listenEvent(body, "click", this.#handleBodyClicked.bind(this));

    // handle open sort options
    listenEvent(sortBySection, "click", this.#handleOpenSortOptions.bind(this));

    // handle sort product items
    listenEvent(sortByOptions, "click", this.#handleSortProducts.bind(this));

    /* 
    Handle cart related events
    */

    // handle open cart modal
    listenEvent(cartContainer, "click", this.#handleOpenCart.bind(this));

    // handle close cart modal
    listenEvent(cartCloseIcon, "click", this.#handleCloseCart.bind(this));

    // handle add item into the cart
    listenEvent(productContainer, "click", this.#handleAddToCart.bind(this));

    // handle cart products action like increment,decrement and delete cart item
    listenEvent(
      cartProductContainer,
      "click",
      this.#handleCartProductAction.bind(this)
    );
  }
}

const ui = new UI();

export { ui };

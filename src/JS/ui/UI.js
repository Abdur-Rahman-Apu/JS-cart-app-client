import { addStyle, listenEvent, selectElm } from "../utils/dom.";

class UI {
  #loadSelector() {
    const body = selectElm("body");
    const modalContainer = selectElm(".modal-section");
    const cartContainer = selectElm(".cart");
    const cartCloseIcon = selectElm(".close-icon");
    const categoriesMenu = selectElm(".categories");
    const categoriesList = selectElm(".categories-list");

    return {
      body,
      modalContainer,
      cartContainer,
      cartCloseIcon,
      categoriesMenu,
      categoriesList,
    };
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

  init() {
    const { cartContainer, cartCloseIcon, categoriesMenu } =
      this.#loadSelector();

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
  }
}

const ui = new UI();

export { ui };

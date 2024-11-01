import { addStyle, listenEvent, selectElm } from "../utils/dom.";

class UI {
  #loadSelector() {
    const body = selectElm("body");
    const modalContainer = selectElm(".modal-section");
    const cartContainer = selectElm(".cart");
    const cartCloseIcon = selectElm(".close-icon");

    return { body, modalContainer, cartContainer, cartCloseIcon };
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
    const { cartContainer, cartCloseIcon } = this.#loadSelector();

    listenEvent(cartContainer, "click", this.#handleOpenCart.bind(this));

    listenEvent(cartCloseIcon, "click", this.#handleCloseCart.bind(this));
  }
}

const ui = new UI();

export { ui };

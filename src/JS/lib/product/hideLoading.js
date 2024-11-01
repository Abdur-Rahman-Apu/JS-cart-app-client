import { addStyle, selectElm } from "../../utils/dom.";

export default function hideLoading() {
  const product = selectElm(".product-loading");

  addStyle(product, { display: "none" });
}

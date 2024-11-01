import { selectElm } from "../../utils/dom.";

export default function hideToast() {
  const toastContainer = selectElm(".toast-section");
  const toastMsg = selectElm(".toast-message");

  const style = { animation: "hideAnim 2s linear" };

  setTimeout(() => {
    addStyle(toastContainer, style);
  }, 2000);
}

import { addStyle, selectElm } from "../../utils/dom.";

export default function hideToast() {
  const toastContainer = selectElm(".toast-section");
  const toastMsg = selectElm(".toast-message");

  const style = {
    animation: "hideAnim 2s ease-in-out",
    display: "none",
    opacity: 0,
  };

  addStyle(toastContainer, style);
}

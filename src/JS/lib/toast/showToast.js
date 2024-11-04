import { addStyle, selectElm } from "../../utils/dom.";

export default function showToast({ action, msg }) {
  const toastContainer = selectElm(".toast-section");
  const toastMsg = selectElm(".toast-message");
  toastMsg.innerText = msg;

  const style =
    action === "success"
      ? { backgroundColor: "#05c46b", display: "block" }
      : { backgroundColor: "#f53b57", color: "#fff", display: "block" };

  style.animation = "showAnim 2s ease-in-out";

  addStyle(toastContainer, style);
}

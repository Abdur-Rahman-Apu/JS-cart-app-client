import { addStyle } from "../../utils/dom.";

export default function handleOpenCartModal({ event, modalContainer }) {
  addStyle(modalContainer, { display: "flex" });
}

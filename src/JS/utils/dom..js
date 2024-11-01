const selectElm = (className) => document.querySelector(className);

const selectMultiElm = (className) => document.querySelectorAll(className);

const insertAdjHtml = (parent, html) =>
  parent.insertAdjacentHTML("afterbegin", html);

const listenEvent = (elm, event, handler) =>
  elm.addEventListener(event, handler);

const addStyle = (elm, newStyle) => Object.assign(elm.style, newStyle);

export { addStyle, insertAdjHtml, listenEvent, selectElm, selectMultiElm };

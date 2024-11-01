const selectElm = (elm) => document.querySelector(elm);

const insertAdjHtml = (parent, html) =>
  parent.insertAdjacentHTML("afterbegin", html);

const listenEvent = (elm, event, handler) =>
  elm.addEventListener(event, handler);

const addStyle = (elm, newStyle) => Object.assign(elm.style, newStyle);

export { addStyle, insertAdjHtml, listenEvent, selectElm };

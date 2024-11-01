const selectElm = (elm) => document.querySelector(elm);

const insertAdjHtml = (parent, html) =>
  parent.insertAdjacentHTML("afterbegin", html);

export { insertAdjHtml, selectElm };

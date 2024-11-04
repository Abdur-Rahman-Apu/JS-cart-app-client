// select an html element
const selectElm = (className) => document.querySelector(className);

// select multiple html elements
const selectMultiElm = (className) => document.querySelectorAll(className);

// insertAdjacentHTML utility function
const insertAdjHtml = (parent, html) =>
  parent.insertAdjacentHTML("afterbegin", html);

// add event listener utility function
const listenEvent = (elm, event, handler) =>
  elm.addEventListener(event, handler);

// add style into a HTML element
const addStyle = (elm, newStyle) => Object.assign(elm.style, newStyle);

export { addStyle, insertAdjHtml, listenEvent, selectElm, selectMultiElm };

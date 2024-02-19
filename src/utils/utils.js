function $(selector) {
  return document.querySelector(selector);
}

function $$(selector) {
  return document.querySelectorAll(selector);
}

function createElement(tagName, className, content) {
  const div = document.createElement(tagName);

  if (className) {
    div.setAttribute("class", className);
  }

  if (content) {
    div.innerHTML = content;
  }

  return div;
}


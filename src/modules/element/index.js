class Element {
  constructor({
    parentNode = null,
    tag = "div",
    className = "",
    content = "",
    attributes = {},
  }) {
    const node = document.createElement(tag);
    node.classList.add(className);
    node.innerHTML = content;
    Object.entries(attributes).forEach(([prop, value]) =>
      node.setAttribute(prop, value)
    );
    if (parentNode) parentNode.append(node);
    this.node = node;
  }
}

export default Element;

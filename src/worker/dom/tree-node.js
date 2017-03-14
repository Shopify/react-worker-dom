import guid from 'common/guid';
import { OPS as _ } from 'common/constants';
import { DOCUMENT_FRAGMENT_NODE } from 'common/nodeType';

export default class TreeNode {
  constructor() {
    this._guid = guid();
    this.parentNode = null;
    this.children = [];
  }

  appendChild(node) {
    this.insertBefore(node, null);
  }

  insertBefore(node, ref) {
    const insertIndex = this.children.indexOf(ref);
    let nodesToInsert = [node];

    if (node.nodeType === DOCUMENT_FRAGMENT_NODE) {
      nodesToInsert = node.children;
      node.children = [];
    }

    this.children.splice(insertIndex < 0 ? this.children.length : insertIndex, 0, ...nodesToInsert);
    nodesToInsert.forEach(node => { node.parentNode = this; });

    return node;
  }

  removeChild(node) {
    const childIndex = this.children.indexOf(node);

    if (childIndex >= 0) {
      return this.children.splice(childIndex, 1)[0];
    }
  }

  replaceChild(newNode, node) {
    const index = this.children.indexOf(node);

    newNode.parentNode = this;

    this.children[index] = newNode;

    return node;
  }

  get firstChild() {
    return this.children[0];
  }

  get lastChild() {
    return this.children[this.children.length - 1];
  }

  get nextSibling() {
    if (!this.parentNode) {
      throw new Error('No parent node, so cannot have siblings');
    }

    const children = this.parentNode.children;

    return children[children.indexOf(this) + 1];
  }
}

import { OPS as _ } from 'common/constants';
import { ELEMENT_NODE } from 'common/nodeType';
import TreeNode from './tree-node';
import Style from './Style';
import ClassList from './ClassList';

const ELEMENT_PROPERTIES = [
  'accept', 'align', 'alt', 'autocomplete', 'autofocus', 'checked', 'disabled',
  'form', 'formaction', 'formenctype', 'formmethod', 'formnovalidate',
  'formtarget', 'height', 'list', 'max', 'maxlength', 'min', 'multiple',
  'name', 'pattern', 'placeholder', 'readonly', 'required', 'size', 'src',
  'step', 'type', 'value', 'width'
];

export default class DomElement extends TreeNode {
  constructor(type, bridge, eventHandler, nodeList) {
    super(bridge, eventHandler, nodeList);

    this._bridge = bridge;
    this._eventHandler = eventHandler;
    this._nodeList = nodeList;

    this.nodeType = ELEMENT_NODE;
    this.nodeName = type;
    this.attributes = {};

    this._bridge.send(_.createDOMElement, this._guid, [type]);
    this._nodeList.set(this._guid, this);

    this.style = Style((key, val) => this._bridge.send(_.setStyle, this._guid, [key, val]));
    this.classList = new ClassList(this);
  }

  // Getters & setters
  set textContent(val) {
    this._textContent = val;
    this._bridge.send(_.setTextContent, this._guid, [val]);
  }

  get textContent() {
    return this._textContent;
  }

  set className(value) {
    this.setAttribute('className', value);
  }

  get className() {
    return this.attributes['className'];
  }

  set innerHTML(val) {
    this._innerHTML = val;
    this._bridge.send(_.innerHTML, this._guid, [val]);
  }

  get innerHTML() {
    return this._innerHTML;
  }

  // TreeNode instance method wrappers
  insertBefore(node, ref) {
    super.insertBefore(node, ref);
    this._bridge.send(_.insertBefore, this._guid, [node, ref]);
    return node;
  }

  removeChild(node) {
    const removedNode = super.removeChild(node);

    if (removedNode) {
      this._bridge.send(_.removeChild, this._guid, [node]);
    }
  }

  replaceChild(newNode, node) {
    super.replaceChild(newNode, node);
    this._bridge.send(_.replaceChild, this._guid, [newNode, node]);
    return node;
  }

  // Instance methods
  setAttribute(key, value) {
    this.attributes[key] = value;
    this._bridge.send(_.setAttribute, this._guid, [key, value]);
  }

  removeAttribute(key) {
    delete this.attributes[key];
    this._bridge.send(_.removeAttribute, this._guid, [key]);
  }

  addEventListener(eventType, callback, useCapture) {
    this._eventHandler.add(this, eventType, callback, useCapture);
  }

  // TODO: Implement
  removeEventListener(eventType, callback, useCapture) {
    console.trace('DomElement#removeEventListener', arguments);
  }

}

export function createElement(type, bridge, eventHandler, nodeList) {
  const element = new DomElement(type, bridge, eventHandler, nodeList);
  const props = {};

  ELEMENT_PROPERTIES.forEach((prop) => (props[prop] = {
    set(val) {
      this.setAttribute(prop, val);
    },
    get() {
      return this.attributes[prop];
    }
  }));

  Object.defineProperties(element, props);

  return element;
};

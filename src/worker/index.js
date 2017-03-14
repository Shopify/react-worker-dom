import { DOCUMENT_NODE } from 'common/nodeType';
import { OPS as _ } from 'common/constants';
import Bridge from './bridge';
import EventHandler from './event-handler';
import { createElement } from './dom/dom-element';
import Fragment from './dom/Fragment';
import TextNode from './dom/TextNode';
import Comment from './dom/Comment';

/**
 * TODO: Convert into factory.
 */

const nodes = {};
const nodeList = new Map();
const eventHandler = new EventHandler(Bridge, nodeList);

const Document = {
  _guid: 'document',

  addEventListener(eventType, callback, useCapture) {
    eventHandler.add(this, eventType, callback, useCapture);
  },

  createComment(comment) {
    return new Comment(comment);
  },

  createDocumentFragment() {
    return new Fragment();
  },

  createElement(tag) {
    const el = createDlement(tag, bridge, eventHandler);
    el.ownerDocument = document;
    return el;
  },

  // TODO: Implement
  createEvent() {
    console.trace('createEvent', arguments);
    return {};
  },

  createTextNode(val) {
    return new TextNode(val);
  },

  documentMode: 12,

  documentElement: {
    style: {},
    textContent: true
  },

  nodeName: '#document',

  nodeType: DOCUMENT_NODE,

  oninput: true,

  onchange: true,
};

const Window = {
  // TODO: Implement
  addEventListener(eventType, callback, useCapture) {
    // eventHandler.add(this, eventType, callback, useCapture);
    console.trace('window.addEventListener', arguments);
  },

  document: Document,

  location: self.location
};

self.window = Window;
self.document = Document;
self.document.body = self.document.createElement('body');
self.document.head = self.document.createElement('head');
self.topElement = self.document.createElement('div');
self.topElement.__TOP = true;

Bridge.send(_.attachBody, null, [self.document.body._guid, self.document.body]);
Bridge.send(_.attachHead, null, [self.document.head._guid, self.document.head]);
Bridge.send(_.attachRoot, null, [self.topElement._guid, self.topElement]);

export default self.topElement;

export default class NodeList {
  constructor() {
    this.nodes = {};
  }

  get(guid) {
    return this.nodes[guid];
  }

  set(guid, node) {
    this.nodes[guid] = node;
  }
}

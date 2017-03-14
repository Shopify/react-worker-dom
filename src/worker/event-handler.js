import { deserializeEvent } from 'common/channel';
import { OPS as _ } from 'common/constants';

let eventHandlerGuid = 0;

class EventHandler {
  constructor(bridge, nodeList) {
    this.bridge = bridge;
    this.nodeList = nodeList;
    this.eventHandlers = {};

    this.bridge.onEventHandler(this.onEventHandler.bind(this));
  }

  add(node, type, handler, useCapture) {
    this.eventHandlers[eventHandlerGuid] = handler;
    this.bridge.send(_.addEventHandler, node._guid, [type, eventHandlerGuid, useCapture]);
    eventHandlerGuid++;
  }

  // TODO: Implement
  remove(node, type, handler) {
    console.trace('EventHandler#remove', arguments);
  }

  onEventHandler({ handler, event }) {
    if (typeof this.eventHandlers[handler] === 'function') {
      const e = deserializeEvent(event);
      e.currentTarget = this.nodeList.get(e.currentTarget);
      e.target = {
        ...this.nodeList.get(e.target),
        ...e.targetProps
      };

      this.eventHandlers[handler](e);
    }
    else {
      console.trace('onEventHandler', handler, event);
    }
  }
}

export default EventHandler;

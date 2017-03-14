import buildDomOperationHandler from './dom';
import Channel from '../common/channel';
import { WORKER_MESSAGES as _ } from '../common/constants';

class ReactWorker {
  constructor(worker, container) {
    this.container = container;
    this.channel = new Channel(worker);
    this.channel.onMessage(this.handleMessage.bind(this));
    this.domOperation = buildDomOperationHandler(document.head, document.body, container, this.channel);
  }

  handleMessage(type, payload) {
    switch (type) {
      case _.renderQueue:
        const start = performance.now();
        payload.forEach(op => this.domOperation(op));
        /* this.channel.send(_.renderTime, {
            time: performance.now() - start,
            count: payload.length
        }); */
        break;

      default:
        console.trace('Unknown message %s', data.type, data.args);
    }
  }
}

module.exports = {
  render(worker, container) {
    return new ReactWorker(worker, container);
  }
};

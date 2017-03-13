import { WORKER_MESSAGES as _ } from './constants';
import TouchList from './api/TouchList';
import Screen from './api/Screen';


//-----------------------------------------------------------------------------
// Channel
//-----------------------------------------------------------------------------

export default class Channel {
  constructor(messageSource) {
    this.messageSource = messageSource;
  }

  send(type, payload) {
    this.messageSource.postMessage(JSON.stringify({ type, payload }));
  }

  // TODO: Wrap in try/catch
  // TODO: Use single handler
  onMessage(handler) {
    this.messageSource.addEventListener('message', ({ data }) => {
      const { type, payload } = JSON.parse(data);
      handler(type, payload);
    });
  }

}


//-----------------------------------------------------------------------------
// Event serialization
//-----------------------------------------------------------------------------

function isTouchEvent(e) {
  return /^touch/.test(e.type);
}

function getTouchProperties(e) {
  // Support only one touch at the moment
  const targetTouches = new TouchList([e.targetTouches[0]]);
  const touches = new TouchList([e.touches[0]]);
  const changedTouches = new TouchList([e.changedTouches[0]]);
  let screen = {};

  if (e.view.screen) {
    screen = new Screen(e.view.screen);
  }

  return {
    targetTouches,
    touches,
    changedTouches,
    view: {
      screen
    }
  };
}

export function serializeEvent(e) {
  let result = {
    bubbles: e.bubbles,
    cancelable: e.cancelable,
    defaultPrevented: e.defaultPrevented,
    eventPhase: e.eventPhase,
    isTrusted: e.isTrusted,
    timeStamp: e.timeStamp,
    type: e.type,
    currentTarget: e.currentTarget['__reactNode'],
    target: e.target['__reactNode'],
    targetProps: {
      value: e.target.value,
      checked: e.target.checked,
      selected: e.target.selected
    }
  };

  // TODO: Create general event parsing method to handle all even types
  if (isTouchEvent(e)) {
    result = Object.assign(result, getTouchProperties(e));
  }

  return JSON.stringify(result);
}

export function deserializeEvent(msg) {
  let e = JSON.parse(msg);

  if (isTouchEvent(e)) {
    e = Object.assign(e, getTouchProperties(e));
  }

  e.preventDefault = e.stopPropgation = function() { };

  return e;
}

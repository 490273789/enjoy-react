import assign from 'shared/assign';

function functionThatReturnTrue() {
  return true;
}

function functionThatReturnFalse() {
  return false;
}

const MouseEventInterface = {
  clientX: 0,
  clientY: 0,
};
function createSyntheticEvent(Interface) {
  // 合成事件的基类
  function SyntheticBaseEvent(
    reactName,
    reactEventType,
    targetInst,
    nativeEvent,
    nativeEventTarget,
  ) {
    this._reactName = reactName;
    this._targetInst = targetInst;
    this.type = reactEventType;
    this.nativeEvent = nativeEvent;
    this.target = nativeEventTarget;
    this.currentTarget = null;
    for (const propName in Interface) {
      if (!Interface.hasOwnProperty(propName)) continue;
      this[propName] = Interface[propName];
    }
    this.isDefaultPrevented = functionThatReturnFalse;
    this.isPropagationStopped = functionThatReturnFalse;
    return this;
  }

  assign(SyntheticBaseEvent.prototype, {
    preventDefault() {
      const event = this.nativeEvent;
      if (event.preventDefault) {
        event.preventDefault();
      } else {
        event.returnValue = false;
      }
      this.isDefaultPrevented = functionThatReturnTrue();
    },
    stopPropagation() {
      const event = this.nativeEvent;
      if (event.stopPropagation) {
        event.stopPropagation();
      } else {
        event.cancelBubble = true;
      }
      this.isPropagationStopped = functionThatReturnTrue();
    },
  });
  return SyntheticBaseEvent;
}
export const SyntheticMouseEvent = createSyntheticEvent(MouseEventInterface);

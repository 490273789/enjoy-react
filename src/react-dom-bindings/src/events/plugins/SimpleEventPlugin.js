import {
  topLevelEventsToReactNames,
  registerSimpleEvents,
} from '../DOMEventProperties';
import {IS_CAPTURE_PHASE} from 'react-dom-bindings/src/events/EventSystemFlags';
import {accumulateSinglePhaseListeners} from '../DOMPluginEventSystem';
import {SyntheticMouseEvent} from './SyntheticEvent';

function extractEvents(
  dispatchQueue,
  domEventName,
  targetInst,
  nativeEvent,
  nativeEventTarget,
  eventSystemFlags,
  targetContainer
) {
  const reactName = topLevelEventsToReactNames.get(domEventName);
  let SyntheticEventCtor;
  switch (domEventName) {
    case 'click':
      SyntheticEventCtor = SyntheticMouseEvent;
  }
  const isCapturePhase = (eventSystemFlags & IS_CAPTURE_PHASE) !== 0;
  const listener = accumulateSinglePhaseListeners(
    targetInst,
    reactName,
    nativeEvent.type,
    isCapturePhase
  );

  let reactEventType = domEventName;
  // 如果有要执行的监听函数的话[onClickCapture, onClickCapture]
  if (listener.length > 0) {
    const event = new SyntheticEventCtor(
      reactName,
      reactEventType,
      null,
      nativeEvent,
      nativeEventTarget
    );
    dispatchQueue.push({
      event,
      listener,
    });
  }
  // debugger;
  // processDispatchQueue(dispatchQueue, eventSystemFlags);
}

export {registerSimpleEvents as registerEvents, extractEvents};

import {
  topLevelEventsToReactNames,
  registerSimpleEvents,
} from '../DOMEventProperties';
import {IS_CAPTURE_PHASE} from 'react-dom-bindings/src/events/EventSystemFlags';
import {accumulateSinglePhaseListeners} from '../DOMPluginEventSystem';

function extractEvents(
  dispatchQueue,
  domEventName,
  targetInst,
  nativeEvent,
  nativeEventTarget,
  eventSystemFlags,
  targetContainer
) {
  const isCapturePhase = (eventSystemFlags & IS_CAPTURE_PHASE) !== 0;
  const reactName = topLevelEventsToReactNames.get(domEventName);
  const listener = accumulateSinglePhaseListeners(
    targetInst,
    reactName,
    nativeEvent.type,
    isCapturePhase
  );
  console.log('listener', listener);
}
export {registerSimpleEvents as registerEvent, extractEvents};

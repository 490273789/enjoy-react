import {
  topLevelEventsToReactNames,
  registerSimpleEvents,
} from '../DOMEventProperties';
import {IS_CAPTURE_PHASE} from 'react-dom-bindings/src/events/EventSystemFlags';
import {accumulateSinglePhaseListeners} from '../DOMPluginEventSystem';
import {SyntheticMouseEvent} from './SyntheticEvent';

/**
 * 收集事件
 * @param {*} dispatchQueue 事件的派发队列
 * @param {*} domEventName 原生事件名称，如：click
 * @param {*} targetInst 当前节点的fiber
 * @param {*} nativeEvent 原生事件
 * @param {*} nativeEventTarget 事件源的真实dom
 * @param {*} eventSystemFlags 事件的标志：0 - 冒泡， 4 - 捕获
 * @param {*} targetContainer 根容器
 */
function extractEvents(
  dispatchQueue,
  domEventName,
  targetInst,
  nativeEvent,
  nativeEventTarget,
  eventSystemFlags,
  targetContainer,
) {
  const reactName = topLevelEventsToReactNames.get(domEventName);
  let SyntheticEventCtor;
  // 获取不同事件类型的合成事件
  switch (domEventName) {
    case 'click':
      SyntheticEventCtor = SyntheticMouseEvent; // click的合成事件
  }
  const isCapturePhase = (eventSystemFlags & IS_CAPTURE_PHASE) !== 0;
  const listeners = accumulateSinglePhaseListeners(
    targetInst,
    reactName,
    nativeEvent.type,
    isCapturePhase,
  );

  let reactEventType = domEventName;
  // 如果有要执行的监听函数- listener：[{listeners, instance, currentTarget }]
  if (listeners.length > 0) {
    const event = new SyntheticEventCtor(
      reactName,
      reactEventType,
      null,
      nativeEvent,
      nativeEventTarget,
    );
    dispatchQueue.push({
      event,
      listeners,
    });
  }
  // debugger;
  // processDispatchQueue(dispatchQueue, eventSystemFlags);
}

export {registerSimpleEvents as registerEvents, extractEvents};

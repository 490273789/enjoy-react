import {allNativeEvents} from './EventRegistry';
import * as SimpleEventPlugin from './plugins/SimpleEventPlugin';
import {IS_CAPTURE_PHASE} from './EventSystemFlags';
import {createEventListenerWrapperWithPriority} from './ReactDOMEventListener';
import {addEventCaptureListener, addEventBubbleListener} from './EventListener';
import {getEventTarget} from './getEventTarget';
import {HostComponent} from 'react-reconcile/src/ReactWorkTags';
import getListener from './getListener';

/** 初始化调用收集事件名称 */
SimpleEventPlugin.registerEvents();

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
  SimpleEventPlugin.extractEvents(
    dispatchQueue,
    domEventName,
    targetInst,
    nativeEvent,
    nativeEventTarget,
    eventSystemFlags,
    targetContainer,
  );
}

/**
 * 执行派发事件
 * @param {*} listener 用户传入的回调函数
 * @param {*} event 合成的事件源对象
 * @param {*} currentTarget
 */
function executeDispatch(listener, event, currentTarget) {
  event.currentTarget = currentTarget;
  // 最终执行回调函数;
  listener(event);
}

/**
 * 按照顺序派发每一个事件
 * @param {*} event 合成的事件源对象
 * @param {*} dispatchListeners 事件监听函数数组
 * @param {*} inCapturePhase 是否在捕获阶段
 * @returns
 */
function processDispatchQueueItemsInOrder(
  event,
  dispatchListeners,
  inCapturePhase,
) {
  if (inCapturePhase) {
    for (let i = dispatchListeners.length - 1; i >= 0; i--) {
      const {listener, currentTarget} = dispatchListeners[i];
      if (event.isPropagationStopped()) {
        return;
      }
      executeDispatch(listener, event, currentTarget);
    }
  } else {
    for (let i = 0; i < dispatchListeners.length; i++) {
      const {listener, currentTarget} = dispatchListeners[i];
      if (event.isPropagationStopped()) {
        return;
      }
      executeDispatch(listener, event, currentTarget);
    }
  }
}

/**
 * 处理派发事件队列
 * @param {*} dispatchQueue 事件队列[{event, listeners}]
 * @param {*} eventSystemFlags 事件的标志：0 - 冒泡， 4 - 捕获
 */
function processDispatchQueue(dispatchQueue, eventSystemFlags) {
  const inCapturePhase = (eventSystemFlags & IS_CAPTURE_PHASE) !== 0;
  for (let i = 0; i < dispatchQueue.length; i++) {
    const {event, listeners} = dispatchQueue[i];
    processDispatchQueueItemsInOrder(event, listeners, inCapturePhase);
  }
}

/**
 * 派发事件
 * @param {*} domEventName 原生事件名称，如：click
 * @param {*} eventSystemFlags 事件的标志：0 - 冒泡， 4 - 捕获
 * @param {*} nativeEvent 原生事件
 * @param {*} targetInst 当前节点的fiber
 * @param {*} targetContainer 根容器
 */
function dispatchEventsForPlugins(
  domEventName,
  eventSystemFlags,
  nativeEvent,
  targetInst,
  targetContainer,
) {
  const nativeEventTarget = getEventTarget(nativeEvent);
  const dispatchQueue = [];
  extractEvents(
    dispatchQueue,
    domEventName,
    targetInst,
    nativeEvent,
    nativeEventTarget,
    eventSystemFlags,
    targetContainer,
  );
  processDispatchQueue(dispatchQueue, eventSystemFlags);
}

const listeningMarker = `_reactListening` + Math.random().toString(36).slice(2);

/**
 * 初始化创建完container的时候调用
 * @param {*} rootContainerElement 根容器
 */
export function listenToAllSupportedEvents(rootContainerElement) {
  // 只监听一遍
  if (!rootContainerElement[listeningMarker]) {
    rootContainerElement[listeningMarker] = true;
    // 遍历原生事件，比如click allNativeEvents = new Set('click')
    allNativeEvents.forEach((domEventName) => {
      listenToNativeEvent(domEventName, true, rootContainerElement); // 捕获
      listenToNativeEvent(domEventName, false, rootContainerElement); // 冒泡
    });
  }
}

/**
 * 手机事件监听器
 * @param {*} targetContainer 根容器
 * @param {*} domEventName 原生事件名称，如：click
 * @param {*} eventSystemFlags 事件的标志：0 - 冒泡， 4 - 捕获
 * @param {*} isCapturePhaseListener 是否为捕获阶段
 */
function addTrappedEventListener(
  targetContainer,
  domEventName,
  eventSystemFlags,
  isCapturePhaseListener,
) {
  const listener = createEventListenerWrapperWithPriority(
    targetContainer,
    domEventName,
    eventSystemFlags,
  );

  // 将处理好的listener函数绑定到toot上
  if (isCapturePhaseListener) {
    addEventCaptureListener(targetContainer, domEventName, listener);
  } else {
    addEventBubbleListener(targetContainer, domEventName, listener);
  }
}

/**
 *
 * @param {*} domEventName 原生事件名称，如：click
 * @param {*} isCapturePhaseListener 是否为捕获阶段
 * @param {*} target 根容器
 */
export function listenToNativeEvent(
  domEventName,
  isCapturePhaseListener,
  target,
) {
  let eventSystemFlags = 0;
  if (isCapturePhaseListener) {
    eventSystemFlags |= IS_CAPTURE_PHASE;
  }
  addTrappedEventListener(
    target,
    domEventName,
    eventSystemFlags,
    isCapturePhaseListener,
  );
}

/**
 * 派发事件
 * @param {*} domEventName 原生事件名称，如：click
 * @param {*} eventSystemFlags 事件的标志：0 - 冒泡， 4 - 捕获
 * @param {*} nativeEvent 原生事件
 * @param {*} targetInst 当前节点的fiber
 * @param {*} targetContainer 根容器
 */
export function dispatchEventForPluginEventSystem(
  domEventName,
  eventSystemFlags,
  nativeEvent,
  targetInst,
  targetContainer,
) {
  dispatchEventsForPlugins(
    domEventName,
    eventSystemFlags,
    nativeEvent,
    targetInst,
    targetContainer,
  );
}

/**
 * 创建派发的listener
 * @param {*} instance dom节点对应的fiber实例
 * @param {*} listener 自定义的事件监听函数
 * @param {*} currentTarget 当前节点的真实DOM
 * @returns
 */
function createDispatchListener(instance, listener, currentTarget) {
  return {
    instance,
    listener,
    currentTarget,
  };
}

/**
 * 获取捕获或 冒泡阶段的listener
 * 捕获阶段的处理会调用一次
 * 冒泡节点的处理会调用一次
 * @param {*} targetFiber 事件源的fiber
 * @param {*} reactName react的时间名称 onClick
 * @param {*} nativeEventType 原生的事件类型
 * @param {*} isCapturePhase 是否为捕获阶段
 * @returns listeners的数组，listener就是我们写事件时传入的自定义函数里面存放捕获或冒泡阶段的所有自定义回调函数
 */
export function accumulateSinglePhaseListeners(
  targetFiber,
  reactName,
  nativeEventType,
  isCapturePhase,
) {
  const captureName = reactName + 'Capture';
  const reactEventName = isCapturePhase ? captureName : reactName;
  const listeners = [];
  let instance = targetFiber;
  // 从事件源向上遍历，获取每个dom上绑定的事件
  while (instance !== null) {
    // stateNode 真实DOM节点
    const {stateNode, tag} = instance;
    // HostComponent 原生标签
    if (tag === HostComponent && stateNode !== null) {
      const listener = getListener(instance, reactEventName);
      if (listener) {
        listeners.push(createDispatchListener(instance, listener, stateNode));
      }
    }
    instance = instance.return;
  }
  return listeners;
}

export function scheduleCallback(callback: IdleRequestCallback) {
  // 系统自带api
  requestIdleCallback(callback);
}

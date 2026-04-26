class TaskObserver {
  constructor() {
    this.listeners = [];
  }

  subscribe(listener) {
    this.listeners.push(listener);
  }

  notify(eventName, data) {
    for (const listener of this.listeners) {
      listener(eventName, data);
    }
  }
}

const taskObserver = new TaskObserver();

taskObserver.subscribe((eventName, data) => {
  console.log(`[Observer] ${eventName}`, data);
});

module.exports = taskObserver;

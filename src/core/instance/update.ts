import { initInstance } from './init';
import { HostElement, PlatformApi } from '../../util/interfaces';

export function queueUpdate(plt: PlatformApi, elm: HostElement, cb?: Function) {
  // only run patch if it isn't queued already
  if (!elm._isQueuedForUpdate) {
    elm._isQueuedForUpdate = true;

    // run the patch in the next tick
    plt.queue.add(function queueUpdateNextTick() {

      // vdom diff and patch the host element for differences
      update(plt, elm);
      cb && cb();
    });
  }
}


export function update(plt: PlatformApi, elm: HostElement) {
  // everything is async, so somehow we could have already disconnected
  // this node, so be sure to do nothing if we've already disconnected
  if (!elm._hasDestroyed) {
    const isInitialLoad = !elm.$instance;

    if (isInitialLoad) {
      // haven't created a component instance for this host element yet
      initInstance(plt, elm);
    }

    // if this component has a render function, let's fire
    // it off and generate a vnode for this
    elm._render();

    if (isInitialLoad) {
      elm._initLoad();
    }
  }

  // no longer queued
  elm._isQueuedForUpdate = false;
}

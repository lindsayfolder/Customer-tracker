// Manual update control: a new build is detected via the service worker's
// normal "waiting" mechanism, but instead of silently forcing a reload the
// moment it's found (which could yank a reader off a page they're mid-read
// on), it's surfaced as a state the UI can show ("Update available") and
// apply on request (see Settings). A "Check for updates" action is also
// exposed so a reader doesn't have to close and reopen the app to find out
// whether one is waiting.

type Listener = () => void;

interface UpdateState {
  available: boolean;
  checking: boolean;
}

let state: UpdateState = { available: false, checking: false };
const listeners = new Set<Listener>();

let applyFn: ((reload?: boolean) => Promise<void>) | null = null;
let registration: ServiceWorkerRegistration | undefined;

function emit() {
  for (const l of listeners) l();
}

export function subscribeUpdateState(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function getUpdateState(): UpdateState {
  return state;
}

// Called from main.tsx's onNeedRefresh once a new service worker has
// installed and is waiting to take over.
export function setUpdateAvailable(): void {
  state = { available: true, checking: false };
  emit();
}

// Called from main.tsx's onRegisteredSW once registration completes, so
// checkForUpdate/applyUpdate have something to act on.
export function registerUpdateHooks(
  updateFn: (reload?: boolean) => Promise<void>,
  reg: ServiceWorkerRegistration | undefined,
): void {
  applyFn = updateFn;
  registration = reg;
}

// Manually asks the browser to re-fetch the service worker script and see
// if it differs from the currently installed one. If it does, the browser
// fires the same "waiting" flow that setUpdateAvailable listens for above.
export async function checkForUpdate(): Promise<void> {
  if (!registration || state.checking) return;
  state = { ...state, checking: true };
  emit();
  try {
    await registration.update();
  } catch {
    // Offline or network error — nothing else to do.
  } finally {
    if (!state.available) {
      state = { ...state, checking: false };
      emit();
    }
  }
}

// Activates the waiting service worker and reloads to run the new build.
export async function applyUpdate(): Promise<void> {
  if (!applyFn) return;
  await applyFn(true);
}

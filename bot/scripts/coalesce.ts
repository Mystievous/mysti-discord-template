// Runs one task at a time per key. Calls made while one is running all share a single queued run.
export function createCoalescer<K, T>() {
  const running = new Map<K, Promise<T>>();
  const queued = new Map<K, Promise<T>>();

  return (key: K, task: () => Promise<T>): Promise<T> => {
    const existing = queued.get(key);
    if (existing) return existing;

    const previous: Promise<unknown> = running.get(key) ?? Promise.resolve();
    const run: Promise<T> = previous
      // A failed run shouldn't block the next one
      .catch(() => undefined)
      .then(() => {
        queued.delete(key);
        running.set(key, run);
        return task();
      })
      .finally(() => {
        if (running.get(key) === run) running.delete(key);
      });

    queued.set(key, run);
    return run;
  };
}

import { executeMutation } from "./executors/index";
import type { QueueItem, TableMutation } from "./mutationTypes";

const queues = new Map<string, QueueItem[]>();
const running = new Set<string>();

export function enqueueTableMutation(mutation: TableMutation) {
  const mutationId = crypto.randomUUID();

  const item: QueueItem = {
    id: mutationId,
    mutation,
    createdAt: Date.now(),
    attempt: 0,
  };

  const queue = queues.get(mutation.tableId);
  if (queue) {
    queue.push(item);
  } else {
    queues.set(mutation.tableId, [item]);
  }

  processQueue(mutation.tableId);
  return mutationId;
}

async function processQueue(tableId: string) {
  if (running.has(tableId)) return;

  const queue = queues.get(tableId);
  if (!queue || queue.length === 0) return;

  running.add(tableId);
  const item = queue[0]!;

  try {
    await executeMutation(item.mutation);
    queue.shift();
  } catch (err) {
    item.attempt++;
    console.error("Mutation failed", item.mutation, err);
    // optional retry/backoff here
    if (item.attempt > 5) {
      queue.shift(); // drop permanently
    }
  } finally {
    running.delete(tableId);
    if (queue.length > 0) processQueue(tableId);
  }
}

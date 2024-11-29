import cluster, { Worker } from 'cluster';
import os from 'os';

interface ProcessResult {
  success: boolean;
  result?: any;
  error?: any;
  index?: number;
}

interface ParallelResult {
  successes: any[];
  errors: { error: any; index: number }[];
}

const processInParallelWithCluster = async (
  operation: any,
  array: any[],
): Promise<ParallelResult> => {
  const numCPUs = os.cpus().length;
  const chunkSize = Math.ceil(array.length / numCPUs);

  return new Promise((resolve, reject) => {
    if (cluster.isMaster) {
      const results: any[] = [];
      let completedWorkers = 0;
      let successes: any[] = [];
      let errors: { error: any; index: number }[] = [];

      // Split the array into chunks and send to workers
      for (let i = 0; i < numCPUs; i++) {
        const chunk = array.slice(i * chunkSize, (i + 1) * chunkSize);

        // Fork a worker to process the chunk
        const worker: Worker = cluster.fork();

        worker.on(
          'message',
          (message: {
            success: boolean;
            results: any[];
            errors: { error: any; index: number }[];
          }) => {
            if (message.success) {
              successes = [...successes, ...message.results];
            } else {
              errors = [...errors, ...message.errors];
            }

            completedWorkers++;

            // Resolve when all workers have completed
            if (completedWorkers === numCPUs) {
              resolve({ successes, errors });
            }
          },
        );

        worker.on('exit', (code: number) => {
          if (code !== 0) {
            errors.push({
              error: `Worker exited with code ${code}`,
              index: -1,
            });
          }
        });

        // Send the chunk to the worker
        worker.send({ chunk, operation });
      }
    } else {
      // Worker process: handle the operation for the assigned chunk
      process.on(
        'message',
        async (message: {
          chunk: any[];
          operation: (item: any, index: number) => Promise<any>;
        }) => {
          try {
            const { chunk, operation } = message;

            const results: ProcessResult[] = await Promise.all(
              chunk.map(async (item, index) => {
                try {
                  const result = await operation(item, index);
                  return { success: true, result, index };
                } catch (error) {
                  return { success: false, error, index };
                }
              }),
            );

            // Send results back to the master process
            const successes = results
              .filter((r) => r.success)
              .map((r) => r.result);
            const errors = results
              .filter((r) => !r.success)
              .map((r) => ({ error: r.error, index: r.index }));

            process.send?.({ success: true, results: successes, errors });
            process.exit(0); // Exit after processing is complete
          } catch (error) {
            process.send?.({
              success: false,
              errors: [
                {
                  error:
                    error instanceof Error
                      ? error.message
                      : 'An unexpected error occurred',
                  index: -1,
                },
              ],
            });
            process.exit(1); // Exit with error code if there is an issue
          }
        },
      );
    }
  });
};

export { processInParallelWithCluster };

//usage
// import { processInParallelWithCluster } from './clusterUtils';

// // Example operation: a simple async operation that resolves after a delay
// const operation = async (item: number, index: number): Promise<string> => {
//   return new Promise((resolve) => {
//     setTimeout(() => resolve(`Processed item ${index}: ${item}`), 1000);
//   });
// };

// // Example array
// const array: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// processInParallelWithCluster(operation, array).then(({ successes, errors }) => { })

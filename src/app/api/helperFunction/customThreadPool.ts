/**
 * Generic Thread Pool Function
 * @param {Array} taskArray - Array of tasks or data to process.
 * @param {Function} operation - Async function to process each task. Receives one task as an argument.
 * @param {number} threadPoolSize - Number of concurrent tasks to run.
 * @returns {Promise<Array>} - Resolves to an array of results from the operation.
 */
import getLogger from '~/core/logger';
const logger = getLogger();

const processWithThreadPool = async (
  taskArray: [],
  operation: any,
  threadPoolSize: number = 5,
) => {
  const queue = [...taskArray]; // Clone the task array to act as a queue
  const results: any = []; // To store the results

  const worker = async () => {
    while (queue.length > 0) {
      const task = queue.shift(); // Get the next task
      try {
        const result = await operation(task); // Perform the operation
        results.push(result); // Save the result
      } catch (error) {
        logger.error(
          `Error processing task: ${error instanceof Error ? error.message : 'An unexpected error occurred'}`,
        );
      }
    }
  };

  // Create workers and run them
  const workers = Array.from({ length: threadPoolSize }, () => worker());

  // Wait for all workers to complete
  await Promise.all(workers);

  return results;
};

// ********************************* usage  ************************************************** //
// const insertPropertyUnitRelation = async ({ propertyId, unitData, client }) => {
//     const { data, error } = await client
//         .from('property_unit_relation_table')
//         .insert([
//             {
//                 property_id: propertyId,
//                 property_unit_id: unitData.id,
//             },
//         ]);

//     if (error) {
//         console.error('Error in property-unit relation table insertion:', error.message);
//         return null; // Handle error appropriately
//     }

//     return data; // Return result
// };

// const propertyIdsForUnitData = [1, 2, 3]; // Example property IDs
// const unitDataArray = [
//     { id: 'unit1' },
//     { id: 'unit2' },
//     { id: 'unit3' },
// ]; // Example unit data

// const client = {}; // Your Supabase client instance

// // Combine property IDs and unit data into task objects
// const tasksArray = unitDataArray.map((unitData) => ({
//     propertyId: propertyIdsForUnitData[0], // Example propertyId; customize as needed
//     unitData,
//     client,
// }));

// // Usage
// const threadPoolSize = 5; // Set the desired concurrency level

// const results = await processWithThreadPool(
//     tasksArray,
//     insertPropertyUnitRelation,
//     threadPoolSize
// );

// console.log('Insertion results:', results);
// ************************************************************************************************

const processInParallel = async (operation: any, array: []) => {
  const results = await Promise.all(
    array.map(async (item, index) => {
      try {
        const result = await operation(item, index);
        return { success: true, result, index };
      } catch (error) {
        return { success: false, error, index };
      }
    }),
  );

  // Separate successes and errors for easier usage
  const successes = results.filter((r) => r.success).map((r) => r.result);
  const errors = results
    .filter((r) => !r.success)
    .map((r) => ({ error: r.error, index: r.index }));

  return { successes, errors };
};

// // Usage example
// const dbCall = async (item) => {
//     // Simulated database call
//     return await fetch(`/api/data/${item.id}`);
// };

// processInParallel(dbCall, arrayOfObjects).then(({ successes, errors }) => {
//     console.log('Successes:', successes);
//     console.log('Errors:', errors);
// });
